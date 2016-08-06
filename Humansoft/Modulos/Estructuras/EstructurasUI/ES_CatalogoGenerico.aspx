﻿<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%
   // if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/CatalogoGenerico.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="js/CatalogoGenerico.js" type="text/javascript"></script>
       
        <script src="js/estructuras.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar(<%=Request["CatalogoGenerico"]%>)" callbackInicio="<%=Request["callbackInicio"]%>">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="CatalogoGenerico encabezadoformulario" >
                                Catálogo Generico
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>
                            </h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los CatalogoGenerico" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoCatalogoGenerico()">Agregar</button>
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="editar"> Editar</label> </th>
                                        <th><label class="clave ordenar">Clave</label> </th>
                                        <th><label class="nivel ordenar">Elemento</label> </th>
                                        <th ><label class="minimo ordenar">Valor Procipal</label></th>
                                        <th ><label class="maximo ordenar">Valor Secundario</label></th>  
                                        <th><label class="estatus ordenar">Estatus</label></th> 
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
                                <h2 class="CatalogoGenerico encabezadoformulario" >Agregar Elemeto al catalogo</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <label class="clave">Clave</label>  
                                <input id="clave" name="clave" class="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                <label class="Nombre">Nombre</label>  
                                <input id="descripcion" name="descripcion" class="Nombre" maxlength="79" placeholder="Nombre" />
                                <label class="Valor">Valor principal</label>  
                                <input id="Valor1" name="Valor1" class="Valor" maxlength="79" placeholder="Valor Principal" />
                                <label class="Valor">Valor secundario</label>  
                                <input id="Valor2" name="Valor2" class="Valor" maxlength="79" placeholder="Valor Secuandario" />
                                <label class="estatus">Estatus</label> 
                                <select class="estatus" name="activo" id="estatus"  >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                                <hr  class="cleaner"/>
                                <div class="barra-botones" style="margin-top:-8px;">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarCatalogoGenerico()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarCatalogoGenerico()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>                
                </div>  
           </div>  
       </div> 
  <%/*}else {%>
    <script>        window.location.href = "../default.htm";</script>
<%}*/%>        
    </body>
</html>
