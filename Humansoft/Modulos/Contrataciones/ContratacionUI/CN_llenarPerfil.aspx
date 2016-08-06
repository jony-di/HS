<%@ Page Language="C#" %>

<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>
<% if (Validacion.ValidarPermisoMenu(Request.Url, Session["cve_usuario"]))
   { %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
    <link href="css/llenarPerfil.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    
    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/jquery.base64.js" type="text/javascript"></script>
    <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="js/llenarform.js?ver=1" type="text/javascript"></script>
    <script src="js/contrataciones.js?ver=1" type="text/javascript"></script>
</head>
<body class="fondo" onload="iniciar(<%=Request["numplantilla"] %>,<%=Request["numpuesto"] %>);"
    callbackinicio="<%=Request["callbackInicio"]%>">
    <div id="inicio">
        <div class="mascara">
            <div class="principal" id="principal">
                <div class="formulario ">
                    <form id="frmNuevo" onsubmit="return false;">
                        <div class="alinear smart-green">
                            <h2 class="Apartado encabezadoformulario">
                                Descripcion de puesto
                                <button class="btnFormularios regresar" id="regresar" style="display: none" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">
                                    Regresar</button>
                            </h2>
                            <div id="notificacion" class="alert-box error ocultar">
                                <span id="mensaje-alerta">.</span></div>
                            <div id="dinamicform" class="scrollable" runat="server">
                                <div style="border: 5px none #c9c9c9; width: 80%; margin: auto;">
                                    <h3 style="margin-bottom: -2px; padding: 0px;">
                                        INFORMACION DEL PUESTO</h3>
                                    <table cellspacing="0" style="border: 1px solid #c9c9c9; margin: auto">
                                        <tr>
                                            <th style="background: #e9e9e9; width: 150px; text-align: left; padding: 20px; border-bottom: 1px solid #c9c9c9;">
                                                Nombre del puesto
                                            </th>
                                            <td style="padding: 20px; border-bottom: 1px solid #c9c9c9; width: 70%;">
                                                <%=Request["nompuesto"] %>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style="background: #e9e9e9; width: 150px; text-align: left; padding: 20px; border-bottom: 1px solid #c9c9c9;">
                                                Fecha
                                            </th>
                                            <td style="padding: 20px; border-bottom: 1px solid #c9c9c9; width: 70%;" id="Fecha">
                                                17/11/2015
                                            </td>
                                        </tr>
                                    </table>
                                    <br />
                                </div>
                            </div>
                            <input type="hidden" id="fechaCreacion" name="fechaCreacion" value="" />
                            <hr class="cleaner" />
                            <div class="barra-botones">
                                <span>
                                    <button class="btnFormularios regresar" id="imprmimir" style="display: none" onclick="imprimirPDF();">
                                        Imprimir</button>
                                    <button id="guardar" class="guardar btnFormularios" onclick="Guardar()">
                                        Guardar</button>
                                    <button id="cancelar" class="cancelar btnFormularios" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">
                                        Salir</button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <% }
   else
   {%>
    <item:comun ID="Comun1" runat="server" />
    <%}%>
</body>
</html>
