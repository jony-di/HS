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
        <script src="js/diasferiados.js?ver=1.0" type="text/javascript"></script>
        <link href="css/diasferiados.css?ver=1.0" rel="stylesheet" type="text/css" />
        <link href="css/vacaciones.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="js/vacaciones.js?ver=1.0" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/layoutGenerico.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio">
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="politicas encabezadoformulario" >Catálogo de Días Feriados</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en Días Feriados" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="270">
                            <table class="listaN" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="editar ordenar  "> Editar</label> </th>
                                        <th><label class="clave ordenar">Clave</label> </th>
                                        <th ><label class="fecha ordenar">Fecha</label></th>        
                                        <th ><label class="descripcion ordenar">Descripción</label></th> 
                                        <th ><label class="descripcion ordenar">Medio día</label></th> 
                                        <th ><label class="descripcion ordenar">Aplíca</label></th> 
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario" id="formulario">
                         <form id="frmNuevo" onsubmit="return false;" >
                            <div class="alinear smart-green" >
                                <h2 class="grado encabezadoformulario" >Crear Nuevo Día Feriado</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="310">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="clave" class="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    <label class="fecha">Fecha</label> 
                                    <input id="fecha" name="fecha" class="fecha" maxlength="79" placeholder="Fecha" />
                                    <label class="descripcion">Descripción</label> 
                                    <input id="descripcion" name="descripcion" class="descripcion" maxlength="79" placeholder="Descripción" />
                                    <label class="medioDia" style="float:left;clear:left;">Medio Día</label> 
                                    <input id="mediodia" type="checkbox" name="medioDia" value="true" class="medioDia" maxlength="79" placeholder="Descripción"  style="float:left;height:auto;margin-left:80px;margin-top:10px;"/>
                                    <label class="medioDia" style="float:left;clear:left;">Aplica para</label> 
                                    <select class="cve_aplica" name="cve_aplica" id="cve_aplica" style="width:220px;float:left;margin-left:60px;"></select>
                                    <select class="estatus" name="activo" id="estatus"  style="width:150px;float:left;margin-left:128px;margin-top:15px;clear:left;">
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
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
                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar" frameborder="0" scrolling="no" ></iframe>  
                </div>  
           </div>  
       </div> 
          <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
