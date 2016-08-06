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
            case "NuevoFamiliaPuesto": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarFamiliaPuesto": Editar(); break;
            case "obtenerCatalogoFamiliaPuesto": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveFamiliaPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Familia puesto", "fampuesto", Request["fampuesto"],true,"string", 9}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 50}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoFamiliaPuesto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "DGA", "dga_agru", Request["dga_agru"],true,"string", 16}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_SG_UActivarDesactivarFamiliaPuestos"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Familia puesto", "fampuesto", Request["fampuesto"],true,"string", 9}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 50}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarFamiliaPuesto"
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
                , { "Familia de puesto", "fampuesto",Request["fampuesto"], true,"string",  9 }
            }
            , "PA_ES_CBusquedaFamiliaPuestos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
