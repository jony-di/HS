<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
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
    <script src="js/solicitud.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
    <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
    <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <script src="../../../Recursos/js/jquery.tablesorter.js"></script>

    <style> 
        body,html{overflow:hidden;}       
        .btnVerDetalle{float:left;background:transparent;border:1px solid;}
        body fieldset table.lista{width:300px;margin:auto;}
        body fieldset{padding-bottom:20px;}
        body fieldset table.lista th{color:#fff !important;}
        .seperador-v{display:none !important;}
        #num_solicitud_w{display:none !important;}
        #diasDerechoVac{float:right;}
    </style>
    
</head>

<body oncontextmenu="return false;" onload="SolicitudesUsuario.iniciar();">
    <input id="numeroEmpleado" value="<%=(Request["num_empleado"]!=null && (Request["num_empleado"].Trim().Length >0)?Request["num_empleado"].Trim() :(Session["num_empleado"]??""))%>" type="hidden"/>
    <div id="inicio" >
        <!--<span style="width:860px;display:block;margin:auto;padding:20px;"><input id="idEmpleado"/> <button onclick="ObtenerEncabezadoEmpledo(document.getElementById('idEmpleado').value);">Ir</button></span>-->
        <div class="mascara">
            <div class="principal" id="principal">
                <div class="ventana">
                    <div class="smart-green" id="formularioSolicitud" style="float:left;">
                        <h2 class="encabezadoformulario">                                                                                                                                        
                            Historial de vacaciones                                                      
                        </h2>                        
                        <div  id="notificacion-escaneo" class="alert-box error ocultarV"><span id="mensaje-alerta"></span></div>                               
                        <div class="wrap scrollable" offset="240" >
                            <fieldset class="info"><legend>Datos del empleado</legend>  
                                <comun:encabezado runat="server"  />                                 
                            </fieldset>
                            <fieldset >
                                <table class="listaN" id="listaMisVacaciones" style="width:auto;">
                                    <thead>
                                        <tr class="columnas">
                                            <th width="70" style="min-width:95px;"><label class="ordenar">No.</label> </th>
                                            <th width="70" style="min-width:70px;"><label class="ordenar"> Periodo</label> </th>
                                            <th width="70" style="min-width:160px;"><label class="ordenar">Fecha</label> </th>
                                            <th width="70"  style="min-width:130px;"><label class="ordenar" title="Días solicitados"> Dias tomados</label> </th>
                                            <th width="115" ><label class="ordenar"> Estatus</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorSolicitudesUsuario" class="filas-seleccionables"></tbody>
                                </table>
                                <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50' ></div>
                            </fieldset>                        
                        </div> 
                        <hr  style="margin-bottom:30px;border:0px;"/>                                                               
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%}else {%>
        <item:comun ID="Comun1" runat="server" /></item:comun>
<%}%>   
    <iframe id="consola" name="consola" style="display:none;"></iframe>  
</body>
</html>
