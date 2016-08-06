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
        <link href="css/seguridad.css" rel="stylesheet" type="text/css" />
        <link href="css/sucursales.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/sucursales.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js" type="text/javascript"></script>
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
                            <h2 class="sucursales encabezadoformulario" >Catálogo de Sucursales</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las Sucursales" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoSucursal()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th ><label class="nombre ordenar">Nombre</label></th>
                                            <th ><label class="empresa ordenar">Empresa</label></th> 
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
                         <form id="frmNuevoSucursal" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="sucursal encabezadoformulario" >Crear Nueva Sucursal</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                    <div class="columnasI scrollable" offset="325" >
                                        <label class="clave">Clave</label>  
                                        <input id="clave" name="cve_sucursal" class="clave" readonly />
                                        <label class="nombre">Nombre</label> 
                                        <input id="nombre" name="nombre" class="nombre" maxlength="79" placeholder="Nombre Sucursal" />
                                        <label class="empresa">Empresa</label> 
                                        <select id="cve_empresa" name="cve_empresa" class="empresa" readonly> </select>
                                        <label class="calle">Calle</label> 
                                        <input id="calle" name="calle" class="calle" maxlength="79" placeholder="Calle" />
                                        <label class="colonia">Colonia</label> 
                                        <input id="colonia" name="colonia" class="colonia" maxlength="79" placeholder="Colonia" />
                                        <label class="delgamunic">Delegación</label> 
                                        <input id="delgamunic" name="delgamunic" class="delgamunic" maxlength="79" placeholder="Delegación" />
                                        <label class="estado">Estado</label> 
                                        <input id="estado" name="estado" class="estado" maxlength="79" placeholder="Estado" />
                                        <label class="cp">Cp</label> 
                                        <input id="cp" name="cp" class="cp" maxlength="79" placeholder="Codigo Postal" />
                                    </div>
                                    <div class="columnasD scrollable" offset="325" >
                                        <label class="entrecalles">Entre Calles</label> 
                                        <input id="entrecalles" name="entrecalles" class="entrecalles" maxlength="79" placeholder="Entre Calles" />
                                        <label class="idusuario" title="Número de empleado del responsable de la sucursal">Num. Emp. Resp.</label> 
                                        <input  id="id_responsable" name="id_responsable" class="idusuario" maxlength="20" placeholder="Responsable"></input>
                                        <label class="numreferencia">Núm. Referencia</label> 
                                        <input id="numreferencia" name="numreferencia" class="numreferencia" maxlength="79" placeholder="Número Referencia" />
                                        <label class="tipo">TipoSucursal</label> 
                                        <select id="cve_tipo" name="cve_tipo" class="tipo" readonly> </select> 
                                        <label class="region">Región</label> 
                                        <select id="cve_region" name="cve_region" class="region" readonly> </select> 
                                        <label class="zona">Zona</label> 
                                        <select id="cve_zona" name="cve_zona" class="zona" readonly> </select>
                                        <label class="estatus">Estatus</label> 
                                        <select class="estatus" name="activo" id="estatus">
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarSucursal()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarSucursal()">Salir</button>
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
