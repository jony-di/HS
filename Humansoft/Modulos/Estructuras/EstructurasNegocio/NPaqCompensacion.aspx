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
            case "NuevoPaqCompensacion": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarPaqCompensacion": Editar(); break;
            case "obtenerCatalogoPaqCompensacion": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClavePaqueteCompensacion"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de paquete", "cve_paquete", Request["cve_paquete"],true,"int", 0}
                ,  { "Nombre", "nombre", Request["nombre"],true,"string", 80}
                ,  { "Descrpción", "descripcion", Request["descripcion"],true,"string", 150}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoPaqueteCompensacion"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Nivel", "nivel", Request["nivel"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoPaqueteCompensacion"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de paquete", "cve_paquete", Request["cve_paquete"],true,"int", 0}
                ,  { "Nombre", "nombre", Request["nombre"],true,"string", 80}
                ,  { "Descrpción", "descripcion", Request["descripcion"],true,"string", 150}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarPaqueteCompensacion"
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
                , { "Clave de paquete de compensaciones", "cve_paquete", Request["cve_paquete"],true,"int", 0}
            }
            , "PA_ES_CBusquedaPaqueteCompensacion"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
