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
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/departamento.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/estructuras.js?ver=1.0" type="text/javascript"></script>
        <script src="js/departamento.js?ver=1.1" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <style>
            div.mascara,#principal,div.smart-green{height:auto !important;min-height:200px !important;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="departamento encabezadoformulario" >Catálogo de Departamentos</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Departamentos" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoDepartamento()">Agregar</button>
                            <div class="scrollable" offset="270" style="clear:both;">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas">
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th><label class="dgagru ordenar">Dirección General</label> </th>
                                            <th ><label class="nombredep ordenar">Nombre</label></th>
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
                         <form id="frmNuevoDepartamento" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="departamento encabezadoformulario" >Crear Nuevo Departamento</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="columnaI scrollable" offset="310">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_departamento" class="clave" readonly onkeypress="return false;" onkeydown="return false;" />
                                    <label class="empresa">Empresa</label>
                                    <select id="cve_empresa" name="cve_empresa" class="empresa" onchange="LlenarCatalogoDga(document.getElementById('dgagru'), undefined, this.options[this.selectedIndex].value);"> </select>
                                    <label class="dgagru">Dirección General</label>  
                                    <select id="dgagru" name="dga_agru" class="dgagru" ><option value="0">Seleccione DGA</option></select>
                                    <label class="nombre">Nombre</label> 
                                    <input id="nombredep" name="nombredep" class="nombre" maxlength="79" placeholder="NombreDepartamento" />
                                </div>
                                <div class="columnaD scrollable" offset="310">
                                    <label class="ccostos">Centro Costos</label>  
                                    <input id="ccostos" name="c_costos" class="ccostos"  />
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarDepartamento()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarDepartamento()">Salir</button>
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
