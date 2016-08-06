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
                case "NuevaDireccionEmpl": NuevaDireccionEmpl(); break;
                case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
                case "EditarDireccionEmpl": EditarDireccionEmpl(); break;
                case "obtenerCatalogoDireccionEmpl": obtenerCatalogoDireccionEmpl(); break;
                case "obtenerSiguienteClave": obtenerSiguienteClave(); break;
            }
        }

        public void obtenerSiguienteClave()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[0, 0], "PA_SG_CObtenerSiguienteClaveDireccionEmpl"
            );
            ds.WriteXml(Response.OutputStream);
        }

        public void NuevaDireccionEmpl()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Direccion", "cve_direccionempl", Request["cve_direccionempl"],true,"int", 0}
                    , { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"int", 0}  
                    , { "Calle", "calle",Request["calle"], true ,"string", 50}
                    , { "Colonia", "colonia",Request["colonia"], true ,"string", 50}
                    , { "Municipio", "cve_municipio",Request["cve_municipio"], true ,"string", 50}
                    , { "Ciudad", "ciudad",Request["ciudad"], true ,"string", 50}
                    , { "Estado", "cveestado",Request["cveestado"], true ,"int", 0}
                    , { "Pais", "cvepais",Request["cvepais"], true ,"int", 0}
                    , { "CP", "cp",Request["cp"], true ,"int", 0}
                    , { "Estatus activo", "activo","true", true, "bool", 0 }

                }
                ,"PA_SG_INuevaDireccionEmpl"                
            );            
            ds.WriteXml(Response.OutputStream);
        }


        public void CambiarEstatusActivo()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Direccion", "cve_direccionempl", Request["cve_direccionempl"],true,"int", 0}
                    , { "Estatus", "esActivar",Request["activo"], true ,"bool", 0}
                }
                , "PA_SG_UActivarUsuarios"                
            );            
            ds.WriteXml(Response.OutputStream);
        }


        public void EditarDireccionEmpl()
        {
            DataSet ds = new Modelo().GenerarOperacion(new object[,]{ 
                      { "Clave de Direccion", "cve_direccionempl", Request["cve_direccionempl"],true,"int", 0}
                    , { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"int", 0}  
                    , { "Calle", "calle",Request["calle"], true ,"string", 50}
                    , { "Colonia", "colonia",Request["colonia"], true ,"string", 50}
                    , { "Municipio", "cve_municipio",Request["cve_municipio"], true ,"string", 50}
                    , { "Ciudad", "ciudad",Request["ciudad"], true ,"string", 50}
                    , { "Estado", "cveestado",Request["cveestado"], true ,"int", 0}
                    , { "Pais", "cvepais",Request["cvepais"], true ,"int", 0}
                    , { "CP", "cp",Request["cp"], true ,"int", 0}
                    , { "Estatus activo", "activo",Request["activo"], true, "bool", 0 }
                }
                , "PA_SG_UActualizarDireccionEmpl"
            );
            ds.WriteXml(Response.OutputStream);
        }


        public void obtenerCatalogoDireccionEmpl()
        {            
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                    , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"int", 0}
                    , { "Criterio de búsqueda", "criterio",Request["criterio"], false ,"string", 210}
                    , { "Id de empleado", "id_empleado",Request["id_empleado"], true,"int",  0 }
                    , { "Clave de Direccion", "cve_direccionempl",Request["cve_direccionempl"], true,"int",  0 }
                }
                , "PA_SG_CBusquedaDireccionEmpl"                
            );
            ds.WriteXml(Response.OutputStream); 
        }
    
    
    </script>
