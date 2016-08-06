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
            case "NuevoDepartamento": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarDepartamento": Editar(); break;
            case "obtenerCatalogoDepartamento": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveDepartamento"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de departamento", "cve_departamento", Request["cve_departamento"],true,"int", 0}
                , { "dga_agru", "dga_agru",Request["dga_agru"], true ,"string", 15}
                , { "Nombre de departamento", "nombredep",Request["nombredep"], true ,"string", 200}
                , { "Clave de empresa", "cve_empresa", Request["cve_empresa"],true,"int", 0}
                , { "Costos", "c_costos",Request["c_costos"], true ,"int", 0}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoDepartamento"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de concepto", "clave_curso", Request["clave_curso"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_SG_INuevoConcepto"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de departamento", "cve_departamento", Request["cve_departamento"],true,"int", 0}
                , { "dga_agru", "dga_agru",Request["dga_agru"], true ,"string", 15}
                , { "Nombre de departamento", "nombredep",Request["nombredep"], true ,"string", 200}
                , { "Clave de empresa", "cve_empresa", Request["cve_empresa"],true,"int", 0}
                , { "Costos", "c_costos",Request["c_costos"], true ,"int", 0}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarDepartamentos"
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
                , { "Clave de departamento", "cve_departamento",Request["cve_departamento"], false,"int",  0 }
                , { "Clave de DGA", "dga_agru",Request["dga_agru"], false,"int",  0 }
            }
            , "PA_ES_CBusquedaDepartamentos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
