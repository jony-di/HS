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
        <link href="css/tipopassword.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/tipopassword.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="tipopassword encabezadoformulario" >Catálogo de TipoPassword</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Tipopassword" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoTipoPassword()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th><label class="descripcion ordenar">Descripción</label> </th>
                                            <th><label class="nombre ordenar">Nombre</label></th> 
                                            <th><label class="validaanterior ordenar">ValidaAnterior</label></th> 
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario">
                         <form id="frmNuevoTipoPassword" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="tipopassword encabezadoformulario" >Crear Nuevo TipoPassword</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="330">
                                    <label class="clave">Clave</label>  
                                    <input id="cve_tipopassword" name="cve_tipopassword" class="clave"  readonly/>
                                    <label class="descripcion">Descripción</label> 
                                    <input id="descripcion" name="descripcion" class="descripcion" placeholder="Descripción"/>
                                    <label class="nombre">Nombre</label>  
                                    <input id="nombre" name="nombre" class="nombre" placeholder="Nombre" />
                                    <label class="validaanterior">Valida Anterior</label> 
                                    <select class="validaanterior" name="validaanterior" id="validaanterior"  >
                                        <option value="true">Si</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarTipoPassword()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarTipoPassword()">Salir</button>
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
