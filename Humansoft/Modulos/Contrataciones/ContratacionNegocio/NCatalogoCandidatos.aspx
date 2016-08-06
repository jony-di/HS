<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    Modelo oModelo = new Modelo("/ContratacionModelo/dboCatalogoCandidatos.xml");

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        string seccion = Request["seccion"];
        string op = Request["op"];
        DataSet ds;
        //string estatus;
        //string mensaje;
        if (!string.IsNullOrEmpty(seccion) && !string.IsNullOrEmpty(op))
        {
            switch (op)
            {
                case "obtenerCV":
                    ds = oModelo.GenerarOperacionCX(op, seccion);
                    string cv = ds.Tables[0].Rows[0]["CVWordBase64"].ToString();
                    if (cv.Length > 100)
                    {
                        byte[] filebytes = Encripta.Base64DecodeFile(cv);
                        HttpContext.Current.Response.Clear();
                        HttpContext.Current.Response.Charset = "";
                        Response.AddHeader("Content-Disposition", "attachment; filename=CV.docx");
                        HttpContext.Current.Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache);
                        HttpContext.Current.Response.Cache.SetExpires(DateTime.Now);
                        HttpContext.Current.Response.Cache.SetNoServerCaching();
                        HttpContext.Current.Response.Cache.SetNoStore();
                        HttpContext.Current.Response.ContentType = "application/octet-stream";
                        HttpContext.Current.Response.BinaryWrite(filebytes);
                        HttpContext.Current.Response.Flush();
                        HttpContext.Current.Response.End();
                    }
                    else
                    {
                        Response.ContentType = "text/html";
                        Response.Write("<" + "script>alert('No se encontro el archivo'); self.close();<" + "/script>");
                    }
                break;
                case "obtenerCandidatos":
                    if (Request["agencia"] == "1")
                    {
                        int vacateID;
                        int.TryParse(Request["vacante"], out vacateID);
                        HumansoftServer.WSBolsa.ServiciosDeBolsa bolsa = new HumansoftServer.WSBolsa.ServiciosDeBolsa() { Url = "http://10.0.0.24:85//ServiciosDeBolsa.asmx" };
                        ds = bolsa.ObtenerCandidatos(vacateID);
                        string[] result= Modelo.InsertaRegistrosEnTablas(ds);
                        Response.Write("<NewDataSet><Table><estatus>" + result[0] + "</estatus><mensaje>" + result[1] + "</mensaje></Table></NewDataSet>");
                    }
                break;
                default:
                    oModelo.GenerarOperacionCX(op, seccion).WriteXml(Response.OutputStream);
                 break;
            }
        }
        else { }
    }
</script>