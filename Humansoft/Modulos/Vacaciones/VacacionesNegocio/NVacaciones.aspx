<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo= new Modelo("/VacacionesModelo/dboVacaciones.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        
        if (seccion != null)
        {
            object[,] arrayidEmpleadoYSolicitante = ((Request["num_empleado"] == null || Request["num_empleado"].ToString().Trim().Length == 0) ? new object[,] { { "Id de empleado", "num_empleado", Session["num_empleado"], true, "string", 20 }, { "Id de empleado solicito", "num_usuario_cambio", Session["cve_usuario"], true, "string", 20 } } : new object[,] { { "Id de empleado solicito", "num_usuario_cambio", Session["cve_usuario"], true, "string", 20 } });
            object[,] cve_usuario = new object[,] { { "Clave de usuario", "cve_usuario", Session["cve_usuario"] ?? 0, true, "int", 0 } };
            
            int _cve_usuario = 0;
            int.TryParse(Session["cve_usuario"].ToString(), out _cve_usuario);
            Boolean esRecibidoNumEmpleado=(Validacion.esRecibidoParametro(Request["num_empleado"],"string"));
            
            if (!esRecibidoNumEmpleado || (Validacion.PuedeVerEmpleado(_cve_usuario, Request["num_empleado"]) && esRecibidoNumEmpleado) ){
                switch (Request["op"]){
                    case "ObtenerEncabezadoVacacionesEmpleadoSesion":
                        {
                            object[,] otrosParametros = new object[,] { { "Id de empleado", "num_empleado", Session["num_empleado"], true, "string", 20 } };
                            oModelo.GenerarOperacionCX("ObtenerEncabezadoVacacionesEmpleado", Request["seccion"], otrosParametros).WriteXml(Response.OutputStream);
                        }; break;
                    case "ObtenerEncabezadoVacacionesEmpleadoId":
                        {
                            oModelo.GenerarOperacionCX("ObtenerEncabezadoVacacionesEmpleado", Request["seccion"]).WriteXml(Response.OutputStream);
                        }; break;
                    case "ObtenerDiasDerechoVacaciones":
                        {
                            object[,] otrosParametros = new object[,] { { "Id de empleado", "num_empleado", Session["num_empleado"], true, "string", 20 } };
                            oModelo.GenerarOperacionCX("ObtenerDiasDerechoVacaciones", Request["seccion"], otrosParametros).WriteXml(Response.OutputStream);
                        } break;
                    case "ObtenerDiasDerechoVacacionesEmpleadoId":
                        {
                            oModelo.GenerarOperacionCX("ObtenerDiasDerechoVacaciones", Request["seccion"]).WriteXml(Response.OutputStream);
                        } break;

                    case "RegistrarSolicitud": ResolverRegistroSolicitud(Request["op"], Request["seccion"], arrayidEmpleadoYSolicitante); break;

                    case "ObtenerMisSolicitudes": oModelo.GenerarOperacionCX(Request["op"], Request["seccion"], new object[,] { { "Id de empleado", "num_empleado", (Session["num_empleado"] == null ? 0 : Session["num_empleado"]), true, "string", 20 } }).WriteXml(Response.OutputStream); break;

                    case "ObtenerListadoSolicitudes": oModelo.GenerarOperacionCX("ObtenerListadoSolicitudes", "Comunes", cve_usuario).WriteXml(Response.OutputStream); break;

                    case "ObtenerDiasVacaciones":
                        {
                            oModelo.GenerarOperacionCX("ObtenerDiasVacaciones", "Comunes", arrayidEmpleadoYSolicitante).WriteXml(Response.OutputStream);
                        } break;
                    case "ObtenerDiasFeriados":
                        {
                            oModelo.GenerarOperacionCX(Request["op"], Request["seccion"], arrayidEmpleadoYSolicitante).WriteXml(Response.OutputStream);
                        } break;
                    case "RegistrarImpresionSolicitud":
                        {
                            bool exito = Validacion.exitoOperacion(oModelo.GenerarOperacionCX("ResolverEstatus", "ProcesoVacaciones", Util.ConcatenarMatrices(new object[,] { { "Estatus", "estatusProceso", 2, true, "string", 20 }, { "Nota", "nota", "Impresión de solicitud", true, "string", 200 } }, arrayidEmpleadoYSolicitante)));
                            Response.Redirect(Request["urlSolicitud"].ToString());
                        } break;

                    case "CargarEscaneo": CargarEscaneo(arrayidEmpleadoYSolicitante); break;

                    case "ObtenerRolParaSolicitudVacaciones": oModelo.GenerarOperacionCX("ObtenerRolParaSolicitudVacaciones", "Comunes", new object[,] { { "Clave de usuario", "cve_usuarioPideInformacion", Session["cve_usuario"] ?? 0, true, "int", 0 } }).WriteXml(Response.OutputStream); break;

                    case "JefeAutorizaVacaciones": JefeAutorizarVacaciones(); break;

                    case "VoBoRH": RH_VoBoVacaciones(); break;

                    case "CancelarSolicitud": CancelarVacaciones(); break;

                    default: oModelo.GenerarOperacionCX(Request["op"], Request["seccion"]).WriteXml(Response.OutputStream); break;
                }
            }else{
                EstatusOperacion.agregarEstatusOperacion(-1001, "Acceso Denegado").WriteXml(Response.OutputStream);
            }
        }
    }
    



    /*********************************************************************************************************************************
     * Funciones 
     * *******************************************************************************************************************************/

    private void JefeAutorizarVacaciones() {
        oModelo.GenerarOperacionCX("ResolverEstatus", "ProcesoVacaciones",
        new Object[,] { 
                { "Estatus", "estatusProceso", 4, true, "string", 20 }
                ,{ "Clave de usuario", "num_usuario_cambio", Session["cve_usuario"], true, "int", 0 }
                ,{ "Nota", "nota", "Autorización por Jefe de empleado.", true, "string", 512 }
        }).WriteXml(Response.OutputStream);
    }

    private void RH_VoBoVacaciones(){
        oModelo.GenerarOperacionCX("ResolverEstatus", "ProcesoVacaciones",
       new Object[,] { 
                { "Estatus", "estatusProceso", 5, true, "string", 20 }
                ,{ "Clave de usuario", "num_usuario_cambio", Session["cve_usuario"], true, "int", 0 }
                ,{ "Nota", "nota", "VoBo. por área de Recursos Humanos.", true, "string", 512 }
        }).WriteXml(Response.OutputStream);
    }

    private void CancelarVacaciones(){
      oModelo.GenerarOperacionCX("ResolverEstatus", "ProcesoVacaciones",
      new Object[,] { 
                { "Estatus", "estatusProceso", 6, true, "string", 20 }
                ,{ "Clave de usuario", "num_usuario_cambio", Session["cve_usuario"], true, "int", 0 }
                ,{ "Nota", "nota", "Usuario Cancela", true, "string", 1024 }
        }).WriteXml(Response.OutputStream);
    }
    
    
    
    private void ResolverRegistroSolicitud(string operacion, string seccion, object[,] objetoIdEmpleado){
        DataSet ods= new DataSet();
        try
        {
            DataRow drEncabezado = oModelo.GenerarOperacionCX("ObtenerEncabezadoVacacionesEmpleado", "Comunes", objetoIdEmpleado).Tables[0].Rows[0];
            ods = oModelo.GenerarOperacionCX("RegistrarSolicitud", Request["seccion"], objetoIdEmpleado);
            if (Validacion.exitoOperacion(ods))
            {
                DataRowCollection drsDetalle = oModelo.GenerarOperacionCX("ObtenerDetalleSolicitud", "Comunes", Util.ConcatenarMatrices(objetoIdEmpleado, new object[,] { { "Número de solicitud", "num_solicitud", ods.Tables[0].Rows[0]["num_solicitud"], true, "int", 0 } })).Tables[0].Rows;
                if (drsDetalle.Count > 0)
                {
                    int a, b;
                    object[,] textosdinamicos = new object[,]{
                        //ORIGINAL left="50" top="700" width="550" height="20" font-size="13"
                        //{80, 540, 380, 20, drsDetalle[0]["num_solicitud"]},
                        {177,672, 550, 20, drEncabezado["nombre"]},
                        {424, 703, 500, 20, drEncabezado["fechaSolicitud"]},
                        {94, 642, 500, 20, drEncabezado["puesto"]},
                        {135, 612, 500, 20, drEncabezado["departamento"]},
                        {424, 642, 500, 20, drEncabezado["lugarTrabajo"]},
                        {260, 533, 500, 20, drEncabezado["fechaIngreso"]},
                        //{260, 533, 500, 20, drEncabezado["periodo"]},
                        {260, 503, 500, 20, drEncabezado["diasDerechoPeriodoActual"]},
                        {260, 473, 500, 20, drEncabezado["diasGozadosPeriodoActual"]},
                        {260, 443, 500, 20, drEncabezado["diasDerecho"]},//acumulado
                        {169, 412, 500, 20, ods.Tables[0].Rows[0]["numDiasSolicitados"]},
                        {275, 412, 500, 20, ods.Tables[0].Rows[0]["de"]},
                        {415, 412, 500, 20, ods.Tables[0].Rows[0]["hasta"]},
                        {175, 382, 500, 20, int.TryParse( ods.Tables[0].Rows[0]["numDiasSolicitados"].ToString(),out a) && int.TryParse( drEncabezado["diasDerecho"].ToString(),out b)? (b-a).ToString() :"--"},
                    };
                    Regex rxp = new Regex("\\|:|,|-");
                    string rutaPlantillaVacaciones = Server.MapPath("~") + "\\Modulos\\Vacaciones\\PlantillasXML\\solicitud_vacaciones_1.0.xml";
                    string urlPdf = "/Expedientes/Empleados/";
                    string nombreDocumento = "solicitud_vacaciones_" + drsDetalle[0]["num_solicitud"] + "_" + rxp.Replace(drEncabezado["fechaSolicitudISO"].ToString().Replace("/", ""), "") + ".pdf";
                    System.IO.File.WriteAllBytes(Server.MapPath("~") + "\\Expedientes\\Empleados\\" + nombreDocumento, Util.generarDocumentoPdf("solicitudvacaciones", rutaPlantillaVacaciones, textosdinamicos));
                    ods = Util.agregarCampoValor("urlSolicitud", urlPdf + nombreDocumento, ods);
                }
            }
        }catch(Exception e){
            ods = EstatusOperacion.agregarEstatusOperacion(-1, "Error en aplicación: " + e.Message);
        }
        ods.WriteXml(Response.OutputStream);
    }



    private void CargarEscaneo(object[,] objetoIdEmpleado)
    {
        DataSet ds = new DataSet();
        string link = "";
        string num_solicitud = Request["num_solicitud"];

        int cve_estatus = 0; try { cve_estatus= int.Parse(oModelo.GenerarOperacionCX("ObtenerEstatusSolicitud", "ProcesoVacaciones").Tables[0].Rows[0]["cve_estatus"].ToString()); }catch(Exception e){}
        if (cve_estatus != 6){
            if (cve_estatus != 1)
            {
                ds = oModelo.GenerarOperacionCX("ResolverEstatus", "ProcesoVacaciones",
                    Util.ConcatenarMatrices(objetoIdEmpleado,
                    new Object[,] { 
                          { "Estatus", "estatusProceso", 3, true, "string", 20 }
                         ,{ "Nota", "nota", "Archivo escaneado.", true, "string", 512 }
                         ,{ "Nombre de archivo", "nombreArchivo", "/escaneo_" + Request["num_solicitud"] + Util.ObtenerExtensionArchivoPost(Request.Files["solicitud"]), true, "string", 512 }
                         ,{ "Archivo adjunto", "path",Request.Files["solicitud"],true,"file|.jpg,.png,.jpeg,.gif,.ico|escaneo_" + num_solicitud + "|" + Server.MapPath("~") + "\\Expedientes\\Empleados\\", 700}//700 kb como maximo tamaño para archivo                
                    })
                );

                //Registrar notificación para autorización
                DataSet dsn;
                if (Validacion.exitoOperacion(ds))
                {
                    dsn = oModelo.GenerarOperacionCX("RegistrarNotificacionSolicitud", "Comunes");
                }
                link = "/Expedientes/Empleados/escaneo_" + Request["num_solicitud"] + Util.ObtenerExtensionArchivoPost(Request.Files["solicitud"]);
            }
            else {
                ds = EstatusOperacion.agregarEstatusOperacion(-1, "No se puede recibir la solicitud escaneada, debe estar en estatus impresa.");
                link = "/";
            }
         }else{
            ds=EstatusOperacion.agregarEstatusOperacion(-1,"No se puede modificar el estatus de la solicitud de vacaciones, esta cancelada.");
            link = "/";
        }
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
            "var link=\"" + link.Replace("\"", "'") + "\";",
            "window.parent." + (Request["proceso"] == null ? "HandlerCargarEscaneo" : Request["proceso"]) + "(estatus,mensaje,link);",
            "</" + "script>"
        ));
    }
    
</script>