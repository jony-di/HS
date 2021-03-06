﻿<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        switch (Request["op"])
        {
            case "NuevoEstadoCivil": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarEstadoCivil": Editar(); break;
            case "obtenerCatalogoEstadoCivil": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveEstadoCivil"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de estado civil", "cve_estadocivil", Request["cve_estadocivil"],true,"string", 14}
                , { "Descripción", "descripcion", Request["descripcion"],true,"string", 49}
                , { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoEstadoCivil"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Estado Civil", "cve_estadocivil", Request["cve_estadocivil"],true,"string", 14}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UActivarDesactivarEstadoCivil"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de estado civil", "cve_estadocivil", Request["cve_estadocivil"],true,"string", 14}
                , { "Descripción", "descripcion", Request["descripcion"],true,"string", 49}
                , { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarEstadoCivil"
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
                , { "Clave de estado civil", "cve_estadocivil",Request["cve_estadocivil"], true,"string",  14 }
            }
            , "PA_ES_CBusquedaEstadoCivil"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
