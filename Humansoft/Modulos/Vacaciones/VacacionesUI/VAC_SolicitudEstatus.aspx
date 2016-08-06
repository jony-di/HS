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
    <script src="js/solicitud.js?ver=2.4" type="text/javascript"></script>
    <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
    <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
    <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <style>
        body,html{overflow:hidden;}
        .btnVerDetalle{float:left;background:transparent;border:1px solid;}
        body fieldset table.lista{width:300px;margin:auto;}
        body fieldset{padding-bottom:20px;}
        body fieldset table.lista th{color:#fff !important;}
        #diasDerechoVac{position:absolute;margin-left:410px;margin-top:85px;}
        #diasDerecho{display:none !important;}
    </style>
    
</head>

<body oncontextmenu="return false;" onload="EstatusSolicitud.iniciar();">
    <input id="no_solicitud" value="<%=Request["num_solicitud"]%>" type="hidden"/>
    <input id="numeroEmpleado" value="<%int a=0; %><%=(Request["num_empleado"]!=null&& int.TryParse(Request["num_empleado"], out a)?Request["num_empleado"]:(Session["num_empleado"]??0))%>" type="hidden"/>
    <div id="inicio" >
        <!--<span style="width:860px;display:block;margin:auto;padding:20px;"><input id="idEmpleado"/> <button onclick="ObtenerEncabezadoEmpledo(document.getElementById('idEmpleado').value);">Ir</button></span>-->
        <div class="mascara">
            <div class="principal" id="principal">
                <div class="ventana">
                    <div class="smart-green" id="formularioSolicitud" style="float:left;">
                        <h2 class="encabezadoformulario">                                                                                                                                        
                            Solicitud de vacaciones
                            <%if(!(Request["esNotificacion"]!=null)){%>                        
                            <button class="btnFormularios regresar" id="btnRegresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "0"%>);">Regresar</button>                                                             
                            <%} %>
                        </h2>                        
                        <div  id="notificacion-estatus" class="alert-box error ocultarV"><span id="mensaje-alerta"></span></div>                               
                        <div class="wrap scrollable" offset="310" id="ventana-solicitud">
                            <fieldset class="info" style="position:relative;"><legend>Datos del empleado</legend>                                   
                                <div class="columnaI">
                                    <label>Número de Solicitud:</label> 
                                    <span id="lblNoSolicitud"></span>  
                                </div> 
                                <div class="columnaD">
                                    <label>Estatus de Solicitud:</label> 
                                    <span id="estatusSolicitud"></span>  
                                </div> 
                                <comun:encabezado runat="server"  />                             
                                    
                                <div class="columnaI">                                         
                                    <label>Dias solicitados:</label> 
                                    <span id="diasSolicitados"></span>                                                                                                      
                                </div>  
                                <div class="columnaD">
                                    <label title="El archivo debe ser .jpg, o .png y el tamaño menor que 800KB.">Escaneo de solicitud:</label> 
                                    <form id=frmEscaneo onsubmit="return false;"  style="display:none;" >
                                        <div style="position:relative;clear: left;margin-top: -5px;margin-bottom: 3px;" id="escaneo" >
                                            <input name="solicitud" type="file" style="margin-top:-10px;position:absolute;left:0px;top:0px;opacity:0;cursor:pointer;" title="El archivo debe ser .jpg, o .png y el tamaño menor que 800KB."/>
                                            <button onclick="EstatusSolicitud.CargarPostEscaneo();" style="border:0px;background:transparent;" class="link-hs">» Subir escaneo</button>                                           
                                        </div>
                                    </form>
                                    <span style="display:none;"><a id="linkEscaneo" target="_blank" >Ver escaneo</a></span>
                                </div>                              
                                <hr style="border:0px;"/>
                                <h3>Detalle de dias Solicitados</h3>
                                <div class="wrap-lista">
                                    <table class="lista" id="tableCatalogo">
                                        <thead>
                                            <tr class="columnas">
                                                <th width="70">Periodo</th>
                                                <th width="200">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody id="contenedorLista" class="filas-seleccionables"></tbody>
                                    </table>
                                    <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50' ></div>
                                </div>
                            </fieldset>                                                      
                        </div>     
                        <!-- Autorizar Jefe-->           
                        <div class="barra-botones" style="margin-top: 30px;display:none;"  id="Jefe">
                            <span style="width:500px;">
                                <button class="guardar btnFormularios" onclick="EstatusSolicitud.Cancelar()" >Cancelar</button>
                                <button class="guardar btnFormularios" onclick="EstatusSolicitud.AutorizarJefe()" style="float:left;margin-left:150px;">Autorizar</button>
                                <button class="guardar btnFormularios" onclick="<%=(!(Request["esNotificacion"]!=null)?"window.parent.DesplazarElemento('principal'," +  (Request["offset"]??"0") + ")" : "window.top.CambiarRutaFrame(window.location.href,'/Modulos/Vacaciones/VacacionesUI/VAC_ListadoSolicitudes.aspx');")%>;" style="float:right;">Salir</button>
                            </span>                            
                        </div>
                        <!-- Vo Bo RH-->
                        <div class="barra-botones" style="margin-top: 30px;display:none;" id="VoBoRH">
                            <span style="width:500px;">
                                <button class="guardar btnFormularios" onclick="EstatusSolicitud.Cancelar()" >Cancelar</button>
                                <button class="cancelar btnFormularios" onclick="EstatusSolicitud.VoBoRH()" style="float:left;margin-left:150px;">VoBo OK</button>
                                <button class="guardar btnFormularios" onclick="<%=(!(Request["esNotificacion"]!=null)?"window.parent.DesplazarElemento('principal'," +  (Request["offset"]??"0") + ")" : "window.top.CambiarRutaFrame(window.location.href,'/Modulos/Vacaciones/VacacionesUI/VAC_ListadoSolicitudes.aspx');")%>" style="float:right;">Salir</button>
                            </span>                            
                        </div>
                        <!-- Usuario -->
                        <div class="barra-botones" style="margin-top: 30px;display:none;" id="Usuario">
                            <span style="width:300px;">
                                <button class="cancelar btnFormularios" onclick="EstatusSolicitud.Cancelar()">Cancelar</button>
                                <button class="guardar btnFormularios" onclick="<%=(!(Request["esNotificacion"]!=null)?"window.parent.DesplazarElemento('principal'," +  (Request["offset"]??"0") + ")" : "window.top.CambiarRutaFrame(window.location.href,'/Modulos/Vacaciones/VacacionesUI/VAC_ListadoSolicitudes.aspx');")%>" >Salir</button>
                            </span>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%}else {%>
        <item:comun runat="server" /></item:comun>
<%}%>   
    <iframe id="consola" name="consola" style="display:none;"></iframe>  
</body>
</html>
