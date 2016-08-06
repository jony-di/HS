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
        <link href="../../Estructuras/EstructurasUI/css/estructura.css" rel="stylesheet"type="text/css" />
        <link href="css/politica.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/politicas.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="js/controlacceso.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <style>
            .columnaI label{clear:left;float:left;margin-top:30px;}
            .columnaI input, .columnaI select {clear:right;float:left;margin-top:20px;margin-left:7px;}
            .seleccionable tr:hover{background:#5fb7f7;cursor:pointer;color:#fff;}
            span.periodo-aux{display:block;clear:both;padding:10px;}
            span.periodo-aux *{width:20%;clear:none;}
            span.periodo-aux label{text-align:right;display:inline !important;float:none;margin:10px;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara"> 
                <div class="principal" id="principal">
                    <div class="catalogo ventana">
                        <div class="smart-green">
                            <h2 class="lugartrabajo encabezadoformulario" >Políticas en control de acceso</h2>
                            
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las Politicaes" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoPolitica()">Agregar</button>
                            <div class="scrollable" offset="260" style="clear:both;">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th ><label class="descripcion ordenar">Descripción</label></th>
                                            <th ><label class="descripcion ordenar">Cantidad</label></th>
                                            <th ><label class="descripcion ordenar">Período</label></th>
                                            <th ><label class="activo ordenar">Activo</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"  class="seleccionable"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>                        
                    </div>
                    <div class="formulario ventana">
                         <form id="frmNuevoPolitica" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="lugartrabajo encabezadoformulario" >Editar Política </h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="auxiliar scrollable" offset="270">
                                    <div class="columnaI">
                                        <label class="indice">Clave</label>
                                        <input id="indice" name="indice" class="clave" readonly onkeypress="return false;" onkeydown="return false;" style="width:70px;clear:right;display:block;"/>                                        
                                        <label class="descripcion">Política</label>
                                        <select id="cve_politica" name="cve_politica" style="width:300px;margin-left:10px;"></select>
                                        <label class="descripcion">Cantidad</label>
                                        <input id="cantidad" name="cantidad" maxlength="79" style="width:70px;"/>
                                        <label class="descripcion">Frecuencia</label>
                                        <input id="frecuencia" name="frecuencia" maxlength="5" style="width:70px;"/>
                                        <label class="descripcion">Unidad de tiempo</label>
                                        <select id="cve_dado" name="cve_dado" style="width:200px;margin-left:10px;" onchange="MostrarAuxiliares(this)"></select>
                                    </div>
                                    <div class="columnaD">
                                        <div id="quincena" style="display:none;">
                                            <label>Primer período</label>
                                            <span class="periodo-aux"><input placeholder="Día inicio" id="diaInicio" name="aux1"/><label>-</label><input id="diaFin" name="aux2" placeholder="Día fin" onkeyup="document.getElementById('diasig').value=$.trim(this.value).length > 0 ? parseInt(this.value,10) + 1:'';"/></span>
                                            <label>Segundo período</label>
                                            <span class="periodo-aux"><input id="diasig" name="aux3" placeholder="Día inicio" onfocus="this.disabled=true;"/><label>-</label><input placeholder="Fin de mes" id="diaFin2" name="aux4"/></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="barra-botones">
                                    <span style="width:300px;">
                                        <button class="guardar btnFormularios" onclick="GuardarPolitica()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="document.getElementById('quincena').style.display = 'none';DesplazarElemento('principal',0)">Salir</button>
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
