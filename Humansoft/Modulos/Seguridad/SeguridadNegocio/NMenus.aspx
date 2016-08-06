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
            case "NuevoMenu": NuevoMenu(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarMenu": EditarMenu(); break;
            case "ObtenerCatalogoMenus": obtenerCatalogoMenus(); break;
            case "ObtenerSiguienteClave": obtenerSiguienteClave(); break;
        }
    }

    public void obtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_SG_CObtenerSiguienteClaveMenu"
        );
        ds.WriteXml(Response.OutputStream);
    }

   public void NuevoMenu(){
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Menu", "cve_menu",Request["cve_menu"], true, "int", 0 }
                , { "Idioma", "cve_idioma",Request["cve_idioma"], true, "int", 0 }
                , { "Página", "pagina",Request["pagina"], true, "string", 512 }
                , { "Nombre", "nombre",Request["nombre"], true, "string", 80 }
                , { "Tooltip", "tooltip",Request["tooltip"], true, "string", 512 }
                , { "Imagen", "cve_imagen",Request["cve_imagen"], true, "int", 0 }
                , { "Menu padre", "cve_padremenu",Request["cve_padremenu"], false, "int", 0 }
                , { "Visible", "visible",Request["visible"], false, "bool", 0 }
                , { "Estatus", "activo","true", true, "bool", 0 }
            }
            , "PA_SG_INuevoMenu"
        );
        ds.WriteXml(Response.OutputStream);
    }

   public void CambiarEstatusActivo()
   {
       DataSet ds = new Modelo().GenerarOperacion(
           new object[,] { 
                    { "Clave de Menu", "cve_Menu", Request["cve_menu"],true,"int", 0}
                , { "Estatus", "esActivar",Request["activo"], true, "bool", 0 }
            }
           , "PA_SG_UCambiarEstatusActivo"
       );
       ds.WriteXml(Response.OutputStream);
   }

   public void EditarMenu(){
       DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Menu", "cve_menu",Request["cve_menu"], true, "int", 0 }
                , { "Idioma", "cve_idioma",Request["cve_idioma"], true, "int", 0 }
                , { "Página", "pagina",Request["pagina"], true, "string", 512 }
                , { "Nombre", "nombre",Request["nombre"], true, "string", 80 }
                , { "Tooltip", "tooltip",Request["tooltip"], true, "string", 512 }
                , { "Imagen", "cve_imagen",Request["cve_imagen"], true, "int", 0 }
                , { "Menu padre", "cve_padremenu",Request["cve_padremenu"], false, "int", 0 }                
                , { "Visible", "visible",Request["visible"], false, "bool", 0 }
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_SG_UActualizarMenu"
        );
       ds.WriteXml(Response.OutputStream);
   }
    
    public void obtenerCatalogoMenus(){
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"string", 80}
                , { "Criterio de búsqueda", "criterio",Request["criterio"], false ,"string", 80}
                , { "Clave de Menu", "cve_Menu",Request["cve_menu"], false,"int",  0 }
            }
            , "PA_SG_CBusquedaMenus"
        );
        ds.WriteXml(Response.OutputStream); 
    }
    
</script>