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
            case "NuevoMunicipio": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarMunicipio": Editar(); break;
            case "obtenerCatalogoMunicipio": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveMunicipios"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de Municipio", "cve_municipio", Request["cve_municipio"],true,"int", 0}
                , { "Clave de estado", "cve_estado", Request["cve_estado"],true,"int", 0}
                , { "Clave de pais", "cve_pais", Request["cve_pais"],true,"int", 0}
                , { "Nombre Municipio", "nombremuni", Request["nombremuni"],true,"string", 100}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoMunicipio"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave de Municipio", "cve_municipio", Request["cve_municipio"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoMunicipio"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                     { "Clave de Municipio", "cve_municipio", Request["cve_municipio"],true,"int", 0}
                , { "Clave de estado", "cve_estado", Request["cve_estado"],true,"int", 0}
                , { "Clave de pais", "cve_pais", Request["cve_pais"],true,"int", 0}
                , { "Nombre Municipio", "nombremuni", Request["nombremuni"],true,"string", 100}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarMunicipio"
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
                , { "Clave de Municipio", "cve_municipio", Request["cve_municipio"],true,"int", 0}
                , { "Clave de Estado", "cveestado", Request["cveestado"],false,"int", 0}
            }
            , "PA_ES_CBusquedaMunicipios"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
