<%@ Page Language="C#" %>
<%@ Register TagPrefix="item" TagName="comun" Src="VacacionesDerecho.ascx" %>
<%@ Register TagPrefix="vacacionesderecho" TagName="comun" Src="EncabezadoVacaciones.ascx" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
     <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="js/vacaciones.js" type="text/javascript"></script>
    <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
    </style>
    <script>
        window.onload = function () {
            ObtenerEncabezadoEmpledo(5168);
            ObtenerDiasDerecho(5168, "diasderecho");
        }
    </script>
</head>
<body>
    <div id="inicio" >
        <!--<span style="width:860px;display:block;margin:auto;padding:20px;"><input id="idEmpleado"/> <button onclick="ObtenerEncabezadoEmpledo(document.getElementById('idEmpleado').value);">Ir</button></span>-->
        <div class="mascara">
            <div class="principal" id="principal">
                <div class="smart-green" id="formularioSolicitud">
                    <h2 class="encabezadoformulario">Periodos de Vacaciones</h2>
                     <fieldset class="info"><legend>Datos del empleado</legend>
                        <vacacionesderecho:comun runat="server" /></vacacionesderecho:comun>                       
                        <hr />
                    </fieldset>

                    <fieldset class="info"><legend>Desglose de periodos</legend>
                        <item:comun runat="server" /></item:comun>                                         
                        <hr />
                    </fieldset>

                </div>
            </div>
        </div>
    </div>
              <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
</body>
</html>
        
