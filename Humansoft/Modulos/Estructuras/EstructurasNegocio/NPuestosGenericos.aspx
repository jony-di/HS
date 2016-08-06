<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="System.IO"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/EstructurasModelo/dboPuestoGenerico.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        
        string seccion = Request["seccion"];
        if (seccion != null)
        {
            switch (Request["op"])
            {
                case "Nuevo": oModelo.GenerarOperacionCX("Nuevo", seccion).WriteXml(Response.OutputStream); break;
                case "CambiarEstatusActivo": oModelo.GenerarOperacionCX("CambiarEstatusActivo", seccion).WriteXml(Response.OutputStream); break;
                case "obtenerCatalogo": oModelo.GenerarOperacionCX("obtenerCatalogo", seccion).WriteXml(Response.OutputStream); break;
                case "obtenerSiguienteClave": oModelo.GenerarOperacionCX("obtenerSiguienteClave", seccion).WriteXml(Response.OutputStream); break;
                case "Editar": oModelo.GenerarOperacionCX("Editar", seccion).WriteXml(Response.OutputStream); break;
                case "PerfilesEscaneados": Util.GetArchivos(Server.MapPath(@"\Expedientes\Puestos\Perfiles"), Request["cve_puesto"] + ".*").WriteXml(Response.OutputStream); break;
                case "GuardarPuestosDepartamento": oModelo.GenerarOperacionCX("GuardarPuestosDepartamento", seccion).WriteXml(Response.OutputStream); break;                    
                default: oModelo.GenerarOperacionCX(Request["op"], seccion).WriteXml(Response.OutputStream); break;
                case "EliminarEscaneo":
                    try
                    {
                        string puesto = Request["puesto"];
                        DirectoryInfo files = new DirectoryInfo(Server.MapPath(@"\Expedientes\Puestos\Perfiles"));
                        foreach (FileInfo fi in files.GetFiles(puesto + ".*"))
                        {
                            File.Delete(fi.FullName);
                        }
                       
                    }
                    catch { }
                    finally
                    {
                        oModelo.GenerarOperacionCX("EliminarEscaneo", seccion).WriteXml(Response.OutputStream);
                    }
                     break;
                
            }
        }else{
            if (Request.Files.Count > 0)
            {
                try
                {
                    HttpFileCollection files = Request.Files;
                    string puesto = Request["puesto"];
                    string ext=string.Empty;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFile file = files[i];
                        ext = Path.GetExtension(file.FileName);
                        string filePath = Path.Combine(Server.MapPath(@"\Expedientes\Puestos\Perfiles"), puesto + ext);
                        file.SaveAs(filePath);
                    }
                    oModelo.GenerarOperacionCX("ConfirmarEscaneo", "PuestoGenerico");
                    Response.ContentType = "application/json";
                    string json = "{ \"ext\": \"" + ext + "\" }";
                    Response.Write(json);
                }
                catch { }
            }
        }
    }
  
</script>

