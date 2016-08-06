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
        <link href="css/vacaciones.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>    
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <script src="js/solicitud.js?version=1.2" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/vacaciones.js?version=1.1" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" />

        <style>
            .campo-par{display:block;float:left;width:400px;clear:both;}
            .campo-par label{float:left;width:100px;padding:5px;}
            .campo-par input{width:110px;padding:0px;float:left;}  
            #tabsListado th{font-size:13px;}
            #tabsListado td{font-size:13px;color:#5E5E5E;}
            #tabsListado .ui-tabs-anchor{font-size:14px;}
            #tabsListado .ui-tabs-panel{padding:10px 0px;}
            #busqueda{min-width:800px;}
        </style>

    </head>
    <body class="fondo" onload="ListadoSolicitudes.iniciar()">
        <button onclick="window.top.CerrarTabDesdeFrame(window.location.href);" style="display:none;">test</button>
        <div id="inicio">
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->                    
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Solicitudes de Vacaciones</h2>
                            <div id="tabsListado" class="tabs-conf">
                                <ul>
                                    <li><a href="#misSolicitudes">Mis solicitudes</a></li>
                                    <li><a href="#listadoGeneral">Solicitudes de personal</a></li>
                                </ul>
                                <div id="misSolicitudes">     
                                    <div class="scrollable" offset="260" style="margin-bottom:30px;">
                                        <div  style="overflow-x:auto;width:1200px;">
                                        <table class="lista" id="listaMisVacaciones" style="margin-left:0px;width:auto;">
                                            <thead>
                                                <tr class="columnas">
                                                    <th width="70" style="min-width:95px;"><label class="ordenar">Historial</label> </th>
                                                    <th width="70" style="min-width:70px;"><label class="ordenar"> No.</label> </th>
                                                    <th width="70" style="min-width:160px;"><label class="ordenar">Fecha</label> </th>
                                                    <th width="70"  style="min-width:80px;"><label class="ordenar" title="Días solicitados"> Dias</label> </th>
                                                    <th width="115" ><label class="ordenar"> Estatus</label> </th>
                                                    <th width="50" style="min-width:90px;" ><label class="ordenar"> No. Emp.</label> </th>
                                                    <th width="200" ><label class="ordenar"> Nombre</label> </th>
                                                    <th width="200" ><label class="ordenar"> Departamento</label> </th>
                                                    <th width="200" ><label class="ordenar"> Puesto</label> </th>
                                                </tr>
                                            </thead>
                                            <tbody id="contenedorMisSolicitudes" class="filas-seleccionables"></tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                                <div id="listadoGeneral">
                                    <div id="busqueda">
                                        <fieldset class="filtros-posiciones" id="filtrosPosiciones">
                                            <legend>Consulta de Solicitudes</legend>
                                            <button class="btnFormularios criterio" onclick="ToggleMenu('criteriosBusqueda')" id="criterioBusqueda"> Agregar criterio ..</button> 
                                            <div class="wrap-menu-criterio">                                 
                                                <div class="opciones-menu" style="display:none;" id="criteriosBusqueda">
                                                    <ul>                        
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('No. de empleado','num_empleado','frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">No.Empleado</li>
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('Nombre de empleado','nombre_empleado', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Nombre de empleado</li>                                                
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('Departamento','departamento', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Departamento</li>
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('Puesto','puesto','frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Puesto</li>
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('Días','dias', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Días</li>
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('Estatus','estatus', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Estatus</li>
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('Periodo','periodo', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Periódo</li>
                                                        <li onclick="ListadoSolicitudes.AgregarCriterio('No. de Solicitud','num_solicitud', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">No. de solicitud</li>
                                                    </ul>     
                                                </div>
                                            </div>                                    
                                            <form id="frmCriteriosBusqueda" class="frm-criterios-busqueda" onsubmit="return false;"></form>
                                        </fieldset>
                                    </div>
                                    <div class="scrollable" offset="310" >
                                        <div  style="overflow-x:auto;width:1200px;">
                                            <table class="lista" id="tableCatalogo" style="margin-left:0px;width:auto;">
                                                <thead>
                                                    <tr class="columnas"> 
                                                        <th width="70" style="min-width:95px;"><label class="ordenar">Historial</label> </th>
                                                        <th width="70" style="min-width:70px;"><label class="ordenar" title="Número de solicitud"> No.</label> </th>
                                                        <th width="70" style="min-width:160px;"><label class="ordenar">Fecha</label> </th>
                                                        <th width="70"  style="min-width:80px;"><label class="ordenar" title="Días solicitados"> Dias</label> </th>
                                                        <th width="115" ><label class="ordenar"> Estatus</label> </th>
                                                        <th width="50" style="min-width:90px;" ><label class="ordenar"> No. Emp.</label> </th>
                                                        <th width="200" ><label class="ordenar"> Nombre</label> </th>
                                                        <th width="200" ><label class="ordenar"> Departamento</label> </th>
                                                        <th width="200" ><label class="ordenar"> Puesto</label> </th>
                                                    </tr>
                                                </thead>
                                                <tbody id="contenedorLista" class="filas-seleccionables"></tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50' ></div>
                                </div>                                         
                           </div> <!--Cerramos tabs -->
                        </div>
                    </div>                   
                    <iframe id="p_frame1" name="pantallaAuxiliar" class="pantallaAuxiliar ventana" frameborder="0" scrolling="no"> </iframe>
                </div>
            </div>
        </div>
                  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
