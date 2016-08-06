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
        <link href="css/seguridad.css" rel="stylesheet" type="text/css" />
        <link href="css/usuarios.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/usuarios.js?ver=1.0" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js?ver=1.0" type="text/javascript"></script>
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
                            <h2 class="usuarios encabezadoformulario" >Catálogo de Usuarios</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Usuarios" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoUsuario()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="empleado ordenar">No.Empl</label> </th>
                                            <th><label class="nombre ordenar">Nombre</label> </th>
                                            <th><label class="perfil ordenar">Perfil</label></th>  
                                            <th><label class="sucursal ordenar">Sucursal</label></th>
                                            <th><label class="cuentabloqueada ordenar">Cta.Bloq</label></th>
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
                         <form id="frmNuevoUsuario" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="usuarios encabezadoformulario" >Crear Nuevo Usuario</h2>
                            	    <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                      <div class="columnaI scrollable" offset="320" style="clear:none;">
                                        <label class="clave">Clave</label>  
                                        <input id="clave" name="cve_usuario" class="clave" readonly />
                                        <label class="empleado">No.Empleado</label> 
                                        <input id="empleado" name="num_empleado" class="empleado" maxlength="79" placeholder="No.Empleado" />
                                        <label class="nombre">Nombre</label> 
                                        <input id="nombre" name="nombre" class="nombre" maxlength="79" placeholder="NombreCompleto" />
                                        <label class="usuario">Usuario</label> 
                                        <input id="usuario" name="usuario" class="usuario" maxlength="79" placeholder="Usuario" />
                                        <label class="password">Password</label> 
                                        <input id="password" name="password" class="password" type="password" maxlength="79" placeholder="Password" />
                                         <label class="password">E-mail</label> 
                                        <input id="email" name="email" class="password" type="text" maxlength="79" placeholder="E-mail" />
                                        <label class="perfil">Perfil</label> 
                                        <select id="cve_perfil" name="cve_perfil" class="perfil" readonly> </select> 
                                        <label class="sucursal">Sucursal</label> 
                                        <select id="cve_sucursal" name="cve_sucursal" class="sucursal" readonly> </select> 
                                      </div>
                                      <div class="columnaD scrollable" offset="320" style="clear:none;">
                                        <label class="seguridad">Seguridad</label> 
                                        <input id="seguridad" name="cve_seguridad" class="seguridad" maxlength="79" placeholder="TipoSeguridad" />
                                        <label class="cuentabloqueada">Cta.Bloq</label> 
                                        <select class="cuentabloqueada" name="cuentabloqueada" id="cuentabloqueada"> 
                                        <option value="true">Si</option>
                                        <option value="false">No</option>
                                        </select >
                                        <label class="tipopassword">TipoPassword</label> 
                                        <select id="cve_tipopassword" name="cve_tipopassword" class="tipopassword" readonly> </select> 
                                        <label class="periodo">Período</label> 
                                        <input id="periodo" name="periodocambiap" class="periodo" maxlength="79" placeholder="PeríodoCambiaPassword" />
                                        <label class="cambiap">CambiaPass</label> 
                                        <select class="cambiap" name="cambiap" id="cambiap" >
                                        <option value="true">Si</option>
                                        <option value="false">No</option>
                                        </select> 
                                        <label class="vecesl">VecesLogin</label> 
                                        <input id="veceslogin" name="veceslogin" class="vecesl" maxlength="79" placeholder="VecesLogin" />
                                        <label class="estatus">Estatus</label> 
                                        <select class="estatus" name="activo" id="estatus"  >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                       </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarUsuario()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarUsuario()">Salir</button>
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
