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
        <link href="css/seguridad.css" rel="stylesheet" type="text/css" />
        <link href="css/roles.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/roles.js?ver=1.2" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js?ver=1.2" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <style>            
            div.mascara,#principal,div.smart-green{height:auto !important;min-height:200px !important;}
            div.mascara div.principal div.formulario div.barra-botones{margin-top:0px;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="roles encabezadoformulario" >Catálogo de Rol</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Roles" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoRole()">Agregar</button>
                            <div class="scrollable" offset="270">
                            <table class="listaN" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="editar"> Editar</label> </th>
                                        <th><label class="clave ordenar">Clave</label> </th>
                                        <th ><label class="nombre ordenar">Nombre</label></th> 
                                        <th ><label class="nombre ordenar">Modulo</label></th> 
                                        <th><label class="estatus ordenar">Estatus</label></th> 
                                        <th><label class="eliminar">Eliminar</label></th>
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5' ></div>
                        </div>
                    </div>
                    <div class="formulario ">
                         <form id="frmNuevoRoles" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="roles encabezadoformulario" >Crear Nuevo Rol</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="330">
                                    <label class="nombre">Módulo</label> 
                                    <select id="selectModulos" name="cve_modulo" style="width:250px;float:left;" onchange="MostrarSiguienteClave(this.options[this.selectedIndex].value);return false;"></select>
                                    <label class="clave" style="clear:left;">Clave</label>
                                    <input id="clave" name="cve_role" class="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    <label class="nombre">Nombre</label> 
                                    <input id="nombrerole" name="nombrerole" class="nombre" maxlength="79" placeholder="NombreRole" />
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarRole()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarRole()">Salir</button>
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
