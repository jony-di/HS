<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>

<script runat="server">   

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        switch (Request["op"])
        {
            case "obtenerSiguienteClave": ObtenerSiguienteClaveGiro(); break;
            case "NuevoGiro": NuevoGiro(); break;
            case "EliminarGiro": EliminarGiro(); break;
            case "EditarGiro": EditarGiro(); break;
            case "obtenerCatalogoGiros": ObtenerCatalogoGiros(); break;
        }
    }

    /****************************************************************** Giro de Empresa ***************************************************************************/
    public void ObtenerSiguienteClaveGiro()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_SG_CObtenerSiguienteClaveGiros"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void NuevoGiro()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de giro", "cve_giro", Request["cve_giro"],true,"int", 0}
                , { "Nombre de Giro", "nombre",Request["nombre"], true ,"string", 80}
            }
            , "PA_SG_INuevoGiro"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void EliminarGiro()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de giro", "cve_giro", Request["cve_giro"],true,"int", 0}
            }
            , "PA_SG_DEliminarGiro"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void EditarGiro()
    {
        DataSet ds = new Modelo().GenerarOperacion(
        new object[,] { 
                    { "Clave de giro", "cve_giro", Request["cve_giro"],true,"int", 0}
                , { "Nombre de Giro", "nombre",Request["nombre"], true ,"string", 80}
            }
        , "PA_SG_UActualizarGiro"
    );
        ds.WriteXml(Response.OutputStream);
    }

    public void ObtenerCatalogoGiros()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"string", 80}
                , { "Criterio de búsqueda", "criterio",Request["criterio"], false ,"string", 80}
                , { "Clave de giro", "cve_giro",Request["cve_giro"], false,"int",  0 }
            }
            , "PA_SG_CBusquedaGiros"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
 </script>
