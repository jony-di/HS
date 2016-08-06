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
            case "NuevoAccion": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarAccion": Editar(); break;
            case "obtenerCatalogoAccion": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveAccion"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de ubicación", "cve_accion", Request["cve_accion"],true,"int", 0}
                    ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                    ,  { "Activo", "activo", Request["activo"],true,"int", 0}
                    ,  { "Estatus", "cve_estatus", Request["cve_estatus"],true,"int", 0}
                    ,  { "Accion", "accion", Request["accion"],true,"int", 0}
            }
            , "PA_ES_INuevoAccion"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave de ubicación", "cve_accion", Request["cve_accion"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoAccion"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] {
                    { "Clave de ubicación", "cve_accion", Request["cve_accion"],true,"int", 0}
                    ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                    ,  { "Activo", "activo", Request["activo"],true,"int", 0}
                    ,  { "Estatus", "cve_estatus", Request["cve_estatus"],true,"int", 0}
                    ,  { "Accion", "accion", Request["accion"],true,"int", 0}
            }
            , "PA_ES_UActualizarAccion"
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
                , { "Clave de ubicación", "cve_accion", Request["cve_accion"],true,"int", 0}
            }
            , "PA_ES_CBusquedaAccion"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
