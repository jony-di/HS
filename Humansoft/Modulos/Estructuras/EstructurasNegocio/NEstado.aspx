<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        switch (Request["op"])
        {
            case "NuevoEstado": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarEstado": Editar(); break;
            case "obtenerCatalogoEstado": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveEstados"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave de estado", "cveestado", Request["cveestado"],true,"int", 0}
                , { "Clave de pais", "cvepais", Request["cvepais"],true,"int", 0}
                , { "Nombre de estado", "nombreestado", Request["nombreestado"],true,"string", 49}
                , { "Activo", "activo"
                      
                      
                      
                      
                      ,"true", true ,"bool", 0}
            }
            , "PA_ES_INuevoEstado"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                     { "Clave de estado", "cveestado", Request["cveestado"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoEstado"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                     { "Clave de estado", "cveestado", Request["cveestado"],true,"int", 0}
                , { "Clave de pais", "cvepais", Request["cvepais"],true,"int", 0}
                , { "Nombre de estado", "nombreestado", Request["nombreestado"],true,"string", 49}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarEstado"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void ObtenerCatalogo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"string", 80}
                , { "Criterio de búsqueda", "criterio",Request["criterio"], false ,"string", 80}
                , { "Clave de estado", "cveestado", Request["cveestado"],false,"int", 0}
                , { "Clave de país", "cve_pais", Request["cve_pais"],false,"int", 0}
            }
            , "PA_ES_CBusquedaEstados"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
