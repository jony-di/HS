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
        <link href="css/contrataciones.css" rel="stylesheet" />
        <link href="css/politicavacaciones.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/flujosubetapas.js?ver=1.2" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/generico.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
         <script>
             var urlBase_WS = "/Modulos/Contrataciones/ContratacionNegocio/";
        </script>
        <style>
            .formulario label{float:left;clear:left;width:100px;}
            .formulario input{float:left;clear:right;}
        </style>
    </head>
    <body class="fondo" onload="iniciar(<%=Request["cve_etapa"]%>)" callbackInicio="<%=Request["callbackInicio"]%>" callbackFin="<%=Request["callback"]%>">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="politica encabezadoformulario" >
                                Subetapas de contratación
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "0"%>);">Regresar</button>
                            </h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Detalles de Políticas" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevo(<%=Request["cve_etapa"]%>)">Agregar</button>
                            <div class="scrollable" offset="280" style="clear:both;">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas">
                                            <th><label class="editar"> Editar</label></th>
                                            <th><label class="clave ordenar">clave</label></th>
                                            <th><label class="annos ordenar">Descripción</label></th>
                                            <th><label class="prestamos ordenar">Url</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>
                    <div class="formulario ">
                         <form id="frmNuevo" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="politica encabezadoformulario" >Editar subetapa de contratación</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>                                
                                <div class="scrollable" offset="310">
                                    <input id="cve_etapa" name="cve_etapa" value="<%=Request["cve_etapa"]%>" type="hidden" class="clave" readonly  onkeypress="return false;" onkeydown="return false;" />
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="cve_subetapa" readonly  onkeypress="return false;" onkeydown="return false;" />
                                    <label >Descripcion</label>
                                    <input id="descripcion" name="descripcion" style="width:500px;"/>
                                    <label >Url</label>
                                    <input id="pantalla" name="pantalla" style="width:500px;"/>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span style="width:300px;">
                                        <button class="guardar btnFormularios" onclick="GuardarFlujoSubetapas()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="MostrarCatalogo();">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>                
                </div>  
           </div>  
       </div> 
  <%}else {%>
        <item:comun ID="Comun1" runat="server" /></item:comun>
<%}%>        
    </body>
</html>
