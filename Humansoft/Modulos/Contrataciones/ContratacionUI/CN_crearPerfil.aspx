<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url, Session["cve_usuario"]))
   { %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <link href="css/contrataciones.css?ver=1" rel="stylesheet" type="text/css" />
    <link href="css/crearPerfil.css?ver=1" rel="stylesheet" type="text/css" />
    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
    <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
    <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
    <script src="js/crearPerfil.js?ver=1" type="text/javascript"></script>
    <script src="js/contrataciones.js?ver=1" type="text/javascript"></script>
</head>
<body class="fondo" onload="iniciar(<%=Request["Plantilla"]%>)" callbackinicio="<%=Request["callbackInicio"]%>">
    <div id="inicio">
        <div class="mascara">
            <div class="principal" id="principal">
                <div class="catalogo ventana">
                    <div class="smart-green">
                        <h2 class="Apartado encabezadoformulario">
                            Secciones del Perfil
                            <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">
                                Regresar</button>
                        </h2>
                        <div id="notificacion" class="alert-box error ocultar">
                            <span id="mensaje-alerta">.</span></div>
                        <fieldset class="info">
                            <div class="marco">
                                <img  class="logo" id="logo" alt="No se encontró logo" title="Logo" />
                            </div>
                            <div style="width:70%;">
                                <legend>Datos del perfil</legend>
                                <label class="etiquetas">
                                    Nombre del perfil:</label>
                                <label class="campos" id="lblPuesto">
                                    </label>
                                <label class="etiquetas">
                                    Empresa:</label>
                                <label class="campos" id="lblEmpresa">
                                    SD</label>
                                <label class="etiquetas">
                                    Logo:</label>
                                <div>
                                    <div class="fileUpload btn agregar">Agregar
                                        <input type="file" class="upload" name="perfilscan" id="perfilscan" accept="image/*" />
                                    </div>
                                    <input type="text" disabled="disabled" style="display:block;float:left;width:150px;" id="pathfile" placeholder="No se a seleccionado archivo" size="30" />
                                </div>
                            </div>
                            
                        </fieldset>

                        <button class="btn agregar" id="btnagregar" onclick="MostrarSeleccionSecciones()">
                            Agregar</button>
                        <hr class="cleaner" />
                        <div class="Secciones">
                            <div id="contenedorLista">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%}
   else
   {%>
        <item:comun id="Comun1" runat="server" />
    <%}%>
</body>
</html>
