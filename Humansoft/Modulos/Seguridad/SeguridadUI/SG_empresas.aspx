<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="css/seguridad.css" rel="stylesheet" type="text/css" />
        <link href="css/empresas.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>        
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="js/empresas.js?ver=1.0" type="text/javascript"></script>
        <script src="js/seguridad.js?ver=1.0" type="text/javascript"></script>
        
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="empresas encabezadoformulario" >Catálogo de Empresas</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las Empresas" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoEmpresa()">Agregar</button>
                            <div class="scrollable" offset="265">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th ><label class="nombre ordenar">Nombre</label></th>
                                            <th ><label class="rfc ordenar">RFC</label></th> 
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
                         <form id="frmNuevoEmpresa" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="empresas encabezadoformulario" >Crear Nueva Empresa</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                    <div class="columnasI scrollable" offset="350">
                                        <label class="clave">Clave</label>  
                                        <input id="clave" name="cve_empresa" class="clave" readonly />
                                        <label class="nombre">Nombre</label> 
                                        <input id="nombre" name="nombre" class="nombre" maxlength="79" placeholder="Nombre Empresa" />
                                        <label class="rfc">RFC</label> 
                                        <input id="rfc" name="rfc" class="rfc" maxlength="79" placeholder="RFC Empresa" />
                                        <label class="fechaalta">FechaAlta</label> 
                                        <input id="fechaalta" name="fechaalta" class="fechaalta" readonly type="text" /> 
                                        <label class="razonsocial">RazónSocial</label> 
                                        <input id="razonsocial" name="razonsocial" class="razonsocial" maxlength="79" placeholder="Razón Social Empresa" />
                                        <span style="display:none">
                                            <label class="idusuariocreo">Id</label> 
                                            <input id="idusuariocreo" name="idusuariocreo" value="." class="idusuariocreo" maxlength="79" placeholder="Id Usuario Creó" />
                                        </span>
                                        <label class="giro">Giro</label> 
                                        <select id="cve_giro" name="cve_giro" class="giro" readonly> </select>
                                        <label class="estatus">Estatus</label> 
                                        <select class="estatus" name="activo" id="estatus"  >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    </div>
                                    <div class="columnasD scrollable" offset="350">
                                        <label class="pais">País</label> 
                                        <select id="cve_pais" name="cve_pais" class="pais" onchange='var selectEstados = document.getElementById("estado");LlenarCatalogoEstados(selectEstados, function () {}, this.options[this.selectedIndex].value);'> </select> 
                                        <label class="estado">Estado</label> 
                                        <select id="estado" name="estado" class="estado"></select>
                                        <label class="delegmunic">Delegación</label> 
                                        <input id="delegmunic" name="delegmunic" class="delegmunic" maxlength="79" placeholder="Delegación" />
                                         <label class="colonia">Colonia</label> 
                                        <input id="colonia" name="colonia" class="colonia" maxlength="79" placeholder="Colonia" />
                                        <label class="calle">Calle</label> 
                                        <input id="calle" name="calle" class="calle" maxlength="79" placeholder="Calle" />
                                        <label class="cp">Cp</label> 
                                        <input id="cp" name="cp" class="cp" maxlength="79" placeholder="Código Postal" />
                                    </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarEmpresa()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarEmpresa()">Salir</button>
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
