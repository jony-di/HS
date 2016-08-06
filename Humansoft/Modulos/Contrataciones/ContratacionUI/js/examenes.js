var urlBase_WS = "/Modulos/Contrataciones/ContratacionNegocio/";
var Preguntas = function () { }
var Respuestas = function () { }
var VariablesExaminar = function () { }

function MostrarNuevoExamen() {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.esEditar = false;
    frmExamen.reset();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_examen", "cve_examen");
    });
    MostrarFormulario();
}

function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    CargarCatalogoExamenes(1);
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    CargarCatalogoExamenes(1, criterio);
}

function PublicarExamen() {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "PublicarExamen", seccion: "Examen", cve_examen: document.getElementById("cve_examen").value }).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function(){
            VerExamen(true);
        });
    });
}

function VerExamen(sinRecorrido) {
    if (!sinRecorrido) {
        RecorrerElemento('principal', '-900');
    }
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerExamen", cve_examen: document.getElementById("cve_examen").value }).done(function (xmlDoc) {
        QuitarEspera();
        var dbPreguntas = xmlDoc.getElementsByTagName("Pregunta");
        if (dbPreguntas.length > 0) {
            var listaPreguntas = document.getElementById("contenedorExamen");
            $(listaPreguntas).html("");
            var totalregistros; var divPregunta;
            for (var i = 0; i < dbPreguntas.length; i++){
                divPregunta = Preguntas.CearUnaPregunta(
                    GetValor(dbPreguntas[i], "cve_examen")
                    , GetValor(dbPreguntas[i], "cve_pregunta")
                    , GetValor(dbPreguntas[i], "descripcion")
                    , GetValor(dbPreguntas[i], "puntaje")
                    , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                    , GetValor(dbPreguntas[i], "secuencia")
                    , GetValor(dbPreguntas[i], "stiporespuesta")
                );
                listaPreguntas.appendChild(divPregunta);
                var listaRespuestas = $(divPregunta).find(".wrap-respuestas")[0];
                var dbGruposRespuestas = dbPreguntas[i].getElementsByTagName("Agrupacion");
                if (new RegExp("abierta", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                    var divRespuesta = document.createElement("div");
                    divRespuesta.className += " abierta";
                    divRespuesta.innerHTML += "<textarea></textarea>";
                    listaRespuestas.appendChild(divRespuesta);
                } else if (dbGruposRespuestas.length > 0) {
                    if (new RegExp("agrupa", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                        var listaColumnas = $(divPregunta).find(".columnas-pregunta")[0];
                        var olEtiquetas = document.createElement("ol");
                        var etiqueta;
                        var dbColRespuestas = dbPreguntas[i].getElementsByTagName("ColRespuesta");
                        for (var n = 0; n < dbColRespuestas.length; n++) {
                            olEtiquetas.appendChild(Preguntas.CrearUnaEtiqueta(GetValor(dbColRespuestas[n], "cve_examen"), GetValor(dbColRespuestas[n], "cve_pregunta"), GetValor(dbColRespuestas[n], "cve_etiqueta"), GetValor(dbColRespuestas[n], "etiqueta")));
                        }
                        listaColumnas.appendChild(olEtiquetas);
                    }
                    $(listaRespuestas).html("");
                    var divUnGrupo;
                    for (var k = 0; k < dbGruposRespuestas.length; k++) {
                        divUnGrupo = Respuestas.CrearUnGrupo(
                                 GetValor(dbGruposRespuestas[k], "cve_examen")
                                 , GetValor(dbGruposRespuestas[k], "cve_pregunta")
                                 , GetValor(dbGruposRespuestas[k], "cve_grupo")
                                 , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                                 , GetValor(dbPreguntas[i], "stiporespuesta")
                        );
                        var totalregistros; var divRespuesta;
                        var dbRespuestas = dbGruposRespuestas[k].getElementsByTagName("Respuesta");
                        for (var j = 0; j < dbRespuestas.length; j++) {
                            divRespuesta = Respuestas.CearUnaRespuesta(
                                  GetValor(dbRespuestas[j], "cve_examen")
                                , GetValor(dbRespuestas[j], "cve_pregunta")
                                , GetValor(dbRespuestas[j], "cve_grupo")
                                , GetValor(dbRespuestas[j], "cve_respuesta")
                                , GetValor(dbRespuestas[j], "descripcion")
                                , GetValor(dbRespuestas[j], "descripcionpar")
                                , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                                , GetValor(dbPreguntas[i], "stiporespuesta")
                            );
                            if (new RegExp("agrupa", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                                $(divUnGrupo).find(".wrap-resp-grupo")[0].appendChild(divRespuesta);
                            } else{
                                listaRespuestas.appendChild(divRespuesta);
                            }
                        }
                        if (new RegExp("agrupa", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                            listaRespuestas.appendChild(divUnGrupo);
                        }
                    }
                }
            }
        } else {
            Preguntas.MostrarEditarPregunta('contenedorExamen', document.getElementById("cve_examen").value,1,true,undefined, 1);
        }
    });
}

function ObtenerRespuestasCandidato(){
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerRespuestasCandidato", cve_examen: 3, cve_candidato:"dipe850502",cve_vacante:13 }).done(function (xmlDoc) {
        QuitarEspera();
        var dbPreguntas = xmlDoc.getElementsByTagName("Pregunta");
        if (dbPreguntas.length > 0) {
            var listaPreguntas = document.getElementById("contenedorExamen");
            $(listaPreguntas).html("");
            var totalregistros; var divPregunta;
            var esLectura = true;
            var stiporespuesta;
            for (var i = 0; i < dbPreguntas.length; i++) {
                stiporespuesta = GetValor(dbPreguntas[i], "stiporespuesta");
                divPregunta = Preguntas.CearUnaPregunta(
                    GetValor(dbPreguntas[i], "cve_examen")
                    , GetValor(dbPreguntas[i], "cve_pregunta")
                    , GetValor(dbPreguntas[i], "descripcion")
                    , GetValor(dbPreguntas[i], "puntaje")
                    , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                    , GetValor(dbPreguntas[i], "secuencia")
                    , stiporespuesta
                    ,esLectura
                );
                listaPreguntas.appendChild(divPregunta);
                var listaRespuestas = $(divPregunta).find(".wrap-respuestas")[0];
                var dbGruposRespuestas = dbPreguntas[i].getElementsByTagName("Agrupacion");
                if (new RegExp("abierta", "gi").test(stiporespuesta)) {
                    var divRespuesta = document.createElement("div");
                    divRespuesta.className += " abierta";
                    divRespuesta.innerHTML += "<textarea></textarea>";
                    listaRespuestas.appendChild(divRespuesta);
                } if (new RegExp("agrupa", "gi").test(stiporespuesta)) {
                        var listaColumnas = $(divPregunta).find(".columnas-pregunta")[0];
                        var olEtiquetas = document.createElement("ol");
                        var etiqueta;
                        var dbColRespuestas = dbPreguntas[i].getElementsByTagName("ColRespuesta");
                        for (var n = 0; n < dbColRespuestas.length; n++){
                            olEtiquetas.appendChild(Preguntas.CrearUnaEtiqueta(GetValor(dbColRespuestas[n], "cve_examen"), GetValor(dbColRespuestas[n], "cve_pregunta"), GetValor(dbColRespuestas[n], "cve_etiqueta"), GetValor(dbColRespuestas[n], "etiqueta")));
                        }
                        listaColumnas.appendChild(olEtiquetas);
                    }
                    $(listaRespuestas).html("");                    
                    var totalregistros; var divRespuesta;
                    var dbRespuestas = dbPreguntas[i].getElementsByTagName("Respuesta");
                    for (var j = 0; j < dbRespuestas.length; j++) {
                        divRespuesta = Respuestas.CearUnaRespuesta(
                                GetValor(dbRespuestas[j], "cve_examen")
                            , GetValor(dbRespuestas[j], "cve_pregunta")
                            , GetValor(dbRespuestas[j], "cve_grupo")
                            , GetValor(dbRespuestas[j], "cve_respuesta")
                            , GetValor(dbRespuestas[j], "descripcion")
                            , GetValor(dbRespuestas[j], "descripcionpar")
                            , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                            , stiporespuesta
                            , esLectura
                        );
                        if (new RegExp("agrupa", "gi").test(stiporespuesta)) {
                            $(divUnGrupo).find(".wrap-resp-grupo")[0].appendChild(divRespuesta);
                        } else {
                            listaRespuestas.appendChild(divRespuesta);
                        }
                    }
                    if (new RegExp("agrupa", "gi").test(stiporespuesta)) {
                        listaRespuestas.appendChild(divUnGrupo);
                    }
            }
        } else {
            Preguntas.MostrarEditarPregunta('contenedorExamen', document.getElementById("cve_examen").value, 1, true, undefined, 1);
        }
    });
}

Preguntas.CrearUnaEtiqueta = function (cve_examen, cve_pregunta, cve_etiqueta, etiqueta) {
    var liColumna = document.createElement("li");
    liColumna.className = "definicionRespuesta";
    liColumna.setAttribute("cve_examen", cve_examen);
    liColumna.setAttribute("cve_pregunta", cve_pregunta);
    liColumna.innerHTML =
        "<img class='editar' src='/Recursos/imagenes/eliminar.png' onclick='Preguntas.EliminarColumna(this.parentNode," + cve_examen + "," + cve_pregunta + "," + cve_etiqueta + ");'" + "/>" +
        "<label class='etiqueta'>" + etiqueta + "</label>";
    return liColumna;
}

Preguntas.EliminarColumna = function (objeto, cve_examen, cve_pregunta, cve_etiqueta) {
    if (confirm("Confirme que desea eliminar la columna:")) {
        $.post(urlBase_WS + "NExamenes.aspx", { op: "EliminarColumna", seccion: "Columnas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_columna: cve_etiqueta }).done(function (xmlDoc) {
            mostrarNotificacion(xmlDoc, "notificacion", function(){
                VerExamen(true);
            });
        });
    }
}

/*****************************************************************************************************************************************************************************/
function ObtenerCatalogoTiposPregunta(selectTipoPregunta, callback) {
    LlenarSelect(urlBase_WS + "NExamenes.aspx?op=ObtenerCatalogoTiposPregunta&seccion=Preguntas", undefined, "Tipo de pregunta", "cve_tipopregunta", "descripcion", function (selectLleno) {
        selectTipoPregunta.parentNode.replaceChild(selectLleno, selectTipoPregunta);
        if (callback) callback(selectLleno);
    });
}

function MostrarNuevoExamen() {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.esEditar = false;
    frmExamen.reset();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_examen", "cve_examen");
    });
    MostrarFormulario();
}

Preguntas.MostrarEditarPregunta = function (objeto, cve_examen, cve_pregunta, esAfter, esEditar, secuencia) {
    var frmPregunta = document.createElement("form");
    frmPregunta.className = "unaPregunta agrupacion";
    frmPregunta.target="consola";
    frmPregunta.onsubmit=function(){return false;};
    frmPregunta.method="post";
    frmPregunta.enctype = "multipart/form-data";
    frmPregunta.esEditar = esEditar;
    var descripcion, puntaje, tipopregunta;

    var parametros = { op: "DetallePregunta", seccion: "Preguntas", cve_examen: cve_examen, cve_pregunta: cve_pregunta };
    if (esAfter) {
        parametros = { op: "ClaveSiguientePregunta", seccion: "Preguntas", cve_examen: cve_examen};
    }
    $.post(urlBase_WS + "NExamenes.aspx", parametros).done(function (xmlDoc) {
        frmPregunta.innerHTML = '<span class="eliminar btnFormularios" onclick="Preguntas.CancelaEdicionPregunta(this.parentNode,' + cve_examen + "," + GetValor(xmlDoc, "cve_pregunta") + ')">x</span>' +
                          '<input name="cve_examen" type="hidden" value="' + cve_examen + '"/>' +
                          '<input name="cve_pregunta"  class="cve_pregunta" value="' + GetValor(xmlDoc, "cve_pregunta") + '"/>' +
                          '<input name="secuencia"  type="hidden" class="secuencia" value="' + secuencia + '"/>' +
                          '<textarea name="descripcion" class="descripcion" placeholder="Escriba aquí la pregunta.">' + GetValor(xmlDoc, "descripcion") + '</textarea>' +
                          '<input name="puntaje_pregunta" class="puntaje_pregunta" style="width:50px;float:left;margin-right:15px;" placeholder="Puntaje" value="' + GetValor(xmlDoc, "puntaje") + '"/>' +
                          '<input type="file" name="adjunto" />' +
                          '<select class="tipoPregunta" name="cve_tipopregunta"></select>' +
                          '<select class="tipoRespuesta" name="cve_tiporespuesta"></select>' +
                          '<button class="guardar btnFormularios" onclick="Preguntas.GuardarPregunta(this.parentNode)">Guardar</button>';
        if (typeof objeto == "string") {
            var contenedor = document.getElementById(objeto);
            contenedor.innerHTML = "";
            contenedor.appendChild(frmPregunta);
        } else if (esAfter) {
            var btnAgregarItem=$(objeto).find(".agregarItemExamen")[0];
            btnAgregarItem.style.display = "none";
            frmPregunta.btnAgregarItem = btnAgregarItem;
            $(frmPregunta).insertAfter(objeto);
        }else{
            objeto.parentNode.replaceChild(frmPregunta, objeto);
        }
        var selectTipoPregunta = $(frmPregunta).find("select.tipoPregunta")[0];
        ObtenerCatalogoTiposPregunta(selectTipoPregunta, function (selectCompleto) {
            selectCompleto.setAttribute("name", "cve_tipopregunta");
            selectCompleto.className = "tipoPregunta";
            SetValorDx(selectCompleto, GetValor(xmlDoc, "cve_tipopregunta"));
        });
        var selectTipoRespuesta = $(frmPregunta).find("select.tipoRespuesta")[0];
        ObtenerCatalogoTiposRespuesta(selectTipoRespuesta, function (selectCompleto) {
            selectCompleto.setAttribute("name", "cve_tiporespuesta");
            selectCompleto.className = "tipoRespuesta";            
            SetValorDx(selectCompleto, GetValor(xmlDoc, "cve_tiporespuesta"));
        });
    });
}

Preguntas.CancelaEdicionPregunta = function (frmEdicion, cve_examen, cve_pregunta) {
    try { frmEdicion.btnAgregarItem.style.display = "inline" } catch (e) { }
    Preguntas.CambiarFormularioPorPregunta(frmEdicion, cve_examen, cve_pregunta);
}

Preguntas.GuardarPregunta = function (formPregunta) {
    if (!formPregunta.esEditar) {
        Preguntas.GuardarEdicionPregunta("NuevaPregunta", formPregunta);
    }else{
        Preguntas.GuardarEdicionPregunta("EditarPregunta", formPregunta);
    }
}


Preguntas.CargarDatosPregunta = function (cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetallePregunta", seccion: "Preguntaes", pagina: 1, longitudPagina: 50, criterio: "", cve_examen: cve }).done(function (xmlDoc) {
        var dbPregunta = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbPregunta, "cve_examen", "cve_examen");
        SetValor(dbPregunta, "nombre", "nombre");
        SetValor(dbPregunta, "objetivo", "objetivo", "bool");
        SetValor(dbPregunta, "cantidad", "cantidad");
        SetValor(dbPregunta, "tiemporespuesta", "tiemporespuesta");
        SetValor(dbPregunta, "aleatorio", "aleatorio", "bool");
        SetValor(dbPregunta, "puntaje", "puntaje");
    });
}

Preguntas.GuardarEdicionPregunta = function (op, formPregunta) {
    window.preguntaActiva = formPregunta;
    formPregunta.action = "../ContratacionNegocio/NExamenes.aspx?seccion=Preguntas&op=" + op + "&cve_examen=" + document.getElementById("cve_examen").value;
    formPregunta.submit();
}

Preguntas.HandlerGuardarPregunta = function (estatus, mensaje, cve_examen, cve_pregunta) {
    mostrarNotificacion(undefined, "notificaciones-2", function(){
        VerExamen(true);
    },estatus,mensaje);
}

Preguntas.CambiarFormularioPorPregunta = function (frmPregunta, cve_examen, cve_pregunta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "DetallePregunta", seccion: "Preguntas", cve_examen: cve_examen, cve_pregunta: cve_pregunta }).done(function (xmlDoc) {
        if (GetValor(xmlDoc, "cve_examen") != "" || GetValor(xmlDoc, "cve_pregunta") != "") {
            var divPregunta = Preguntas.CearUnaPregunta(GetValor(xmlDoc, "cve_examen"), GetValor(xmlDoc, "cve_pregunta"), GetValor(xmlDoc, "descripcion"), GetValor(xmlDoc, "puntaje"), GetValor(xmlDoc, "cve_tiporespuesta"), GetValor(xmlDoc, "secuencia"), GetValor(xmlDoc, "stiporespuesta"));
            frmPregunta.parentNode.replaceChild(divPregunta, frmPregunta);
        } else {
            frmPregunta.parentNode.removeChild(frmPregunta);
        }
    });
}

Preguntas.CearUnaPregunta = function (cve_examen, cve_pregunta, descripcion, puntaje, cve_tiporespuesta, secuencia,stiporespuesta,_esLectura) {
    var divPregunta = document.createElement("div");
    divPregunta.className = "definicionPregunta agrupacion";
    divPregunta.innerHTML =
        "<label class='clave'>Clave:<b>" + cve_pregunta + "</b></label>" +
        (! _esLectura?(
        "<img class='editar' src='/Recursos/imagenes/eliminar.png' onclick='Preguntas.EliminarPregunta(this.parentNode," + cve_examen + "," + cve_pregunta + "," + secuencia + ");'" + "/>" +
        "<img class='editar' src='/Recursos/imagenes/editar.png' onclick='Preguntas.MostrarEditarPregunta(this.parentNode," + cve_examen + "," + cve_pregunta + ",false,true," + secuencia + ");'" + "/>" +
        "<label class='descripcion'><b>" + secuencia + ") </b>" + descripcion.replace(new RegExp("\n","gi"),"<br\>") + "</label>" +
        //"<label class='tipopregunta'>" + GetValor(xmlDoc, "stiporespuesta") + "</label>" +
        "<div class='agregarItemExamen'><b onclick='if($(this.parentNode).find(\".opcionesExamen\")[0].style.display==\"none\"){$(this.parentNode).find(\".opcionesExamen\")[0].style.display=\"block\";}else{$(this.parentNode).find(\".opcionesExamen\")[0].style.display=\"none\";}'>Agregar</b><ul class='opcionesExamen' style='display:none;'>"+
        "<li onclick='Preguntas.MostrarEditarPregunta(this.parentNode.parentNode.parentNode," + cve_examen + "," + cve_pregunta + ",true,false," + (parseInt(secuencia, 10) + 1) + ");this.parentNode.style.display=\"none\";'>Agregar pregunta</li>" +
        (
            (new RegExp("agrupa", "gi").test(stiporespuesta)) ?
                "<li stiporespuesta='" + stiporespuesta + "' onclick='Respuestas.MostrarAgregarGrupoRespuestas(this.parentNode.parentNode.parentNode," + cve_examen + "," + cve_pregunta + "," + cve_tiporespuesta + ",this.getAttribute(\"stiporespuesta\"));this.parentNode.style.display=\"none\";'>Agregar grupo de respuestas</li>"
             :
                "<li stiporespuesta='" + stiporespuesta + "' onclick='Respuestas.MostrarEditarRespuesta(this.parentNode.parentNode.parentNode," + cve_examen + "," + cve_pregunta + ",undefined," + cve_tiporespuesta + ",this.getAttribute(\"stiporespuesta\"),false,true);this.parentNode.style.display=\"none\";'>Agregar respuesta</li>"
        ) +
        "</ul></div>"):descripcion)  +
        "<label class='puntaje'>Puntaje:<b>" + puntaje + "</b></label>" +
        (new RegExp("agrupa", "gi").test(stiporespuesta) ? "<div class='wrap-columnas'><div class='columnas-pregunta'></div><button style='clear:both;display:block;' onclick='Preguntas.MostrarEditarColumna(this.parentNode," + cve_examen + "," + cve_pregunta + ",undefined,false,true)'>Agregar etiqueta de columna</button></div>" : "") +
        "<div class='wrap-respuestas'></div>";
    return divPregunta;
}


Preguntas.MostrarEditarColumna = function (objeto, cve_examen, cve_pregunta, cve_columna, esEditar, esAfter) {
    var frmColumna = document.createElement("form");
    frmColumna.className = "unaColumna agrupacion";
    frmColumna.target = "consola";
    frmColumna.onsubmit = function () { return false; };
    frmColumna.method = "post";
    frmColumna.enctype = "multipart/form-data";
    frmColumna.esEditar = esEditar;
    var descripcion, puntaje, tiporespuesta;
    var parametros = { op: "ObtenerDetalleColumna", seccion: "Columnas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_columna: cve_columna };
    if (esAfter) {
        parametros = { op: "ClaveSiguiente", seccion: "Columnas", cve_examen: cve_examen, cve_pregunta: cve_pregunta };
    }
    $.post(urlBase_WS + "NExamenes.aspx", parametros).done(function (xmlDoc) {
        frmColumna.innerHTML = '<span class="eliminar btnFormularios" onclick="VerExamen(true);">x</span>' +
                          '<input name="cve_examen" type="hidden" value="' + cve_examen + '"/>' +
                          '<input name="cve_pregunta"  type="hidden" value="' + cve_pregunta + '"/>' +
                          '<input name="cve_columna" type="hidden" value="' + GetValor(xmlDoc, "cve_columna") + '"/>' +
                          '<input name="descripcion" class="descripcion" placeholder="Etiqueta.." value="' + GetValor(xmlDoc, "descripcion") + '"/>' +
                          '<button class="guardar btnFormularios" onclick="Preguntas.GuardarColumna(this.parentNode);">Guardar</button>';
        var contenedor = $(objeto).find(".columnas-pregunta")[0];
        contenedor.appendChild(frmColumna);                
    });
}


Preguntas.GuardarColumna = function (formColumna) {
    if (!formColumna.esEditar) {
        Preguntas.GuardarEdicionColumna("Nuevo", formColumna);
    } else {
        Preguntas.GuardarEdicionColumna("Editar", formColumna);
    }
}

Preguntas.GuardarEdicionColumna = function (op, form) {
    form.action = "../ContratacionNegocio/NExamenes.aspx?seccion=Columnas&op=" + op;
    var parametros = $(form).serialize();
    $.post(form.action + "&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            VerExamen(true);
        });
    });
}

Respuestas.MostrarAgregarGrupoRespuestas = function (objeto, cve_examen, cve_pregunta, cve_tiporespuesta, stiporespuesta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerClaveSiguienteGrupo", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta }).done(function (xmlDoc) {
        $(objeto).find(".wrap-respuestas")[0].appendChild(Respuestas.CrearUnGrupo(cve_examen, cve_pregunta, GetValor(xmlDoc, "cve_grupo"), cve_tiporespuesta, stiporespuesta));
    });
}

Respuestas.MostrarAgregarColumnas = function (objeto, cve_examen, cve_pregunta, cve_tiporespuesta, stiporespuesta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerClaveSiguienteGrupo", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta }).done(function (xmlDoc) {
        $(objeto).find(".wrap-respuestas")[0].appendChild(Respuestas.CrearUnaColumna(cve_examen, cve_pregunta, GetValor(xmlDoc, "cve_grupo"), cve_tiporespuesta, stiporespuesta));
    });
}

Respuestas.CrearUnaColumna = function (cve_examen, cve_pregunta, cve_grupo, cve_tiporespuesta, stiporespuesta) {
    var divColumna = document.createElement("div");
    var wrapRepGrupo = document.createElement("div");
    wrapRepGrupo.className = "wrap-resp-grupo";
    divGrupo.appendChild(wrapRepGrupo);
    var btnEditarRespuesta = document.createElement("button");
    btnEditarRespuesta.innerHTML = "+";
    divGrupo.appendChild(btnEditarRespuesta);
    btnEditarRespuesta.onclick = function () {
        wrapRepGrupo.parentNode.style.width = "100%";
        Respuestas.MostrarEditarRespuesta(this.parentNode, cve_examen, cve_pregunta, undefined, cve_tiporespuesta, stiporespuesta, false, true, true);
        this.style.display = "none";
    }
    divGrupo.className = "grupo-respuestas";
    divGrupo.setAttribute("cve_examen", cve_examen);
    divGrupo.setAttribute("cve_pregunta", cve_pregunta);
    divGrupo.setAttribute("cve_grupo", cve_grupo);
    return divGrupo;
}

Respuestas.CrearUnGrupo = function (cve_examen, cve_pregunta, cve_grupo, cve_tiporespuesta, stiporespuesta) {
    var divGrupo = document.createElement("div");
    if (new RegExp("agrupa", "gi").test(stiporespuesta)){
        var wrapRepGrupo = document.createElement("div");
        wrapRepGrupo.className = "wrap-resp-grupo";
        divGrupo.appendChild(wrapRepGrupo);
        var btnEditarRespuesta = document.createElement("button");
        btnEditarRespuesta.innerHTML = "+";
        divGrupo.appendChild(btnEditarRespuesta);
        btnEditarRespuesta.onclick = function (){
            wrapRepGrupo.parentNode.style.width = "100%";
            Respuestas.MostrarEditarRespuesta(this.parentNode,cve_examen,cve_pregunta, undefined, cve_tiporespuesta, stiporespuesta, false, true, true);
            this.style.display = "none";
        }
        divGrupo.className = "grupo-respuestas";
        divGrupo.setAttribute("cve_examen", cve_examen);
        divGrupo.setAttribute("cve_pregunta", cve_pregunta);
        divGrupo.setAttribute("cve_grupo", cve_grupo);
    }
    return divGrupo;
}

Preguntas.EliminarPregunta = function (divPregunta, cve_examen, cve_pregunta,secuencia) {
    if (confirm("Confirme que desea eliminar la pregunta:")) {
        $.post(urlBase_WS + "NExamenes.aspx", { op: "EliminarPregunta", seccion: "Preguntas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, secuencia:secuencia }).done(function (xmlDoc) {
            mostrarNotificacion(xmlDoc, "notificacion", function (){
                VerExamen(true);
            });
        });
    }
}

Preguntas.DesactivarPregunta = function(cve_departamento) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        cargarCatalogoPregunta();
    });
}

/****************************************************************************************************************************************************************************
 Respuestas
*****************************************************************************************************************************************************************************/

function ObtenerCatalogoTiposRespuesta(selectTipoRespuesta, callback) {
    LlenarSelect(urlBase_WS + "NExamenes.aspx?op=ObtenerCatalogoTiposRespuesta&seccion=Respuestas", undefined, "Tipo de respuesta", "cve_tiporespuesta", "descripcion", function (selectLleno) {
        selectTipoRespuesta.parentNode.replaceChild(selectLleno, selectTipoRespuesta);
        if (callback) callback(selectLleno);
    });
}

function MostrarNuevoExamen() {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.esEditar = false; 
    frmExamen.reset();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_examen", "cve_examen");
    });
    MostrarFormulario();
}

Respuestas.MostrarEditarRespuesta = function (objeto, cve_examen, cve_pregunta, cve_respuesta, cve_tiporespuesta,stiporespuesta,esEditar,esAfter,esGrupo) {
    var frmRespuesta = document.createElement("form");
    frmRespuesta.className = "unaRespuesta agrupacion";    
    frmRespuesta.target = "consola";
    frmRespuesta.onsubmit = function () { return false; };
    frmRespuesta.method = "post";
    frmRespuesta.enctype = "multipart/form-data";
    frmRespuesta.esEditar = esEditar;
    var descripcion, puntaje, tiporespuesta;

    var parametros = { op: "ObtenerDetalleRespuesta", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_respuesta: cve_respuesta };
    if (esAfter) {
        parametros = { op: "ClaveSiguienteRespuesta", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta };
    }
    $.post(urlBase_WS + "NExamenes.aspx", parametros).done(function (xmlDoc) {
        var cve_grupo = (new RegExp("agrupa", "gi").test(stiporespuesta) ? objeto.getAttribute("cve_grupo") : undefined);        
        frmRespuesta.innerHTML = '<span class="eliminar btnFormularios" onclick="Respuestas.CancelaEdicionRespuesta(this.parentNode,' + cve_examen + "," + cve_pregunta + "," + cve_respuesta + ')">x</span>' +
                          '<input name="cve_examen" type="hidden" value="' + cve_examen + '"/>' +
                          '<input name="cve_pregunta"  type="hidden" value="' + cve_pregunta + '"/>' +
                          '<input name="cve_respuesta"  class="cve_respuesta" value="' + GetValor(xmlDoc, "cve_respuesta") + '"/>' +
                          '<textarea name="descripcion" class="descripcion" placeholder="Escriba aquí la respuesta.">' + GetValor(xmlDoc, "descripcion") + '</textarea>' +
                          (new RegExp("asociaci", "gi").test(stiporespuesta) ? "<input type='text' name='descripcionpar' class='descripcionpar'/>" : "") +
                          (cve_grupo ? "<input type='hidden' name='cve_grupo' value='" + cve_grupo + "' />" : "") +
                          '<label style="float:left;margin-left:3px;color:#000;">Es correcto</label><input name="correcto" class="correcto" style="float:left;margin-right:15px;" type="checkbox" value="' + GetValor(xmlDoc, "correcto") + '"/>' +
                          '<input type="file" name="adjunto" />' +
                          '<button class="guardar btnFormularios" onclick="Respuestas.GuardarRespuesta(this.parentNode)">Guardar</button>';
        if (typeof objeto == "string") {
            var contenedor = document.getElementById(objeto);
            contenedor.innerHTML = "";
            contenedor.appendChild(frmRespuesta);
        } else if (new RegExp("definicionRespuesta", "gi").test(objeto.className)) {
            objeto.parentNode.replaceChild(frmRespuesta,objeto);
        } else if (esGrupo) {
            var contenedor = $(objeto).find(".wrap-resp-grupo")[0];
            contenedor.appendChild(frmRespuesta);
        }else {
            var contenedor = $(objeto).find(".wrap-respuestas")[0];
            contenedor.appendChild(frmRespuesta);
        }
        if (frmRespuesta.parentNode.parentNode.className = "grupo-respuestas") {
            frmRespuesta.parentNode.parentNode.setAttribute("widthRespaldo", $(frmRespuesta.parentNode.parentNode).css("width"));
            frmRespuesta.parentNode.parentNode.style.width = "100%";
        }
        //var selectTipoRespuesta = $(frmRespuesta).find("select.tipoRespuesta")[0];
        //ObtenerCatalogoTiposRespuesta(selectTipoRespuesta, function (selectCompleto) {
        //    selectCompleto.setAttribute("name", "cve_tiporespuesta");
        //    selectCompleto.className = "tipoRespuesta";
        //    SetValorDx(selectCompleto, GetValor(xmlDoc, "cve_tiporespuesta"));
        //});
    });
}

Respuestas.CancelaEdicionRespuesta = function (frmEdicion, cve_examen, cve_pregunta,cve_respuesta) {
    VerExamen(true);
}

Respuestas.GuardarRespuesta = function (formRespuesta) {
    if (!formRespuesta.esEditar) {
        Respuestas.GuardarEdicionRespuesta("NuevaRespuesta", formRespuesta);
    } else {
        Respuestas.GuardarEdicionRespuesta("EditarRespuesta", formRespuesta);
    }
}


Respuestas.CargarDatosRespuesta = function (cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetalleRespuesta", seccion: "Respuestaes", pagina: 1, longitudPagina: 50, criterio: "", cve_examen: cve }).done(function (xmlDoc) {
        var dbRespuesta = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbRespuesta, "cve_examen", "cve_examen");
        SetValor(dbRespuesta, "nombre", "nombre");
        SetValor(dbRespuesta, "objetivo", "objetivo", "bool");
        SetValor(dbRespuesta, "cantidad", "cantidad");
        SetValor(dbRespuesta, "tiemporespuesta", "tiemporespuesta");
        SetValor(dbRespuesta, "aleatorio", "aleatorio", "bool");
        SetValor(dbRespuesta, "puntaje", "puntaje");
    });
}

Respuestas.GuardarEdicionRespuesta = function (op, formRespuesta) {
    window.respuestaActiva = formRespuesta;
    formRespuesta.action = "../ContratacionNegocio/NExamenes.aspx?seccion=Respuestas&op=" + op + "&cve_examen=" + document.getElementById("cve_examen").value;
    formRespuesta.submit();
}

Respuestas.HandlerGuardarRespuesta = function (estatus, mensaje, cve_examen, cve_respuesta) {
    mostrarNotificacion(undefined, "notificaciones-2", function () {
        Preguntas.InsertarRespuesta();

    }, estatus, mensaje);
}

Respuestas.CambiarFormularioPorRespuesta = function (frmRespuesta, cve_examen, cve_pregunta, cve_respuesta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "DetalleRespuesta", seccion: "Respuestas", cve_examen: cve_examen,cve_pregunta:cve_pregunta, cve_respuesta: cve_respuesta }).done(function (xmlDoc) {
        if (GetValor(xmlDoc, "cve_examen") != "" || GetValor(xmlDoc, "cve_respuesta") != "") {
            var divRespuesta = Respuestas.CearUnaRespuesta(GetValor(xmlDoc, "cve_examen"), GetValor(xmlDoc, "cve_pregunta"), GetValor(xmlDoc, "cve_grupo"), GetValor(xmlDoc, "cve_respuesta"), GetValor(xmlDoc, "descripcion"), GetValor(xmlDoc, "descripcionpar"), GetValor(xmlDoc, "puntaje"), GetValor(xmlDoc, "cve_tipoRespuesta"), GetValor(xmlDoc, "secuencia"));
            frmRespuesta.parentNode.replaceChild(divRespuesta, frmRespuesta);
        } else {
            frmRespuesta.parentNode.removeChild(frmRespuesta);
        }
    });
}

Respuestas.CearUnaRespuesta = function (cve_examen, cve_pregunta,cve_grupo, cve_respuesta, descripcion,descripcionpar, cve_tiporespuesta, stiporespuesta,_esLectura) {
    var divRespuesta = document.createElement("div");
    divRespuesta.className = "definicionRespuesta";
    divRespuesta.setAttribute("cve_examen", cve_examen);
    divRespuesta.setAttribute("cve_pregunta", cve_pregunta);
    if(!_esLectura){
        divRespuesta.innerHTML =
            "<img class='editar' src='/Recursos/imagenes/eliminar.png' onclick='Respuestas.EliminarRespuesta(this.parentNode," + cve_examen + "," + cve_pregunta + "," + cve_respuesta + ");'" + "/>" +
            "<img class='editar' src='/Recursos/imagenes/editar.png' stiporespuesta='" + stiporespuesta + "' onclick='Respuestas.MostrarEditarRespuesta(this.parentNode," + cve_examen + "," + cve_pregunta + "," + cve_respuesta + "," + cve_tiporespuesta + ",this.stiporespuesta,true,false);'" + "/>"+
            "<img class='editar' src='/Recursos/imagenes/eval.png' stiporespuesta='" + stiporespuesta + "' onclick='Respuestas.MostrarEditarEvaluacion(this.parentNode," + cve_examen + "," + cve_pregunta + "," + cve_respuesta + "," + cve_tiporespuesta + ",this.stiporespuesta,true,false);'" + "/>";
        if (new RegExp("varias", "gi").test(stiporespuesta)) {
            divRespuesta.className += " varias";
            divRespuesta.innerHTML += "<input type='checkbox'/><label>" + descripcion + "</label>";
        } else if (new RegExp("multiple", "gi").test(stiporespuesta)) {
            divRespuesta.className += " multiple";
            divRespuesta.innerHTML += "<input type='radio'/><label>" + descripcion + "</label>";
        } else if (new RegExp("prioridad", "gi").test(stiporespuesta)) {
            divRespuesta.className += " prioridad";
            divRespuesta.innerHTML += "<input type='text'/><label>" + descripcion + "</label>";
        } else if (new RegExp("asocia", "gi").test(stiporespuesta)) {
            divRespuesta.style.display = "block";
            divRespuesta.className += " asocia";
            divRespuesta.innerHTML += "<span class='itemasocia'><input type='text'/><label>" + descripcion + "</label></span>";
            divRespuesta.innerHTML += "<span class='itemasociapar'><input type='text'/><label>" + descripcionpar + "</label></span>";
        } else if (new RegExp("agrupadas", "gi").test(stiporespuesta)) {
            divRespuesta.className += " agrupadas";
            divRespuesta.innerHTML += "<input type='text'/><label>" + descripcion + "</label>";
        } else {
            alert("Tipo de pregunta no definido");
        }
    }else{
        divRespuesta.innerHTML = "<p class='r-respuesta'>" + descripcion + "</p>";
    }
    return divRespuesta;
}

Respuestas.MostrarEditarEvaluacion = function (divRespuesta, cve_examen, cve_pregunta, cve_respuesta) {
        var divTmp = document.createElement("div");
        var alertas = document.createElement("h2");
        alertas.innerHTML = "<span></span>";
        alertas.setAttribute("id","__Alertas_Variables");
        divTmp.appendChild(alertas);
        var divR = document.createElement("div");
        divR.style.width = "800px";
        divR.style.height = "400px";
        divR.innerHTML = "<ul id='__id_Asignar_Variables' class='treeview'><li></li></ul>";
        VariablesExaminar.CargarCatalogo("__id_Asignar_Variables", function (objeto, cve, cve_padre) {
            VariablesExaminar.AsignarVariable(objeto, cve, cve_padre, cve_examen, cve_pregunta, cve_respuesta);
        },true, cve_examen,cve_pregunta,cve_respuesta);
        divTmp.appendChild(divR);
        $.fancybox({type:'html',content:$(divTmp),preload:false,openEffect:'elastic'});
}


Examen_MostrarEditarEvaluacion = function (cve_examen) {
    var divTmp = document.createElement("div");
    var alertas = document.createElement("h2");
    alertas.innerHTML = "<span></span>";
    alertas.setAttribute("id", "__Alertas_Variables_examen");
    divTmp.appendChild(alertas);
    var divR = document.createElement("div");
    divR.style.width = "800px";
    divR.style.height = "400px";
    divR.innerHTML = "<ul id='__id_Asignar_Variables_examen' class='treeview'><li></li></ul>";
    VariablesExaminar.CargarCatalogo("__id_Asignar_Variables_examen", function (objeto, cve, cve_padre) {
        Examen_AsignarVariable(objeto, cve, cve_padre);
    }, true, cve_examen);
    divTmp.appendChild(divR);
    $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
}

Examen_AsignarVariable = function (elemA, cve_variable, cve_variablepadre, cve_examen) {
    var op;
    if (elemA.className != "seleccionado") {
        elemA.className = "seleccionado";
        op = "AsignarVariable";
    } else {
        elemA.className = "";
        op = "QuitarVariable";
    }
    $.post(urlBase_WS + "NExamenes.aspx", { op: op, seccion: "Examen", cve_examen: cve_examen, cve_variable: cve_variable }).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "__Alertas_Variables_examen", function () {

        });
    });
}

VariablesExaminar.AsignarVariable = function (elemA, cve_variable, cve_variablepadre, cve_examen, cve_pregunta, cve_respuesta) {
    var op;
    if (elemA.className != "seleccionado"){
        elemA.className = "seleccionado";
        op = "AsignarVariable";
    } else {
        elemA.className = "";
        op = "QuitarVariable";
    }
    $.post(urlBase_WS + "NExamenes.aspx", { op: op, seccion: "VariablesExaminar", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_respuesta: cve_respuesta, cve_variable: cve_variable }).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "__Alertas_Variables", function () {
            
        });
    });
}

Respuestas.EliminarRespuesta = function (divRespuesta, cve_examen, cve_pregunta, cve_respuesta){
    if (confirm("Confirme que desea eliminar la respuesta:")) {
        $.post(urlBase_WS + "NExamenes.aspx", { op: "EliminarRespuesta", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_respuesta: cve_respuesta }).done(function (xmlDoc) {
            
        });
    }
}

Respuestas.DesactivarRespuesta = function (cve_departamento){
    $.post(urlBase_WS + "NExamenes.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        cargarCatalogoRespuesta();
    });
}

/*****************************************************************************************************************************************************/


var ordenador;
function CargarCatalogoExamenes(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerCatalogo", seccion: "Examen", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "") }).done(function (xmlDoc) {
        QuitarEspera();
        var dbExamenes = xmlDoc.getElementsByTagName("Table");
        var listaExamen = document.getElementById("contenedorLista");
        $(listaExamen).html("");
        var totalregistros;
        for (var i = 0; i < dbExamenes.length; i++) {
            var cve_examen = GetValor(dbExamenes[i], "cve_examen");
            var itemLista = document.createElement("tr");
            itemLista.className = "columnas columnas1";
            totalregistros = GetValor(dbExamenes[i], "totalRegistros");
            itemLista.cve_examen = cve_examen;
            itemLista.onclick = function () {
                MostrarEditarExamen(this.cve_examen);
            }
            $(itemLista).html(
                 '<td>' + cve_examen + '</td>' +
                '<td>' + GetValor(dbExamenes[i],"nombre") + '</td>' +
                '<td>' + GetValor(dbExamenes[i], "cantidad") + '</td>' +
                '<td>' + GetValor(dbExamenes[i], "escala") + '</td>' +
                '<td>' + GetValor(dbExamenes[i], "tiemporespuesta") + '</td>'
            );
            listaExamen.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoExamenes);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarExamen() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmExamen = document.getElementById("frmNuevoExamen");
        if (!frmExamen.esEditar) {
            GuardarEdicionExamen("Nuevo");
        } else {
            GuardarEdicionExamen("Editar");
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarExamen(cve) {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.reset();
    frmExamen.esEditar = true;
    MostrarFormulario();
    CargarDatosExamen(cve);
}

function CargarDatosExamen(cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetalleExamen", seccion: "Examen", pagina: 1, longitudPagina: 50, criterio: "", cve_examen: cve }).done(function (xmlDoc) {
        var dbExamen = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbExamen, "cve_examen", "cve_examen");
        SetValor(dbExamen, "nombre", "nombre");
        SetValor(dbExamen, "objetivo", "objetivo", "bool");
        SetValor(dbExamen, "cantidad", "cantidad");
        SetValor(dbExamen, "tiemporespuesta", "tiemporespuesta");
        SetValor(dbExamen, "aleatorio", "aleatorio", "bool");
        SetValor(dbExamen, "puntaje", "puntaje");
        SetValor(dbExamen, "escala", "escala");
    });
}

function GuardarEdicionExamen(op) {
    var frmNuevoExamen = document.getElementById("frmNuevoExamen");
    var parametros = $(frmNuevoExamen).serialize();
    $.post(urlBase_WS + "NExamenes.aspx", "op=" + op + "&seccion=Examen&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            CargarCatalogoExamenes();
        });
    });
}

function DesactivarExamen(cve_departamento) {
    $.post(urlBase_WS + "NExamen.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoExamen();
    });
}

VariablesExaminar.Iniciar = function () {
    VariablesExaminar.CargarCatalogo("arbol-variables", VariablesExaminar.MostrarEditar);
    LlenarSelect(urlBase_WS + "NExamenes.aspx?op=ObtenerCategorias&seccion=VariablesExaminar", "cve_variablepadre", "Seleccione variable", "cve_variable", "descripcion", undefined, function (selectCargado) {

    });
}

var VARIABLE_AGRUPACION= undefined;
VariablesExaminar.MostrarNuevo = function (parametros) {
    var frmVariables = document.getElementById("frmVariables");
    frmVariables.esEditar = false;
    frmVariables.reset();
    if (VARIABLE_AGRUPACION) {
        document.getElementById("svariablepadre").innerHTML = VARIABLE_AGRUPACION.innerHTML;
        document.getElementById("cve_variablepadre").value = VARIABLE_AGRUPACION.parentNode.getAttribute("cve_variable");
    }
    MostrarFormulario();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerClaveSiguiente", seccion: "VariablesExaminar" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_variable", "cve_variable");
    });
}


VariablesExaminar.Guardar= function() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmExamen = document.getElementById("frmVariables");
        if (!frmExamen.esEditar) {
            VariablesExaminar.GuardarEdicion("Nuevo");
        } else {
            VariablesExaminar.GuardarEdicion("Editar");
        }
    }else{
        MostrarCatalogo();
    }
}

VariablesExaminar.GuardarEdicion=function(op) {
    var frmVariables = document.getElementById("frmVariables");
    var parametros = $(frmVariables).serialize();
    $.post(urlBase_WS + "NExamenes.aspx", "op=" + op + "&seccion=VariablesExaminar&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            VariablesExaminar.CargarCatalogo("arbol-variables", VariablesExaminar.MostrarEditar);
            MostrarCatalogo();
        });
    });
}

VariablesExaminar.MostrarEditar = function (objeto, cve, cve_variablepadre) {
    if (VARIABLE_AGRUPACION) {
        VARIABLE_AGRUPACION.className = "";
    }
    VARIABLE_AGRUPACION = objeto;
    VARIABLE_AGRUPACION.className = "seleccionado";
    var frmVariables = document.getElementById("frmVariables");
    document.getElementById("svariablepadre").innerHTML = "";
    frmVariables.reset();
    frmVariables.esEditar = true;
    MostrarFormulario();
    VariablesExaminar.CargarDatos(cve, cve_variablepadre);
}

VariablesExaminar.CargarDatos = function (cve, cve_variablepadre) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetalleVariable", seccion: "VariablesExaminar", cve_variable: cve }).done(function (xmlDoc) {
        var dbExamen = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbExamen, "cve_variable", "cve_variable");
        SetValor(dbExamen, "descripcion", "descripcion");
        SetValor(dbExamen, "cve_variablepadre", "cve_variablepadre");
        SetValor(dbExamen, "valor", "valor");
    });
}

VariablesExaminar.CargarCatalogo = function (id, callbackClick, esLectura, cve_examen, cve_pregunta, cve_respuesta) {
    PonerEnEspera();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerCatalogoVariables", seccion: "VariablesExaminar", cve_respuesta: cve_respuesta, cve_examen:cve_examen,cve_pregunta:cve_pregunta}).done(function (xmlDoc) {
        QuitarEspera();
        var contenedor = document.getElementById(id);
        var raiz = contenedor.getElementsByTagName("li")[0];
        $(raiz).html("<a>Variables de exámen</a>");
        VariablesExaminar.CrearLista(raiz, xmlDoc.getElementsByTagName("Variables")[0], 0, callbackClick, esLectura);
        ddtreemenu.createTree(id, true);
        ddtreemenu.flatten(id, 'expand');
    });
}

VariablesExaminar.MostrarNombreVariable = function (svariablepadre, cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetalleVariable", seccion: "VariablesExaminar", cve_variable: cve }).done(function (xmlDoc) {
        var dbExamen = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbExamen, "descripcion", svariablepadre);
    });
}

VariablesExaminar.CrearLista = function (elementoPadre, xmlNodo, nivel, callbackClick, esLectura) {
    var dbItems = xmlNodo.children;
    var existenVariables = false;
    var cve_variable="", cve_variablepadre="", descripcion="", valor="",estilo="";
    var olItems=undefined, indiceHijos = 0;
    var itemLista;
    for(var i = 0; i < dbItems.length; i++){
        if (dbItems[i].tagName.toLowerCase() == "unavariable") {
            if (indiceHijos == 0){
                olItems = document.createElement("ul");
            }
            itemLista = document.createElement("li");
            olItems.appendChild(itemLista);
            indiceHijos++;
            VariablesExaminar.CrearLista(itemLista, dbItems[i],nivel + 1,callbackClick,esLectura);
        } else if (dbItems[i].tagName.toLowerCase() == "descripcion"){
            descripcion = dbItems[i].childNodes[0].nodeValue;
        } else if (dbItems[i].tagName.toLowerCase() == "cve_variablepadre"){
            cve_variablepadre= dbItems[i].childNodes[0].nodeValue;
        } else if (dbItems[i].tagName.toLowerCase() == "cve_variable"){
            cve_variable= dbItems[i].childNodes[0].nodeValue;
        } else if (dbItems[i].tagName.toLowerCase() == "valor"){
            valor = dbItems[i].childNodes[0].nodeValue;
        } else if (dbItems[i].tagName.toLowerCase() == "cve_respuesta") {
            estilo = "seleccionado";
        }
    }
    var aLink = document.createElement("a");
    aLink.innerHTML = cve_variable + ". " + descripcion;
    elementoPadre.appendChild(aLink);
    aLink.onclick = function () {
        if (callbackClick) {
            callbackClick(this, this.parentNode.getAttribute("cve_variable"), this.parentNode.getAttribute("cve_variablepadre"));
        }
    }
    if (descripcion.length > 0){
        if (esLectura) {
            
        } else {
            var imgEliminar = document.createElement("img");
            imgEliminar.src = "/Recursos/imagenes/eliminar.png";
            imgEliminar.onclick=function(){
                VariablesExaminar.Eliminar(this.parentNode.getAttribute("cve_variable"));
            }
            elementoPadre.appendChild(imgEliminar);
        }
    }
    elementoPadre.setAttribute("cve_variablepadre", cve_variablepadre);
    elementoPadre.setAttribute("cve_variable", cve_variable);
    elementoPadre.setAttribute("valor", valor);
    elementoPadre.setAttribute("nivel", nivel);
    aLink.setAttribute("class", estilo);
    if(olItems){
        elementoPadre.appendChild(olItems);
    }
}

VariablesExaminar.Eliminar = function (cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "EliminarVariable", seccion: "VariablesExaminar", cve_variable: cve }).done(function (xmlDoc) {
        VariablesExaminar.CargarCatalogo("arbol-variables",VariablesExaminar.MostrarEditar);
    });
}


