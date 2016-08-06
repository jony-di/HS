<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Import Namespace="System.Data" %>
<%@ Register TagPrefix="comun" TagName="encabezado" Src="EncabezadoVacaciones.ascx" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){        
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title></title>
    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="js/vacaciones.js" type="text/javascript"></script>
    <script src="js/solicitud.js?ver=1.0" type="text/javascript"></script>
    <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
    <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
    <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <style type="text/css">  
        body,html{overflow:hidden;}      
        .btnVerDetalle{float:left;background:transparent;border:1px solid;}
        .wrap{height:700px;}
        body .barra-botones{margin: -20px -30px;}
        body .ui-datepicker td.diaSel a{border: 1px solid #FCD113;color:#915608;background: #fff url("/Recursos/imagenes/palomita.png") no-repeat center center;}
        body .ui-datepicker td.vacaciones-util span{border: 1px solid #FCD113;color:#915608;background: #7BB87B url("/Recursos/imagenes/palomita.png") no-repeat center center;}
        body .ui-datepicker td.feriado span{border: 1px solid #FCD113;color:#915608;background: #B87BB8;}
        body .ui-datepicker-today{}
        body fieldset span.dias-seleccionados{display:block;width:50px;height:50px;font-size:50px;color:#7892C2;clear:left;float:none;margin:auto;}
        .bordeado{border:1px solid #e9e9e9;padding:10px;text-align:center;margin:auto;clear:both;float:none;}
        body fieldset label.l-unica{display:block;text-align:center;float:none;}
         fieldset.aux-1{padding:30px;margin-bottom:30px;}
    </style>

    <script>
        var fechaInicial="<%= DateTime.Now.AddMonths(-1).ToString("dd-MM-yyyy") %>";
        var fechaFinal="<%= DateTime.Now.AddMonths(6).ToString("dd-MM-yyyy") %>";
    </script>
    
</head>

<body oncontextmenu="return false;" onload="iniciar('<%=Request["num_empleado"]%>');">
    <div id="inicio" >
        <!--<span style="width:860px;display:block;margin:auto;padding:20px;"><input id="num_empleado"/> <button onclick="ObtenerEncabezadoEmpledo(document.getElementById('num_empleado').value);">Ir</button></span>-->
        <div class="mascara">
            <%
                int estatusSolicitud = 0; DataSet ds = new DataSet(); 
                try{
                    ds=new Modelo("/VacacionesModelo/dboVacaciones.xml").GenerarOperacionCX("ObtenerEstatusUltimaSolicitud", "Comunes", ((Request["num_empleado"] == null || Request["num_empleado"].ToString().Trim().Length == 0) ? new object[,] { { "Id de empleado", "num_empleado", Session["num_empleado"], true, "string", 20 } } : null));
                    int.TryParse(ds.Tables[0].Rows[0]["cve_estatus"].ToString(), out estatusSolicitud);                    
                }catch(Exception e){}
            %>
            <div class="principal" id="principal" style="position:relative;left:-<%=(estatusSolicitud==1?900:(estatusSolicitud==2?1800 : 0)) %>px;">
                <div  id="formularioSolicitud" style="height:830px;"  class="ventana">
                   <div class="smart-green">
                        <h2 class="encabezadoformulario">                                                                                                                                    
                            Solicitud de vacaciones
                            <%if (Request["num_empleado"] != null){%>                                
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>                                                                   
                            <%}%>                                                      
                        </h2>                        
                        <div  id="notificacion" class="alert-box error ocultarV"><span id="mensaje-alerta"></span></div> 
                        <form id="" onsubmit="return false">      
                            <div class="wrap scrollable" offset="260">
                                <fieldset class="info"><legend>Datos del empleado</legend>
                                    <comun:encabezado runat="server"/>  
                                    <div class="columnaD">                                         
                                        <label class="l-unica">Dias solicitados</label> 
                                        <span class="dias-seleccionados bordeado" id="diasSeleccionadas">--</span>                                                                                                      
                                    </div>                                
                                    <hr />
                                </fieldset>
                                <fieldset style="padding:10px;">
                                    <legend>Seleccionar fechas</legend>                                
                                    <div id="seleccionarDias" style="text-align:center;"></div>
                                </fieldset>                                                       
                            </div>                       
                            <div class="barra-botones">
                                <span style="width:200px;">
                                    <button class="guardar btnFormularios" onclick="SolicitarVacaciones()">Crear Solicitud</button>
                                    <%if (Request["num_empleado"]!=null) {%>
                                    <button class="cancelar btnFormularios" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);" style="float: right;">Salir</button>
                                    <%} %>
                                </span>                            
                            </div>
                        </form>                       
                    </div>
                </div>

                <div  style="height:500px;" class="ventana">
                    <div class="smart-green" onsubmit="return false;">
                        <h2 class="encabezadoformulario">                                                                                                                                    
                            Imprimir solicitud 
                        </h2>   
                        <div  id="notificacion-escaneo-2" class="alert-box error ocultarV"><span></span></div> 
                        <div class="scrollable" offset="310">
                            <p class="resaltado">Para continuar, imprima el archivo generado y solicite las firmas de autorización.</p>
                            <fieldset class="aux-1"><legend>Archivo Generado</legend>
                                <%if(estatusSolicitud==1||estatusSolicitud==2){%>
                                <a id="link-pdf-solicitud-vacaciones" target="_blank" href="<%="../VacacionesNegocio/NVacaciones.aspx?op=RegistrarImpresionSolicitud&Seccion=ProcesoVacaciones&num_empleado=" + ds.Tables[0].Rows[0]["num_empleado"]  + "&num_solicitud=" + ds.Tables[0].Rows[0]["num_solicitud"] + "&urlSolicitud=/Expedientes/Empleados/solicitud_vacaciones_" + ds.Tables[0].Rows[0]["num_solicitud"] + "_" + ds.Tables[0].Rows[0]["fechaprog"] + ".pdf"%>" >
                                    <%="/solicitud_vacaciones_" + ds.Tables[0].Rows[0]["num_solicitud"] + "_" + ds.Tables[0].Rows[0]["fechaprog"] + ".pdf" %>
                                </a>
                                <%}else{ %>
                                <a id="link-pdf-solicitud-vacaciones" target="_blank"></a>    
                                <%}%>
                            </fieldset>
                        </div>
                        <div class="barra-botones" style="margin-top: 0px;" >
                            <span style="width:300px;">
                                <button class="guardar btnFormularios" onclick="DesplazarElemento('principal',-1800)">Continuar con escaneo</button>
                                <%if (Request["num_empleado"]!=null) {%>
                                <button class="cancelar btnFormularios"  onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);" style="float:right;">Salir</button>
                                <%} %>
                            </span>                            
                        </div>
                    </div>
                </div>

                <div  style="height:500px;" class="ventana">
                    <form  id="formularioImprimirEscanear" class="smart-green" onsubmit="return false;">
                        <h2 class="encabezadoformulario">                                                                                                                                    
                            Escanear solicitud.
                            <button class="btnFormularios regresar" onclick="DesplazarElemento('principal',-900);">Regresar</button>                                                                   
                        </h2>   
                        <div  id="notificacion-escaneo" class="alert-box error ocultarV"><span></span></div> 
                        <div class="scrollable" offset="310">
                            <p class="resaltado">Seleccione la solicitud que escaneó y respaldelo en el sistema.</p>
                            <fieldset class="aux-1"><legend>Ingrese el archivo escaneado</legend>
                                <%if(estatusSolicitud==1||estatusSolicitud==2){%>
                                <input type="hidden" name="num_solicitud" id="num_solicitud-esc" value="<%=ds.Tables[0].Rows[0]["num_solicitud"] %>" />
                                <input type="hidden" name="num_empleado" id="num_empleado-esc"  value="<%=ds.Tables[0].Rows[0]["num_empleado"] %>"/>
                                <%}else{ %>
                                <input type="hidden" name="num_solicitud" id="num_solicitud-esc" />
                                <input type="hidden" name="num_empleado" id="num_empleado-esc"/>
                                <%}%>
                                <input type="file" name="solicitud" />
                            </fieldset>
                        </div>
                        <div class="barra-botones" style="margin-top: 0px;">
                            <span style="width:320px;">
                                <button class="guardar btnFormularios"  onclick="CargarEscaneo()">Enviar para aprobación</button>
                                <%if (Request["num_empleado"]!=null) {%>
                                <button class="cancelar btnFormularios"  onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);" style="float:right;">Salir</button>
                                <%} %>
                            </span>
                        </div>
                    </form>
                </div>

                <div  style="height:500px;" class="ventana">
                    <div  class="smart-green">
                        <h2 class="encabezadoformulario">
                            Fin de proeso
                        </h2>
                        <div  class="scrollable" offset="260" >                        
                            <div  class="alert-box success" style="margin-top:80px;">
                                <span>
                                    La solicitud se ha procesado correctamente.
                                </span>
                            </div>
                        </div>
                        <div class="barra-botones" style="margin-top: 0px;" >
                            <span style="width:100px;">
                                <%if (Request["num_empleado"]!=null){%>
                                <button class="cancelar btnFormularios" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);" style="float:right;">Salir</button>
                                <%} %>
                            </span>                            
                        </div>                         
                    </div>
                </div>                   
                <iframe id="consola" name="consola" style="display:none;"></iframe>  
            </div>
        </div>
    </div>
    <%}else {%>
        <item:comun ID="Comun1" runat="server" /></item:comun>
<%}%>   
</body>
</html>
