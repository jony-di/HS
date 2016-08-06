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
            case "NuevoDeduccion": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarDeduccion": Editar(); break;
            case "obtenerCatalogoDeduccion": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveDeducciones"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Id de empleado", "ID_Empleado", Request["ID_Empleado"],true,"int", 0}
                , { "Año", "anio",Request["anio"], true ,"int", 0}
                , { "Descripción", "descripcion",Request["descripcion"], true ,"string", 200}
                , { "Tiene", "tiene",Request["tiene"], true ,"bool", 0}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevaDeduccion"
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
                  { "Id de empleado", "ID_Empleado", Request["ID_Empleado"],true,"int", 0}
                , { "Año", "anio",Request["anio"], true ,"int", 0}
                , { "Descripción", "descripcion",Request["descripcion"], true ,"string", 200}
                , { "Tiene", "tiene",Request["tiene"], true ,"bool", 0}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarDeducciones"
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
                , { "Id de empleado", "id_empleado",Request["id_empleado"], true,"int",  0 }
            }
            , "PA_ES_CBusquedaDeducciones"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
