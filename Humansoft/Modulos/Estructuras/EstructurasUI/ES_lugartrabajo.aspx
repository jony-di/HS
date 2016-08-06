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
        <link href="css/lugartrabajo.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/lugartrabajo.js?ver=1.0" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js?ver=1.0" type="text/javascript"></script>
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
                            <h2 class="lugartrabajo encabezadoformulario" >Catálogo de Lugar Trabajo</h2>
                            <div class="scrollable" offset="160">
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos las Lugar Trabajo" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoLugarTrabajo()">Agregar</button>
                            <div class=" scrollable" offset="310">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="lugartrabajo ordenar">Clave</label> </th>
                                            <th ><label class="descripcion ordenar">Descripción</label></th> 
                                            <th><label class="estatus ordenar">Estatus</label></th> 
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div></div>
                        </div>
                    </div>
                    <div class="formulario ventana">
                         <form id="frmNuevoLugarTrabajo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="lugartrabajo encabezadoformulario" >Crear Nuevo Lugar Trabajo </h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="auxiliar scrollable" offset="270">
                                    <fieldset class="columnaI">
                                    <legend>Lugar</legend>
                                        <label class="lugartrabajo">Clave</label>  
                                        <input id="lugartrabajo" name="cve_lugar" class="lugartrabajo" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="descripcion">Descripción</label> 
                                        <input id="descripcion" name="descripcion" class="descripcion" maxlength="79" placeholder="NombreLugarTrabajo" />
                                        <label class="estatus">Estatus</label> 
                                        <select class="estatus" name="activo" id="estatus"  >
                                           <option value="true">Activo</option>
                                           <option value="false">Inactivo</option>
                                        </select>
                                    </fieldset>
                                    <fieldset class="columnaD">
                                        <legend>Dirección</legend>
                                        <label class="calle">Calle</label> 
                                        <input id="calle" name="calle"  class="calle" maxlength="79" placeholder="Calle" />
                                        <label class="entrecalles">EntreCalles</label> 
                                        <input id="entrecalles" name="entrecalles"  class="entrecalles" maxlength="79" placeholder="EntreCalles" />
                                        <label class="estado">Estado</label> 
                                        <select id="estado" name="cveestado" class="estado" readonly onchange="LlenarCatalogoMunicipio(document.getElementById('municipio'),undefined,this.options[this.selectedIndex].value)"> </select> 
                                        <label class="municipio">Delg. Munic.</label> 
                                        <select id="municipio" name="cve_municipio" class="municipio" readonly> </select> 
                                        <label class="colonia">Colonia</label> 
                                        <input id="colonia" name="colonia" class="colonia" maxlength="79" placeholder="Colonia" />
                                        <label class="cp">CP</label> 
                                        <input id="cp" name="cp" class="cp" maxlength="79" placeholder="CP" />
                                    </fieldset>
                                </div>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarLugarTrabajo()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarLugarTrabajo()">Salir</button>
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
