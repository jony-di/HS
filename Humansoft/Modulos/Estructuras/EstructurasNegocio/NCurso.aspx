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
            case "NuevoCurso": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarCurso": Editar(); break;
            case "obtenerCatalogoCurso": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveCursos"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de curso", "clave_curso", Request["clave_curso"],true,"int", 0}
                , { "Clave de curso", "cvecurso_emp",Request["cvecurso_emp"], true ,"int", 0}
                , { "Nombre del curso", "nombre_curso",Request["nombre_curso"], true ,"string", 200}
                , { "Descripción", "descripcion",Request["descripcion"], true ,"string", 200}
                , { "Número de dias", "dias",Request["dias"], true ,"int", 0}
                , { "Todos puesto", "todospuesto",Request["todospuesto"]==null? false.ToString() : Request["todospuesto"], true ,"bool", 0}
                , { "Horas", "horas",Request["horas"], true ,"int", 0}
                , { "Tipo de curso", "tipo_curso",Request["tipo_curso"], true ,"int", 0}
                , { "Frecuencia", "frecuencia",Request["frecuencia"], true ,"int", 0}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoCurso"
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
            , "PA_ES_UEditarCurso"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de curso", "clave_curso", Request["clave_curso"],true,"int", 0}
                , { "Clave de curso", "cvecurso_emp",Request["cvecurso_emp"], true ,"int", 0}
                , { "Nombre del curso", "nombre_curso",Request["nombre_curso"], true ,"string", 200}
                , { "Descripción", "descripcion",Request["descripcion"], true ,"string", 200}
                , { "Número de dias", "dias",Request["dias"], true ,"int", 0}
                , { "Todos puesto", "todospuesto",Request["todospuesto"]==null? false.ToString() : Request["todospuesto"], true ,"bool", 0}
                , { "Horas", "horas",Request["horas"], true ,"int", 0}
                , { "Tipo de curso", "tipo_curso",Request["tipo_curso"], true ,"int", 0}
                , { "Frecuencia", "frecuencia",Request["frecuencia"], true ,"int", 0}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarCurso"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void ObtenerCatalogo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"int", 0}
                , { "Criterio de búsqueda", "criterio",Request["criterio"], false ,"string", 80}
                , { "Clave", "clave_curso",Request["clave_curso"], true,"int",  0 }
            }
            , "PA_ES_CBusquedaCursos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
