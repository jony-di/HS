<%@ Page Language="C#"%>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
     <title></title>
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js?ver=1.5"></script>
        <script src="js/controlacceso.js?ver=1.1"></script>
        <script src="js/flujos.js?ver=1.38" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" />
        <script src="../../../Recursos/js/SeleccionSecuencial.js"></script>
        <link href="css/esquemaFlujo.css?ver=1.0" rel="stylesheet" />
        <style>
            inputs[type=checkbox], inputs[type=radio]{width:auto !important;height:auto !important;}
            ul{list-style:none;padding-left:10px;}
            .roles li:hover, .roles li label:hover, .roles li.seleccionado{cursor:pointer;background:#e9e9e9;border-right:2px solid #4690c1;}
            ul li{height:35px;}
            ul li input[type=checkbox],ul li input[type=radio]{float:left;clear:left;}
            ul li label{float:left;clear:right;}
            h3{clear:both;padding-top:20px;}
            ul.acciones li{}
            .asignados .btnFormularios{float:right;margin-right:20px;}
            .campo-par{display:block;clear:both;height:35px;}
            .campo-par label{clear:right;}
            .columnaI input[type=text]{clear:left;width:250px;}

            .campo-par{display:block;clear:both;}
            .campo-par label{float:left;width:80px;padding:5px;}
            .campo-par b{float:left;width:230px;padding:5px;border:1px solid #E5E5E5;padding:4px;margin-top:10px;min-height:19px;}
            .campo-par input{width:110px;padding:0px;float:left;}
            .campo-par select{width:110px;padding:0px;float:left;}

            .flujo div.paso span:hover{cursor:pointer;background:#cfe0eb;border:1px solid #e9e9e9;}

        </style>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal" style="width:3000px;"><!-- Carrete-->                    
                    <div class="ventana">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Flujos de justificación</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Flujos" onkeyup="BuscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoFlujo();">Agregar</button>
                            <div class="wrapper-tabla scrollable" offset="310">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th width="100" ><label> Editar</label></th>
                                            <th width="100" ><label> Clave</label></th>
                                            <th width="600" ><label class="ordenar">Descripción</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista" class="filas-seleccionables"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>
                    
                    <div class="formulario ventana" id="frmFlujo">
                         <form id="frmNuevoFlujo" class="smart-green" onsubmit="return false;">
                            <h2 class="encabezadoformulario" >Editar Flujo </h2>
                            <div id="notificacion" class="alert-box error"><span id="mensaje-alerta">.</span></div>
                            <div class="columnaI" offset="280">
                                <span class="campo-par"><label>Clave</label><input id="cve_flujo" name="cve_flujo" style="text-align:center;"/></span>
                                <span class="campo-par"><label>Descripción</label><input id="descripcion" name="descripcion" style="width:250px;" /></span>
                                <span class="campo-par"><label>Activo</label><input id="activo" name="activo" type="checkbox" value="true" style="width:auto;height:auto;margin-top:15px;" /></span>                                                                                              
                            </div>
                             <div class="columnaD scrollable flujo" offset="280" id="esquemaFlujo"></div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones">
                                <span style="width:400px;">
                                    <button class="guardar btnFormularios" onclick="GuardarFlujo();" style="float:left;margin-left:60px;">Guardar</button>
                                    <button id="btnIniciarFlujo" class="guardar btnFormularios" onclick="GuardarFlujo(Pasos.MostrarIniciarFlujo);" style="float:left;margin-left:60px;">Iniciar flujo</button>                                    
                                    <button class="cancelar btnFormularios" onclick="DesplazarElemento('principal',0)">Salir</button>
                                </span>
                            </div>
                         </form>
                    </div>
                    
                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar ventana" src="consola.htm" frameborder="0" scrolling="no" ></iframe>

                    <div class="formulario ventana ventanaPaso" name="formulario" id="ventanaClonable">
                         <form class="smart-green" onsubmit="return false;" name="frmPaso">
                            <h2 class="encabezadoformulario" >Editar Flujo: Paso 1</h2>
                            <div class="notificacion alert-box error" style="visibility:hidden;" ><span>.</span></div>
                            <div>
                                <fieldset><legend>Seleccione Estatus</legend>
                                    <select class="listaEstatus" style="width:60%;margin:auto;display:block;" name="cve_estatus"></select>
                                    <input type="hidden" class="estatusAnterior" name="cve_estatusAnterior"/>
                                </fieldset> 
                                <fieldset  class="scrollable" offset="370" style="float:left;width:22%;margin-bottom:20px;clear:none;"><legend>Roles</legend>
                                    <ul class="roles" ></ul>                                    
                                </fieldset>                                
                                <fieldset  class="scrollable" offset="420" style="overflow:auto;float:left;margin-left:2%;width:22%;margin-bottom:0px;clear:none;"><legend>Acciones</legend>
                                    <ul class="acciones"></ul>
                                </fieldset>
                                <fieldset class="scrollable" offset="420" style="width:40%;float:left;margin-left:2%;position:relative;margin-bottom:0px;clear:none;">                                    
                                    <legend>Empleados Asignados</legend>
                                    <div class="divAsignados" style="display:none;">
                                        <div style="padding:10px;padding-right:0px;">
                                            <button class="btn" style="padding:5px;float:right;margin-right:15px;margin-bottom:10px;" onclick="var frmPaso=ObtenerParentNode(this,'div','name','formulario'); MostrarCatalogoPorAsignar($(frmPaso).find('.asignados')[0],$(frmPaso).find('.roles')[0]);">Seleccionar</button>
                                        </div>
                                        <ul style="padding-top:10px;margin:0px;" class="asignados"></ul>
                                   </div>
                                </fieldset>
                                 <div style="padding:10px;padding-right:0px; padding-left:40px;bottom:0px;width:60%;float:left;">
                                    <button class="btn guardarParaRol" style="padding:5px;float:left;margin-right:15px;" onclick="var frmPaso=ObtenerParentNode(this,'div','name','formulario');GuardarEmpleadosAccionesRole(frmPaso);">Guardar</button>
                                </div>
                            </div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones">
                                <span style="width:500px;">
                                    <button class="guardar btnFormularios seguir"  onclick="DesplazarElemento('principal',parseInt(document.getElementById('principal').style.left) + 900)" style="margin-left:0px;float:left;">Atras</button>
                                    <button class="guardar btnFormularios seguir btnSig" onclick="var ventanaClonable=ObtenerParentNode(this,'div','name','formulario'); Pasos.GuardarPaso(ObtenerParentNode(this,'form','name','frmPaso'), function(){Pasos.MostrarSiguientePaso(ventanaClonable);});" style="margin-left:30px;float:left;display:none;">Guadar estatus y continuar</button>
                                    <button class="guardar btn seguir btnNuevo" onclick="var ventanaClonable=ObtenerParentNode(this,'div','name','formulario'); Pasos.MostrarSiguientePaso(ventanaClonable);" style="margin-left:30px;float:left;padding:7px;display:block;">Nuevo paso</button>
                                    <button class="cancelar btnFormularios fin" onclick="DesplazarElemento('principal',-900);">Salir</button>
                                </span>
                            </div>
                         </form>
                    </div>

                </div>
            </div>
        </div>
        <div style="display:none;"><div id="buscarEmpleados" style="width:500px;height:400px;"></div></div>
                  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
