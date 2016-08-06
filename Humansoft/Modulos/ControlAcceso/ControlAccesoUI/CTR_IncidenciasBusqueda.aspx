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
        <script src="../../../Recursos/js/generico.js?ver=1.6"></script>
        <script src="js/controlacceso.js?ver=1.1"></script>
        <script src="js/permisos.js?ver=1.18" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

        <style>
            input[type=radio],input[type=checkbox]{width:auto !important;height:auto !important;margin-top:17px;}
            .campo-par{display:block;clear:both;}
            .campo-par label{float:left;width:130px;padding:5px;}
            .campo-par b{float:left;width:230px;padding:5px;border:1px solid #E5E5E5;padding:4px;margin-top:10px;min-height:19px;}
            .campo-par input{width:110px;padding:0px;float:left;}
            .campo-par select{width:110px;padding:0px;float:left;}
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
    <body class="fondo" onload="BusquedaIncidencias.Iniciar();">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->
                    
                    <div class="ventana">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Historial de incidencias</h2>
                            <div id="busqueda">
                                <fieldset class="filtros-posiciones" id="filtrosPosiciones">
                                    <legend>Consulta de Solicitudes</legend>
                                    <button class="btnFormularios criterio" onclick="ToggleMenu('criteriosBusqueda')" id="criterioBusqueda"> Agregar criterio ..</button> 
                                    <div class="wrap-menu-criterio">                                 
                                        <div class="opciones-menu" style="display:none;" id="criteriosBusqueda">
                                            <ul>
                                                <li onclick="AgregarCriterioBusqueda('No. de empleado','num_empleado','frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">No.Empleado</li>
                                                <li onclick="AgregarCriterioBusqueda('Nombre de empleado','nombre_empleado', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Nombre de empleado</li>                                                
                                                <li onclick="AgregarCriterioBusqueda('Departamento','departamento', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Departamento</li>
                                                <li onclick="AgregarCriterioBusqueda('Puesto','puesto','frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Puesto</li>
                                                <li onclick="AgregarCriterioBusqueda('Días','dias', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Días</li>
                                                <li onclick="AgregarCriterioBusqueda('Estatus','estatus', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Estatus</li>
                                                <li onclick="AgregarCriterioBusqueda('Periodo','periodo', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Periódo</li>
                                                <li onclick="AgregarCriterioBusqueda('No. de Solicitud','num_solicitud', 'frmCriteriosBusqueda');ToggleMenu('criteriosBusqueda');">Folio de incidencia</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <form id="frmCriteriosBusqueda" class="frm-criterios-busqueda" onsubmit="return false;"></form>
                                </fieldset>
                            </div>
                            <div class="wrapper-tabla scrollable" offset="335">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th width="100" ><label> Clave</label> </th>
                                            <th width="90" ><label class="ordenar">Fecha</label></th>
                                            <th width="90" ><label class="ordenar">No. Emp.</label></th>
                                            <th width="300" ><label class="ordenar">Nombre</label></th>
                                            <th width="150" ><label class="ordenar">Motivo</label></th>
                                            <th width="120" ><label class="ordenar">Estatus</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista" class="filas-seleccionables"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>

                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar ventana" frameborder="0" scrolling="no" ></iframe>

                </div>
            </div>
        </div>
          <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
