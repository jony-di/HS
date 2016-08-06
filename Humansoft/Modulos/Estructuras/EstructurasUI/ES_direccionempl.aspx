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
        <script src="js/direccionempl.js" type="text/javascript"></script>

        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/direccionempl.css" rel="stylesheet" type="text/css" />
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
                            <h2 class="direccionempl encabezadoformulario" >Dirección Empleados <button class="btnFormularios regresar" id="btnregresar" onclick="window.parent.DesplazarElemento('principal',-900);">Regresar</button></h2>
                            <!--<div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las Direcciones" onkeyup="buscarCoincidencias(event,this);"/> </div>-->                                                                                   
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevaDireccionEmpl()">Agregar</button> 
                            <fieldset class="info-empleado">
                                <legend>Información del empleado</legend>
                                <h3 class="nombreEmpleado">Id de empleado: <b id="idEmpleado"><%=Request["id_empleado"]%></b></h3>
                                <h3 class="nombreEmpleado">Nombre: <%=Request["nombre"]%></h3>
                            </fieldset>
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th><label class="editar"> Editar</label></th>
                                        <th><label class="empleado ordenar">No.Empl</label></th>
                                        <th><label class="calle ordenar">Calle</label></th>
                                        <th><label class="colonia ordenar">Colonia</label> </th>
                                        <th><label class="ciudad ordenar">Ciudad</label> </th>
                                        <th><label class="cp ordenar">CP</label></th>
                                        <th><label class="estatus ordenar">Estatus</label></th>
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            <div class='paginador' id="paginador"  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario">
                         <form id="frmNuevaDireccionEmpl" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="direccion encabezadoformulario" >Crear Dirección</h2>
                            	    <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                    <div class="auxiliar">
                                      <div class="columnaI">
                                        <label class="direccion">Clave</label> 
                                        <input id="direccion" name="cve_direccionempl" class="direccion" maxlength="79" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="empleado">No.Empleado</label> 
                                        <input id="empleado" name="id_empleado" class="empleado" maxlength="79" placeholder="No.Empleado" readonly/>
                                        <label class="calle">Calle</label> 
                                        <input id="calle" name="calle"  class="calle" maxlength="79" placeholder="Calle" />
                                        <label class="colonia">Colonia</label> 
                                        <input id="colonia" name="colonia" class="colonia" maxlength="79" placeholder="Colonia" />
                                        <label class="municipio">Municipio</label> 
                                        <select id="municipio" name="cve_municipio" class="municipio" readonly> </select> 
                                      </div>
                                      <div class="columnaD">
                                        <label class="ciudad">Ciudad</label> 
                                        <input id="ciudad" name="ciudad"  class="ciudad" maxlength="79" placeholder="Ciudad" />
                                        <label class="estado">Estado</label> 
                                        <select id="estado" name="cveestado" class="estado" readonly> </select> 
                                        <label class="pais">País</label> 
                                        <select id="pais" name="cvepais" class="pais" readonly> </select> 
                                        <label class="cp">CP</label> 
                                        <input id="cp" name="cp" class="cp" maxlength="79" placeholder="CP" />
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
                                        <button class="guardar btnFormularios" onclick="GuardarDireccionEmpl()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarDireccionEmpl()">Salir</button>
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
