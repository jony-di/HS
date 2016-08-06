<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url, Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
        <link href="css/registroPublicaciones.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css"/>

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>

        <script src="js/registroPublicaciones.js" type="text/javascript"></script>
        <script src="js/contrataciones.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar(<%=Request["Vacante"]%>)" callbackInicio="<%=Request["callbackInicio"]%>">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="CatalogoGenerico encabezadoformulario" >
                                Publicaciones de la vacante
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>
                            </h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los CatalogoGenerico" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="330">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Agencia</label> </th>
                                            <th><label class="nivel ordenar">Fecha</label> </th>
                                            <th ><label class="minimo ordenar">Vigencia</label></th>
                                            <th ><label class="maximo ordenar">Costo</label></th>
                                            <th><label class="estatus ordenar">Publicado por</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario ">
                        <form id="frmNuevo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="CatalogoGenerico encabezadoformulario" >Registro de publicacion</h2>
                                <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="430">
                                    <input type="hidden" name="cve_publico" id="cve_publico" value="" />
                                    <input type="hidden" name="cve_usuario" id="cve_usuario" value="1" />
                                    <label class="Nombre">Publicada en</label>
                                    <select name="agencia" id="agencia"></select>
                                    <label class="Valor">Fecha de publicacion</label>  
                                    <input id="fecha" name="fecha" maxlength="79" placeholder="dd/mm/yyyy" readonly="readonly" onkeypress="return false;" />
                                    <label class="Valor">Vigencia</label>  
                                    <input id="vigencia" name="vigencia" maxlength="79" placeholder="Num. de dias" onkeypress="return SoloNumerosEnteros(event);" />
                                    <label class="estatus">Publicado por</label>
                                    <input id="publicador" name="publicador" maxlength="79" placeholder="Nombre"/>
                                    <label class="estatus">Costo de publicacion</label> 
                                    <input id="costo" name="costo" class="Valor" maxlength="79" placeholder="0.00" onkeypress="return SoloNumeros(event);" />
                                    <label class="estatus">Comentarios</label> 
                                    <textarea id="comentario" name="comentario"></textarea>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="Guardar()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="Cancelar()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
           </div>
       </div>
  <% } else {%>
    <item:comun ID="Comun1" runat="server" />
<%}%>
    </body>
</html>
