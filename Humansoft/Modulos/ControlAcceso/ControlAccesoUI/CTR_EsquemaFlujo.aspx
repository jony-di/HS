<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> 
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js?ver=1.0"></script>
        <script src="js/controlacceso.js"></script>
        <script src="js/flujos.js?ver=1.10" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.1" rel="stylesheet" type="text/css" />
        <link href="css/esquemaFlujo.css" rel="stylesheet" />        
    <title></title>
</head>
<body onload="Pasos.MostrarEsquemaFlujo(document.getElementById('esquemaFlujo'),'<%=Request["cve_flujo"]%>');">
    <div>
        <div class="ventana">
            <div class="smart-green" >
                <h2 class="encabezadoformulario" >Esquema de Flujo</h2>
                <div class="flujo scrollable" offset="270" id="esquemaFlujo" style="margin-bottom:20px;"></div>
                <div class="barra-botones">
                    <span style="width:100px;">
                        <button class="cancelar btnFormularios" onclick="window.parent.DesplazarElemento('principal',0)">Salir</button>
                    </span>
                </div>
            </div>
        </div>
    </div>
              <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
</body>
</html>
