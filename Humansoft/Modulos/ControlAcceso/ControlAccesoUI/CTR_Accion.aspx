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
        <link href="../../Estructuras/EstructurasUI/css/estructura.css" rel="stylesheet"type="text/css" />
        <link href="css/accion.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/accion.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="js/controlacceso.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara"> 
                <div class="principal" id="principal">
                    <div class="catalogo ventana">
                        <div class="smart-green">
                            <h2 class="lugartrabajo encabezadoformulario" >Catálogo de Acciones</h2>
                            <div class="scrollable" offset="160">
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las Acciones" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoAccion()">Agregar</button>
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="editar"> Editar</label> </th>
                                        <th><label class="clave ordenar">Clave</label> </th>
                                        <th ><label class="descripcion ordenar">Descripción</label></th> 
                                        <th ><label class="activo ordenar">Activo</label></th> 
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div></div>
                        </div>
                    </div>
                    <div class="formulario ventana">
                         <form id="frmNuevoAccion" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="lugartrabajo encabezadoformulario" >Crear Nueva Acción </h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="auxiliar scrollable" offset="310">
                                    <fieldset class="columnaI">
                                    <legend>Acciones</legend>
                                        <label class="clave">Clave</label>  
                                        <input id="clave" name="cve_accion" class="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="descripcion">Descripción</label> 
                                        <input id="descripcion" name="descripcion" class="descripcion" maxlength="79" placeholder="NombreAccion" />
                                        <span class="activo"><label>Activo</label>
                                        <input type="checkbox" name="activo" id="permitejustifica" value="true"/></span>
                                        <label class="estatus">Estatus</label> 
                                        <select id="estatus" name="cve_estatus" class="estatus" readonly onchange="LlenarCatalogoMunicipio(document.getElementById('municipio'),undefined,this.options[this.selectedIndex].value)"> </select> 
                                        <label class="tipoaccion">Tipo Acción</label> 
                                        <select id="tipoaccion" name="accion" class="tipoaccion" readonly> </select> 
                                    </fieldset>
                                </div>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarAccion()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarAccion()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>                
                </div>  
           </div>  
       </div> 
          <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
