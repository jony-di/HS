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
            case "NuevoPerfil": NuevoPerfil(); break;
            case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
            case "EditarPerfil": EditarPerfil(); break;
            case "obtenerCatalogoPerfiles": obtenerCatalogoPerfiles(); break;
            case "obtenerSiguienteClave": obtenerSiguienteClave(); break;
        }
    }

    public void obtenerSiguienteClave()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[0, 0], "PA_SG_CObtenerSiguienteClavePerfiles"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
    public void NuevoPerfil(){    
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                 { "Clave de Perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                ,{ "Nombre de Perfil", "nombre", Request["nombre"],true,"string", 80}
                ,{ "Estatus puede ver todo", "puedevertodo", Request["puedevertodo"],true,"bool", 0}
                ,{ "Tipo de estructura", "cve_tipoestructura", Request["TipoEstructura"],true,"int", 0}
                ,{ "Estatus activo", "activo", "true", true, "bool", 0 }
            }
            , "PA_SG_INuevoPerfil"
        );
        ds.WriteXml(Response.OutputStream);   
    }

    public void CambiarEstatusActivo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                 { "Clave de Perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                ,{ "Estatus activo", "esActivar",Request["activo"], true, "bool", 0 }
            }
            , "PA_SG_UCambiarEstatusPerfil"
        );
        ds.WriteXml(Response.OutputStream);   
    }

        public void EditarPerfil()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                     { "Clave de Perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                    ,{ "Nombre de Perfil", "nombre", Request["nombre"],true,"string", 80}
                    ,{ "Estatus puede ver todo", "puedevertodo", Request["puedevertodo"],true,"bool", 0}
                    ,{ "Tipo de estructura", "cve_tipoestructura", Request["TipoEstructura"],true,"int", 0}
                    ,{ "Estatus activo", "activo",Request["activo"], true, "bool", 0 }
                }
                , "PA_SG_UActualizarPerfil"
            );
            ds.WriteXml(Response.OutputStream);   
        }

        public void obtenerCatalogoPerfiles()
        {
            DataSet ds = new Modelo().GenerarOperacion(
               new object[,] { 
                        { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                    , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"string", 80}
                    , { "Criterio de búsqueda.", "criterio",Request["criterio"], false ,"string", 80}
                    , { "Clave de Perfil", "cve_perfil",Request["cve_perfil"], false,"int",  0 }
                }
               , "PA_SG_CBusquedaPerfiles"
            );
            ds.WriteXml(Response.OutputStream);    
        }
</script>