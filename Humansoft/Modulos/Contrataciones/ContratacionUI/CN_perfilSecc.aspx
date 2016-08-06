<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>
<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
        <link href="css/perfilSecc.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/layoutGenerico.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
        <script src="js/perfilSecc.js" type="text/javascript"></script>
        <script src="js/contrataciones.js" type="text/javascript"></script>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="grado encabezadoformulario" >Secciones del perfil</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="c-cat-1"> Editar</label> </th>
                                            <th><label class="c-cat-2 ordenar">Clave</label> </th>
                                            <th ><label class="c-cat-3 ordenar">Descripción</label></th> 
                                            <th ><label class="c-cat-2 ordenar">Secuencia</label></th> 
                                            <th><label class="c-cat-4 ordenar">Estatus</label></th> 
                                            <th><label class="c-cat-5">Seleccionar</label></th>
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
                                <h2 class="grado encabezadoformulario" >Crear nueva Seccion</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="400">
                                    <label class="l-form-1">Clave</label>
                                    <input id="clave" name="clave" class="c-form-1" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    <label class="l-form-2">Descripción</label>
                                    <input id="descripcion" name="descripcion" class="c-form-2" maxlength="79" placeholder="Descripción" />
                                    <label class="l-form-2">Secuencia</label>
                                    <input id="secuencia" name="secuencia" class="c-form-2" maxlength="3" placeholder="Secuencia"/>
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
                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="ventana" frameborder="0" scrolling="no" ></iframe>
                </div>  
           </div>  
       </div> 
  <%}else {%>
        <item:comun runat="server" />
<%}%>
    </body>
</html>
