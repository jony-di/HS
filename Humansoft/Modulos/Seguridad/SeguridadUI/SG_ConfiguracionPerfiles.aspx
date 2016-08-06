<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%
    if (Validacion.ValidarPermisoMenu(4, Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" />
    <script src="../../../Recursos/jqueryui/jquery-ui.min.js"></script>
    <link href="../../../Recursos/css/arbolmenu.css" rel="stylesheet" type="text/css" />
    <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
    <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
    <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
    <script src="js/seguridad.js?ver=1.0" type="text/javascript"></script>
    <script src="js/ConfiguracionPerfiles.js?ver=1.0" type="text/javascript"></script>
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/PerfilesMenus.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    
</head>
<body onload="iniciar();">    
    <div class="__seccion  smart-green">        
        <h2>Configuración de Perfiles</h2>        
        <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta"></span></div>
        <div class="alinear-izquierda">
            <fieldset class="perfilseleccionado">
                <legend>Perfil seleccionado</legend>
                <label>Clave: </label><b id="cp_clave"></b>
                <label>Nombre: </label><b id="cp_nombre"></b>
                <label>Puede ver todo: </label><b id="cp_puedevertodo"></b>
                <label>Estatus activo: </label><b id="cp_activo"></b>
            </fieldset>             
        </div>
        <div class="alinear-derecha">
            <div id="tabsPerfiles" class="tabs-conf">
                <ul>
                    <li><a href="#menusPerfil">Menus a perfil</a></li>
                    <li><a href="#modulosRolesPerfil">Módulos y roles de perfil</a></li>
                    <li><a href="#empresasSucursalesPerfil" >Empresas y sucursales a perfil</a></li>
                </ul>
                <div id="menusPerfil">     
                    <div class="arbol-editar" id="arbolMenus"></div>
                    <div class="barra-botones botones-menus"><button class="btnFormularios" onclick="GuardarMenusPerfil();">Guardar</button></div>
                </div>
                <div id="modulosRolesPerfil" class="asignar-a-perfil">
                    <div id="contenedorListaModulos">
                        <ol id="listaModulos" class="lista-cp modulosPerfil"></ol>
                        <div class="barra-botones botones-modulos"><button class="btnFormularios" onclick="GuardarModulosRoles();">Guardar</button></div>
                    </div>
                    <div id="contenedorlistaRoles" style="display:none">
                        <ol id="listaRoles" class="lista-cp sinNavegacion rolesPerfil"></ol>
                        <div class="barra-botones botones-modulos"><button onclick="IntercambioVisual('contenedorListaModulos', 'contenedorlistaRoles');" class="regresar">Regresar</button></div>
                    </div>
                </div>
                <div id="empresasSucursalesPerfil" class="asignar-a-perfil">
                     <div class="izq">
                        <ol id="listaEmpresas" class="lista-cp empresasPerfil"></ol>
                        <div class="barra-botones botones-empresas"><button class="btnFormularios" onclick="GuardarEmpresasPerfil();">Guardar</button></div>
                     </div>
                     <div class="der">
                        <ol id="listaSucursales" class="lista-cp sinNavegacion sucursalesPerfil"></ol>
                        <div class="barra-botones botones-sucursales"><button class="btnFormularios" id="nombreEmpresaSel" onclick="GuardarSucursalesEmpresaPerfil();">Guardar</button></div>
                     </div>
                </div>
            </div>
        </div>              
    </div>
<%}else {%>
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <div class="no-permitido">
        <hr/>
          <h1>Acceso no permitido.</h1>
        <hr/>
    </div>
<%}%>
</body>
</html>
