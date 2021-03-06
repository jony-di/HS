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
            case "NuevoTelefono": Nuevo(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarTelefonos": Editar(); break;
            case "obtenerCatalogoTelefonos": ObtenerCatalogo(); break;
            case "obtenerSiguienteClave": ObtenerSiguienteClave(); break;
        }
    }

    public void ObtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_ES_CObtenerSiguienteClaveTelefono"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Nuevo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                   { "Id de empleado", "id_empleado", Request["id_empleado"],true,"int", 0}
                ,  { "Clave de telefono", "cve_telefono", Request["cve_telefono"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                ,  { "Número de Tel.", "numerotel", Request["numerotel"],true,"string", 20}
                ,  { "Activo", "activo","true", true ,"bool", 0}
            }
            , "PA_ES_INuevoTelefono"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Id de empleado", "id_empleado", Request["id_empleado"],true,"int", 0}
                , { "Estatus", "activo",Request["activo"], true, "bool", 0 }
            }
            , "PA_ES_UCambiarEstatusActivoTelefono"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void Editar()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] {                   
                   { "Id de empleado", "id_empleado", Request["id_empleado"],true,"int", 0}
                ,  { "Clave de telefono", "cve_telefono", Request["cve_telefono"],true,"int", 0}
                ,  { "Descripción", "descripcion", Request["descripcion"],true,"string", 150}
                ,  { "Número de Tel.", "numerotel", Request["numerotel"],true,"string", 20}
                ,  { "Activo", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_ES_UActualizarTelefono"
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
                ,  { "Clave de telefono", "cve_telefono", Request["cve_telefono"],true,"int", 0}
            }
            , "PA_ES_CBusquedaTelefono"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
</script>
