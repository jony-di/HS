<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="System.IO"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">

    Modelo oModelo = new Modelo("/ContratacionModelo/dboPerfilPuesto.xml");

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        string htmlb64 = Request["html"] ?? string.Empty;
        string cve_perfil = Request["cve_perfil"] ?? string.Empty;
        if (string.IsNullOrEmpty(htmlb64))
        {
            string seccion = Request["seccion"];
            string op = Request["op"];
            if (!string.IsNullOrEmpty(seccion) && !string.IsNullOrEmpty(op))
            {
                switch (op)
                {
                    case "gardarLogo":
                        if (Request.Files.Count > 0)
                        {
                            try
                            {
                                HttpFileCollection files = Request.Files;
                                string puesto = Request["puesto"];
                                string ext = string.Empty;
                                for (int i = 0; i < files.Count; i++)
                                {
                                    HttpPostedFile file = files[i];
                                    string filePath = Path.Combine(Server.MapPath("~/Archivos/Contrataciones/Perfiles/Logos"), Request["pantilla"] + ".png?ver=1");
                                    file.SaveAs(filePath);
                                }
                                oModelo.GenerarOperacionCX("ConfirmarEscaneo", "PuestoGenerico");
                                Response.ContentType = "application/json";
                                string json = "{ \"ext\": \"" + ext + "\" }";
                                Response.Write(json);
                            }
                            catch { }
                        }
                    break;
                    default:
                        oModelo.GenerarOperacionCX(op, seccion).WriteXml(Response.OutputStream);
                    break;
                }
            }
        }
        else
        {
            var base64EncodedBytes = System.Convert.FromBase64String(htmlb64);
            var html = System.Text.Encoding.Default.GetString(base64EncodedBytes);
            string pathLogo = Server.MapPath("~/Archivos/Contrataciones/Perfiles/Logos/" + cve_perfil + ".png");
            Byte[] bytes = Util.converHTMLToPDF(html, pathLogo);
            if (bytes != null)
            {
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.Charset = "";
                HttpContext.Current.Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache);
                HttpContext.Current.Response.Cache.SetExpires(DateTime.Now);
                HttpContext.Current.Response.Cache.SetNoServerCaching();
                HttpContext.Current.Response.Cache.SetNoStore();
                HttpContext.Current.Response.ContentType = "application/pdf";
                HttpContext.Current.Response.BinaryWrite(bytes);
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.End();
            }
            else {
                Response.ContentType = "text/html";
                Response.Write("<" + "script>alert('Error en la generacion del PDF intente de nuevo');<" + "/script>");
            }
        }
    }
</script>
