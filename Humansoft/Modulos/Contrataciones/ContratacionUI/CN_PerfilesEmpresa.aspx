<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>
<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/layoutGenerico.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="css/PerfilesEmpresa.css?ver=1" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
        <script src="js/PerfilesEmpresa.js?ver=1" type="text/javascript"></script>
        <script src="js/contrataciones.js?ver=1" type="text/javascript"></script>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo ventana" >
                        <div class="smart-green">
                            <h2 class="grado encabezadoformulario" >Perfiles por empresa</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="Button1" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="450">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label>Editar</label> </th>
                                            <th><label class="ordenar">Nombre</label> </th>
                                            <th ><label class="ordenar">Empresa</label></th> 
                                            <th><label>Seleccionar</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                     <div class="formulario ventana" id="formulario">
                         <form id="frmNuevo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="CatalogoGenerico encabezadoformulario" >Agregar Perfil</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="300">
                                    <label class="clave">Clave</label>
                                    <input id="clave" name="clave" class="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    <label class="empresa">Empresa</label> 
                                    <select class="empresa" name="empresa" id="empresa">
                                    </select>
                                    <label class="Nombre">Nombre</label>  
                                    <input id="descripcion" name="descripcion" class="Nombre" maxlength="79" placeholder="Nombre" />
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
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
