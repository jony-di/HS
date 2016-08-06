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
                case "Nuevo": NuevoEmpleado(); break;
                case "CambiarEstatusActivo": CambiarEstatusActivo(); break;
                case "Editar": EditarEmpleado(); break;
                case "obtenerCatalogoEmpleado": obtenerCatalogoEmpleado(); break;
                case "obtenerSiguienteClave": obtenerSiguienteClave(); break;
            }
        }

        public void obtenerSiguienteClave()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[0, 0], "PA_SG_CObtenerSiguienteClaveEmpleado"
            );
            ds.WriteXml(Response.OutputStream);
        }

        public void NuevoEmpleado()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"int", 0}
                    , { "Nombre de Empleado", "nombre",Request["nombre"], true ,"string", 50}
                    , { "Apellido Paterno de Empleado", "apellidop",Request["apellidop"], true ,"string", 50}
                    , { "Apelludo Materno de Empleado", "apellidom",Request["apellidom"], true ,"string", 50}
                    , { "Sueldo", "sueldo", Request["sueldo"],true,"float", 0}
                    , { "Fecha Ingreso", "fechaing",Request["fechaing"], true ,"string", 20}
                    , { "Genero", "cve_sexo",Request["cve_sexo"], true ,"int", 0}
                    , { "Estatus", "cve_estatus",Request["cve_estatus"], true ,"int", 0}
                    , { "Estado Civil", "cve_estadocivil",Request["cve_estadocivil"], true,"int",  0 }
                    , { "Banco", "cve_banco", Request["cve_banco"], true, "int", 0 }
                    , { "Número de Cuenta", "numerocuenta", Request["numerocuenta"],true,"int",  0 }
                    , { "Vencimiento de contrato", "Venci_contrato", Request["Venci_contrato"],true ,"string", 20}
                    , { "E-Mail", "email",Request["email"], true ,"string", 150}
                    , { "Estudios", "estudios",Request["estudios"], true ,"string", 120}
                    , { "Escuela", "escuela",Request["escuela"], true ,"string", 100}
                    , { "IMSS", "imss",Request["imss"], true ,"string", 50}
                    , { "CURP", "curp",Request["curp"], true ,"string", 50}
                    , { "RFC", "rfc",Request["rfc"], true ,"string", 50}
                    , { "Fecha Nacimiento", "fechanac",Request["fechanac"], true ,"string", 20}
                    , { "Pais Nacimiento", "cve_paisnaci",Request["cve_paisnaci"], true ,"int", 0}
                    , { "Lugar", "lugarnacimiento",Request["lugarnacimiento"], true ,"string", 50}
                    , { "Nacionalidad", "nacionalidad",Request["nacionalidad"], true ,"string", 50}
                    , { "Pais Trabajo", "cve_paistrabaja",Request["cve_paistrabaja"], true ,"int", 0}
                    , { "Grado Alcanzado", "cve_grado",Request["cve_grado"], true ,"int", 0}
                    , { "Tipo Empleado", "cve_tipoemp",Request["cve_tipoemp"], true ,"int", 0}
                    , { "Número Posicion", "num_posicion",Request["num_posicion"], true ,"string", 50}
                    , { "Estatus activo", "activo","true", true, "bool", 0 }
                    , { "Nombre de foto", "nombreFoto","foto_" + Request["id_empleado"] + Util.ObtenerExtensionArchivoPost(Request.Files["foto"]), true, "string", 50 }
                    , { "Archivo adjunto", "foto",Request.Files["foto"] ,true,"file|.jpg,.png,.jpeg|foto_" + Request["id_empleado"] + "|" + Server.MapPath("~") + "\\Expedientes\\Empleados\\", 800}//800 kb como maximo tamaño para archivo                    
                    , { "Clave de usuario", "cve_usuario", Session["cve_usuario"],true,"int", 0}
                    , { "Url solicitud", "url", Request.Url,true,"string", 500}
                }
                ,"PA_SG_INuevoEmpleado"                
            );
            Response.ContentType = "text/html";
            string estatus = "-1"; string mensaje = "";
            try
            {
                estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
            }
            catch (Exception ex)
            {
                mensaje = "Error: " + ex.Message;
            }
            Response.Write(String.Concat("<script>",
                "var estatus=" + estatus + ";",
                "var mensaje=\"" + mensaje.Replace("\"", "'") + "\";",
                "window.parent.HandlerGuardarEmpleado(estatus,mensaje);",
                "</" + "script>"
            ));
        }


        public void CambiarEstatusActivo()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"int", 0}
                    , { "Estatus", "esActivar",Request["activo"], true ,"bool", 0}
                }
                , "PA_SG_UActivarUsuarios"                
            );            
            ds.WriteXml(Response.OutputStream);
        }


        public void EditarEmpleado()
        {
            Response.ContentType = "text/html";
            string estatus = "-1"; string mensaje = "";            
            /*Protegemos acceso a operaciones sobre catálogo de empleados*/
            int cve_usuario = 0;
            int.TryParse(Session["cve_usuario"].ToString(), out cve_usuario);
            if(Validacion.PuedeVerEmpleado(cve_usuario,Request["id_empleado"])){
                DataSet ds = new Modelo().GenerarOperacion(new object[,]{ 
                          { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"int", 0}
                        , { "Nombre de Empleado", "nombre",Request["nombre"], true ,"string", 50}
                        , { "Apellido Paterno de Empleado", "apellidop",Request["apellidop"], true ,"string", 50}
                        , { "Apelludo Materno de Empleado", "apellidom",Request["apellidom"], true ,"string", 50}
                        , { "Sueldo", "sueldo", Request["sueldo"],true,"float", 0}
                        , { "Fecha Ingreso", "fechaing",Request["fechaing"], true ,"string", 20}
                        , { "Genero", "cve_sexo",Request["cve_sexo"], true ,"int", 0}
                        , { "Estatus", "cve_estatus",Request["cve_estatus"], true ,"int", 0}
                        , { "Estado Civil", "cve_estadocivil",Request["cve_estadocivil"], true,"int",  0 }
                        , { "Banco", "cve_banco", Request["cve_banco"], true, "int", 0 }
                        , { "Número de Cuenta", "numerocuenta", Request["numerocuenta"],true,"int",  0 }
                        , { "Vencimiento de contrato", "Venci_contrato", Request["Venci_contrato"],true ,"string", 20}
                        , { "E-Mail", "email",Request["email"], true ,"string", 150}
                        , { "Estudios", "estudios",Request["estudios"], true ,"string", 120}
                        , { "Escuela", "escuela",Request["escuela"], true ,"string", 100}
                        , { "IMSS", "imss",Request["imss"], true ,"string", 50}
                        , { "CURP", "curp",Request["curp"], true ,"string", 50}
                        , { "RFC", "rfc",Request["rfc"], true ,"string", 50}
                        , { "Fecha Nacimiento", "fechanac",Request["fechanac"], true ,"string", 20}
                        , { "Pais Nacimiento", "cve_paisnaci",Request["cve_paisnaci"], true ,"int", 0}
                        , { "Lugar", "lugarnacimiento",Request["lugarnacimiento"], true ,"string", 50}
                        , { "Nacionalidad", "nacionalidad",Request["nacionalidad"], true ,"string", 50}
                        , { "Pais Trabajo", "cve_paistrabaja",Request["cve_paistrabaja"], true ,"int", 0}
                        , { "Grado Alcanzado", "cve_grado",Request["cve_grado"], true ,"int", 0}
                        , { "Tipo Empleado", "cve_tipoemp",Request["cve_tipoemp"], true ,"int", 0}
                        , { "Número Posicion", "num_posicion",Request["num_posicion"], true ,"int",0}
                        , { "Estatus activo", "activo",Request["activo"], true, "bool", 0 }
                        , { "Nombre de foto", "nombreFoto", Request.Files["foto"]!=null && Request.Files["foto"].ContentLength > 0 ? "foto_" + Request["id_empleado"] + Util.ObtenerExtensionArchivoPost(Request.Files["foto"]) : null, false, "string", 50 }
                        , { "Foto de empleado", "foto",Request.Files["foto"] ,false,"file|.jpg,.png,.jpeg|foto_" + Request["id_empleado"] + "|" + Server.MapPath("~") + "\\Expedientes\\Empleados\\", 800}//800 kb como maximo tamaño para archivo                    
                        , { "Clave de usuario", "cve_usuario", Session["cve_usuario"],true,"int", 0}
                        , { "Url solicitud", "url", Request.Url,true,"string", 500}
                    }
                    , "PA_SG_UActualizarEmpleado"
                );
                try
                {
                    estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                    mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
                }
                catch (Exception ex)
                {
                    mensaje = "Error: " + ex.Message;
                }
            }else{
                estatus="-1000";//Acceso denegado
                mensaje="Acceso a empleado denegado";//Acceso denegado
            }
            
            Response.Write(String.Concat("<script>",
                "var estatus=" + estatus + ";",
                "var mensaje=\"" + mensaje.Replace("\"", "'") + "\";",
                "window.parent.HandlerGuardarEmpleado(estatus,mensaje);",
                "</" + "script>"
            ));
        }


        public void obtenerCatalogoEmpleado()
        {            
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Número de página", "pagina", Request["pagina"],true,"int", 0}
                    , { "Longitud de página", "longitudPagina",Request["longitudPagina"], true ,"int", 0}
                    , { "Clave de Empleado", "id_empleado", Request["id_empleado"],false,"int", 0}
                    , { "Nombre de Empleado", "nombre",Request["nombre"], false ,"string", 50}
                    , { "Nombre completo del Empleado", "nombrecompleto",Request["nombrecompleto"], false ,"string", 200}
                    , { "Apellido Paterno de Empleado", "apellidop",Request["apellidop"], false ,"string", 50}
                    , { "Apelludo Materno de Empleado", "apellidom",Request["apellidom"], false ,"string", 50}
                    , { "Sueldo", "sueldo", Request["sueldo"],false,"float", 0}
                    , { "Fecha Ingreso", "fechaing",Request["fechaing"], false ,"string", 20}
                    , { "Genero", "cve_sexo",Request["cve_sexo"], false ,"int", 0}
                    , { "Estatus", "cve_estatus",Request["cve_estatus"], false ,"int", 0}
                    , { "Estado Civil", "cve_estadocivil",Request["cve_estadocivil"], false,"int",  0 }
                    , { "Banco", "cve_banco", Request["cve_banco"], false, "int", 0 }
                    , { "Número de Cuenta", "numerocuenta", Request["numerocuenta"],false,"int",  0 }
                    , { "Dias Contrato", "Venci_contrato", Request["Venci_contrato"],false ,"string", 20}
                    , { "E-Mail", "email",Request["email"], false ,"string", 150}
                    , { "Estudios", "estudios",Request["estudios"], false ,"string", 120}
                    , { "Escuela", "escuela",Request["escuela"], false ,"string", 100}
                    , { "IMSS", "imss",Request["imss"], false ,"string", 50}
                    , { "CURP", "curp",Request["curp"], false ,"string", 50}
                    , { "RFC", "rfc",Request["rfc"], false ,"string", 50}
                    , { "Fecha Nacimiento", "fechanac",Request["fechanac"], false ,"string", 20}
                    , { "Pais Nacimiento", "cve_paisnaci",Request["cve_paisnaci"], false ,"int", 0}
                    , { "Lugar", "lugarnacimiento",Request["lugarnacimiento"], false ,"string", 50}
                    , { "Nacionalidad", "nacionalidad",Request["nacionalidad"], false ,"string", 50}
                    , { "Pais Trabajo", "cve_paistrabaja",Request["cve_paistrabaja"], false ,"int", 0}
                    , { "Grado Alcanzado", "cve_grado",Request["cve_grado"], false ,"int", 0}
                    , { "Tipo Empleado", "cve_tipoemp",Request["cve_tipoemp"], false ,"int", 0}
                    , { "Número Posicion", "num_posicion",Request["num_posicion"], false ,"int",0}
                    , { "Estatus activo", "activo",Request["activo"], false, "bool", 0 }
                }
                , "PA_SG_CBusquedaEmpleados"                
            );
            ds.WriteXml(Response.OutputStream); 
        }
    
    
    </script>