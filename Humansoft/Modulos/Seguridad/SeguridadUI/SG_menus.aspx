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
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
        <link href="css/seguridad.css" rel="stylesheet" type="text/css" />
        <link href="css/menus.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/menus.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <style>
            #contenedorLista td label{overflow:hidden;text-overflow:ellipsis;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="menus encabezadoformulario" >Catálogo de Menús</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Menús" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoMenu()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th><label class="nombre ordenar">Nombre</label> </th>
                                            <th><label class="pagina ordenar">Página</label></th> 
                                            <th><label class="imagen ordenar">Imagen</label></th>  
                                            <th><label class="estatus ordenar">Estatus</label></th> 
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id="paginador"  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario ">
                         <form id="frmNuevoMenu" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="menus encabezadoformulario" >Crear Nuevo Menú</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="aux-left scrollable" offset="320"  style="clear:none;">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_menu" class="clave" readonly />
                                    <label class="nombre">Nombre</label> 
                                    <input id="nombre" name="nombre" class="nombre" maxlength="79" placeholder="NombreMenú" />
                                     <label class="tooltip">Tooltip</label> 
                                    <input id="tooltip" name="tooltip" class="tooltip" maxlength="79" placeholder="Tooltip" />
                                    <label class="pagina">Página</label> 
                                    <input id="url" name="pagina" class="pagina" maxlength="79" placeholder="DescripciónPágina" />
                                    <input id="cve_imagen" name="cve_imagen" class="imagen" style="display:none;" maxlength="79" placeholder="DescripciónImagen" />                                    
                                    <label class="idioma">Idioma</label> 
                                    <select id="idioma" name="cve_idioma" class="idioma" readonly> </select>
                                    <label class="padresubmenu">PadreMenú</label> 
                                    <select id="cve_padremenu" name="cve_padremenu" class="padresubmenu" readonly> </select> 
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus">
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                    <label class="estatus">Visible</label> 
                                    <select class="estatus" name="visible" id="visible">
                                        <option value="true">Si</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div class="aux-right scrollable" offset="320"  style="clear:none;height:auto;overflow:auto;">
                                    <div id="imagenSeleccionada">
                                        <label class="imagen">Imagen seleccionada</label> 
                                        <div class="imagen-menu"><img src="" id="imagenMenu"/></div>
                                        <button class="btnFormularios" onclick="VerCatalogoImagenes();">Cambiar imagen</button>
                                    </div>
                                    <div id="menuImagenes" class="menu-imagenes" style="display:none;">
                                        <h3>Seleccionar imagen</h3>
                                        <div class="busqueda"><input class="buscar" id="buscarImagenes" placeholder="Buscar en todas las imagenes" onkeyup="BuscarImagenes(event, this, 'catalogoImagenes',SeleccionarImagen);"/> </div>
                                        <div id="catalogoImagenes" class="lista-imagenes"></div>
                                        <button class="btnFormularios regresar" onclick="IntercambioVisual('imagenSeleccionada','menuImagenes');">Regresar</button>                                        
                                    </div>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarMenu()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarMenu()">Salir</button>
                                    </span>
                                </div>
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
