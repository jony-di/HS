<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>

<script runat="server">    
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        switch (Request["op"])
        {
            case "NuevaImagen": NuevaImagen(); break;
            case "EliminarImagen": EliminarImagen(); break;
            case "EditarImagen": EditarImagenes(); break;
            case "obtenerCatalogoImagenes": obtenerCatalogoImagenes(); break;
            case "obtenerSiguienteClave": obtenerSiguienteClave(); break;
        }
    }

    public void obtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_SG_CObtenerSiguienteClaveImagenes"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void NuevaImagen()
    {
        DataSet ds = new DataSet();
        string cve_imagen = Request["cve_imagen"];

        ds = new Modelo().GenerarOperacion(
            new Object[,] { 
                 { "Clave de Imagen", "cve_imagen", cve_imagen,true,"int", 0}
                ,{ "Palabras clave", "palabrasclave",Request["palabrasclave"] ,true,"string", 512}
                ,{ "Archivo adjunto", "path",Request.Files["path"] ,true,"file|.jpg,.png,.jpeg,.gif,.ico|imagen_" + cve_imagen + "|" + System.Configuration.ConfigurationManager.AppSettings["RutaCatalogoImagenes"], 500}//500 kb como maximo tamaño para archivo
                ,{ "Path de Imagen", "path", "/imagen_" + Request["cve_imagen"] + Util.ObtenerExtensionArchivoPost(Request.Files["path"]), true, "string", 512 }
            }
            , "PA_SG_INuevaImagen"
        );
        Response.ContentType = "text/html";
        string estatus="-1";string mensaje="";
        try{
            estatus= ds.Tables[0].Rows[0]["estatus"].ToString();
            mensaje= ds.Tables[0].Rows[0]["mensaje"].ToString();
        }catch(Exception ex){
            mensaje = "Error: " + ex.Message;
        }
        Response.Write(String.Concat("<script>",
            "var estatus=" + estatus + ";" ,
            "var mensaje=\"" + mensaje.Replace("\"", "'") + "\";",
            "window.parent.HandlerNuevaImagen(estatus,mensaje);",
            "</" + "script>"
        ));
    }

    public void EliminarImagen(){
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                { "Clave de Imagen", "cve_imagen", Request["cve_imagen"],true,"int", 0}
            }
            , "PA_SG_DEliminarImagen"
        );
        ds.WriteXml(Response.OutputStream);   
    }

    public void EditarImagenes()
    {
        string cve_imagen = Request["cve_imagen"];
        object[,] p1 = new object[,] {                
                     { "Clave de Imagen", "cve_imagen", cve_imagen,true,"int", 0}
                    ,{ "Palabras clave", "palabrasclave",Request["palabrasclave"] ,true,"string", 512}
        };
        object[,] p2 = new object[,] {
                 { "Archivo adjunto", "path",Request.Files["path"] ,true,"file|.jpg,.png,.jpeg,.gif,.ico|imagen_" + cve_imagen + "|" + System.Configuration.ConfigurationManager.AppSettings["RutaCatalogoImagenes"], 500}//500 kb como maximo tamaño para archivo
                ,{ "Path de Imagen", "path", "/imagen_" + Request["cve_imagen"] + Util.ObtenerExtensionArchivoPost(Request.Files["path"]), true, "string", 512 }
        };
        object[,] p = p1;
        if (Request.Files["path"] != null && Request.Files["path"].ContentLength>0)
        {
            p = Util.ConcatenarMatrices(p1, p2);
        }
        DataSet ds = new Modelo().GenerarOperacion(p, "PA_SG_UActualizarImagenes");
        string estatus = "-1"; string mensaje = "";
        try
        {
            estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
            mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
        }
        catch (Exception ex) {
            mensaje = "Error: " + ex.Message;
        }
        Response.ContentType = "text/html";
        Response.Write(String.Concat("<script>",
            "var estatus=" + estatus + ";",
            "var mensaje=\"" + mensaje.Replace("\"","'") + "\";",
            "window.parent.HandlerEditarImagen(estatus,mensaje);",
            "</" + "script>"
        ));
    }

    public void obtenerCatalogoImagenes()
        {
            DataSet ds = new Modelo().GenerarOperacion(
               new object[,] { 
                        { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                    , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"string", 80}
                    , { "Criterio de búsqueda.", "criterio",Request["criterio"], false ,"string", 80}
                    , { "Clave de Imagen", "cve_imagen", Request["cve_imagen"],false,"int", 0}
                }
               , "PA_SG_CBusquedaImagenes"
            );
            ds.WriteXml(Response.OutputStream);    
        }
</script>