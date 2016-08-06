<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <script src="/Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="/Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <script src="/Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="/Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="js/estructuras.js?ver=1.0" type="text/javascript"></script>
        <script src="js/empleados.js?ver=1.0" type="text/javascript"></script>

        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/empleados.css" rel="stylesheet" type="text/css" />
        <link href="/Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
        <link href="/Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="/Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        
    </head>
    <body class="fondo" onload="Empleados.iniciarAdmin('<%=Request["callback"]%>')" style="overflow:hidden;">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="usuarios encabezadoformulario" >                                                                                  
                                Operaciónes de empleados
                                <div class="OpcionesPosiciones">
                                    <span class="btnFormularios menu-up" onclick="ToggleMenu('opcionesEmpleado');"><a class="nombre">Movimientos ..</a> </span>
                                    <div class="opciones-menu" style="display:none" id="opcionesEmpleado">
                                        <ul>                        
                                            <li class="titulo"><h3>Vacaciones</h3></li>
                                            <li onclick="MostrarSolicitudVacaciones()">Solicitar vacaciones al empleado</li>
                                            <li onclick="MostrarSolicitudesVacaciones()">Historial de vacaciones</li>
                                            <li onclick="MostrarSolicitudIncidencia();">Solicitar incidencia</li>
                                            <li onclick="MostrarSolicitudesIncidencias();">Historial de incidencias</li>
                                            <hr/><li class="titulo"><h3>Mas operaciones..</h3></li>
                                            <li onclick="try{MoverEmpleadoPosicion(this,'DEMOSION', 'DEMOSION');}catch(e){}ToggleMenu('opcionesEmpleado');">..</li>
                                            <li onclick="try{MoverEmpleadoPosicion(this,'MOVIMIENTO_LATERAL','MOVIMIENTO LATERAL');}catch(e){}ToggleMenu('opcionesPosiciones');">..</li>                                                
                                        </ul>     
                                    </div>
                                </div>   
                            </h2>
                            <div id="busqueda">
                                <fieldset class="filtros-posiciones" id="filtrosPosiciones">
                                <legend>Consulta de Empleados</legend>
                                <button class="btnFormularios criterio" onclick="ToggleMenu('criteriosBusqueda')" id="criterioBusqueda"> Agregar criterio ..</button> 
                                <div class="wrap-menu-criterio">                                 
                                        <div class="opciones-menu" style="display:none;" id="criteriosBusqueda">
                                            <ul>                        
                                                <li onclick="AgregarCriterioEmpleadoAdmin('NoEmpleado','id_empleado','criteriosPosiciones');ToggleMenu('criteriosBusqueda');">No.Empleado</li>
                                                <li onclick="AgregarCriterioEmpleadoAdmin('NombreCompleto','nombrecompleto', 'criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Nombre Completo</li>
                                                <li onclick="AgregarCriterioEmpleadoAdmin('Estado civil','cve_estadocivil','criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NEstadoCivil.aspx?op=obtenerCatalogoEstadoCivil&pagina=1&longitudPagina=1000&cve_estadocivil=0&criterio=' ,'Estado Civil','descripcion','cve_estadocivil');ToggleMenu('criteriosBusqueda');">Estado Civil</li>
                                                <li onclick="AgregarCriterioEmpleadoAdmin('Grado alcanzado','cve_grado','criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NGrado.aspx?op=obtenerCatalogoGrado&pagina=1&longitudPagina=1000&cve_grado=0&criterio=' ,'Grado Estudios','descripcion','cve_grado');ToggleMenu('criteriosBusqueda');">Grado Alcanzado</li>
                                                <li onclick="AgregarCriterioEmpleadoAdmin('Posición','num_posicion', 'criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Posición</li>
                                            </ul>     
                                        </div>
                                    </div>                                    
                                <form id="criteriosPosiciones" class="frm-criterios-busqueda" onsubmit="return false;"></form>
                                </fieldset>
                            </div>
                            <div class="scrollable" offset="310">
                            <table class="listaN" id="tableCatalogo" style="width:700px;">
                                <thead>
                                    <tr class="columnas"> 
                                        <th width="60"><label class="ordenar">No.Empl</label> </th>
                                        <th width="300"><label class="ordenar">Nombre Completo</label> </th>
                                        <th width="60"><label class="ordenar">Estatus</label></th>
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista" class="filas-seleccionables" ></tbody>
                            </table>
                            </div>
                            <div class='paginador' id="paginador"  total='0' criterio='%' tamPagina='50' style="margin-left:50px;"></div>
                        </div>
                    </div>                                       
                    <iframe id="pantallaAuxiliar" frameborder="0" scrolling="no" class="ventana"></iframe>               
                </div>  
           </div>  
       </div>  
  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>  
    </body>
</html>
