<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/contrataciones.css" rel="stylesheet" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js"></script>
        <script src="js/paq_examenes.js?ver=1.3" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js?ver1.0"></script>
        <style>
            .campo-par{display:block;clear:both;}
            .campo-par label{font-weight:bolder;float:left;width:100px;text-align:left;}
            .campo-par input{display:block;float:left;}
            .examenes{clear:both;}
            .colClaveExamen{width:100px;}
            div.base{height:auto;}
            div.base table{border:0px;}
            body div.base div.wraptable{border:0px;}
            div.base input{width:95% !important;display:block;margin:auto;}
            div.base h3{display:none;}
            div.base table tr.seleccionado td:first-child{background-position: left center;background-image: url("/Recursos/imagenes/ok.png");background-repeat:no-repeat; }
            div.base table tr td{padding:5px; }
            div.base table tr.seleccionado:hover,div.base table tr:hover{color:#000;background-color:transparent;}
            div.base table tr.seleccionado{background-color:transparent;}
            .alinearTxtIzq{text-align:left !important;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="examen encabezadoformulario" >Paquetes de exámenes</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los paquetes" onkeyup="buscarCoincidencias(event,this);"/></div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoPaqExamen()" style="width:100px;">Nuevo</button>
                            <div class="scrollable" offset="260">
                                <table class="listaN" id="tableCatalogo" style="width:780px;">
                                    <thead>
                                        <tr class="columnas">
                                            <th><label class="ordenar">Clave</label> </th>
                                            <th ><label class="ordenar">Descripción</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>

                    <div class="formulario " id="editarExamen">
                         <form id="frmPaqExamen" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="examen encabezadoformulario" >Editar paquete de exámenes </h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>                                
                                <div >
                                    <span class="campo-par"><label >Clave:</label><input  id="cve_paqexamen" name="cve_paqexamen"/></span>
                                    <span class="campo-par"><label >Descripción:</label><input style="width:400px;" id="descripcion" name="descripcion"/></span>
                                </div>
                                <fieldset class="examenes"><legend>Exámenes asociados</legend>
                                    <div id="examenes-asociados" class="scrollable" offset="400"></div>
                                </fieldset>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span style="width:300px;">
                                        <button class="guardar btnFormularios" onclick="GuardarPaqExamen()" >Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="RecorrerElemento('principal',0)">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>

                    
                    <div class="formulario " id="Div1">
                         <form id="frmAsignarVarExamen" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="examen encabezadoformulario">Asignar variables a exámen.</h2>
                            	<div  id="Div2" class="alert-box error ocultar"><span id="Span1">.</span></div>
                                <div >
                                    <span class="campo-par"><label >Clave:</label><input  id="Text1" name="cve_paqexamen"/></span>
                                    <span class="campo-par"><label >Descripción:</label><input style="width:400px;" id="Text2" name="descripcion"/></span>
                                </div>
                                <fieldset class="examenes"><legend>Exámenes asociados</legend>
                                    <div id="Div3" class="scrollable" offset="400"></div>
                                </fieldset>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span style="width:300px;">
                                        <button class="guardar btnFormularios" onclick="GuardarPaqExamen()" >Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="RecorrerElemento('principal',0)">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>


                </div>
           </div>
       </div>
    <% } else {%>
        <item:comun ID="Comun1" runat="server" />
    <%}%>
    </body>
</html>
