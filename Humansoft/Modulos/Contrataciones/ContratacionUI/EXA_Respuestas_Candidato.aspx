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
        <script src="js/examenes.js?ver=1.4" type="text/javascript"></script>
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
            .r-respuesta{font-family:Arial;font-size:13px;font-weight:bold;font-style:italic;padding:10px;}
        </style>
        <script src="../../../Recursos/Chart.js-master/Chart.js"></script>
        <style>
            #canvas-holder {
            width: 100%;
            margin-top: 50px;
            text-align: center;
        }
        #chartjs-tooltip {
            opacity: 1;
            position: absolute;
            background: rgba(0, 0, 0, .7);
            color: white;
            padding: 3px;
            border-radius: 3px;
            -webkit-transition: all .1s ease;
            transition: all .1s ease;
            pointer-events: none;
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
        }
        #chartjs-tooltip.below {
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
        }
        #chartjs-tooltip.below:before {
            border: solid;
            border-color: #111 transparent;
            border-color: rgba(0, 0, 0, .8) transparent;
            border-width: 0 8px 8px 8px;
            bottom: 1em;
            content: "";
            display: block;
            left: 50%;
            position: absolute;
            z-index: 99;
            -webkit-transform: translate(-50%, -100%);
            transform: translate(-50%, -100%);
        }
        #chartjs-tooltip.above {
            -webkit-transform: translate(-50%, -100%);
            transform: translate(-50%, -100%);
        }
        #chartjs-tooltip.above:before {
            border: solid;
            border-color: #111 transparent;
            border-color: rgba(0, 0, 0, .8) transparent;
            border-width: 8px 8px 0 8px;
            bottom: 1em;
            content: "";
            display: block;
            left: 50%;
            top: 100%;
            position: absolute;
            z-index: 99;
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
        }
        </style>

        <style>
            .agrupacion{width:94%;margin-bottom:20px;}
            .agrupacion span label{float:left;clear:left;margin:2px;}
            .agrupacion span b{float:left;clear:right;margin:2px;}
        </style>

    </head>
    <body class="fondo" onload="IniciarGraficas();">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">

                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="examen encabezadoformulario" >
                                Resultados de exámen
                                 <button class="btnFormularios regresar" onclick="ObtenerRespuestasCandidato();RecorrerElemento('principal','-900');">Ver respuestas del candidato</button>
                            </h2>                            
                            <div class="scrollable" offset="180" style="padding-top:10px;">
                                <div class="encabezado-horario agrupacion">
                                    <span><label>Nombre: </label><b>Jonathan Díaz</b></span>
                                    <span><label>RFC: </label><b>DIPE850502</b></span>
                                    <span><label>Vacante: </label><b>Analista de créditos</b></span>
                                </div>
                                <div id="Div1" style="float:left;width:45%;">
                                    <canvas id="chart-area2" width="250" height="200" />
                                </div>
                                <div id="chartjs-tooltip"></div>

                                <div style="width:50%;float:left;">
			                        <div>
				                        <canvas id="canvas" height="250" width="400"></canvas>
			                        </div>
		                        </div>

                                <script>
                                    Chart.defaults.global.customTooltips = function (tooltip){

                                        // Tooltip Element
                                        var tooltipEl = $('#chartjs-tooltip');

                                        // Hide if no tooltip
                                        if (!tooltip) {
                                            tooltipEl.css({
                                                opacity: 0
                                            });
                                            return;
                                        }

                                        // Set caret Position
                                        tooltipEl.removeClass('above below');
                                        tooltipEl.addClass(tooltip.yAlign);

                                        // Set Text
                                        tooltipEl.html(tooltip.text);

                                        // Find Y Location on page
                                        var top;
                                        if (tooltip.yAlign == 'above') {
                                            top = tooltip.y - tooltip.caretHeight - tooltip.caretPadding;
                                        } else {
                                            top = tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
                                        }

                                        // Display, position, and set styles for font
                                        tooltipEl.css({
                                            opacity: 1,
                                            left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
                                            top: tooltip.chart.canvas.offsetTop + top + 'px',
                                            fontFamily: tooltip.fontFamily,
                                            fontSize: tooltip.fontSize,
                                            fontStyle: tooltip.fontStyle,
                                        });
                                    };

                                    var pieData = [{
                                        value: 300,
                                        color: "#F7464A",
                                        highlight: "#FF5A5E",
                                        label: "Análitico"
                                    }, {
                                        value: 50,
                                        color: "#46BFBD",
                                        highlight: "#5AD3D1",
                                        label: "Visionario"
                                    }, {
                                        value: 100,
                                        color: "#FDB45C",
                                        highlight: "#FFC870",
                                        label: "Lógico"
                                    }, {
                                        value: 40,
                                        color: "#949FB1",
                                        highlight: "#A8B3C5",
                                        label: "Intuitivo"
                                    }];

                                    var IniciarGraficas = function () {
                                        $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerResultadosCandidato", seccion: "Examen", cve_examen: 3, cve_candidato: 'DIPE850502'}).done(function (xmlDoc) {
                                            var randomScalingFactor = function () { return Math.round(Math.random() * 100) };
                                            var lineChartData = {
                                                labels: [],
                                                datasets: [
                                                    {
                                                        label: "Valores",
                                                        fillColor: "rgba(151,187,205,0.2)",
                                                        strokeColor: "rgba(151,187,205,1)",
                                                        pointColor: "rgba(151,187,205,1)",
                                                        pointStrokeColor: "#fff",
                                                        pointHighlightFill: "#fff",
                                                        pointHighlightStroke: "rgba(151,187,205,1)",
                                                        data: []
                                                    }
                                                ]
                                            }
                                            var puntos= xmlDoc.getElementsByTagName("Table");
                                            for (var i = 0; i < puntos.length; i++) {
                                                lineChartData.labels.push(GetValor(puntos[i], "descripcion"));
                                                lineChartData.datasets[0].data.push(GetValor(puntos[i], "PuntosPorVariable"));
                                            }
                                            var ctx = document.getElementById("canvas").getContext("2d");
                                            window.myLine = new Chart(ctx).Line(lineChartData, {
                                                responsive: true
                                            });
                                        });
                                        var ctx2 = document.getElementById("chart-area2").getContext("2d");
                                        window.myPie = new Chart(ctx2).Pie(pieData);
                                    };
                                </script>


                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>

                    <div id="editarPreguntas" class="ventana">
                        <input style="width:60px;" id="cve_examen" name="cve_examen" type="hidden" value="3"/>
                        <div class="alinear smart-green">
                            <h2 class="examen encabezadoformulario" >
                                Respuestas del candidato
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
                            <iframe id="consola" style="display:none;"></iframe>
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
