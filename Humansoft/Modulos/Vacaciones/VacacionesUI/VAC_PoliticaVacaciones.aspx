<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/vacaciones.css" rel="stylesheet" type="text/css" />
        <link href="css/politicavacaciones.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/politicavacaciones.js?ver=1.2" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/vacaciones.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
    </head>
    <body class="fondo" onload="iniciar(<%=Request["cve_grupopolitica"]%>)" callbackInicio="<%=Request["callbackInicio"]%>" callbackFin="<%=Request["callback"]%>">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="politica encabezadoformulario" >
                                Política de Vacaciones
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "0"%>);">Regresar</button>
                            </h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Detalles de Políticas" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoPoliticaVacaciones()">Agregar</button>
                            <div class="scrollable" offset="280" style="clear:both;">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas">
                                            <th><label class="editar"> Editar</label></th>
                                            <th><label class="clave ordenar">clave</label></th>
                                            <th><label class="annos ordenar">Años</label></th>
                                            <th><label class="prestamos ordenar">Dias Derecho</label></th>
                                            <th><label class="primavacacional ordenar">Prima Vacacional</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>
                    <div class="formulario ">
                         <form id="frmNuevoPoliticaVacaciones" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="politica encabezadoformulario" >Crear Nueva Política Vacaciones</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>                                
                                <div class="scrollable" offset="310">
                                    <input id="cve_grupopoliticas" name="cve_grupopoliticas" value="<%=Request["cve_grupopolitica"]%>" type="hidden" class="clave" readonly  onkeypress="return false;" onkeydown="return false;" />
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_politica" class="clave" readonly  onkeypress="return false;" onkeydown="return false;" />
                                    <label class="annos">Años</label>  
                                    <input id="annos" name="anios" class="annos" />
                                    <label class="prestamos">Dias derecho</label>  
                                    <input id="prestamos" name="prestamos" class="prestamos"  />
                                    <label class="primavacacional">Prima Vacacional</label>  
                                    <input id="primavacacional" name="primavacacional" class="primavacacional" />
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarPoliticaVacaciones()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarPoliticaVacaciones()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>                
                </div>  
           </div>  
       </div> 
  <%}else {%>
        <item:comun ID="Comun1" runat="server" /></item:comun>
<%}%>        
    </body>
</html>
