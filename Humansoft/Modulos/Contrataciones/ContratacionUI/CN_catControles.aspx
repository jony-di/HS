<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
        <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
        <link href="css/catcontroles.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="js/catcontroles.js" type="text/javascript"></script>
        <script src="js/contrataciones.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="puesto encabezadoformulario" >Catálogo de Controles</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Controles" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th ><label class="descripcion ordenar">Descripción</label></th>
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
                                <h2 class="control encabezadoformulario" >Crear Nuevo Controles</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="330">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_tipocontrol" class="clave" readonly onkeypress="return false;" onkeydown="return false;" />
                                    <label class="descripcion">Descripción</label>  
                                    <input id="descripcion" name="descripcion" class="descripcion"  />
                                    <hr  class="cleaner"/>
                                </div>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarControles()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarControles()">Salir</button>
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
