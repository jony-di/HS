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
        <link href="css/CatalogoVacantes.css?ver=1" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Utilidades/UtilidadesUI/js/utilidades.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
        <script src="js/CatalogoVacantes.js" type="text/javascript"></script>
        <script src="js/contrataciones.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo" >
                        <div class="smart-green">
                            <h2 class="grado encabezadoformulario">Solicitudes de vacantes</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="ordenar">#</label></th>
                                            <th><label class="ordenar">Posicion</label></th>
                                            <th><label class="ordenar">Puesto</label></th> 
                                            <th><label class="ordenar">Departamento</label></th> 
                                            <th><label class="ordenar">Fecha</label></th> 
                                            <th><label class="ordenar">Asignado</label></th> 
                                            <th><label class="ordenar">Estatus</label></th>
                                            <th><label class="ordenar">Opciones</label></th>
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
                                <h2 class="grado encabezadoformulario" >Solicitud de vacante
                                <button class="btnFormularios regresar" onclick="Cancelar()">Regresar</button>
                                </h2>
                                <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="330" >
                                    <div class="columnaI">
                                        <label class="l-form-1">Solicitud Vacante</label>
                                        <input id="clave" name="clave" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="l-form-2">Asignado a</label>
                                        <input id="asignado" name="asignado" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <button class="btnFormularios peque" id="cambiarReclutador">..</button>
                                        <label class="l-form-2">Estatus</label>
                                        <input id="estatus" name="estatus" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="l-form-2">Fecha Solicitud</label>
                                        <input id="fsolicitud" name="fsolicitud" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="l-form-2">Fecha Contratacion</label>
                                        <input id="fcontratacion" name="fcontratacion" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    </div>
                                    <div class="columnaD">
                                        <label class="l-form-2">Numero Posicion</label>
                                        <input id="posicion" name="posicion" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="l-form-2">Puesto</label>
                                        <input id="puesto" name="puesto" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="l-form-2">Departamento</label>
                                        <input id="departamento" name="departamento" readonly onkeypress="return false;" onkeydown="return false;"/>
                                        <label class="l-form-2">Sueldo de contratacion</label>
                                        <input id="sueldo" name="sueldo" readonly onkeypress="return false;" onkeydown="return false;"/>
                                    </div>
                                    <label class="l-form-2">Detalle</label>
                                    <textarea placeholder="Descripcion de la vacante" maxlength="180" id="detalle" name="detalle" rows="10" cols="10" ></textarea>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" id="btnVerperfil">Ver perfil</button>
                                        <button class="cancelar btnFormularios" id="btnPublicar" onclick="">Publicar pag. web</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="ventana" frameborder="0" scrolling="no" ></iframe>
                </div>  
           </div>  
       </div> 
  <%}else {%>
        <item:comun runat="server" />
<%}%>
    </body>
</html>
