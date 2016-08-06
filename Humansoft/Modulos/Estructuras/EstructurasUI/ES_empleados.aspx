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
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <script src="js/estructuras.js?ver=1.0" type="text/javascript"></script>
        <script src="js/empleados.js?ver=1.0" type="text/javascript"></script>
        <link href="css/empleados.css" rel="stylesheet" type="text/css" />
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/generico.js"></script>       
    </head>
    <body class="fondo" onload="Empleados.iniciar('<%=Request["callback"]%>')">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="usuarios encabezadoformulario" >                                                                                  
                                <%if (Request["esSeleccion"] != null)
                                  {%>
                                Seleccione empleado que ocupara la posición
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',-900);">Regresar</button>
                                <% }
                                  else
                                  { %>
                                    Empleados   
                                <%}%>
                            </h2>
                            <div id="busqueda">
                                <fieldset class="filtros-posiciones" id="filtrosPosiciones">
                                <legend>Consulta de Empleados</legend>
                                <button class="btnFormularios criterio" onclick="ToggleMenu('criteriosBusqueda')" id="criterioBusqueda"> Agregar criterio ..</button> 
                                <div class="wrap-menu-criterio">                                 
                                        <div class="opciones-menu" style="display:none;" id="criteriosBusqueda">
                                            <ul>                        
                                                <li onclick="AgregarCriterioEmpleado('NoEmpleado','id_empleado','criteriosPosiciones');ToggleMenu('criteriosBusqueda');">No.Empleado</li>
                                                <li onclick="AgregarCriterioEmpleado('NombreCompleto','nombrecompleto', 'criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Nombre Completo</li>
                                                <li onclick="AgregarCriterioEmpleado('Estado civil','cve_estadocivil','criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NEstadoCivil.aspx?op=obtenerCatalogoEstadoCivil&pagina=1&longitudPagina=1000&cve_estadocivil=0&criterio=' ,'Estado Civil','descripcion','cve_estadocivil');ToggleMenu('criteriosBusqueda');">Estado Civil</li>
                                                <li onclick="AgregarCriterioEmpleado('Grado alcanzado','cve_grado','criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NGrado.aspx?op=obtenerCatalogoGrado&pagina=1&longitudPagina=1000&cve_grado=0&criterio=' ,'Grado Estudios','descripcion','cve_grado');ToggleMenu('criteriosBusqueda');">Grado Alcanzado</li>
                                                <li onclick="AgregarCriterioEmpleado('Posición','num_posicion', 'criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Posición</li>
                                            </ul>     
                                        </div>
                                    </div>                                    
                                <form id="criteriosPosiciones" class="frm-criterios-busqueda" onsubmit="return false;"></form>
                                </fieldset>
                            </div>
                            <%if (Request["esSeleccion"]==null){%>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoEmpleado()">Agregar</button>
                            <%}%>
                            
                            <div class="scrollable" offset="340" style="clear:both;">
                            <table class="listaN" id="tableCatalogo" style="display:;">
                                <thead>
                                    <tr class="columnas">
                                        <th><label class="empleado ordenar">No. Empl.</label> </th>
                                        <th><label class="nombrecompleto ordenar">Nombre Completo</label> </th>
                                        <th><label class="estatus ordenar">Estatus</label></th>
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista" tipo="<%=(Request["esSeleccion"]==null) ? "editar" : "seleccionar"%>" class="filas-seleccionables"></tbody>
                            </table>
                            </div>
                            <div class='paginador' id="paginador"  total='0' criterio='%' tamPagina='50'></div>
                        </div>
                    </div>
                    <div class="formulario ventana" id="wrapFormulario">
                         <form id="frmNuevoEmpleado" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="usuarios encabezadoformulario" >
                                    Crear Empleados                                                       
                                    <%if(Request["esSeleccion"] != null){%>                                
                                    <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',-900);">Regresar</button>
                                    <% } %>
                                </h2>
                            	    <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                    <div class="auxiliar scrollable" offset="310" >
                                      <div class="columnaI">
                                         <img src="/Recursos/imagenes/photodefault.png" class="fotoEmpl" id="fotoImg" onerror="this.src='/Recursos/imagenes/photodefault.png'"/>
                                         <div class="btnUpload btnFormularios">
                                            <span>Subir imagen</span>
                                            <input id="foto" name="foto" type="file" class="upload"  onchange="PreviewImagen(this,'fotoImg');"/>
                                        </div>
                                        <label class="nombrecom">Nombre Completo</label> 
                                        <input id="nombrecom" name="nombrecompleto" class="nombrecom" maxlength="79" readonly />
                                        <label class="empleado">No.Empleado</label> 
                                        <input id="empleado" name="id_empleado" class="empleado" maxlength="79" placeholder="No.Empleado"/>
                                        <label class="nombre">Nombres</label> 
                                        <input id="nombre" name="nombre" onkeyup="LlenarNombreCompleto(this)" class="nombre" maxlength="79" placeholder="Nombres" />
                                        <label class="apellidop">Apellido P.</label>
                                        <input id="apellidop" name="apellidop" onkeyup="LlenarNombreCompleto(this)" class="apellidop" maxlength="79" placeholder="Apellido Paterno" />
                                        <label class="apellidom">Apellido M.</label> 
                                        <input id="apellidom" name="apellidom" onkeyup="LlenarNombreCompleto(this)" class="apellidom" maxlength="79" placeholder="Apellido Materno" />
                                        <label class="sueldo">Sueldo</label> 
                                        <input id="sueldo" name="sueldo" class="sueldo" maxlength="79" placeholder="Sueldo" />
                                        <label class="fechaingreso">Fecha Ingreso</label> 
                                        <input id="fechaingreso" name="fechaing" class="fechaingreso" readonly type="text" /> 
                                        <label class="sexo">Género</label> 
                                        <select id="sexo" name="cve_sexo" class="sexo" readonly type="text"> </select> 
                                        <label class="estatust">Estatus</label> 
                                        <select id="estatust" name="cve_estatus" class="estatust" readonly> </select> 
                                        <label class="estadocivil">Estado Civil</label> 
                                        <select id="estadocivil" name="cve_estadocivil" class="estadocivil" readonly> </select> 
                                        <label class="banco">Banco</label> 
                                        <select id="banco" name="cve_banco" class="banco" readonly> </select> 
                                        <label class="numerocuenta">Número Cuenta</label> 
                                        <input id="numerocuenta" name="numerocuenta" class="numerocuenta" maxlength="79" placeholder="Nùmero Cuenta" />
                                        <label class="diascontrato">Vencimiento de contrato</label> 
                                        <input id="diascontrato" name="Venci_Contrato" class="diascontrato" maxlength="79" placeholder="Dias Contrato" />
                                        <label class="email">E-mail</label> 
                                        <input id="email" name="email" class="email" maxlength="79" placeholder="E-mail" />
                                        <label class="estudios">Estudios</label> 
                                        <input id="estudios" name="estudios" class="estudios" maxlength="79" placeholder="Estudios" />
                                      </div>
                                      <div class="columnaD">
                                        <label class="escuela">Escuela</label> 
                                        <input id="escuela" name="escuela" class="escuela" maxlength="79" placeholder="Escuela" />
                                        <label class="imss">IMSS</label> 
                                        <input id="imss" name="imss" class="imss"  maxlength="79" placeholder="IMSS" />
                                        <label class="curp">CURP</label> 
                                        <input id="curp" name="curp" class="curp"  maxlength="79" placeholder="CURP" />
                                        <label class="rfc">RFC</label> 
                                        <input id="rfc" name="rfc" class="rfc"  maxlength="79" placeholder="RFC" />
                                        <label class="fechanaci">Fecha Nacimiento</label> 
                                        <input id="fechanaci" name="fechanac" class="fechanaci" readonly type="text" /> 
                                        <label class="pais">País Nacimiento</label> 
                                        <select id="pais" name="cve_paisnaci" class="pais" readonly> </select> 
                                        <label class="lugar">Lugar</label> 
                                        <input id="lugar" name="lugarnacimiento" class="lugar" maxlength="79" placeholder="Lugar Nacimiento" />
                                        <label class="nacionalidad">Nacionalidad</label> 
                                        <input id="nacionalidad" name="nacionalidad" class="nacionalidad" maxlength="79" placeholder="Nacionalidad" />
                                        <label class="paist">País Trabajo</label> 
                                        <select id="paist" name="cve_paistrabaja" class="paist" readonly> </select> 
                                        <label class="grado">Grado Alcanzado</label> 
                                        <select id="grado" name="cve_grado" class="grado" readonly> </select> 
                                        <label class="tipoempl">Tipo Empleado</label> 
                                        <select id="tipoempl" name="cve_tipoemp" class="tipoempl" readonly> </select> 
                                        <label class="numerop">Número Posición</label> 
                                        <input id="numerop" name="num_posicion" class="numerop" maxlength="79" placeholder="Número Posición"  readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="estatus">Estatus</label> 
                                        <select class="estatus" name="activo" id="estatus"  >
                                            <option value="true">Activo</option>
                                            <option value="false">Baja</option>
                                        </select>
                                      </div>
                                    </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">                                    
                                   <%if (Request["esSeleccion"]!=null){%>
                                    <span id="btnSeleccionar">
                                        <button class="guardar btnFormularios" onclick="SeleccionarEmpleado(document.getElementById('empleado').value,document.getElementById('numerop').value,this);this.setAttribute('nombre',document.getElementById('nombrecom').value);">Seleccionar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarEmpleado()">Volver a empleados</button>
                                    </span>
                                    <%}
                                     else
                                     {%>
                                     <div class="OpcionEmpleado">
                                        <span class="btnFormularios auxiliar"><a class="nombre">Opciones Empleado</a> <button class="opcioneslist" onclick="ToggleOpcionesEmpleado(this);"> </button></span>
                                        <div class="opciones-empleado" style="display:none" id="opcionesEmpleado">
                                            <ul>                        
                                                <li id="linkDirecciones" onclick="MostrarPantallaFrame(this)" url="/Modulos/Estructuras/EstructurasUI/ES_direccionempl.aspx">Direcciones</li>
                                                <li id="linkTelefonos" onclick="MostrarPantallaFrame(this)" url="/Modulos/Estructuras/EstructurasUI/ES_telefonoempl.aspx">Teléfonos</li>
                                            </ul>     
                                        </div>
                                    </div>
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarEmpleado()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarEmpleado()">Salir</button>
                                    </span>
                                <%} %>
                                </div>
                            </div>
                        </form>
                    </div>                     
                    <iframe id="consola" name="consola" style="display:none;"></iframe>               
                    <iframe id="pantallaAuxiliar" frameborder="0" scrolling="no" style="height:800px !important;" ></iframe>               
                </div>  
           </div>  
       </div>  
  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>        
    </body>
</html>
