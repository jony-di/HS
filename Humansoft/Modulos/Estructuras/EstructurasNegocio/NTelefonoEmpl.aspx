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
                case "NuevaTelefonoEmpl": NuevaTelefonoEmpl(); break;
                case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
                case "EditarTelefonoEmpl": EditarTelefonoEmpl(); break;
                case "obtenerCatalogoTelefonoEmpl": obtenerCatalogoTelefonoEmpl(); break;
                case "obtenerSiguienteClave": obtenerSiguienteClave(); break;
            }
        }

        public void obtenerSiguienteClave()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[0, 0], "PA_SG_CObtenerSiguienteClaveTelefonoEmpl"
            );
            ds.WriteXml(Response.OutputStream);
        }

        public void NuevaTelefonoEmpl()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Telefono", "cve_telefono", Request["cve_telefono"],true,"int", 0}
                    , { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"string", 50}
                    , { "Area", "area",Request["area"], true,"string",20}
                    , { "NoTelefono", "no_telefono",Request["no_telefono"], true,"string",20}
                    , { "Fecha", "fecha",Request["fecha"], false,"string",20}
                    , { "Tipo Red", "tipored",Request["tipored"], true,"string",7}
                    , { "Tipo Llamada", "tipollamada_id",Request["tipollamada_id"], true ,"int", 0}
                    , { "Extension", "extension",Request["extension"], true,"string", 50}
                    , { "Estatus activo", "activo","true", true, "bool", 0 }

                }
                ,"PA_SG_INuevaTelefonoEmpl"                
            );            
            ds.WriteXml(Response.OutputStream);
        }


        public void CambiarEstatusActivo()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Direccion", "cve_telefono", Request["cve_direccionempl"],true,"int", 0}
                    , { "Estatus", "esActivar",Request["activo"], true ,"bool", 0}
                }
                , "PA_SG_UActivarUsuarios"                
            );            
            ds.WriteXml(Response.OutputStream);
        }


        public void EditarTelefonoEmpl()
        {
            DataSet ds = new Modelo().GenerarOperacion(new object[,]{ 
                      { "Clave de Telefono", "cve_telefono", Request["cve_telefono"],true,"int", 0}
                    , { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"string", 50}
                    , { "Area", "area",Request["area"], true,"string",20}
                    , { "NoTelefono", "notelefono",Request["notelefono"], true,"string",20}
                    , { "Fecha", "fecha",Request["fecha"], false,"string",20}
                    , { "Tipo Red", "tipored",Request["tipored"], true,"string",7}
                    , { "Tipo Llamada", "tipollamada_id",Request["tipollamada_id"], true ,"int", 0}
                    , { "Extension", "extension",Request["extension"], true,"string", 50}
                    , { "Estatus activo", "activo","true", true, "bool", 0 }
                }
                , "PA_SG_UActualizarTelefonoEmpl"
            );
            ds.WriteXml(Response.OutputStream);
        }


        public void obtenerCatalogoTelefonoEmpl()
        {            
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                    , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"int", 0}
                    , { "Criterio de búsqueda", "criterio",Request["criterio"], false ,"string", 210}
                    , { "Id de empleado", "id_empleado",Request["id_empleado"], true,"int",  0 }
                    , { "Clave de Telefono", "cve_telefono",Request["cve_telefono"], true,"int",  0 }
                }
                , "PA_SG_CBusquedaTelefonoEmpl"                
            );
            ds.WriteXml(Response.OutputStream); 
        }
    
    
    </script>
