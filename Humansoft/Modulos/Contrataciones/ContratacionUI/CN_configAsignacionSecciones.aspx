<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
        <link href="css/configAsignacionSecc.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
        <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
        <script src="js/configAsignacionSecc.js" type="text/javascript"></script>
        <script src="js/contrataciones.js" type="text/javascript"></script>
         <script>
            $(function () {
                $("#accordion").accordion({
                     heightStyle: "fill"
                });
             });
             $(function () {
                 $("#accordion2").accordion({
                     heightStyle: "fill"
                   
                 });
             });
        </script>
    </head>
    <body class="fondo" onload="iniciar(<%=Request["clave"]%>)" callbackInicio="<%=Request["callbackInicio"]%>">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo"></div>
                    <div class="formulario ">
                         <form id="frmNuevo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="Apartado encabezadoformulario" >Agregar Requisito
                                    <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>
                                </h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                    <fieldset class="info">
                                        <legend>Configuracion</legend>
                                        <label class="etiquetas">Num. </label>
                                        <label class="campos" id="lblClave">Zona Bajio</label>
                                        <label class="etiquetas">Nombre:</label>
                                        <label class="campos" id="lblNombre">Equipat</label>
                                        <label class="etiquetas">Asignar al jefe:</label>
                                        <label class="campos" id="lblJefe">Equipat</label>
                                    </fieldset>
                                    <div class="columnaI">
                                        <div id="accordion" >
                                            <h3>Puestos</h3>
                                            <div>
                                                <button class="btn agregar" id="Button1" onclick="mostrarPuestos()">Agregar</button>
                                                <table style="width:85%;margin:auto;clear:both;" frame="hsides" id="contenedorPuestos">
                                                    <thead>
                                                        <tr>
                                                            <th style="width:95%">Nombre</th>
                                                            <th>Quitar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="tPuestos"></tbody>
                                                </table>
                                            </div>
                                            <h3>Departamentos</h3>
                                            <div>
                                                <button class="btn agregar" id="btnagregar" onclick="mostrarDepartamentos()">Agregar</button>
                                                <table style="width:85%;margin:auto;clear:both;" frame="hsides" id="contenedorDep">
                                                    <thead>
                                                        <tr>
                                                            <th style="width:95%">Nombre</th>
                                                            <th>Quitar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="tDep"></tbody>
                                                </table>
                                            </div>
                                            <h3>Region</h3>
                                            <div>
                                                <button class="btn agregar" id="Button3" onclick="mostrarRegion()">Agregar</button>
                                                <table style="width:85%;margin:auto;clear:both;" frame="hsides" id="contenedorRegion">
                                                    <thead>
                                                        <tr >
                                                            <th style="width:95%">Nombre</th>
                                                            <th>Quitar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="tRegion"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="columnaD">
                                        <div id="accordion2" >
                                            <h3>Reclutadores</h3>
                                            <div>
                                                <button class="btn agregar" id="Button2" onclick="mostrarReclutadores()">Agregar</button>
                                                <table style="width:85%;margin:auto;clear:both;" frame="hsides" id="contenedorReclutadores">
                                                    <thead>
                                                        <tr>
                                                            <th style="width:95%">Nombre</th>
                                                            <th>Quitar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="tReclutadores"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones" style="visibility:hidden">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarApartado()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>  
           </div>  
       </div> 
  <%}else {%>
    <item:comun ID="Comun1" runat="server" />
<%}%>
    </body>
</html>
