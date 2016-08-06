<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>

<script runat="server">
    
        
        Modelo oModelo = new Modelo("/SeguridadModelo/dboSeguridad.xml");

        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Clear();
            Response.ContentType = "text/xml";
            switch (Request["op"])
            {
                case "IniciarSesion": IniciarSesion(); break;
                case "CerrarSesion": CerrarSesion(); break;
                case "MantenerSesionAbierta": MantenerConetado(); break;
                case "CambiarPassword": CambiarPassword(); break;
                case "EnviarPasswordEmail": EnviarPasswordEmail(); break;
                case "ObtenerDescripcionTipoPassword": ObtenerDescripcionTipoPassword(); break;
                case "ObtenerNotificacionesUsuario": oModelo.GenerarOperacionCX("ObtenerNotificacionesUsuario", "Comunes", new object[,] { { "Clave de usuario", "cve_usuario", Session["cve_usuario"], true, "int", 0 } }).WriteXml(Response.OutputStream); break;
                case "EliminarNotificacionUsuario": oModelo.GenerarOperacionCX("EliminarNotificacionUsuario", "Comunes", new object[,] { { "Clave de usuario", "cve_usuario", Session["cve_usuario"], true, "int", 0 } }).WriteXml(Response.OutputStream); break;
                case "ObtenerEstructura": oModelo.GenerarOperacionCX("ObtenerEstructura", "Visibilidad", new object[,] { { "Clave de usuario", "cve_usuario", Session["cve_usuario"], true, "int", 0 } }).WriteXml(Response.OutputStream); break;
                case "ObtenerEmpleados": oModelo.GenerarOperacionCX("ObtenerEmpleados", "Visibilidad", new object[,] { { "Clave de usuario", "cve_usuario", Session["cve_usuario"], true, "int", 0 } }).WriteXml(Response.OutputStream); break;
                case "ObtenerEncabezadoEmpleado": oModelo.GenerarOperacionCX("ObtenerEncabezadoEmpleado", "Comunes", Validacion.esRecibidoParametro(Request["num_empleado"], "string") ? null : new object[,] { { "Número de empleado", "num_empleado", Session["num_empleado"], true, "string", 20 } }).WriteXml(Response.OutputStream); break;
                default : oModelo.GenerarOperacionCX(Request["op"], Request["seccion"]).WriteXml(Response.OutputStream); break;
            }
        }

        public void ObtenerDescripcionTipoPassword()
        {
            DataSet ds = new DataSet();
            ds = new Modelo().GenerarOperacion(
                    new object[,] { 
                            { "Clave usuario", "cve_usuario",Session["cve_usuario"] ,true,"string", 40}
                    }
                    , "PA_SG_CDescripcionTipoPassword"
                );
            ds.WriteXml(Response.OutputStream);
        }

        public void MantenerConetado()
        {
            Session["MantenerConectado"] = true;
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            Response.Cache.SetNoStore();
            Response.Cache.SetNoServerCaching();
            Util.agregarCampoValor("estatus", (HttpContext.Current.Session["cve_usuario"] == null).ToString(), null).WriteXml(Response.OutputStream);
        }

        public void IniciarSesion()
        {
            DataSet ds = new DataSet();
            int intentosPermitidos = -1;
            int esCuentaBloqueada = -1;
            try{
                DataSet dsB = new DataSet();
                dsB = new Modelo().GenerarOperacion(
                        new object[,] { 
                              { "Nombre de Usuario", "usuario",Request["usuario"] ,true,"string", 40}
                        }
                        , "PA_SG_CIntentosPermitidosUsuario"
                        , true
                    );
                intentosPermitidos = Convert.ToInt32(dsB.Tables[0].Rows[0]["veceslogin"]);
                esCuentaBloqueada = Convert.ToInt32(dsB.Tables[0].Rows[0]["cuentabloqueada"]);
            }catch (Exception exc) {}

            if (esCuentaBloqueada == 0 ){//No Es cuenta bloqueada
                string a=Request["usuario"];
                string b = Request["_password"];
                string c = Request["mantenerConectado"];
                Boolean MantenerConectado = false;
                try { MantenerConectado = Convert.ToBoolean(c); }catch(Exception ex) {}
                if (MantenerConectado){
                    Session["MantenerConectado"] = true;
                }
                DataSet dsA = new Modelo().GenerarOperacion(
                    new object[,] { 
                            { "Nombre de Usuario", "usuario",a ,true,"string", 20}
                        , { "Contraseña", "password",b, true ,"string", 20}
                    }
                    , "PA_SG_ValidarUsuario"
                    , true
                );
                try {
                    if (dsA.Tables[0].Rows.Count > 0)
                    {
                        int TimeOut= 20;//Valor por default del timeout 20 min
                        int.TryParse(ConfigurationManager.AppSettings.Get("TimeOut"),out TimeOut);//Valor seleccionado por el usuario.
                        Session.Timeout = TimeOut;
                        Session["cve_usuario"] = dsA.Tables[0].Rows[0]["cve_usuario"];
                        Session["cve_perfil"] = dsA.Tables[0].Rows[0]["cve_perfil"];
                        Session["nombre_perfil"] = dsA.Tables[0].Rows[0]["perfil"];
                        Session["nombre"] = dsA.Tables[0].Rows[0]["nombre"];
                        Session["perfil"] = dsA.Tables[0].Rows[0]["perfil"];
                        Session["num_empleado"] = dsA.Tables[0].Rows[0]["num_empleado"];
                        //Session["cve_usuario"] = ds.Tables[0].Rows[0]["cve_usuario"];
                        Session["intentosAcceso"] = 0;
                        try {
                            new Modelo().GenerarOperacion(
                                new object[,] { 
                                        { "Clave de usuario", "cve_usuario",Session["cve_usuario"].ToString() ,true,"int", 0}
                                    , { "IP", "ip",Request.UserHostAddress, true ,"string", 40}
                                }
                                , "PA_SG_RegistrarAccesoUsuario"
                                , true
                            );
                        }catch(Exception ex){ }
                        ds= EstatusOperacion.agregarEstatusOperacion(1, "Continuar acceso.");
                    }
                    else {
                        ds = EstatusOperacion.agregarEstatusOperacion(0, "Denegar acceso.");
                        Session["intentosAcceso"] = Session["intentosAcceso"] == null ? 0 : (int)Session["intentosAcceso"];
                        if ((int)Session["intentosAcceso"] > intentosPermitidos ){
                            DataSet dsD = new Modelo().GenerarOperacion(
                                new object[,] { 
                                    { "Nombre de Usuario", "usuario",Request["usuario"] ,true,"string", 40}
                                }, "PA_SG_UBloquearUsuario"
                                , true
                            );
                            ds = EstatusOperacion.agregarEstatusOperacion(-100, "Cuenta bloqueada.");
                        }else if (intentosPermitidos > -1){
                            Session["intentosAcceso"] = (Session["intentosAcceso"] == null ? 1 : (int)Session["intentosAcceso"] + 1);
                        }
                    }
                }catch (Exception ex){
                    ds = EstatusOperacion.agregarEstatusOperacion(0, "Denegar acceso.");
                }
            }
            else if (esCuentaBloqueada == 1)
            {
                ds = EstatusOperacion.agregarEstatusOperacion(-100, "Cuenta bloqueada.");
            }
            else {
                ds = EstatusOperacion.agregarEstatusOperacion(-1, "Denegar acceso.");
            }             
            ds.WriteXml(Response.OutputStream);
        }


        public void CerrarSesion()
        {
            DataSet ds = new DataSet();

            try
            {
                Session.Abandon();
                ds = EstatusOperacion.agregarEstatusOperacion(1, "Cierre de sesión correcto.");
            }
            catch (Exception ex)
            {
                ds = EstatusOperacion.agregarEstatusOperacion(1, "Cierre de sesión con errores.");
            
            }
            ds.WriteXml(Response.OutputStream);
        }

        public void CambiarPassword(){
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "No se reconoce al usuario", "cve_usuario", Session["cve_usuario"] ,true,"string", 20}
                    , { "Password anterior", "anteriorpassword", Request["anteriorpassword"] ,true,"string", 20}
                    , { "Nuevo password", "nuevopassword", Request["nuevopassword"] , false ,"string", 20}
                }
                , "PA_SG_UCambiarPassword"
            );
            ds.WriteXml(Response.OutputStream);
        }

        public void EnviarPasswordEmail()
        {
            DataSet dsA = new DataSet();
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "E-mail", "email", Request["email"] ,true,"string",  80}
                }
                , "PA_SG_CEmailPassword"
            );
            string password = "";
            try {
                password = ds.Tables[0].Rows[0]["_password"].ToString();
            }catch(Exception ex){}
            if (password != "")
            {
                try
                {
                    new Email().Enviar(
                            "emmelopez@equipat.com.mx",
                            "Acceso al sistema",
                            Request["email"].ToString().Split(','),
                            new string[0],
                            new string[0],
                            "<h1 style='font-family:tahoma;font-weight:normal;font-size:13px;'>Datos de Acceso</h1><a>Human Soft</a>" +
                            "Password: <b>" + password + "</b>",
                            new Object[0][]
                   );
                    dsA = EstatusOperacion.agregarEstatusOperacion(1, "Correo enviado correctamente.");
                }
                catch (Exception ex) {
                    dsA = EstatusOperacion.agregarEstatusOperacion(-1, "No se tiene acceso al servidor de correo.");
                }
            }
            else {
                dsA = EstatusOperacion.agregarEstatusOperacion(-1, "No se encontró el e-mail en la base de datos.");
            }
            dsA.WriteXml(Response.OutputStream);
            
        }
    
    </script>