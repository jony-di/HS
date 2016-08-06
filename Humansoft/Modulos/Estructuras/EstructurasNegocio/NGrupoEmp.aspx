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
            case "NuevoGrupoEmp": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarGrupoEmp": Editar(); break;
            case "obtenerCatalogoGrupoEmp": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveGrupoEmp"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                   { "Clave del grupo de empleados", "cve_grupoempl", Request["cve_grupoempl"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 149}
                ,  { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoGrupoEmp"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                   { "Clave del grupo de empleados", "cve_grupoempl", Request["cve_grupoempl"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoGrupoEmp"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                   { "Clave del grupo de empleados", "cve_grupoempl", Request["cve_grupoempl"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 149}
                ,  { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarGrupoEmp"
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
                , { "Clave del grupo de empleados", "cve_grupoempl", Request["cve_grupoemp"],true,"int", 0}
            }
            , "PA_ES_CBusquedaGrupoEmps"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
