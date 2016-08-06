<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="System.IO"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/ContratacionModelo/dboPerfiles.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        string seccion = Request["seccion"];
        string op=Request["op"];
        if (!string.IsNullOrEmpty(seccion) &&  !string.IsNullOrEmpty(op))
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
                                ext = Path.GetExtension(file.FileName);
                                string filePath = Path.Combine(Server.MapPath("~/Archivos/Contrataciones/Perfiles/Logos/"), Request["pantilla"] + ".png");
                                file.SaveAs(filePath);
                            }
                            oModelo.GenerarOperacionCX("ConfirmarEscaneo", "PuestoGenerico");
                            Response.ContentType = "application/json";
                            Response.Write("{ \"success\":true}");
                        }
                        catch(Exception ex) { }
                    }  
                break;
                default:
                    oModelo.GenerarOperacionCX(op, seccion).WriteXml(Response.OutputStream);
                break;
            }
            
        }else{}
    }
    
    
</script>
