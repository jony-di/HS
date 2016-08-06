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
            case "NuevoTipoSuc": NuevoTipoSuc(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarTipoSuc": EditarTipoSuc(); break;
            case "obtenerCatalogoTipoSuc": obtenerCatalogoTipoSuc(); break;
            case "obtenerSiguienteClave": obtenerSiguienteClave(); break;
        }
    }

     public void obtenerSiguienteClave()
     {
         DataSet ds = new Modelo().GenerarOperacion(
             new object[0, 0], "PA_SG_CObtenerSiguienteClaveTipoSuc"
         );
         ds.WriteXml(Response.OutputStream);
     }
    
    public void NuevoTipoSuc()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de zona","cve_tipo", Request["cve_tipo"],true,"int", 0}
                , { "Nombre","nombre", Request["nombre"], true ,"string", 80}                
                , { "Estatus", "activo","true", true ,"bool", 0}
            }
            ,"PA_SG_INuevoTipoSuc"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de zona","cve_tipo", Request["cve_tipo"],true,"int", 0}
                , { "Estatus", "esActivar",Request["activo"], true ,"bool", 0}
            }
            , "PA_SG_UActivarTipoSuc"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void EditarTipoSuc()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave de zona","cve_tipo", Request["cve_tipo"],true,"int", 0}
                , { "Nombre","nombre", Request["nombre"], true ,"string", 80}
                , { "Estatus", "activo",Request["activo"], true ,"bool", 0}
            }
            , "PA_SG_UActualizarTipoSuc"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void obtenerCatalogoTipoSuc()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"string", 80}
                , { "Criterio de búsqueda.", "criterio",Request["criterio"], false ,"string", 80}
                , { "Clave de TipoSuc", "cve_tipo",Request["cve_tipo"], false,"int",  0 }
            }
            , "PA_SG_CBusquedaTipoSucs"
        );
        ds.WriteXml(Response.OutputStream); 
    }
    
    
</script>