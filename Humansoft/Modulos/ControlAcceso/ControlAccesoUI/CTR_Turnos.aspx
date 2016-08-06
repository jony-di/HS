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
        <script src="js/controlacceso.js"></script>
        <script src="js/turnos.js?ver=1.3" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

        <style>
            .campo-par{display:block;float:left;width:400px;clear:both;}
            .campo-par label{float:left;width:100px;padding:5px;}
            .campo-par input{width:110px;padding:0px;float:left;}
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
                            <h2 class="encabezadoformulario" >Turnos de trabajo</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos horarios" onkeyup="BuscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoTurno()">Agregar</button>                            
                            <div class="wrapper-tabla scrollable" offset="305">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th width="100" ><label> Clave</label> </th>
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
                         <form id="frmNuevoTurno" class="smart-green" onsubmit="return false;">
                            <h2 class="encabezadoformulario" >Editar turno </h2>
                            <div  id="notificacion" class="alert-box error"><span id="mensaje-alerta">.</span></div>
                                <span class="campo-par"><label>Clave</label><input id="cve_turno" onclick="return false;"  readonly onkeypress="return false;"  onkeydown="return false;"/></span>
                                <span class="campo-par"><label>Nombre</label><input style="width:250px;" id="nombre" placeholder="Ingrese nombre de turno"/></span>
                                <hr class="cleaner"/>
                                <div class="scrollable" offset="360">
                                <table id="captura-horarios">
                                    <thead>
                                        <tr><th rowspan="2">Día</th> <th>Jornada</th> <th>Comida</th></tr>
                                        <tr><th>Entrada/Salida</th><th>Entrada/Salida</th></tr>
                                    </thead>
                                    <tbody id="diasTurno"></tbody>
                                </table>
                            </div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones">
                                <span style="width:300px;">
                                    <button class="guardar btnFormularios" onclick="GuardarTurno()">Guardar</button>
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
