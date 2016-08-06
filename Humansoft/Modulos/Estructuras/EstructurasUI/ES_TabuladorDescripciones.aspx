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
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/busqueda-3-c.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/catalogo-3-c.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/layoutGenerico.css" rel="stylesheet" type="text/css" />
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="grado encabezadoformulario" >Catálogo de Tabuladores</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="270">
                            <table class="lista" id="tableCatalogo" style="width:790px;">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="c-cat-1"> Editar</label> </th>
                                        <th><label class="c-cat-2 ordenar">Clave</label> </th>
                                        <th ><label class="c-cat-3 ordenar">Descripción</label></th> 
                                        <th><label class="c-cat-4 ordenar">Estatus</label></th> 
                                        <th><label class="c-cat-5 ordenar">Ver Niveles</label></th>
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
                                <h2 class="grado encabezadoformulario" >Crear nueva descripción de Tabulador</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="310">
                                    <label class="l-form-1">Clave</label>  
                                    <input id="clave" name="clave" class="c-form-1" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    <label class="l-form-2">Descripción</label> 
                                    <input id="descripcion" name="descripcion" class="c-form-2" maxlength="79" placeholder="Descripción" />
                                    <label class="l-form-3">Estatus</label> 
                                    <select class="c-form-3" name="activo" id="estatus">
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
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
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>        
    </body>
</html>
