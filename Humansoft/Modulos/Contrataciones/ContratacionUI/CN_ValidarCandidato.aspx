<%@ Page Language="C#" %>

<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>
<% if (Validacion.ValidarPermisoMenu(Request.Url, Session["cve_usuario"]))
   { %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <!-- CSS -->
    <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
    <link href="css/CAT_Candidatos.css?ver=1" rel="stylesheet" type="text/css" />
    <!-- Scripts -->
    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
    <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
    <script src="js/contrataciones.js?ver=1" type="text/javascript"></script>
    <script src="js/CAT_Candidatos.js?ver=1" type="text/javascript"></script>
    <!-- Other scripts -->
    <script type="text/javascript">
        $(function () {
            $("#tabs").tabs();
        });
    </script>
    <style>
        .examenes
        {
            width: 100%;
            padding: 10px;
            border-left: 10px solid #cec7c7;
            box-shadow: #cec7c7 0px 2px;
            margin-bottom: 50px;
        }
        .examenes li:hover
        {
            font-weight: bolder;
            cursor: pointer;
        }
    </style>
</head>
<body class="fondo" onload="iniciar(<%=  String.Format("{0},{1}", Request["puesto"] !=null ? Request["puesto"].ToString() : "0" , Request["numplantilla"] !=null ? Request["numplantilla"].ToString() : "0") %>)">
    <div id="inicio">
        <div class="mascara">
            <div class="principal" id="principal">
                <div class="catalogo">
                    <div class="smart-green">
                        <h2 class="encabezadoformulario">
                            <span id="nombre"></span>
                            <button class="btnFormularios regresar" onclick="Cancelar()">Regrezar</button>
                        </h2>
                        <form id="frmNuevo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="grado encabezadoformulario">
                                    Informacion del candidato
                                    <button class="btnFormularios regresar" onclick="Cancelar()">Regrezar</button>
                                </h2>
                                <label for="resumen">Resumen de actividad</label>
                                <textarea rows="5" cols="8" id="resumen">
                                </textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
</body>
</html>
<% }
   else
   { %><item:comun ID="Comun1" runat="server" />
<%}%>