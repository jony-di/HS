<%@ Page Language="C#"%>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
     <title></title>
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js?ver=1.0"></script>
        <script src="js/controlacceso.js?ver=1.5"></script>
        <script src="js/horarios.js?ver=1.6" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" />
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js"></script>

        <style>
            .campo-par{display:block;float:left;width:400px;clear:both;}
            #turnos .campo-par{width:auto;}
            .campo-par label{float:left;width:100px;padding:5px;}
            #turnos .campo-par label{width:200px;padding:0px;margin-top:0px;}
            .campo-par input{width:110px;padding:0px;float:left;}
            .campo-par input[type=checkbox],.campo-par input[type=radio]{width:auto;padding:0px;float:left;clear:left;height:auto;}
            table#captura-horarios input{width:50px;border-width:0px;border-bottom-width:1px;background:transparent;}
            table#captura-horarios{margin:30px auto;clear:both;}
            table#captura-horarios th{padding:5px;}
            table#captura-horarios td{border-right:1px dashed #a9a9a9;padding-left:20px;padding-right:20px;}
            table#captura-horarios td label.tag-rubro{width:150px;}
            body span.campo-par select{width:200px;}
            input.in-lbl-doble{width:250px;margin-top:20px;}
            body{font-size:11px;}
        </style>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->
                    
                    <div class="ventana">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario">Horarios</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos horarios" onkeyup="BuscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoHorario()">Agregar</button>                            
                            <div class="wrapper-tabla scrollable" offset="305">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th width="100" ><label>Clave</label> </th>
                                            <th width="500" ><label class="ordenar">Descripción</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista" class="filas-seleccionables"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>
                    
                    <div class="formulario ventana">
                         <form id="frmNuevoHorario" class="smart-green" onsubmit="return false;">
                            <h2 class="encabezadoformulario" >Editar Horario </h2>
                            <div  id="notificacion" class="alert-box error"><span id="mensaje-alerta">.</span></div>
                             <div style="clear:both;">
                                 <div class="scrollable" offset="320" style="width:60%;float:left;border-right:1px solid #a9a9a9;">
                                    <span class="campo-par"><label>Clave</label><input id="cve_horario" name="cve_horario" onclick="return false;"  readonly onkeypress="return false;"  onkeydown="return false;"/></span>                                
                                    <span class="campo-par"><label>Descripción</label><input style="width:250px;" id="nombre" name="nombre" placeholder="Ingrese nombre de horario"/></span>
                                    <span class="campo-par"><label>Tipo de horario</label><select name="cve_rotacion" id="cve_rotacion" onchange="CambiarTipoInputsLocal(this);"></select></span>
                                    <span class="campo-par"><label>Fecha Inicio</label><input style="width:250px;" id="fechaInicio" name="fechaInicio" placeholder="Fecha de inicio" readonly="readonly"/></span>
                                    <span class="campo-par"><label>Frecuencia</label><select name="cve_frecuenciarota" id="cve_frecuenciarota" style="float:left;clear:right;"></select></span>
                                    <span class="campo-par"><label>Tolerancia de entrada(Min.)</label><input class="in-lbl-doble" name="toleranciaEntrada" id="toleranciaEntrada" placeholder= "Tolerancia" onkeypress="return SoloNumeros(event);"/></span>
                                    <span class="campo-par"><label>Tolerancia de comida(Min.)</label><input class="in-lbl-doble" name="toleranciaComida" id="toleranciaComida" placeholder="Tolerancia" onkeypress="return SoloNumeros(event);"/></span>
                                  </div>
                                 <div style="width:35%;float:right;">
                                    <label>Turnos:</label>
                                    <input type="hidden" name="cve_turno" id="cve_turno"/>
                                    <div id="turnos" class="scrollable" offset="320" style="clear:left;padding-top:20px;" ></div>
                                 </div>
                            </div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones">
                                <span style="width:300px;">
                                    <button class="guardar btnFormularios" onclick="GuardarHorario()">Guardar</button>
                                    <button class="cancelar btnFormularios" onclick="DesplazarElemento('principal',0)">Salir</button>
                                </span>
                            </div>
                         </form>
                    </div>

                </div>
            </div>
        </div>
                  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
