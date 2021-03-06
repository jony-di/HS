﻿<%@ Page Language="C#" %>
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
        <link href="css/paqconcepto.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/paqconcepto.js" type="text/javascript"></script>
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
                            <h2 class="paqconceptos encabezadoformulario" >Catálogo de Paquete Conceptos</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Paquete Conceptos" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoPaqConcepto()">Agregar</button>
                            <div class="scrollable"  offset="270" >
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th><label class="dado ordenar">Dado en</label> </th>
                                            <th><label class="tipo ordenar">Tipo</label> </th>
                                            <th ><label class="descripcion ordenar">Descripcion</label></th> 
                                            <th ><label class="calculo ordenar">Calculo</label></th> 
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
                         <form id="frmNuevoPaqConcepto" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="paqconceptos encabezadoformulario" >Crear Nuevo Paquete Concepto</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="columnaI scrollable" offset="310">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_concepto" class="clave" readonly onkeypress="return false;" onkeydown="return false;" />
                                    <label class="dado">Dado en</label>  
                                    <input id="dado" name="cve_dado" class="dado"  />
                                    <label class="tipo">Tipo</label>  
                                    <input id="tipo" name="cve_tipo" class="tipo" />
                                </div>
                                <div class="columnaD scrollable" offset="310">
                                    <label class="descripcion">Descripción</label> 
                                    <input id="descripcion" name="descripcion" class="descripcion" maxlength="79" placeholder="Nombre Paq Concepto" />
                                    <label class="calculo">Calculo</label> 
                                    <input id="calculo" name="calculo" class="calculo" maxlength="79" placeholder="Calculo" />
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarPaqConcepto()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarPaqConcepto()">Salir</button>
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
