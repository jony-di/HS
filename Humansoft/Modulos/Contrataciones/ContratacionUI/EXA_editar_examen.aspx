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
        <script src="js/examenes.js?ver=1.2" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js"></script>
        <link href="../../../Recursos/treeview/simpletree.css" rel="stylesheet" />
        <script src="../../../Recursos/treeview/simpletreemenu.js"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" />
        <script src="../../../Recursos/fancybox/jquery.fancybox.js"></script>
        <style>
            .bodyform label{float:left;clear:left;margin-right:10px;width:100px;}
            .bodyform input{float:left;clear:right;width:200px;}
            .bodyform input[type=checkbox]{width:auto;}
            .bodyform textarea{}
            
             a.seleccionado{padding:3px 3px 3px 30px; background:transparent url(/Recursos/imagenes/ok.png) no-repeat left center;}

            .unaPregunta{padding:5px;float:left;margin-bottom:20px;width:735px;background-color:white;padding-top:10px;}
            .unaPregunta .eliminar{padding:2px;float:right;margin-right:-15px;margin-top:-23px;position:relative;}
            .unaPregunta .guardar{float:right;padding:0px 6px;margin-top:6px;margin-right:20px;}
            .unaPregunta textarea.descripcion{float:left;clear:right;width:87%;height:45px;margin-bottom:5px;background-color:white;margin-left:1%;}
            .unaPregunta input[type=file]{width:100px;float:left;}
            .unaPregunta select{float:left;width:170px;margin-left:40px;}
            .cve_pregunta{float:left;height:56px !important;clear:left;width:7%}

            .unaRespuesta{padding:5px;float:left;margin-bottom:20px;width:710px;background-color:#ffb37d;padding-top:10px;position:relative;top:10px;}
            .agrupacion .eliminar{padding:2px;float:right;margin-right:-15px;margin-top:-23px;position:relative;}
            .unaRespuesta .guardar{float:right;padding:0px 6px;margin-top:6px;margin-right:20px;}
            .unaRespuesta textarea.descripcion{float:left;clear:right;width:87%;height:45px;margin-bottom:5px;background-color:white;margin-left:1%;}
            .unaRespuesta input.descripcionpar{float:left;clear:right;width:87%;margin-bottom:5px;background-color:white;margin-left:8%;padding:0px;}
            .unaRespuesta input[type=file]{width:60px;float:left;}
            .unaRespuesta select{float:left;width:200px;margin-left:40px;}
            .unaRespuesta input.cve_respuesta{float:left;height:56px !important;clear:left;width:7%;background:transparent;border:0px;box-shadow:none;font-weight:bolder;color:#fff;padding:0px;}

            .definicionPregunta{width:735px;background:#fff;border-color:#B9D7F5;margin-bottom:5px;}
            .definicionPregunta .clave{float:left;padding:4px;margin-right:0px;color:#0094ff;font-size:11px;}
            .definicionPregunta .secuencia{float:left;padding:4px;clear:right;color:#ff6a00;}
            .definicionPregunta .descripcion{float:left;clear:both;width:735px;padding:0px;font-size:14px;font-weight:bold;margin:0px;}
            .definicionPregunta .puntaje{float:right;font-size:11px;color:#000;padding:0px;margin-top:0px;}
            .definicionPregunta .editar{float:right;width:22px;margin-right:0px;cursor:pointer;margin-left:20px;}

            .definicionRespuesta{width:605px;background:#fff;border-color:#B9D7F5;margin-bottom:0px;padding:0px;clear:both;float:left;padding-top:4px;}
            .definicionRespuesta .clave{float:left;padding:4px;margin-right:100px;color:#0094ff;}
            .definicionRespuesta .editar{float:right;width:22px;margin-right:0px;cursor:pointer;margin-left:20px;}
            .definicionRespuesta .wrap-respuestas{clear:both;}
            .definicionRespuesta hr.cambiar-linea{clear:both;visibility:hidden;}
            
            .wrap-respuestas{clear:both;}
            .wrap-respuestas .definicionRespuesta label{float:left;clear:none;padding:0px;margin:0px;}
            .wrap-respuestas .multiple input,.wrap-respuestas .varias input{float:left;clear:left;height:auto;}
            .wrap-respuestas .abierta textarea{clear:both;display:block;width:99%;height:40px;margin:auto;float:none;}
            .wrap-respuestas .prioridad input{clear:left;float:left;width:40px;margin-right:10px;}
            .wrap-respuestas .prioridad label{margin-top:9px;}

            .asocia .itemasocia,.asocia .itemasociapar{width:250px;float:left;}
            .asocia input{width:40px;float:left;}
            .asocia label{width:190px;float:left;margin-left:5px !important;margin-top:7px !important;}
            .definicionRespuesta .asocia .itemasociapar{width:300px;float:right;}
            .wrap-respuestas .asociacion label{margin-top:9px;}

            .grupo-respuestas{float:left;width:30%;margin:1%;overflow:hidden;border:1px dotted;border-color:#0094ff;padding:2px;font-size:11px;}
            .grupo-respuestas .definicionRespuesta{padding:2px;clear:both;margin:0px;width:auto;}
            .grupo-respuestas label{float:left;width:27%;}
            .grupo-respuestas .agrupadas input{float:right;width:20%;border-width:1px;border-style:solid;border-color:#000 !important;background-color:transparent; height:14px;text-align:center;padding:1px;}


            div.agregarItemExamen{float:right;margin-left:50px;display:inline;height:20px;width:100px;padding-top:0px;position:relative;cursor:pointer;margin-top:-2px;}
            div.agregarItemExamen > b{color:#de182c;}
            div.agregarItemExamen ul{width: 150px;margin-left: -40px;list-style:none;background:white;border:1px solid #808080;padding:0px;margin-top:3px;padding-top:20px;}
            div.agregarItemExamen ul li{cursor:pointer;padding:4px;}
            div.agregarItemExamen ul li:hover{background-color:#57afef;color:#dfeef8;}

            div.wrap-columnas{clear:both;min-height:35px;background-color:#E1F0FF;padding:10px;border-radius:6px;}
            div.wrap-columnas ol{float:left;width:100%;}
            div.wrap-columnas .definicionRespuesta{background-color:transparent;width:70px;font-weight:bolder;float:left;}
            div.wrap-columnas .definicionRespuesta label{height:auto;padding:initial;margin:0px;}
            .unaColumna{padding:5px;float:left;margin-bottom:20px;width:250px;background-color:#E1F0FF;padding-top:10px;position:relative;top:10px;}
            .unaColumna .guardar{float:right;padding:0px 6px;margin-top:6px;margin-right:20px;}
            .unaColumna input.descripcion{float:left;clear:right;width:140px;margin-bottom:5px;background-color:white;margin-left:1%;text-align:center;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="examen encabezadoformulario" >Catálogo de exámenes</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los exámenes" onkeyup="buscarCoincidencias(event,this);"/></div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoExamen()" style="width:120px;">Nuevo exámen</button>
                            <div class="scrollable" offset="260">
                                <table class="listaN" id="tableCatalogo" style="width:780px;">
                                    <thead>
                                        <tr class="columnas">
                                            <th><label class="ordenar">Número</label> </th>
                                            <th ><label class="ordenar">Nombre</label></th>
                                            <th><label class="ordenar">Ctd. preguntas</label></th>
                                            <th><label class="ordenar">Escala</label></th>
                                            <th><label class="ordenar">Tiempo estimado</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>
                    <div class="formulario " id="editarExamen">
                         <form id="frmNuevoExamen" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="examen encabezadoformulario" >Editar Exámen 
                                    <button class="btnFormularios regresar" id="btnregresar" onclick="RecorrerElemento('principal',0);">Salir</button>
                                </h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable columnaI bodyform" offset="290">
                                    <label >Número:</label>
                                    <input style="width:60px;" id="cve_examen" name="cve_examen"/>
                                    <label  >Nombre:</label>
                                    <input  style="width:230px;" id="nombre" name="nombre"/>
                                    <label >Cantidad de preguntas:</label>
                                    <input style="width:100px;" id="cantidad" name="cantidad"/>
                                    <label >Objetivo:</label>
                                    <textarea style="clear:both;float:left;width:95%;height:120px;"  id="objetivo" name="objetivo"></textarea>
                                </div>
                                <div class="scrollable columnaD bodyform" offset="290">
                                    <label >Tiempo de respuesta(min):</label>
                                    <input  id="tiemporespuesta" name="tiemporespuesta"/>
                                    <label >Escala:</label>
                                    <input  id="escala" name="escala"/>
                                    <label >Puntaje aceptable:</label>
                                    <input  id="puntaje" name="puntaje"/>
                                    <label >Ordenar aleatoriamente:</label>
                                    <input  id="aleatorio" type="checkbox" name="aleatorio" value="true"/>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span style="width:800px;">
                                        <button class="guardar btnFormularios" onclick="GuardarExamen()">Guardar</button>
                                        <button class="guardar btnFormularios" onclick="VerExamen()" style="float:left;margin-left:40px;">Editar contenido</button>
                                        <button class="guardar btnFormularios" onclick="PublicarExamen()" style="float:left;margin-left:40px;">Publicar exámen</button>
                                        <button class="cancelar btnFormularios" onclick="Respuestas.MostrarEditarEvaluacion(this.parentNode,3,1,1,1,'multiple',true,false);;">Variables a examinar</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div id="editarPreguntas" class="ventana">
                        <div class="alinear smart-green">
                            <h2 class="examen encabezadoformulario" >
                                Editar Exámen 
                                 <button class="btnFormularios regresar" onclick="RecorrerElemento('principal','+900');">Regresar</button>
                            </h2>
                            <div  id="notificaciones-2" class="alert-box error" style="visibility:hidden;"><span></span></div>
                            <div class="scrollable" offset="240" id="contenedorExamen" style="padding-top:15px;">
                                <!--<hr  class="cleaner"/><button class="btn agregar"  onclick="NuevoItemExamen()" style="width:auto;clear:both;">Nueva pregunta</button>
                                <form class="unaPregunta agrupacion" target="consola" onsubmit="return false;" method="post"  enctype="multipart/form-data" >
                                    <span class="eliminar btnFormularios">x</span>
                                    <input name="cve_pregunta" id="cve_pregunta" class="cve_pregunta" />
                                    <textarea name="descripcion" class="descripcion" placeholder="Escriba aquí la pregunta."></textarea>
                                    <input name="puntaje_pregunta" id="puntaje_pregunta" class="puntaje_pregunta" style="width:100px;float:left;margin-right:15px;" placeholder="Puntaje"/>
                                    <input type="file" name="adjunto" />
                                    <select class="tipoPregunta" name="cve_tipopregunta" id="cve_tipopregunta"></select>
                                    <button class="guardar btnFormularios" onclick="Preguntas.GuardarPregunta(this.parentNode)">Guardar</button>
                                </form>-->
                            </div>
                            <hr class="cleaner"/>
                            <iframe id="consola" name="consola" style="display:none;"></iframe>
                        </div>
                    </div>
                </div>
           </div>
       </div>
    <% } else {%>
        <item:comun ID="Comun1" runat="server" />
    <%}%>
    </body>
</html>
