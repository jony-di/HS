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
            case "NuevoBanco": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarBanco": Editar(); break;
            case "obtenerCatalogoBanco": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveBanco"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de banco", "cve_banco", Request["cve_banco"],true,"int", 0}
                ,  { "Nombre", "nombre", Request["nombre"],true,"string", 99}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoBanco"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave de banco", "cve_banco", Request["cve_banco"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoBanco"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                   { "Clave de banco", "cve_banco", Request["cve_banco"],true,"int", 0}
                ,  { "Nombre", "nombre", Request["nombre"],true,"string", 99}
                ,  { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarBanco"
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
                , { "Clave de banco", "cve_banco", Request["cve_banco"],true,"int", 0}
            }
            , "PA_ES_CBusquedaBancos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
