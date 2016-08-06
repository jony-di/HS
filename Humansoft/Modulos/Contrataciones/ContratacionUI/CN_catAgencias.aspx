<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <!-- CSS -->
    <link href="css/contrataciones.css" type="text/css" rel="stylesheet"/>
    <link href="../../../Recursos/css/paginate.css" type="text/css" rel="stylesheet"/>
    <link href="../../../Recursos/css/tema.css" type="text/css" rel="stylesheet"/>
    <link href="css/cat_Agencias.css" type="text/css" rel="stylesheet" />

    <!-- Scripts -->
    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
    <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
    <script src="js/contrataciones.js?ver=1" type="text/javascript"></script>
    <script src="js/cat_Agencias.js?ver=1" type="text/javascript"></script>

    <!-- Other scripts -->
</head>
<body class="fondo" onload="iniciar()">
    <div id="inicio">
        <div class="mascara">
            <div class="principal" id="principal">
                <div class="catalogo">
                    <div class="smart-green">
                        <h2 class="CatalogoGenerico encabezadoformulario">Catálogo Generico</h2>
                        <div class="busqueda">
                            <input class="buscar" id="buscar" placeholder="Buscar en todas las Agencias" onkeyup="buscarCoincidencias(event,this);" />
                        </div>
                        <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">
                            Agregar</button>
                        <table class="lista" id="tableCatalogo">
                            <thead>
                                <tr class="columnas">
                                    <th>
                                        <label class="editar">
                                            Editar</label>
                                    </th>
                                    <th>
                                        <label class="clave ordenar">
                                            Clave</label>
                                    </th>
                                    <th>
                                        <label class="nivel ordenar">
                                            Nombre</label>
                                    </th>
                                    <th>
                                        <label class="maximo ordenar">
                                            Pagina</label>
                                    </th>
                                    <th>
                                        <label class="estatus ordenar">
                                            Estatus</label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="contenedorLista">
                            </tbody>
                        </table>
                        <div class='paginador' id='paginador' total='0' criterio='%' tampagina='5'>
                        </div>
                    </div>
                </div>
                <div class="formulario ">
                    <form id="frmNuevo" onsubmit="return false;">
                    <div class="alinear smart-green">
                        <h2 class="CatalogoGenerico encabezadoformulario">
                            Agregar Elemeto al catalogo</h2>
                        <div id="notificacion" class="alert-box error ocultar">
                            <span id="mensaje-alerta">.</span></div>
                        <div class="columnaI">
                            <label class="clave">
                                Clave</label>
                            <input id="cve_agencia" name="cve_agencia" class="clave" readonly="readonly" onkeypress="return false;"
                                onkeydown="return false;" />
                            <label class="Nombre">
                                Nombre</label>
                            <input id="nombre" name="nombre" class="Nombre" maxlength="79" placeholder="Nombre" />
                            <label class="estatus">
                                Estatus</label>
                            <select class="estatus" name="activa" id="activa">
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                        <div class="columnaD">
                            <label class="Valor">
                                Pagina</label>
                            <input id="pagina" name="destino" class="Valor" maxlength="79" placeholder="donde se publicara" />
                            <label class="Valor">
                                Usuario</label>
                            <input id="usuario" name="usuario" class="Valor" maxlength="79" placeholder="Para publicar" />
                            <label class="Valor">
                                Contraseña</label>
                            <input id="password" name="password" type="password" class="Valor" maxlength="79" placeholder="Para publicar" />
                            <div class="extra" id="mostrarEscaneo" class="ocultar">
                                <fieldset style="float: left;" id="escaneo">
                                    <legend>Instalar Plugin</legend>
                                    <div class="fileUpload btn agregar">
                                        Agregar
                                        <input type="file" class="upload" name="perfilscan" id="perfilscan" onchange="CargarEscaneo()"
                                            accept=".dll,.zip" />
                                    </div>
                                    <input type="text" disabled="disabled" id="pathfile" placeholder="No se a seleccionado archivo"
                                        size="30" />
                                </fieldset>
                            </div>
                            <div id="archivoescaneado" class="ocultar">
                                <fieldset style="float: left;">
                                    <legend>Plugin</legend>
                                    <img src="../../../Recursos/imagenes/eliminar.png" class="eliminar" title="Borar archivo" onclick="eliminarEscaneo()" />
                                    <a id="ligaEscaneo" href="#">Desintalar el plugin</a>
                                </fieldset>
                            </div>
                        </div>
                        <br />
                        <hr class="cleaner" />
                        <div class="barra-botones">
                            <span>
                                <button class="guardar btnFormularios" onclick="Guardar()">
                                    Guardar</button>
                                <button class="cancelar btnFormularios" onclick="Cancelar()">
                                    Salir</button>
                            </span>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <%} else {%>
        <item:comun ID="Comun1" runat="server" />
    <%}%>
</body>
</html>
