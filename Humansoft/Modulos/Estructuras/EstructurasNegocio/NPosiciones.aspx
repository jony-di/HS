<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>

<script runat="server">
    

protected void Page_Load(object sender, EventArgs e)
        {
            Response.Clear();
            Response.ContentType = "text/xml";
            /*CON PROTECCIÓN A CONJUNTO DE POSICIÓNES*/
            switch (Request["op"])
            {
                case "NuevaPosicion": NuevaPosicion(); break;
                case "EditarPosicion": EditarPosiciones(); break;
                case "obtenerSiguienteClave": obtenerSiguienteClave(); break;
                case "ObtenerArbolPosiciones": ObtenerArbolPosiciones(); break;
                    
                case "LiberarPosicion": CambiarEstatusPosicion("VACANTE"); break;
                case "SuspenderPosicion": CambiarEstatusPosicion("SUSPENDIDA"); break;
                case "CancelarPosicion": CambiarEstatusPosicion("CANCELADA"); break;
                    
                case "REMOCION": MovimientoEmpleadoPosicion("REMOCION"); break;
                case "ASIGNACION": MovimientoEmpleadoPosicion("ASIGNACION"); break;
                case "DEMOSION": MovimientoEmpleadoPosicion("DEMOSION"); break;
                case "MOVIMIENTO_LATERAL": MovimientoEmpleadoPosicion("LATERAL"); break;
                case "PROMOCION": MovimientoEmpleadoPosicion("PROMOCION"); break;
                case "ENROQUE_POSICION": MovimientoEmpleadoPosicion("ENROQUE"); break;
            }
            /*CON PROTECCIÓN POR POSICIÓN*/
        }

        public void MovimientoEmpleadoPosicion(string movimiento)
        {
            bool esVACANTE = (movimiento == "REMOCION");
            bool esASIGNACION = (movimiento == "ASIGNACION");
            bool esDEMOSION = (movimiento == "DEMOSION");
            bool esPROMOCION = (movimiento == "PROMOCION");
            bool esENROQUE = (movimiento == "ENROQUE");
            bool esLATERAL = (movimiento == "LATERAL");
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                        { "Número de posición origen", "num_posicion_origen",Request["num_posicion_origen"],esVACANTE || esENROQUE, "int", 0 }
                    , { "Número de posición destino", "num_posicion_destino",Request["num_posicion_destino"], esDEMOSION ||esPROMOCION || esENROQUE || esLATERAL || esASIGNACION, "int", 0 }
                    , { "Id de Empleado", "idEmpleado_A",Request["idEmpleado_A"], true, "string", 30 }
                    , { "Fecha de aplicación", "fechaEfectiva",Request["fechaAplicacion"], true,"string", 20}           
                    , { "Observaciones", "observaciones",Request["observaciones"],true,"string", 2000}               
                    , { "Movimiento", "tipoMovimiento",movimiento,true,"string", 20}               
                }, "PA_ES_UMovimientoEmpleadoPosicion"
            );
            ds.WriteXml(Response.OutputStream);
        }

        public void CambiarEstatusPosicion(string estatusplan)
        {
            DataSet ds = new Modelo().GenerarOperacion(
                        new object[,] { 
                              { "Número de posición", "num_posicion",Request["num_posicion"], true, "int", 0 }
                            , { "Fecha de aplicación", "fechaEfectiva",Request["fechaAplicacion"],true,"string", 20}           
                            , { "Observaciones", "observaciones",Request["observaciones"],true,"string", 2000}              
                            , { "Estatus de posición", "estatusplan",estatusplan,true,"string", 40}              
                            }, "PA_SG_UCambiarEstatusPosicion"
            );
            ds.WriteXml(Response.OutputStream);
        }
            
        public void ObtenerArbolPosiciones()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                 new object[,] { 
                      { "Número de plantilla", "num_plantilla",Request["num_plantilla"], false, "int", 0 }
                    , { "Clave de PlantillaDep", "num_plantilladep", Request["num_plantilladep"],false,"int", 0}  
                    , { "Id de Empleado", "id_empleado",Request["id_empleado"],false,"int", 0}
                    , { "Area", "area",Request["area"],false,"int", 0}
                    , { "Division", "division",Request["division"],false,"int", 0}
                    , { "Plaza", "plaza", Request["plaza"],false,"int", 0}
                    , { "Puesto", "cve_puesto",Request["cve_puesto"],false,"int", 0}
                    , { "Lugar de trabajo", "cve_lugartrabajo", Request["lugarTrabajo"],false,"string",  30 }
                    , { "Familia Puesto", "Fampuesto",Request["Fampuesto"], false ,"int", 0}
                    , { "Departamento", "cve_departamento",Request["cve_departamento"], false ,"int", 0}
                    , { "C Costos", "c_costos",Request["c_costos"], false,"int",  0 }
                    , { "Vigencia", "Vigencia", Request["Vigencia"], false, "string", 20 }
                    , { "Estatus", "estatus", Request["estatus"],false,"int",  0 }
                    , { "S_Estatus", "s_estatus", Request["s_estatus"],false,"string",  30 }
                    , { "Tipo Plantilla", "tipoplantilla", Request["tipoplantilla"],false,"int",  0 }
                    , { "DGA_Agrup", "dga_agru", Request["dga_agru"],false,"string",  50 }
                    , { "Ubn", "ubn",Request["ubn"], false ,"string", 50} 
                    , { "Empresa", "cve_empresa",Request["cve_empresa"],false,"int",  0 }
                    , { "Nivel", "nivel",Request["nivel"],false,"int",  0 }
                    , { "Tabulador", "tabulador",Request["tabulador"],false,"int",  0 }
                    , { "Nivel Tabulador", "niveltabular",Request["niveltabular"],false,"int",  0 }
                    , { "PuntosHay", "puntoshay",Request["puntoshay"],false,"int",  0 }
                    , { "Segmento", "segmento",Request["segmento"],false,"int",  0 }
                    , { "Headcount", "headcount",Request["headcount"], false ,"int", 0}
                    , { "Headcountocup", "headcountocup",Request["headcountocup"], false ,"int", 0}
                    , { "ZonaCara", "zonacara",Request["zonacara"], false ,"int", 0}
                    , { "Telefono", "telefono",Request["telefono"], false ,"string", 50}
                    , { "Ext", "ext",Request["ext"], false ,"string", 50}  
                    , { "q", "q",Request["q"],false,"int",  0 }
                    , { "Actfuncional", "actfuncional",Request["actfuncional"], false ,"string", 50}    
                    , { "Consecutiv", "consecutiv",Request["consecutiv"], false ,"int", 0}
                    , { "Grupo Pago", "cve_grupopago",Request["cve_grupopago"], false,"int",  0 }  
                    , { "Sindicalizado", "Sindicalizado",Request["Sindicalizado"], false ,"int", 0}
                    , { "Ejecutivo", "Ejecutivo",Request["Ejecutivo"], false ,"int", 0}
                    , { "Direcplantilla", "direcplantilla",Request["direcplantilla"], false ,"int", 0}
                    }, "PA_ES_CArbolPosiciones"
            );
            ds.WriteXml(Response.OutputStream);
        }
    
        public void obtenerSiguienteClave()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[0, 0], "PA_SG_CObtenerSiguienteClavePosicion"
            );
            ds.WriteXml(Response.OutputStream);
        }

        public void NuevaPosicion()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Plantilla", "num_plantilla", Request["num_plantilla"],true,"int", 0}
                    , { "Clave de PlantillaDep", "num_plantilladep", Request["num_plantilladep"],true,"int", 0}  
                    , { "Id de Empleado", "id_empleado",Request["id_empleado"],false,"int", 0}
                    , { "Es contratación inmediata?", "contratacionInmediata",(Request["contratacionInmediata"]==null? 0: 1),false,"bool", 0}
                    , { "Area", "area",Request["area"],false,"int", 0}
                    , { "Division", "division",Request["division"],false,"int", 0}
                    , { "Plaza", "plaza", Request["plaza"],false,"int", 0}
                    , { "Puesto", "cve_puesto",Request["cve_puesto"],true,"int", 0}
                    , { "Lugar de trabajo", "cve_lugartrabajo", Request["lugarTrabajo"].ToString().Length==0?"0":Request["lugarTrabajo"],false,"string",  30 }
                    , { "Familia Puesto", "Fampuesto",Request["Fampuesto"].ToString().Length==0?"0":Request["Fampuesto"], false ,"int", 0}
                    , { "DGA", "dga_agrup",Request["dga_agru"], true ,"int", 0}
                    , { "Departamento", "cve_departamento",Request["cve_departamento"], true ,"int", 0}
                    , { "C Costos", "c_costos",Request["c_costos"],false,"int",  0 }
                    , { "Política de vacaciones", "cve_politica",Request["cve_politica"].ToString().Length==0?"0":Request["cve_politica"].ToString(), false,"int",  0 }
                    , { "Nivel política", "nivel_politica",Request["nivel_politica"].ToString().Length==0?"0":Request["nivel_politica"], false,"int",  0 }
                    , { "Clave de Horario", "cve_horario",Request["cve_horario"].ToString().Length==0?"0":Request["cve_horario"], false,"int",  0 }
                    , { "Vigencia", "Vigencia", Request["Vigencia"], false, "string", 20 }
                    , { "Estatus", "estatus", Request["estatus"],false,"int",  0 }
                    , { "Tipo Plantilla", "tipoplantilla", Request["tipoplantilla"],false,"int",  0 }
                    , { "Ubn", "ubn",Request["ubn"], false ,"string", 50}
                    , { "Empresa", "cve_empresa",Request["cve_empresa"],false,"int",  0 }
                    , { "Nivel", "nivel",Request["nivel"],false,"int",  0 }
                    , { "Tabulador", "tabulador",Request["tabulador"],false,"int",  0 }
                    , { "Nivel Tabulador", "niveltabular",Request["niveltabular"],false,"int",  0 }
                    , { "PuntosHay", "puntoshay",Request["puntoshay"],false,"int",  0 }
                    , { "Segmento", "segmento",Request["segmento"],false,"int",  0 }
                    , { "Headcount", "headcount",Request["headcount"], false ,"int", 0}
                    , { "Headcountocup", "headcountocup",Request["headcountocup"], false ,"int", 0}
                    , { "ZonaCara", "zonacara",Request["zonacara"], false ,"int", 0}
                    , { "Telefono", "telefono",Request["telefono"], false ,"string", 50}
                    , { "Ext", "ext",Request["ext"], false ,"string", 50}
                    , { "q", "q",Request["q"],false,"int",  0 }
                    , { "Actfuncional", "actfuncional",Request["actfuncional"], false ,"string", 50}
                    , { "Grupo Pago", "cve_grupopago",Request["cve_grupopago"], false,"int",  0 }  
                    , { "Direcplantilla", "direcplantilla",Request["direcplantilla"], false ,"int", 0}
                    , { "Clave de usuario", "cve_usuario", Session["cve_usuario"],true,"int", 0}
                    , { "Url solicitud", "url", Request.Url,true,"string", 500}
                }
                ,"PA_SG_INuevaPosicion"                
            );            
            ds.WriteXml(Response.OutputStream);
        }


        public void CambiarEstatusActivo()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                new object[,] { 
                      { "Clave de Empleado", "id_empleado", Request["id_empleado"],true,"int", 0}
                    , { "Estatus", "esActivar",Request["activo"], true ,"bool", 0}
                }
                , "PA_SG_UActivaPosicion"                
            );            
            ds.WriteXml(Response.OutputStream);
        }


        public void EditarPosiciones()
        {
            DataSet ds = new Modelo().GenerarOperacion(
                     new object[,] { 
                      { "Clave de Plantilla", "num_plantilla", Request["num_plantilla"],true,"int", 0}
                    , { "Clave de PlantillaDep", "num_plantilladep", Request["num_plantilladep"],true,"int", 0}  
                    , { "Id de Empleado", "id_empleado",Request["id_empleado"],false,"int", 0}
                    , { "Es contratación inmediata?", "contratacionInmediata",(Request["contratacionInmediata"]==null? 0: 1),false,"bool", 0}
                    , { "Area", "area",Request["area"],false,"int", 0}
                    , { "Division", "division",Request["division"],false,"int", 0}
                    , { "Plaza", "plaza", Request["plaza"],false,"int", 0}
                    , { "Puesto", "cve_puesto",Request["cve_puesto"],true,"int", 0}
                    , { "Lugar de trabajo", "cve_lugartrabajo", Request["lugarTrabajo"].ToString().Length==0?"0":Request["lugarTrabajo"],false,"string",  30 }
                    , { "Familia Puesto", "Fampuesto",Request["Fampuesto"], false ,"int", 0}
                    , { "DGA", "dga_agrup",Request["dga_agru"], false ,"int", 0}
                    , { "Departamento", "cve_departamento",Request["cve_departamento"], false ,"int", 0}
                    , { "C Costos", "c_costos",Request["c_costos"], false,"int",  0 }                    
                    , { "Política de vacaciones", "cve_politica",Request["cve_politica"]==null?"0":Request["cve_politica"].ToString(), false,"int",  0 }
                    , { "Nivel política", "nivel_politica",Request["nivel_politica"]==null?"0":Request["nivel_politica"], false,"int",  0 }
                    , { "Clave de Horario", "cve_horario",Request["cve_horario"]==null?"0":Request["cve_horario"], false,"int",  0 }
                    , { "Vigencia", "Vigencia", Request["Vigencia"], false, "string", 20 }
                    , { "Estatus", "estatus", Request["estatus"],false,"int",  0 }
                    , { "Tipo Plantilla", "tipoplantilla", Request["tipoplantilla"],false,"int",  0 }
                    , { "Ubn", "ubn",Request["ubn"], false ,"string", 50} 
                    , { "Empresa", "cve_empresa",Request["cve_empresa"],false,"int",  0 }
                    , { "Nivel", "nivel",Request["nivel"],false,"int",  0 } 
                    , { "Tabulador", "tabulador",Request["tabulador"],false,"int",  0 }
                    , { "Nivel Tabulador", "niveltabular",Request["niveltabular"],false,"int",  0 }
                    , { "PuntosHay", "puntoshay",Request["puntoshay"],false,"int",  0 }
                    , { "Segmento", "segmento",Request["segmento"],false,"int",  0 }
                    , { "Headcount", "headcount",Request["headcount"], false ,"int", 0}
                    , { "Headcountocup", "headcountocup",Request["headcountocup"], false ,"int", 0}
                    , { "ZonaCara", "zonacara",Request["zonacara"], false ,"int", 0}
                    , { "Telefono", "telefono",Request["telefono"], false ,"string", 50}
                    , { "Ext", "ext",Request["ext"], false ,"string", 50} 
                    , { "q", "q",Request["q"],false,"int",  0 }
                    , { "Actfuncional", "actfuncional",Request["actfuncional"], false ,"string", 50}
                    , { "Grupo Pago", "cve_grupopago",Request["cve_grupopago"], false,"int",  0 }  
                    , { "Direcplantilla", "direcplantilla",Request["direcplantilla"], false ,"int", 0}
                    , { "Clave de usuario", "cve_usuario", Session["cve_usuario"],true,"int", 0}
                    , { "Url solicitud", "url", Request.Url,true,"string", 500}
                }
                , "PA_SG_UActualizarPosicion"
            );
            ds.WriteXml(Response.OutputStream);
        }


    
    
    </script>