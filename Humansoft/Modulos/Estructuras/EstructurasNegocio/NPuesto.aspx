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
            case "NuevoPuesto": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarPuesto": Editar(); break;
            case "obtenerCatalogoPuesto": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClavePuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de Puesto", "cve_puesto", Request["cve_puesto"],true,"string", 50}
                , { "Clave de departamento", "cve_departamento", Request["cve_departamento"],true,"int", 0}
                , { "Nombre", "nombrepuesto", Request["nombrepuesto"],true,"string", 150}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de Puesto", "cve_puesto", Request["cve_puesto"],true,"string", 50}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] {
                    { "Clave de puesto", "cve_puesto", Request["cve_puesto"],true,"string", 50}
                , { "Clave de departamento", "cve_departamento", Request["cve_departamento"],true,"int", 0}
                , { "Nombre", "nombrepuesto", Request["nombrepuesto"],true,"string", 150}
                , { "Activo", "activo", Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarPuesto"
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
                , { "Clave de puesto", "cve_puesto", Request["cve_puesto"],false,"string", 50}
            }
            , "PA_ES_CBusquedaPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
