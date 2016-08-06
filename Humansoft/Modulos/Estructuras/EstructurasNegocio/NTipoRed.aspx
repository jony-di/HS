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
            case "NuevoTipoPago": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarTipoPago": Editar(); break;
            case "obtenerCatalogoTipoPago": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveTipoPago"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                   { "Clave de tipo pago", "cve_tipopago", Request["cve_tipopago"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                ,  { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoTipoPago"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave de tipo pago", "cve_tipopago", Request["cve_tipopago"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoTipoPago"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] {
                    { "Clave de tipo pago", "cve_tipopago", Request["cve_tipopago"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarTipoPago"
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
                , { "Clave de tipo pago", "cve_tipopago", Request["cve_tipopago"],true,"int", 0}
            }
            , "PA_ES_CBusquedaTipoPagos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
