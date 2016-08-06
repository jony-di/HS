<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <script src="js/politicavacacionesmaes.js?ver=1.2" type="text/javascript"></script>
        <link href="css/politicavacacionesmaes.css?ver=1.1" rel="stylesheet" type="text/css" />
        <link href="css/vacaciones.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/vacaciones.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/layoutGenerico.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
        <script>
            $(function () {
                var selectVencimiento = document.getElementById("vencimiento");
                for (var i = 0; i < 61; i++) {
                    selectVencimiento.appendChild(NuevoElemento(selectVencimiento,"option","",i));
                }
            });

        </script>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio">
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="politicas encabezadoformulario" >Catálogo de Políticas</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en Políticas Vacaciones" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div class="scrollable" offset="270" style="clear:both;">
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas">
                                        <th><label class="editar ordenar  "> Editar</label></th>
                                        <th><label class="clave ordenar">No.</label> </th>
                                        <th ><label class="nombre ordenar">Nombre</label></th>
                                        <th><label class=" dias ordenar">DiasPermitidos</label></th>
                                        <th><label class=" activo ordenar">Activo</label></th>
                                        <th><label class=" ver ordenar">VerDetalle</label></th>
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
                                <h2 class="grado encabezadoformulario" >Crear Nueva Política</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>                           
                                <div class="scrollable" offset="310">
                                    <label class="clave">Número de Política</label>  
                                    <input id="clave" name="clave" class="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    <label class="nombre">Nombre de Política</label> 
                                    <input id="nombre" name="nombre" class="nombre" maxlength="79" placeholder="Nombre Política" />
                                    <label class="dias">Días Permitidos</label> 
                                    <input id="dias" name="diaspermitidos" class="dias" maxlength="79" placeholder="Días Permitidos" />
                                    <label class="anno">% Año</label> 
                                    <input id="annios" name="porcentajedeanios" class="anno" maxlength="79" placeholder="% Año" />
                                    <label class="anno">Vencimiento</label> 
                                    <select id="vencimiento" name="vencimiento" class="anno"  style="width:100px;float:left;"></select>
                                    <label class="activo">Estatus</label> 
                                    <select class="activo" name="activo" id="estatus">
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
                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar ventana" frameborder="0" scrolling="no" ></iframe>  
                </div>  
           </div>
       </div> 
  <%}else {%>
        <item:comun ID="Comun1" runat="server" /></item:comun>
<%}%>        
    </body>
</html>
