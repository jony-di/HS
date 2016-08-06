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
        
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/puestogenerico.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js?ver=1.0" type="text/javascript"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
        <script src="js/puestogenerico.js?ver=1.2" type="text/javascript"></script>
        <script src="js/estructuras.js" type="text/javascript"></script>
        <style>
            .anchoA,.anchoB,.anchoC,.anchoD{min-width:60px;}

        </style>

    </head>
    <body class="fondo" onload="iniciar();">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="puesto encabezadoformulario" >Catálogo de Puesto Genérico</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Puestos Genéricos" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo()">Agregar</button>
                            <div  class="scrollable" offset="270" >
                                <table class="listaN" id="tableCatalogo" style="width:760px;">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="puesto ordenar">Clave</label> </th>
                                            <th ><label class="nombrepuesto ordenar">Nombre Puesto</label></th>
                                            <th ><label class="nivel ordenar">Nivel</label></th> 
                                            <th ><label class="tabulador ordenar">Tabulador</label></th> 
                                            <th ><label class="niveltabular ordenar">NivelTabular</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario "  id="formulario">
                         <form id="frmNuevo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="puesto encabezadoformulario" >Crear Nuevo Puesto Genérico</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="columnaI scrollable" offset="310" style="clear:none;">
                                    <label class="puesto">Puesto</label>  
                                    <input id="clave" name="cve_puesto" class="puesto" readonly onkeypress="return false;" onkeydown="return false;" />
                                    <label class="puntos">Puntos</label>  
                                    <input id="puntos" name="puntos" class="puntos"  />
                                    <label class="nivel">Nivel</label>  
                                    <input id="nivel" name="nivelmercer" class="nivel"    />
                                    <div class="agrupacion">
                                        <label class="tabulador">Tabulador</label> 
                                        <input id="tabulador" name="tabulador" class="tabulador conBoton" type="hidden" />
                                        <input id="stabulador" name="stabulador" class="tabulador conBoton" readonly onkeypress="return false;" onkeydown="return false;" />
                                        <button class="btnFormularios peque" onclick="MostrarSeleccionTabuladores();">..</button>
                                        <label class="niveltabular">Nivel Tabular</label>  
                                        <input id="niveltabular" name="niveltabular" class="niveltabular conBoton" readonly onkeypress="return false;" onkeydown="return false;"  />
                                        <button class="btnFormularios peque" style='margin-left:9px;' onclick="MostrarDetalleTabulador();">..</button>
                                    </div>
                                </div>
                                <div class="columnaD scrollable" offset="310" style="clear:none;">
                                    <label class="nombre">Nombre Puesto</label>  
                                    <input id="nombre" name="nombre_puesto" class="nombre"/>
                                    <label class="extra">Extra</label>
                                    <input id="extra" name="cve_extra" class="" Extra" />
                                    <label class="extra" style="margin-bottom:5px;">Exámenes</label>
                                    <select id="cve_paqexamen" name="cve_paqexamen" style="width:215px;margin-top:15px;"></select>
                                    <hr  class="cleaner"/>
                                    <button class="guardar btnFormularios ocultar" id="agregarPerfil" onclick="VerDescripcionPuesto();">Agregar Perfil del puesto</button>
                                    <button class="guardar btnFormularios ocultar" id="mostrarPerfil" onclick="VerDescripcionPuesto('1');">Ver Perfil del puesto</button>
                                
                                    <hr  class="cleaner"/>
                                    <div class="extra" id="mostrarEscaneo" class="ocultar">
                                        <fieldset style="margin:auto;" id="escaneo">
                                            <legend>Ingrese el archivo escaneado</legend>
                                            <div class="fileUpload btn agregar">
                                                Agregar
                                                <input type="file" class="upload" name="perfilscan" id="perfilscan" onchange="CargarEscaneo()" accept=".gif,.jpeg,.jpg,.png" />
                                            </div>
                                            <input type="text" disabled="disabled" id="pathfile" placeholder="No se a seleccionado archivo" size="30" />
                                        </fieldset>
                                    </div>
                                    <div id="archivoescaneado" class="ocultar">
                                        <fieldset style="margin:auto;">
                                            <legend>Consulte el archivo escaneado</legend>
                                            <a id="ligaEscaneo" href="#" >Ver archivo escaneado...</a><img src="../../../Recursos/imagenes/eliminar.png" class="eliminar" title="Borar archivo" onclick="eliminarEscaneo()" />
                                        </fieldset>
                                    </div>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarPuestoGenerico()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarPuestoGenerico()">Salir</button>
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
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>        
    </body>
</html>
