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
        <link href="css/imagenes.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/imagenes.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="imagenes encabezadoformulario" >Catálogo de Imágenes</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las Imágenes" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoImagen()">Agregar</button>                                
                            <ul id="contenedorLista" class="catalogo-imagenes  scrollable" offset="270" ></ul>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='20'  ></div>
                        </div>
                    </div>
                    <div class="formulario">
                         <form id="frmNuevoImagenes" onsubmit="return false;">
                            <div class="alinear smart-green" >
                                <h2 class="imagenes" encabezadoformulario" >Crear Nueva Imagen</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="img-left scrollable" offset="320" style="clear:none;overflow:auto;">
                                    <label class="clave">Clave:</label>  
                                    <input  id="cve_imagen" name="cve_imagen" class="clave"  readonly/>
                                    <label class="path">Path:</label> 
                                    <input type="file" id="path" name="path" class="path" onchange="PreviewImage();"/>
                                    <label class="palabrasclave">Palabras Clave:</label>  
                                    <input  id="palabrasclave" name="palabrasclave" class="palabrasclave"/>
                                    <iframe name="frame-aux" class="ocultar"></iframe>
                                </div>
                                <div class="img-right scrollable" offset="320"  style="clear:none;overflow:auto;" > 
                                    <h3>Vista Preeliminar</h3>
                                    <img id="uploadPreview" />
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarImagen()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarImagen()">Salir</button>
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
