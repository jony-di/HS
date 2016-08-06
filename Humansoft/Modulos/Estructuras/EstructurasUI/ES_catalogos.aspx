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
        <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/catalogos.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/catalogos.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js" type="text/javascript"></script>
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
                            <h2 class="puesto encabezadoformulario" >Catálogos</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Catalogos" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="editar"> Editar</label> </th>
                                        <th><label class="clave ordenar">Clave</label> </th>
                                        <th ><label class="descripcion ordenar">Descripción</label></th>
                                        <th ><label class="selecccionar">Selecccionar</label></th>
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario ">
                         <form id="frmNuevo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="control encabezadoformulario" >Crear Nuevo Catalogo</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_tipocontrol" class="clave" readonly onkeypress="return false;" onkeydown="return false;" />
                                    <label class="descripcion">Descripción</label>  
                                    <input id="descripcion" name="descripcion" class="descripcion"  />
                                <hr  class="cleaner"/>
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
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>  
    </body>
</html>
