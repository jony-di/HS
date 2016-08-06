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
            case "NuevoEstatusEmpl": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarEstatusEmpl": Editar(); break;
            case "obtenerCatalogoEstatusEmpl": ObtenerCatalogo(); break;
            case "ObtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveEstatusEmpl"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de estatus", "cve_estatus", Request["cve_estatus"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 99}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoEstatusEmpl"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave de estatus", "cve_estatus", Request["cve_estatus"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoEstatusEmpl"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                   { "Clave de estatus", "cve_estatus", Request["cve_estatus"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 99}
                ,  { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarEstatusEmpl"
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
                , { "Clave de estatus", "cve_estatus", Request["cve_estatus"],true,"int", 0}
            }
            , "PA_ES_CBusquedaEstatusEmpls"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
