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
            case "NuevoLugarTrabajo": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarLugarTrabajo": Editar(); break;
            case "obtenerCatalogoLugarTrabajo": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveLugarTrabajo"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de ubicación", "cve_lugar", Request["cve_lugar"],true,"int", 0}
                    ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                    , { "Calle", "calle",Request["calle"], true ,"string", 50}
                    , { "Colonia", "colonia",Request["colonia"], true ,"string", 50}
                    , { "Municipio", "cve_municipio",Request["cve_municipio"], true ,"string", 50}
                    , { "Estado", "cveestado",Request["cveestado"], true ,"int", 0}
                    , { "CP", "cp",Request["cp"], true ,"int", 0}
                    , { "EntreCalles", "entrecalles",Request["entrecalles"], true ,"string", 50}
                    , { "Estatus activo", "activo","true", true, "bool", 0 }
            }
            , "PA_ES_INuevoLugarTrabajo"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave de ubicación", "cve_lugar", Request["cve_lugar"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoLugarTrabajo"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] {
                    { "Clave de ubicación", "cve_lugar", Request["cve_lugar"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                    , { "Calle", "calle",Request["calle"], true ,"string", 50}
                    , { "Colonia", "colonia",Request["colonia"], true ,"string", 50}
                    , { "Municipio", "cve_municipio",Request["cve_municipio"], true ,"string", 50}
                    , { "Estado", "cveestado",Request["cveestado"], true ,"int", 0}
                    , { "CP", "cp",Request["cp"], true ,"int", 0}
                    , { "EntreCalles", "entrecalles",Request["entrecalles"], true ,"string", 50}
                    , { "Estatus activo", "activo","true", true, "bool", 0 }
            }
            , "PA_ES_UActualizarLugarTrabajo"
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
                , { "Clave de ubicación", "cve_lugar", Request["cve_lugar"],true,"int", 0}
            }
            , "PA_ES_CBusquedaLugarTrabajos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
