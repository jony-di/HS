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
        <link href="css/estructura.css?ver=1.0" rel="stylesheet" type="text/css" />
        <link href="css/estado.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/estado.js?ver=1.0" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js?ver=1.0" type="text/javascript"></script>
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
                            <h2 class="estado encabezadoformulario" >Catálogo de Estados</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Estados" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoEstado()">Agregar</button>
                            <div class=" scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="estado ordenar">Clave</label> </th>
                                            <th ><label class="nombre ordenar">Nombre</label></th> 
                                            <th ><label class="pais ordenar">Pais</label></th> 
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
                         <form id="frmNuevoEstado" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="estado encabezadoformulario" >Crear Nuevo Estado</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class=" scrollable" offset="310">
                                    <label class="estado">Clave</label>  
                                    <input id="estado" name="cveestado" class="estado" readonly />
                                    <label class="nombre">Descripción</label> 
                                    <input id="nombre" name="nombreestado" class="nombre" maxlength="79" placeholder="NombreEstado" />
                                    <label class="pais">País</label>  
                                    <select id="pais" name="cvepais" class="pais"> </select>
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarEstado()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarEstado()">Salir</button>
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
