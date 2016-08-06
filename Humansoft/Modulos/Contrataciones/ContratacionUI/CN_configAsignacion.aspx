<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        
        <link href="../../../Recursos/css/layoutGenerico.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
        <link href="css/contrataciones.css" rel="stylesheet" type="text/css" />
        <link href="css/configAsignacion.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
        <script src="js/configAsignacion.js" type="text/javascript"></script>
        <script src="js/contrataciones.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar()">
       <div id="inicio" >
           <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo" >
                        <div class="smart-green">
                            <h2 class="grado encabezadoformulario">Configuracion de Asignacion de vacantes</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="ordenar">Editar</label></th>
                                            <th><label class="ordenar">Configuracion</label></th>
                                            <th><label class="ordenar">Max Asignaciones</label></th> 
                                            <th><label class="ordenar">Salario Min</label></th> 
                                            <th><label class="ordenar">Salario Max</label></th> 
                                            <th><label class="ordenar">Estatus</label></th>
                                            <th><label class="ordenar">Seleccionar</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario" id="formulario">
                        <form id="frmNuevo" onsubmit="return false;" >
                            <div class="alinear smart-green" >
                                <h2 class="grado encabezadoformulario" >Configuracion
                                </h2>
                                <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="330" >
                                    <label >Clave</label>
                                    <input id="clave" name="clave" readonly="readonly" onkeypress="return false;" onkeydown="return false;"/>
                                    <label >Nombre</label>
                                    <input id="nombre" name="nombre" maxlength="79" placeholder="Descripción" />
                                    <label >Maximo de Asignacion</label>
                                    <input id="max" name="max"maxlength="79" placeholder="Num. de vacantes" />
                                    <label >Salario Minimo</label>
                                    <input id="smin" name="smin" maxlength="79" placeholder="Monto del salario min" />
                                    <label >Salario Maximo</label>
                                    <input id="smax" name="smax" maxlength="79" placeholder="Monto del salario max" />
                                    <label >Prioridad</label>
                                    <input id="prioridad" name="prioridad" maxlength="79" placeholder="Valor de la prioridad" />
                                    <label >Asignar al Jefe</label>
                                    <input id="jefe" name="jefe" value="true" type="checkbox" maxlength="79" placeholder="Estiqueta" />
                                    <label >Estatus</label>
                                    <select name="activo" id="activo">
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="Guardar()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="Cancelar()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar" frameborder="0" scrolling="no" ></iframe>
                </div>  
           </div>  
       </div> 
  <%}else {%>
    <item:comun runat="server" />
<%}%>
    </body>
</html>
