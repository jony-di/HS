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
        <link href="css/seguridad.css?ver=1.0" rel="stylesheet" type="text/css" />
        <link href="css/perfiles.css?ver=1.0" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/arbolmenu.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="js/ConfiguracionPerfiles.js?ver=1.3" type="text/javascript"></script>
        <script src="js/seguridad.js?ver=1.3" type="text/javascript"></script>
        <script src="js/perfiles.js?ver=1.2" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js"></script>
        <style>
            #fs_tiposEstructura{width:300px;clear:both;margin-bottom:10px;}
            #fs_tiposEstructura span{float:left;display:block;width:140px;}
            #fs_tiposEstructura span input{float:left;width:auto;}
            div.mascara,#principal,div.smart-green{height:auto !important;min-height:200px !important;}
            body div.mascara div.principal div.catalogo{height:auto;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="perfiles encabezadoformulario" >Catálogo de Perfiles</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Perfiles" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoPerfil()">Agregar</button>
                            <div class="scrollable" offset="270" style="clear:both;">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th ><label class="nombre ordenar">Nombre</label></th> 
                                            <th ><label class="puedevertodo ordenar">PuedeVerTodo</label></th> 
                                            <th><label class="estatus ordenar">Estatus</label></th> 
                                            <th><label class="eliminar">Eliminar</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario" id="edicionPerfil">
                         <form id="frmNuevoPerfiles" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="perfiles encabezadoformulario" >Crear Nuevo Perfil</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="320">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_perfil" class="clave" readonly />
                                    <label class="nombre">Nombre</label> 
                                    <input id="nombre" name="nombre" class="nombre" maxlength="79" placeholder="NombrePerfil" />
                                    <label class="puedevertodo">PuedeVerTodo</label> 
                                    <select class="puedevertodo" name="puedevertodo" id="puedevertodo">
                                        <option value="true">Si</option>
                                        <option value="false">No</option>
                                    </select>
                                    <fieldset id="fs_tiposEstructura" style="clear:both;width:300px;margin-bottom:15px;"><legend>Tipo acceso estructura</legend></fieldset>
                                    <label class="estatus">Estatus</label>
                                    <select class="estatus" name="activo" id="estatus">
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones"  style="margin-top:0px;">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarPerfil()">Guardar</button>
                                        <span id="btnConfigurar"></span>
                                        <button class="cancelar btnFormularios" onclick="DesplazarElemento('principal',0)">Regresar</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>  
                    <div id="configuracionPerfil" class="configuracion-perfil">
                        <div class="__seccion  smart-green">
                            <h2>Configuración de Perfiles</h2>
                            <div  id="notificacion-conf" class="alert-box error ocultar"><span></span></div>
                            <div class="scrollable" offset="290">
                                <div class="alinear-izquierda">
                                    <fieldset class="perfilseleccionado">
                                        <legend>Perfil seleccionado</legend>
                                        <label>Clave: </label><b id="cp_clave"></b>
                                        <label>Nombre: </label><b style="line-height: 15px;" id="cp_nombre"></b>
                                        <label>Puede ver todo: </label><b id="cp_puedevertodo"></b>
                                        <label>Estatus activo: </label><b id="cp_activo"></b>
                                    </fieldset>             
                                </div>
                                <div class="alinear-derecha">
                                    <div id="tabsPerfiles" class="tabs-conf">
                                        <ul>
                                            <li><a href="#menusPerfil">Menus a perfil</a></li>
                                            <li><a href="#modulosRolesPerfil">Módulos y roles de perfil</a></li>
                                            <li><a href="#empresasSucursalesPerfil" >Empresas y departamentos de perfil</a></li>
                                        </ul>
                                        <div id="menusPerfil">     
                                            <div class="arbol-editar" id="arbolMenus"></div>
                                            <div class="barra-botones-b botones-menus"><button class="btnFormularios" onclick="GuardarMenusPerfil();">Guardar</button></div>
                                        </div>
                                        <div id="modulosRolesPerfil" class="asignar-a-perfil">
                                            <div id="contenedorListaModulos">
                                                <ol id="listaModulos" class="lista-cp modulosPerfil"></ol>
                                                <div class="barra-botones-b botones-modulos"><button class="btnFormularios" onclick="GuardarModulosRoles();">Guardar</button></div>
                                            </div>
                                            <div id="contenedorlistaRoles" style="display:none">
                                                <ol id="listaRoles" class="lista-cp sinNavegacion rolesPerfil"></ol>
                                                <div class="barra-botones-b botones-modulos"><button onclick="IntercambioVisual('contenedorListaModulos', 'contenedorlistaRoles');" class="btnFormularios">Regresar</button></div>
                                            </div>
                                        </div>
                                        <div id="empresasSucursalesPerfil" class="asignar-a-perfil">
                                             <div class="izq">
                                                <ol id="listaEmpresas" class="lista-cp empresasPerfil"></ol>
                                             </div>
                                             <div class="der">
                                                <ol id="listaDepartamentos" class="lista-cp sinNavegacion sucursalesPerfil"></ol>
                                                <div class="barra-botones-b botones-sucursales"><button class="btnFormularios" id="nombreEmpresaSel" onclick="GuardarDepartamentosEmpresaPerfil();">Guardar</button></div>
                                             </div>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                            <div class="barra-botones botones-menus"><button class="btnFormularios" onclick="CancelarPerfil();">Regresar</button></div>            
                        </div>
                    </div>                                  
                </div>  
           </div>  
       </div>     
      <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>        
    </body>
</html>
