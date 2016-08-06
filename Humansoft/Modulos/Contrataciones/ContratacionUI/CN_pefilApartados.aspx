<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
        <link href="css/perfilApartados.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
        <script src="js/perfilApartados.js?ver=1" type="text/javascript"></script>
        <script src="js/contrataciones.js?ver=1" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar(<%=Request["perfilApartados"]%>)" callbackInicio="<%=Request["callbackInicio"]%>">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="Apartado encabezadoformulario" >
                                Requisitos
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>
                            </h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Apartado" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoApartado()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th><label class="nivel ordenar">Apartado</label> </th>
                                            <th ><label class="maximo ordenar">Multivalor</label></th>
                                            <th><label class="minimo ordenar">Secuencia</label> </th>
                                            <th><label class="estatus ordenar">Estatus</label></th> 
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
                                <h2 class="Apartado encabezadoformulario" >Agregar Requisito</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="400">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="clave" class="clave" readonly onkeypress="return false;" onkeydown="return false;" />
                                    <label class="Nombre">Apartado</label>
                                    <input id="descripcion" name="descripcion" class="Nombre" maxlength="180" placeholder="Nombre"/>
                                    <label class="Nombre">Secuencia</label>  
                                    <input id="secuencia" name="secuencia" class="clave" maxlength="2" placeholder="Num." onkeypress="return SoloNumeros(event);" />
<%--                                    <label class="Multivalor">Tipo Multivalor</label>
                                    <input type="checkbox" id="Multivalor" name="Multivalor" value="true" class="Multivalor" />--%>
                                    <label class="tipocontrol" style="display:none">Tipo de Control</label>  
                                    <select class="tipocontrol" name="tipocontrol" style="display:none" id="tipocontrol">
                                    </select>
                                    <label class="lstCatalogos">Fuente de Datos</label>  
                                    <select class="lstcatalogos" name="lstcatalogos" id="lstcatalogos">
                                    </select>
                                    <label class="tipodatos">Tipo de catalogo</label>  
                                    <select class="tipocontrol" name="tipocatalogo" id="tipocatalogo">
                                    </select>
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarApartado()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarApartado()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
           </div>
       </div>
    <%}else {%>
        <item:comun ID="Comun1" runat="server" />
    <%}%>
    </body>
</html>
