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
            case "obtenerSiguienteClave": ObtenerSiguienteClavePais(); break;
            case "NuevoPais": NuevoPais(); break;
            case "EliminarPais": EliminarPais(); break;
            case "EditarPais": EditarPais(); break;
            case "obtenerCatalogoPais": ObtenerCatalogoPais(); break;
        }
    }

    /****************************************************************** Pais de Empresa ***************************************************************************/
    public void ObtenerSiguienteClavePais()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_SG_CObtenerSiguienteClavePais"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void NuevoPais()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de Pais", "cve_Pais", Request["cve_Pais"],true,"int", 0}
                , { "Nombre de Pais", "nombre",Request["nombre"], true ,"string", 80}
            }
            , "PA_SG_INuevoPais"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void EliminarPais()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de Pais", "cve_Pais", Request["cve_Pais"],true,"int", 0}
            }
            , "PA_SG_DEliminarPais"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void EditarPais()
    {
        DataSet ds = new Modelo().GenerarOperacion(
        new object[,] { 
                    { "Clave de Pais", "cve_Pais", Request["cve_Pais"],true,"int", 0}
                , { "Nombre de Pais", "nombre",Request["nombre"], true ,"string", 80}
            }
        , "PA_SG_UActualizarPais"
    );
        ds.WriteXml(Response.OutputStream);
    }

    public void ObtenerCatalogoPais()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"string", 80}
                , { "Criterio de búsqueda", "criterio",Request["criterio"], false ,"string", 80}
                , { "Clave de Pais", "cve_Pais",Request["cve_Pais"], false,"int",  0 }
            }
            , "PA_SG_CBusquedaPais"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
 </script>
