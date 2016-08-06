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
            case "NuevoNivelPuesto": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarNivelPuesto": Editar(); break;
            case "obtenerCatalogoNivelPuesto": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveNivelPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Nivel", "cve_nivel", Request["cve_nivel"],true,"int", 0}
                ,  { "Clave del puesto", "cve_puesto", Request["cve_puesto"],true,"int", 0}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoNivelPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Nivel", "cve_nivel", Request["cve_nivel"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_SG_UActivarDesactivarNivelPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] {
                    { "Nivel", "cve_nivel", Request["cve_nivel"],true,"int", 0}
                ,  { "Clave del puesto", "cve_puesto", Request["cve_puesto"],true,"int", 0}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarNivelPuesto"
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
                , { "Nivel", "cve_nivel", Request["cve_nivel"],true,"int", 0}
            }
            , "PA_ES_CBusquedaNivelPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
