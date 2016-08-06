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
            case "NuevoDga": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarDga": Editar(); break;
            case "obtenerCatalogoDga": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveDGA"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "DGA AGRU", "dga_agrup", Request["dga_agrup"],true,"int", 16}
                ,  { "DGA", "dga", Request["dga"],true,"string", 34}
                , { "Activo", "activo","true", true ,"bool", 0} 
                ,{ "Clave de empresa", "cve_empresa", Request["cve_empresa"],true,"int", 0}
            }
            , "PA_ES_INuevoDGA"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "DGA", "dga_agrup", Request["dga_agrup"],true,"int", 16}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_SG_UActivarDesactivarDGA"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "DGA AGRU", "dga_agrup", Request["dga_agrup"],true,"int", 16}
                ,  { "DGA", "dga", Request["dga"],true,"string", 34}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
                , { "Clave de empresa", "cve_empresa", Request["cve_empresa"],true,"int", 0}
            }
            , "PA_ES_UActualizarDGA"
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
                , { "DGA", "dga_agrup",Request["dga_agrup"], false,"int", 0 }
                ,{ "Clave de empresa", "cve_empresa", Request["cve_empresa"],false,"int", 0}
            }
            , "PA_ES_CBusquedaDGA"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
