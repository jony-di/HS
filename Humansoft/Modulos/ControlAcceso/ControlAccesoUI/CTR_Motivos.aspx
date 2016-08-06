<%@ Page Language="C#"%><%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>

<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
     <title></title>
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js?ver=1.2"></script>
        <script src="js/controlacceso.js?ver=1.0"></script>
        <script src="js/motivos.js?ver=1.5" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

        <style>
            input[type=radio],input[type=checkbox]{width:auto !important;height:auto !important;margin-top:17px;}
            .campo-par{display:block;float:left;clear:both;}
            .campo-par label{float:left;width:130px;padding:5px;}
            .campo-par input{width:110px;padding:0px;float:left;}
            .campo-par select{width:110px;padding:0px;float:left;}
            table#captura-horarios input{width:50px;border-width:0px;border-bottom-width:1px;background:transparent;}
            table#captura-horarios{margin:30px auto;clear:both;}
            table#captura-horarios th{padding:5px;}
            table#captura-horarios td{border-right:1px dashed #a9a9a9;padding-left:20px;padding-right:20px;}
            table#captura-horarios td label.tag-rubro{width:150px;}
        </style>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->
                    
                    <div class="ventana">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Motivos de justificación</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los motivos" onkeyup="BuscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoMotivo()">Agregar</button>
                            <div class="wrapper-tabla scrollable" offset="305">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th width="100" ><label> Clave</label></th>
                                            <th width="300" ><label class="ordenar">Justificación</label></th>
                                            <th width="300" ><label class="ordenar">Motivo</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista" class="filas-seleccionables"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>
                    
                    <div class="formulario ventana">
                         <form id="frmNuevoMotivo" class="smart-green" onsubmit="return false;">
                            <h2 class="encabezadoformulario" >Editar motivo </h2>
                            <div  id="notificacion" class="alert-box error"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="285">
                                    <div class="columnaI">
                                        <span class="campo-par"><label>Justificación</label><select style="width:250px;" id="cve_tipojustificacion" name="cve_tipojustificacion"></select></span>
                                        <span class="campo-par"><label>Clave</label><input id="cve_motivo" name="cve_motivo" onclick="return false;"  readonly onkeypress="return false;"  onkeydown="return false;"/></span>                                        
                                        <span class="campo-par"><label>Motivo</label><input style="width:250px;" id="descripcion" name="descripcion" placeholder="Ingrese motivo"/></span>
                                        <span class="campo-par"><label>Activo</label><input type="checkbox" name="activo" id="activo" value="true"/></span>
                                        <span class="campo-par"><label>Tolerancia</label><input style="width:100px;" id="tolerancia" placeholder="Tolerancia" name="tolerancia"/><select id="cve_dadotolerancia" name="cve_dadotolerancia" style="width:120px;margin-left:10px;"></select></span>
                                        <span class="campo-par"><label>Permite justificación</label><input type="checkbox" name="permitejustifica" id="permitejustifica" value="true"/></span>
                                    </div>
                                    <div class="columnaD">
                                        <span class="campo-par"><label>Escaneo</label><input type="checkbox" name="escaneo" id="escaneo"  value="true"/></span>
                                        <span class="campo-par"><label>Con goce de salario</label><input type="checkbox" id="congose" name="congose"  value="true"/></span>
                                        <span class="campo-par">
                                            <label style="margin-bottom:5px;">Flujo de incidencia</label>
                                            <select style="width:200px;margin-top:0px;" id="cve_flujo" name="cve_flujo"></select>
                                        </span>
                                        <span class="campo-par"><label style="width:100px;">Plazo</label><input style="width:100px !important;" id="plazo" placeholder="Plazo" name="plazo"/><select id="cve_dadoplazo" name="cve_dadoplazo" style="width:120px;margin-left:10px;"></select></span>
                                        <span class="campo-par"><label>Aplíca para política</label><input type="checkbox" name="aplicaparapolitica" id="aplicaparapolitica" value="true"/></span>
                                        <span class="campo-par"><label>Permite reponer día</label><input type="checkbox" name="permitereponerdia" id="permitereponerdia" value="true"/></span>
                                    </div>
                                </div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones" id="barra-botones">
                                <span style="width:300px;">
                                    <button class="guardar btnFormularios" onclick="GuardarMotivo()">Guardar</button>
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
