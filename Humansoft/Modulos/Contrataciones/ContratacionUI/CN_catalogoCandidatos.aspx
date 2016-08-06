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
    <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
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
                        <h2 class="CatalogoGenerico encabezadoformulario">
                            Candidatos de
                            <%= Request["vacante"].ToString().ToLower() %>
                            <button class="btnFormularios regresar" id="regreza">
                                Actializar</button>
                        </h2>
                        <div id="notificacion" class="alert-box error ocultar">
                            <span id="mensaje-alerta">.</span></div>
                        <div id="tabs" class="tabs">
                            <ul>
                                <li><a href="#tabs-1">Nuevos</a></li>
                                <li><a href="#tabs-2">En proceso</a></li>
                                <li><a href="#tabs-3">Rechazados</a></li>
                            </ul>
                            <div id="tabs-1">
                                <div class="book" id="Nuevos">
                                </div>
                            </div>
                            <div id="tabs-2">
                                <div class="book" id="EnProceso">
                                </div>
                            </div>
                            <div id="tabs-3">
                                <div class="book" id="Rechzados">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="formulario" id="formulario">
                    <form id="frmNuevo" onsubmit="return false;">
                    <div class="alinear smart-green">
                        <h2 class="grado encabezadoformulario">
                            Informacion del candidato
                            <button class="btnFormularios regresar" onclick="Cancelar()">
                                Regrezar</button>
                        </h2>
                        <div class="book" style="height: 500px; clear: both;">
                            <div id="dipe850502" class="car expandir">
                                <div class="cuerpo">
                                    <div class="cabeza">
                                        <img src="" id="foto-candidato">
                                        <div class="datos">
                                            <div class="columnaI">
                                                <label class="etiquetas-azules">
                                                    Nombre:</label>
                                                <label class="etiquetas-grises" id="lbl-nombre">
                                                </label>
                                                <label class="etiquetas-azules">
                                                    email:</label>
                                                <label class="etiquetas-grises" id="lbl-email">
                                                </label>
                                                <label class="etiquetas-azules">
                                                    Tel:</label>
                                                <label class="etiquetas-grises" id="lbl-tel">
                                                </label>
                                                <label class="etiquetas-azules">
                                                    Sexo:</label>
                                                <label class="etiquetas-grises" id="lbl-sexo">
                                                </label>
                                                <label class="etiquetas-azules">
                                                    Fecha de nacimiento:</label>
                                                <label class="etiquetas-grises" id="lbl-fecha">
                                                </label>
                                            </div>
                                            <div class="columnaD">
                                                <label class="etiquetas-azules">
                                                    Estado:</label>
                                                <label class="etiquetas-grises" id="lbl-estado">
                                                </label>
                                                <label class="etiquetas-azules">
                                                    Mumunicipio:</label>
                                                <label class="etiquetas-grises" id="lbl-minicipio">
                                                </label>
                                                <label class="etiquetas-azules">
                                                    Nivel de Estudios:</label>
                                                <label class="etiquetas-grises" id="lbl-nivel">
                                                </label>
                                                <label class="etiquetas-azules">
                                                    Condición académica:</label>
                                                <label class="etiquetas-grises" id="lbl-status">
                                                </label>
                                                <img class="etiquetas-grises" id="ver_cv" style="width: 40px; height: 40px; cursor: pointer;
                                                    float: left" src="../../../Recursos/imagenes/perfiles.png" />
                                                <img class="etiquetas-grises" id="ver_perfil" style="width: 40px; height: 35px; cursor: pointer;
                                                    float: left" src="../../../Recursos/imagenes/perfil.png" />
                                            </div>
                                            <br />
                                        </div>
                                    </div>
                                    <div class="datos2">
                                    </div>
                                </div>
                            </div>
                            <div class="flujo">
                                <div style="width: 5000px;">
                                    <span class="pasos extremos">
                                        <label>
                                            Inicio</label>
                                    </span><span class="pasos flecharDerecha"></span>
                                    <div style="display: inline-block;" id="fujomapa">
                                    </div>
                                    <span class="pasos extremos">
                                        <label>
                                            Fin</label></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
                <div class="ocultar" id="updatebox">
                    <div class="updatebox">
                        <div class="title">
                            <h2>
                                Actualizar Candidatos</h2>
                        </div>
                        <div class="internal">
                            <p>
                                Seleccione la agencia de la cual desea obtener los candidatos.<br />
                                <span class="warning2">¡Advertencia!<br />
                                    El proceso de obtención de candidatos puede tardar varios minutos. El sistema le
                                    notificara cuando termine
                                    <br />
                                    Puede seguir trabajando </span>
                            </p>
                            <label class="agencias">
                                Agencias:</label>
                            <select id="agencias">
                                <option value="1" selected="selected">Bolsa Equipat</option>
                            </select>
                            <br />
                            <button class="btn agregar" onclick="irPorCandidatos()">
                                Actualizar</button>
                        </div>
                    </div>
                </div>
                <div class="ocultar" id="Registro">
                    <div class="updatebox">
                        <div class="title">
                            <h3 id="titulo">
                                ¡Registro de actividad!</h3>
                        </div>
                        <div class="internal smart-green">
                            <div id="divsubetapas">
                                <label for="subetapas">
                                    Sub-Etapa</label>
                                <select id="subetapas" onchange="seleccion(this)">
                                    <option>Validación de referencias</option>
                                </select>
                            </div>
                            <div id="cat_rechazo" class="ocultar">
                                <p>
                                    Por favor indique el motivo del rechazo
                                </p>
                                <label for="motivo_rechazo">
                                    Motivo</label>
                                <select id="motivo_rechazo">
                                    <option>No cumple con el perfil</option>
                                </select>
                            </div>
                            <div id="archivo" class="ocultar">
                                <p>
                                    Ingrese el archivo escaneado</p>
                                <div class="fileUpload btn agregar">
                                    Agregar
                                    <input type="file" class="upload" name="perfilscan" id="perfilscan" onchange="CargarEscaneo()"
                                        accept=".gif,.jpeg,.jpg,.png" />
                                </div>
                                <input type="text" disabled="disabled" id="pathfile" placeholder="No se a seleccionado archivo"
                                    size="30" />
                            </div>
                            <label class="agencias">
                                Resumen de la actividad</label><br />
                            <textarea rows="4" cols="40" id="resumen"></textarea>
                            <br />
                            <input  type="hidden" id="pagina" value="" />
                            <input  type="hidden" id="cve_subestado" value="" />
                            <input  type="hidden" id="subestado" value="" />
                            <button class="btn agregar" style="margin-right: 20px" onclick="Guardar()">
                                Gardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</body>
</html>
<% }
   else
   { %><item:comun ID="Comun1" runat="server" />
<%}%>