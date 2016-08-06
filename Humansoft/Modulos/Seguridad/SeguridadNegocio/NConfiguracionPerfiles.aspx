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
            case "ObtenerMenusPefilSesion": ObtenerMenusPefilSesion(); break;
            case "ObtenerMenusPefil": ObtenerMenusPefil(); break;
            case "GuardarMenusPerfil": GuardarMenusPerfil(); break;
            case "ObtenerPerfilModulosRole": ObtenerPerfilModulosRole(); break;
            case "GuardarPerfilModulosRole": GuardarPerfilModulosRole(); break;
            case "ObtenerPerfilesEmpresas": ObtenerPerfilEmpresas(); break;
            case "ObtenerPerfilesEmpresasDepartamentos": ObtenerPerfilesEmpresasDepartamentos(); break;
            case "GuardarPerfilEmpresasDepartamentos": GuardarPerfilEmpresasDepartamentos(); break;
        }
    }

    public void ObtenerMenusPefilSesion()
    {    
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Session["cve_perfil"],true,"int", 0}
                , { "Es selección", "esSeleccion",Request["esSeleccion"], true, "bool", 0 }
                , { "Criterio", "criterio",Request["criterio"], false, "string", 80 }
            }, "PA_SG_CArbolPerfilMenus"
        );
        ds.WriteXml(Response.OutputStream);   
    }

    public void ObtenerMenusPefil()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                , { "Es selección", "esSeleccion",Request["esSeleccion"], true, "bool", 0 }
            }, "PA_SG_CArbolPerfilMenus"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void GuardarMenusPerfil()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                , { "Menus de Perfil", "menusperfil",Request["menusperfil"], false, "string", 1024 }
            }, "PA_SG_UMenusPerfil"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void ObtenerPerfilModulosRole()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
            }, "PA_SG_CPerfilModulosRoles"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void GuardarPerfilModulosRole()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                , { "Modulos y Roles de Perfil", "modulosperfilRole",Request["modulosperfilRole"], false, "string", 2000 }
            }, "PA_SG_UPerfilModulosRoles"
        );
        ds.WriteXml(Response.OutputStream);
    }


    public void ObtenerPerfilEmpresas()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
            }, "PA_SG_CPerfilEmpresas"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void ObtenerPerfilesEmpresasDepartamentos()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                    ,{ "Clave de empresa", "cve_empresa", Request["cve_empresa"],true,"int", 0}
            }, "PA_SG_CPerfilEmpresasDepartamentos"
        );
        ds.WriteXml(Response.OutputStream);
    }
    
    public void GuardarPerfilEmpresasDepartamentos()
    {
        DataSet ds = new Modelo().GenerarOperacion(
             new object[,] { 
                    { "Clave de perfil", "cve_perfil", Request["cve_perfil"],true,"int", 0}
                , { "Clave de empresa", "cve_empresa", Request["cve_empresa"],true,"int", 0}
                , { "Departamentos de Perfil", "departamentos_perfil",Request["departamentosperfil"], false, "string", 1024 }
            }, "PA_SG_UPerfilEmpresasDepartamentos"
        );
        ds.WriteXml(Response.OutputStream);
    }

</script>

