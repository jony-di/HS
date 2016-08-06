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
            case "NuevoConcepto": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarConcepto": Editar(); break;
            case "obtenerCatalogoConcepto": ObtenerCatalogo(); break;
            case "ObtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveConceptos"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de concepto", "cve_concepto", Request["cve_concepto"],true,"int", 0}
                , { "Clave dado", "cve_dado",Request["cve_dado"], true ,"int", 0}
                , { "Descripcion", "descripcion",Request["descripcion"], true ,"string", 200}
                , { "Estatus", "activo","true", true, "bool", 0 }
            }
            , "PA_ES_INuevoConcepto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de concepto", "cve_concepto", Request["cve_role"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_INuevoConcepto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de concepto", "cve_concepto", Request["cve_concepto"],true,"int", 0}
                , { "Clave dado", "cve_dado",Request["cve_dado"], true ,"int", 0}
                , { "Descripcion", "descripcion",Request["descripcion"], true ,"string", 200}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UActualizarConcepto"
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
                , { "Clave", "cve_concepto",Request["cve_concepto"], true,"int",  0 }
            }
            , "PA_ES_CBusquedaConceptos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
