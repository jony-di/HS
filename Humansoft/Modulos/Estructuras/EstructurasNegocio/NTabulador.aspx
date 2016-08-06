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
            case "NuevoTabulador": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarTabulador": Editar(); break;
            case "obtenerCatalogoTabulador": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Tabulador", "tabulador", Request["tabulador"],true,"int", 0}
            }
            , "PA_ES_CObtenerSiguienteClaveTabulador"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Tabulador", "tabulador", Request["tabulador"],true,"int", 0}
                    ,{ "Nivel", "nivel", Request["nivel"],true,"int", 0}
                    ,{ "P_Min", "p_min", Request["p_min"],true,"float", 0}
                    ,{ "P_Max", "P_Max", Request["P_Max"],true,"float", 0}
                    ,{ "Minimo", "minimo", Request["minimo"],true,"float", 0}
                    ,{ "Contratacion", "Contratacion", Request["Contratacion"],true,"float", 0}
                    ,{ "Medio", "medio", Request["medio"],true,"float", 0}
                    ,{ "Máximo", "maximo", Request["maximo"],true,"float", 0}
                    ,{ "Activo", "activo","true", true ,"bool", 0}
                    , { "Clave de usuario", "cve_usuario", Session["cve_usuario"],true,"int", 0}
                    , { "Url solicitud", "url", Request.Url,true,"string", 500}
            }
            , "PA_ES_INuevoTabulador"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Tabulador", "tabulador", Request["tabulador"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoTabulador"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Tabulador", "tabulador", Request["tabulador"],true,"int", 0}
                    ,{ "Nivel", "nivel", Request["nivel"],true,"int", 0}
                    ,{ "P_Min", "p_min", Request["p_min"],true,"float", 0}
                    ,{ "P_Max", "P_Max", Request["P_Max"],true,"float", 0}
                    ,{ "Minimo", "minimo", Request["minimo"],true,"float", 0}
                    ,{ "Contratacion", "Contratacion", Request["Contratacion"],true,"float", 0}
                    ,{ "Medio", "medio", Request["medio"],true,"float", 0}
                    ,{ "Máximo", "maximo", Request["maximo"],true,"float", 0}
                    ,{ "Activo", "activo",Request["activo"], true ,"bool", 0}
                    , { "Clave de usuario", "cve_usuario", Session["cve_usuario"],true,"int", 0}
                    , { "Url solicitud", "url", Request.Url,true,"string", 500}
            }
            , "PA_ES_UActualizarTabulador"
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
                , { "Tabulador", "tabulador", Request["tabulador"],true,"int", 0}
                , { "Nivel", "nivel", Request["nivel"],false,"int", 0}  
            }
            , "PA_ES_CBusquedaTabulador"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
