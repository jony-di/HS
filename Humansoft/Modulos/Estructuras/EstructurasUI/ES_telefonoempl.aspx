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
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="js/estructuras.js" type="text/javascript"></script>
        <script src="js/telefonoempl.js" type="text/javascript"></script>
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/telefonoempl.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../SeguridadUI/css/tema.css" rel="stylesheet" type="text/css" />
    </head>
    <body class="fondo" onload="iniciar(<%=Request["id_empleado"]%>)">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="telefonoempl encabezadoformulario" >Teléfonos Empleados <button class="btnFormularios regresar" id="btnregresar" onclick="window.parent.DesplazarElemento('principal',-900);">Regresar</button></h2>
                            <!--<div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las Direcciones" onkeyup="buscarCoincidencias(event,this);"/> </div>-->                                                                                   
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevaTelefonoEmpl()">Agregar</button> 
                            <fieldset class="info-empleado">
                                <legend>Información del empleado</legend>
                                <h3 class="nombreEmpleado">Id de empleado: <b id="idEmpleado"><%=Request["id_empleado"]%></b></h3>
                                <h3 class="nombreEmpleado">Nombre: <%=Request["nombre"]%></h3>
                            </fieldset>
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="editar"> Editar</label></th>
                                        <th><label class="telefonoempl ordenar">Teléfono</label></th>
                                        <th><label class="empleado ordenar">No.Empleado</label></th>
                                        <th><label class="area ordenar">Area</label> </th>
                                        <th><label class="ntelefono ordenar">N.Teléfono</label> </th>
                                        <th><label class="tipollamada ordenar">TipoLLamada</label> </th>
                                        <th><label class="estatus ordenar">Estatus</label> </th>
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            <div class='paginador' id="paginador"  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario">
                         <form id="frmNuevaTelefonoEmpl" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="telefono encabezadoformulario" >Crear Teléfono</h2>
                            	    <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                    <div class="auxiliar">
                                      <div class="columnaI">
                                        <label class="telefonoempl">Teléfono</label> 
                                        <input id="telefonoempl" name="cve_telefono" class="telefonoempl" maxlength="79" readonly  onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="empleado">No.Empleado</label> 
                                        <input id="empleado" name="id_empleado" class="empleado" maxlength="79" readonly  onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="area">Area</label> 
                                        <input id="area" name="area"  class="area" maxlength="79" placeholder="Area" />
                                        <label class="ntelefono">N.Teléfono</label> 
                                        <input id="ntelefono" name="no_telefono" class="ntelefono" maxlength="79" placeholder="Teléfono" />
                                        <label class="fecha">Fecha</label> 
                                        <input id="fecha" name="fecha" class="fecha" maxlength="79" readonly />
                                      </div>
                                      <div class="columnaD">
                                        <label class="tipored">TipoRed</label> 
                                        <select id="tipored" name="tipored" class="tipored" readonly> 
                                           <option value="1">telcel</option>
                                           <option value="2">movistar</option>
                                        </select> 
                                        <label class="tipollamada">TipoLLamada</label> 
                                        <select id="tipollamada" name="tipoLlamada_id" class="tipollamada" readonly>
                                        <option value="1">casa</option>
                                        <option value="2">celular</option>
                                         </select> 
                                        <label class="extension">Extensión</label> 
                                        <input id="extension" name="extension" class="extension" /> 
                                        <label class="estatus">Estatus</label> 
                                        <select class="estatus" name="activo" id="estatus"  >
                                            <option value="true">Activo</option>
                                            <option value="false">Baja</option>
                                        </select>
                                      </div>
                                    </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarTelefonoEmpl()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarTelefonoEmpl()">Salir</button>
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
