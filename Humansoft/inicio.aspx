<%@ Page Language="C#" %>
<%
   if (Session["cve_usuario"] != null)
   {
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        
        <script src="/Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="/Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <script src="/Recursos/js/menu.arbol.js" type="text/javascript"></script>
        <link href="/Recursos/css/arbolmenu.css" rel="stylesheet" type="text/css" />       
        <script src="/Recursos/js/inicio.js?version=1.7" type="text/javascript"></script>
        <script src="/Modulos/Seguridad/SeguridadUI/js/seguridad.js" type="text/javascript"></script>
        <link href="/Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="/Recursos/css/inicio.css?ver=1.5" rel="stylesheet" type="text/css" />
        <script>
        <%
        Boolean MantenerConectado=false;
        try{MantenerConectado=Convert.ToBoolean(Session["MantenerConectado"]);}catch(Exception ex){}
        if (MantenerConectado)
        { 
        %>
           $(function(){
                MantenerConectado();
           });
        <%
        }
        %>
        </script>
    </head>
    <body onload="iniciar();" onresize="redimensionarPantalla();">
        <div class="principal">
            <div class="inicio">
                <a class="iniciologo"> HumanSoft </a>
                <div class="sesionUsuario">
                    <span class="notificaciones-sistemas" onclick="ToggleLista(this,'lstSis');">
                        <b id="NumSis">0</b>
                        <ul id="lstSis" style="display:none;"></ul>
                    </span>
                    <span class="notificaciones" onclick="ToggleLista(this,'listaNotificaciones');">
                        <b id="numeroNotificaciones">0</b>
                        <ul id="listaNotificaciones" style="display:none;">
                            <li class="titulo">Eventos</li>
                        </ul>
                    </span>
                    <img class="imgusuario" src="/Recursos/imagenes/usuario1.png" onclick="ToggleLista(this,'opcionesUsuario')" id="btnSesion"/>
                    <a class="nombre" onclick="ToggleLista(document.getElementById('btnSesion'),'opcionesUsuario')"> <%=Session["nombre"]%></a> <button id="btnOpcioneslist" class="opcioneslist" onclick="ToggleLista(document.getElementById('btnSesion'),'opcionesUsuario')"> </button>
                    <div class="opciones-usuario ocultar" id="opcionesUsuario" style="display:none">
                        <ul>
                            <li onclick="AgregarNuevoTab('/DatosSesion.aspx','Datos sesión');ToggleLista(this,'opcionesUsuario');">Ver datos de sesión</li>
                            <li onclick="AgregarNuevoTab('window.location.href=inicio.aspx?ruta=/Modulos/Seguridad/SeguridadUI/Seguridad/SG_cambiarpassword.aspx','Cambiar contraseña');">Cambiar contraseña</li>
                            <li onclick="CerrarSesion()">Cerrar sesión</li>
                        </ul>
                    </div>
                    <button class="ayuda" ></button>
                </div>
            </div>
            <div class="spliter">
                <div id="spliterLeft" class="spliter-left">
                    <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Catálogos" onkeyup="buscarCoincidencias(event,this);"/> </div>
                    <div class="botones-auto-hide">
                        <button id="btnMenu" class="auto-hide" onclick="ToggleMostrarMenu()"></button>
                    </div>
                    <div id="arbolPrincipal" class="arbol-principal"></div>
                </div>
                <ul class="tabs-app" id="tabsApp"></ul>
                <div id="spliterRight"  class="spliter-right" ></div>
            </div>
        </div>
    </body>
</html>
<%}else{%>
    <script>
        window.location.href = "/default.htm";
    </script>
<%}%>