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
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js" type="text/javascript"></script>
        <link href="css/cambiarpassword.css" rel="stylesheet" type="text/css" />

    </head>
    <body class="fondo" onload="MostrarTipoPasword('descripcionTipoPassword');">
        <div id="inicio">                  
            <div class="formulario ">
                    <form id="frmCambiarPassword" onsubmit="return false;">
                    <div class="alinear smart-green">
                        <h2 class="roles encabezadoformulario" >Cambio de contraseña</h2>
                        <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                        <div class="descripcion-password">
                            <h3>Tipo de contraseña asociado:</h3>
                            <p id="descripcionTipoPassword" ></p>
                        </div>
                        <div class="centrado">
                            <label class="clave">Contraseña anterior:</label>  
                            <input id="anteriorpassword" name="anteriorpassword" class="clave" placeholder="Contraseña anterior" maxlenght="20"/>
                            <label class="nombre">Nueva contraseña: </label> 
                            <input id="nuevopassword" name="nuevopassword" class="nombre" maxlength="20" placeholder="Nueva contraseña" />
                        </div>
                        <hr  class="cleaner"/>
                        <div class="barra-botones">
                            <span>
                                <button class="guardar btnFormularios" onclick="GuardarCambioPassword()">Guardar</button>
                                <button class="cancelar btnFormularios" onclick="CerrarSesion();">Salir</button>
                            </span>
                        </div>
                    </div>
                </form>
            </div> 
       </div> 
  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>        
    </body>
</html>

