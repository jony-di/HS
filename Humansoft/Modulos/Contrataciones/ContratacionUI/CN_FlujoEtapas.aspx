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
        <link href="css/contrataciones.css" rel="stylesheet" />
        <script src="js/flujoetapas.js?ver=1.2" type="text/javascript"></script>
        <link href="css/flujoetapas.css?ver=1.1" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/generico.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/layoutGenerico.css" rel="stylesheet" type="text/css" />
        <script>
            var urlBase_WS = "/Modulos/Contrataciones/ContratacionNegocio/";
        </script>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio">
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="politicas encabezadoformulario" >Catálogo de etapas de flujos de contratación</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en etapas de contratación" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="270" style="clear:both;">
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas">
                                        <th><label class="editar ordenar  "> Editar</label></th>
                                        <th><label class="clave ordenar">Clave</label> </th>
                                        <th ><label class="nombre ordenar">Descripción</label></th>
                                        <th><label class=" dias ordenar" title="Resolución automática">Res. Auto.</label></th>
                                        <th><label class=" ver ordenar">Ver subetapas</label></th>
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario" id="formulario">
                         <form id="frmNuevo" onsubmit="return false;" >
                            <div class="alinear smart-green" >
                                <h2 class="grado encabezadoformulario" >Editar etapa</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>                           
                                <div class="scrollable" offset="310">

                                    <label class="clave">Clave</label>
                                    <input id="clave" name="clave" class="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    <label class="nombre">Descripción</label> 
                                    <input id="descripcion" name="descripcion" class="nombre" maxlength="200" placeholder="Descripción" />
                                    <label class="activo">Resolución automática</label>
                                    <input id="resolucionautomatica" name="resolucionautomatica" class="nombre" type="checkbox" value="true"/>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="Guardar()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="Cancelar()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>                    
                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar ventana" frameborder="0" scrolling="no" ></iframe>  
                </div>  
           </div>
       </div> 
  <%}else {%>
        <item:comun ID="Comun1" runat="server" /></item:comun>
<%}%>        
    </body>
</html>
