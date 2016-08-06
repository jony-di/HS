<%@ Page Language="C#"%>
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
        <script src="../../../Recursos/js/generico.js?ver=1.7"></script>
        <script src="js/controlacceso.js?ver=1.2"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" />
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js?ver=1.1"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" />
        <link href="css/control-acceso.css?ver=1.1" rel="stylesheet" />
        <style>
            body{font-size:11px;}
            input,label{clear:both;float:left;}
            input{margin-left:50px;}
            input#fecha{margin-bottom:20px;}
            .periodo{clear:both;height:60px;padding:20px;width:90%;margin-bottom:10px;}
            fieldset.periodo label,fieldset.periodo input{float:left;margin-left:20px;clear:none !important;width:100px;}
            fieldset.periodo label{text-align:right;}
            .loading{width:220px;height:40px;}
        </style>
    </head>
    <body class="fondo" onload="IntegracionEventosCTR.IniciarProcesar();">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->
                    <div class="ventana">
                        <form id="frmNuevoPolitica" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="encabezadoformulario" >
                                    Procesar descuentos del período                                    
                                </h2>
                                <div class="auxiliar scrollable" offset="220">
                                    <label class="indice">Núm. Proceso</label>
                                    <input id="num_proceso" name="num_proceso" />
                                    <label class="descripcion">Fecha de proceso</label>
                                    <input id="fecha" name="fecha" maxlength="5" style="width:140px;"/>
                                    <fieldset class="periodo" id="periodos"> <legend>Período a procesar</legend>
                                        <!--<select style="width:120px;display:block;margin:auto;float:none;margin-top:-20px;border:1px solid #9FB4F2;border-bottom:0px;"><option>2015</option></select>-->
                                        <label>Desde </label><input id="fechaInicio" name="fechaInicio" disabled="true" /><label>Hasta</label><input id="fechaFin" name="fechaFin" disabled="true" />
                                    </fieldset>
                                    <div  style="text-align:center;background:#fff;width:400px;margin:auto;padding:10px;border:1px dashed #dbdbdb;">
                                        <img id="procesando" class="loading" src="/Recursos/imagenes/loading.gif" style="display:none;"/><br />
                                        <label style="float:none;" id="lblProcesando"></label>
                                    </div>
                                </div>
                                <div class="barra-botones">
                                        <button class="guardar btnFormularios" onclick="ProcesarPeriodo()">Procesar</button>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
        </div>
          <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
