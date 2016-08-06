﻿<%@ Page Language="C#"%>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
     <title></title>
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js?ver=1.6"></script>
        <script src="js/controlacceso.js?ver=1.2"></script>
        <script src="js/permisos.js?ver=1.20" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" />
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js"></script>

        <style>
            body{font-size:11px;}
            input[type=radio],input[type=checkbox]{width:auto !important;height:auto !important;margin-top:17px;}
            .campo-par{display:block;clear:both;}
            .campo-par label{float:left;width:130px;padding:5px;}
            .campo-par b{float:left;width:230px;padding:5px;border:1px solid #E5E5E5;padding:4px;margin-top:4px;min-height:19px;}
            .campo-par input{width:110px;padding:0px;float:left;}
            .campo-par select{width:110px;padding:0px;float:left;}
            fieldset.datos-emp{float:left;clear:both;}
            fieldset.datos-emp span.campo-par{float:left;clear:none;}
            table#captura-horarios input{width:50px;border-width:0px;border-bottom-width:1px;background:transparent;}
            table#captura-horarios{margin:30px auto;clear:both;}
            table#captura-horarios th{padding:5px;}
            table#captura-horarios td{border-right:1px dashed #a9a9a9;padding-left:20px;padding-right:20px;}
            table#captura-horarios td label.tag-rubro{width:150px;}
            #uploadJustificantes ol li input{width:245px;clear:left;margin-right:5px;font-size:11px;}
            #uploadJustificantes ol li a{padding:5px;display:block;font-size:12px;}
            #barra-botones button{float:left !important;margin-left:30px;}
        </style>

    </head>
    <body class="fondo" onload="SolicitarIncidencia.Iniciar(<%=Request["num_empleado"] %>);">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->                    
                    <div class="formulario ventana">
                         <form id="frmNuevoPermiso" class="smart-green" onsubmit="return false;" enctype="multipart/form-data" method="post" target="consola">
                            <h2 class="encabezadoformulario" >Solicitar Permiso, Incapacidad o Retardo</h2>
                            <div  id="notificacion" class="alert-box error" style="visibility:hidden;"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="280">
                                    <fieldset class="datos-emp" style="clear:both;"><legend>Solicitud</legend>
                                        <span class="campo-par" style=""><label style="width:40px;margin-top:3px;">Folio</label><input id="cve_solicitudjusti" name="cve_solicitudjusti" style="width:60px;text-align:center;background:#b3dcee;font-weight:bolder;border:#3085aa;" onclick="return false;"  onkeypress="return false;" onkeyup="return false;" ></input></span>                                        
                                        <span class="campo-par" style=""><label style="margin-top:3px;width:73px;margin-left:40px;">Núm. Emp.</label><input id="txtNumEmp" name="num_empleado" onkeypress="return false;" onkeyup="return false;"  onclick="return false;"></input></span>
                                        <span class="campo-par" style=""><label style="margin-top:3px;width:60px;margin-left:17px;">Nombre</label><b id="lblNombreEmpleado" style="width:330px;"></b></span>
                                        <span class="campo-par" style=""><label style="width:95px;">Departamento</label><b id="lblDepartamento"></b></span>
                                        <span class="campo-par" style=""><label style="width:60px;margin-left:17px;">Puesto</label><b id="lblPuesto" style="width:330px;" ></b></span>
                                    </fieldset>
                                    <div class="columnaI" style="margin-top:10px;border-right-width:1px;border-right-style:dashed !important;">
                                        <span class="campo-par"><label style="width:50px;">Justifica</label>
                                            <select id="cve_tipojustificacion" name="cve_tipojustificacion" style="width:260px;margin-left:10px;margin-top:10px;" onchange="ObtenerMotivosAusentarse('cve_motivo', this.options[this.selectedIndex].value, undefined, ['escaneo']);"></select>
                                        </span>
                                        <span class="campo-par"><label style="width:50px;">Motivo</label>
                                            <select id="cve_motivo" name="cve_motivo" style="width:260px;margin-left:10px;margin-top:10px;" onchange="HabilitarBotonEscanear(this);"><option>Motivos de justificación</option></select>
                                        </span>
                                        <span class="campo-par"><label>Comentario:</label><textarea style="clear:both;display:block;height:80px;width:96%;margin:auto;margin-bottom:20px;" name="comentario" id="comentario"></textarea></span>                                                                                
                                    </div>
                                    <div class="columnaD" style="margin-top:10px;">
                                        <span class="campo-par"><label>Fecha Inicio</label><input  style="width:90px;" id="fechainicio"/><input id="horainicio" style="float:left;width:70px;text-align:center" maxlength="5" placeholder="Hora" /></span>
                                        <span class="campo-par"><label>Fecha Fin</label><input style="width:90px;" id="fechafin" /><input id="horafin" style="float:left;width:70px;text-align:center;" placeholder="Hora"  maxlength="5"/></span>
                                        <input type="hidden" name="fechainicio" id="hfechainicio" />
                                        <input type="hidden" name="fechafin" id="hfechafin" />
                                        <fieldset id="wrap-justificantes" style="clear:both;width:90%;"><legend>Justificantes</legend>
                                            <div id="uploadJustificantes" style="clear:both;min-height:40px;margin-bottom:10px;"></div>
                                        </fieldset>
                                    </div>
                                </div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones" id="barra-botones">
                                <span style="width:500px;">
                                    <button class="guardar btnFormularios" onclick="GuardarPermiso()">Guardar</button>                                                                       
                                    <button class="cancelar btnFormularios" onclick="window.top.CerrarTabDesdeFrame(window.location.href);" style="float:right !important;">Salir</button>
                                </span>
                            </div>
                         </form>
                        <iframe name="consola" id="consola" style="display:none;"></iframe>
                    </div>
                </div>
            </div>
        </div>
          <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
