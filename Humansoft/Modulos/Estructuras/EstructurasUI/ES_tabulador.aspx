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
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/tabulador.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/tabulador.js?ver=1.4" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js?ver=1.0" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

    </head>
    <body class="fondo" onload="iniciar(<%=Request["tabulador"]%>)" callbackInicio="<%=Request["callbackInicio"]%>" callbackFin="<%=Request["callback"]%>">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="tabulador encabezadoformulario" >
                                Catálogo de Tabulador
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>
                            </h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Tabulador" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoTabulador()">Agregar</button>                            
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo" style="width:790px;">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="nivel ordenar">Nivel</label> </th>
                                            <th ><label class="contratacion ordenar">Contratación</label></th>
                                            <th ><label class="minimo ordenar">Mínimo</label></th>
                                            <th ><label class="minimo ordenar">Medio</label></th>
                                            <th ><label class="maximo ordenar">Máximo</label></th>  
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
                         <form id="frmNuevoTabulador" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="tabulador encabezadoformulario" >Crear Nuevo Tabulador</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="columnaI scrollable" offset="310">
                                    <label class="clave">Tabulador</label>  
                                    <input id="clave" name="tabulador" value="<%=Request["tabulador"]%>" class="clave" readonly  onkeypress="return false;" onkeydown="return false;" />
                                    <label class="nivel">Nivel</label>  
                                    <input id="nivel" name="nivel" class="nivel" readonly  onkeypress="return false;" onkeydown="return false;" />
                                    <label class="pmin">P_MIN</label>  
                                    <input id="pmin" name="p_min" class="pmin"  />
                                    <label class="pmax">P_MAX</label>  
                                    <input id="pmax" name="p_max" class="pmax"  />
                                </div>
                                <div class="columnaD scrollable" offset="310">
                                    <label class="minimo">Minimo($)</label> 
                                    <input id="minimo" name="minimo" class="minimo" maxlength="79" placeholder="Mínimo ($)" style="text-align:right;"/>
                                    <label class="contratacion">Contratación($)</label>  
                                    <input id="contratacion" name="contratacion" class="contratacion"  placeholder="Contratación ($)" style="text-align:right;"/>
                                    <label class="medio">Medio($)</label>  
                                    <input id="medio" name="medio" class="medio" placeholder="Medio ($)"  style="text-align:right;"/>
                                    <label class="maximo">Maximo($)</label>  
                                    <input id="maximo" name="maximo" class="maximo" placeholder="Máximo ($)"  style="text-align:right;"/>
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarTabulador()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarTabulador()">Salir</button>
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
