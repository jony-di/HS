var _Vacante = 0;
var _Puesto = 0;
var _RFC = "";

function iniciar(puesto, vacante) {
    _Puesto = puesto;
    _Vacante = vacante;

    $("#regreza").fancybox({ content: $("#updatebox").html(), 'padding': 0 });
    $.post(urlBase_WS + "NCatalogoCandidatos.aspx", { seccion: "Candidatos", op: "obtenerLista", vacante: _Vacante }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < ItemCat.length; i++) {
            var RFC = GetValor(ItemCat[i], "RFC");
            var cve_Estatus_Proceso = GetValor(ItemCat[i], "cve_Estatus_Proceso");
            var Nombres = GetValor(ItemCat[i], "Nombres");
            var Apellido_Paterno = GetValor(ItemCat[i], "Apellido_Paterno");
            var Apellido_Materno = GetValor(ItemCat[i], "Apellido_Materno");
            var Estdo = GetValor(ItemCat[i], "Estado");
            var Municipio = GetValor(ItemCat[i], "Municipio");
            var AniosExperiencia = GetValor(ItemCat[i], "AniosExperiencia");
            var FechaNacimiento = GetValor(ItemCat[i], "FechaNacimiento");
            var AreaDeExperiencia = GetValor(ItemCat[i], "AreaDeExperiencia");
            var sexo = GetValor(ItemCat[i], "sexo");
            var EstadoCivil = GetValor(ItemCat[i], "EstadoCivil");
            var GradoEstudios = GetValor(ItemCat[i], "GradoEstudios");
            var EstadoGradoEstudios = GetValor(ItemCat[i], "EstadoGradoEstudios");
            var fotoBse64 = GetValor(ItemCat[i], "FotoBase64");
            /*Crear targeta*/

            var car = document.createElement("div");
            car.className = "car";
            car.id = RFC;

            var cuerpo = document.createElement("div");
            cuerpo.className = "cuerpo";

            var cabeza = document.createElement("div");
            cabeza.className = "cabeza";

            var img = document.createElement("img");
            if (fotoBse64.length > 100) {
                img.setAttribute("src", "data:image/png;base64," + fotoBse64);
            } else {
                img.setAttribute("src", "/Recursos/imagenes/usuario1.png");
            }
            cabeza.appendChild(img);
            var datos = document.createElement("div");
            datos.className = "datos";
            var TituloNombre = document.createElement("h4");
            TituloNombre.innerHTML = Apellido_Paterno + " " + Apellido_Materno + " " + Nombres;
            var TituloProfecion = document.createElement("h4");
            TituloProfecion.innerHTML = AreaDeExperiencia;
            var direccion = document.createElement("label");
            direccion.innerHTML = Municipio + ", " + Estdo
            datos.appendChild(TituloNombre);
            datos.appendChild(TituloProfecion);
            datos.appendChild(direccion);
            cabeza.appendChild(datos);

            var Detalle = document.createElement("div");
            Detalle.className = "datos2";
            var Nivel = document.createElement("label");
            Nivel.className = "etiquetas-azules";
            Nivel.innerHTML = "Nivel de estudios:";
            var NivelValor = document.createElement("label");
            NivelValor.className = "etiquetas-grises";
            NivelValor.innerHTML = GradoEstudios;
            Detalle.appendChild(Nivel);
            Detalle.appendChild(NivelValor);
            Detalle.appendChild(document.createElement("br"));

            var Situacion = document.createElement("label");
            Situacion.className = "etiquetas-azules";
            Situacion.innerHTML = "Situacion escolar:";
            var SituacionValor = document.createElement("label");
            SituacionValor.className = "etiquetas-grises";
            SituacionValor.innerHTML = EstadoGradoEstudios;
            Detalle.appendChild(Situacion);
            Detalle.appendChild(SituacionValor);
            Detalle.appendChild(document.createElement("br"));

            var Estado = document.createElement("label");
            Estado.className = "etiquetas-azules";
            Estado.innerHTML = "Estado civil:";
            var EstadoValor = document.createElement("label");
            EstadoValor.className = "etiquetas-grises";
            EstadoValor.innerHTML = EstadoCivil;
            Detalle.appendChild(Estado);
            Detalle.appendChild(EstadoValor);
            cuerpo.appendChild(cabeza);
            cuerpo.appendChild(Detalle);
            car.appendChild(cuerpo);
            if (cve_Estatus_Proceso === "1") {
                car.appendChild(agregarBotones(0, RFC));
                document.getElementById("Nuevos").appendChild(car);
            }
            else if (cve_Estatus_Proceso === "6") {
                car.appendChild(agregarBotones(1, RFC));
                document.getElementById("Rechzados").appendChild(car);
            }
            else {
                car.appendChild(agregarBotones(1, RFC));
                document.getElementById("EnProceso").appendChild(car);
            }
        }
    });
}

function agregarBotones(op, RFC) {
    var controles = document.createElement("div");
    var btnRechazar = document.createElement("span");
    var imgRechazar = document.createElement("img");
    var btnAceptar = document.createElement("span");
    var imgAceptar = document.createElement("img");
    var btnVer = document.createElement("span");
    var imgver = document.createElement("img");
    controles.className = "car-select";
    imgRechazar.setAttribute("src", "../../../Recursos/imagenes/error.png");
    imgAceptar.setAttribute("src", "../../../Recursos/imagenes/success.png");
    imgver.setAttribute("src", "../../../Recursos/imagenes/notice.png");
    btnRechazar.setAttribute("onclick", "rechazar('" + RFC + "')");
    btnAceptar.setAttribute("onclick", "verForm('" + RFC + "')");
    btnVer.setAttribute("onclick", "verCV('" + RFC + "')");
    btnRechazar.appendChild(imgRechazar);
    btnAceptar.appendChild(imgAceptar);
    btnVer.appendChild(imgver);
    btnRechazar.appendChild(document.createTextNode("Rechazar"));
    btnAceptar.appendChild(document.createTextNode("Iniciar Proceso"));
    btnVer.appendChild(document.createTextNode(" Ver CV "));
    btnRechazar.className = "btn-car";
    btnAceptar.className = "btn-car";
    btnVer.className = "btn-car centrar";
   
    switch (op) {
        case 0:
            controles.appendChild(btnRechazar);
            controles.appendChild(btnAceptar);
            controles.appendChild(btnVer);
        break;
    case 1:
        btnAceptar.removeChild(btnAceptar.firstChild);
        btnAceptar.appendChild(document.createTextNode("Dar seguimiento"));
    break
    case 2:
            btnVer.className = "btn-car";
            controles.appendChild(btnAceptar);
            controles.appendChild(btnVer);
        break;
    }
    return controles;
}

function rechazar(RFC) {
    document.getElementById("btnRechazar").setAttribute("onclick","rechazarExtracted('"+RFC+"')");
    $.fancybox({ content: $("#Rechazo").html(), 'padding': 0 });
}


function rechazarExtracted(RFC) {
    var motivos = $("#motivos");
    //if(motivos.value !==""){
        $(document.getElementById(RFC)).find(".car-select").first().remove();
        var car = document.getElementById(RFC).cloneNode(true);
        $(document.getElementById(RFC)).remove();
        document.getElementById("Rechzados").appendChild(car);
        car.appendChild(agregarBotones(2, RFC));
        $.fancybox.close();
    //}
    }

    function verForm(RFC) {
        $.post(urlBase_WS + "NCatalogoCandidatos.aspx", { seccion: "Candidato", op: "obtenerCandidato", vacante: _Vacante, RFC: RFC }).done(function (xmlDoc) {
            var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
            SetValor(ItemCat, "Nombres", "lbl-nombre");
            SetValor(ItemCat, "Estado", "lbl-estado");
            SetValor(ItemCat, "Municipio", "lbl-minicipio");
            var AniosExperiencia = GetValor(ItemCat, "AniosExperiencia");
            var cve_vacante = GetValor(ItemCat, "cve_vacante");
            var num_plantilla = GetValor(ItemCat, "num_plantilla");
            SetValor(ItemCat, "FechaNacimiento", "lbl-fecha");
            var AreaDeExperiencia = GetValor(ItemCat, "AreaDeExperiencia");
            SetValor(ItemCat, "sexo", "lbl-sexo");
            var EstadoCivil = GetValor(ItemCat, "EstadoCivil");
            SetValor(ItemCat, "GradoEstudios", "lbl-nivel");
            SetValor(ItemCat, "EstadoGradoEstudios", "lbl-status");
            SetValor(ItemCat, "Telfonos", "lbl-tel");
            document.getElementById("ver_cv").setAttribute("onclick", "verCV('" + RFC + "')");
            document.getElementById("ver_perfil").setAttribute("onclick", "VerPerfilPuesto('" + num_plantilla + "," + cve_vacante + "')");
            var fotoBse64 = GetValor(ItemCat, "FotoBase64");
            var img = document.getElementById("foto-candidato");
            var frmItemCat = document.getElementById("frmNuevo");
            if (fotoBse64.length > 100) {
                img.setAttribute("src", "data:image/png;base64," + fotoBse64);
            } else {
                img.setAttribute("src", "/Recursos/imagenes/usuario1.png");
            }
            IntercambioVisual("formulario", "pantallaAuxiliar");
            frmItemCat.reset();
            frmItemCat.esEditar = false;
            MostrarFormulario();
        });
        var mapa=document.getElementById("fujomapa");

        $.post(urlBase_WS + "NCatalogoCandidatos.aspx", { seccion: "Candidato", op: "obtenerInfoEstapas", RFC: 'dipe850502', flujo: 1 }).done(function (xmlDoc) {
            var valores = xmlDoc.getElementsByTagName("Table");
            var termindados = new Array();
            var actual;
            var rechazado;

            for (var i = 0; i < valores.length; i++) {
                if (GetValor(valores[i], "TERMINADAS") != 0) { termindados.push(GetValor(valores[i], "TERMINADAS")); }
                if (GetValor(valores[i], "ACTUAL") != 0) { actual = (GetValor(valores[i], "ACTUAL")); }
                if (GetValor(valores[i], "RECHAZADA") != 0) { rechazado = (GetValor(valores[i], "RECHAZADA")); }
            }

            $.post(urlBase_WS + "NCatalogoCandidatos.aspx", { seccion: "Candidato", op: "obtenerflujo", flujo: 1 }).done(function (xmlDoc) {
                var ItemCat = xmlDoc.getElementsByTagName("Table");
                for (var i = 0; i < ItemCat.length; i++) {
                    var paso = document.createElement("div");
                    var Etiqueta = document.createElement("label");
                    var imagen = document.createElement("span");
                    var flecharDerecha = document.createElement("span");
                    var etapa = GetValor(ItemCat[i], "cve_etapa");
                    imagen.setAttribute("Etapa", etapa);
                    Etiqueta.innerHTML = GetValor(ItemCat[i], "descripcion");
                    paso.appendChild(Etiqueta);
                    paso.appendChild(imagen);
                    if (termindados.indexOf(etapa) > -1) {
                        paso.className = "pasos termindo";
                    } else if (actual == etapa) {
                        paso.className = "pasos actual";
                        var pasoselect = document.createElement("div");
                        pasoselect.className = "paso-select";
                        var drechazar = document.createElement("img");
                        drechazar.className = "rechazar";
                        drechazar.src = "../../../Recursos/imagenes/error.png"
                        var validar = document.createElement("img");
                        validar.className = "validar";
                        validar.src = "../../../Recursos/imagenes/success.png"
                        //var scanear = document.createElement("img");
                        //scanear.className = "scanear";
                        //scanear.src = "../../../Recursos/imagenes/upload.png"
                        var verHistorial = document.createElement("img");
                        verHistorial.className = "verHistorial";
                        verHistorial.src = "../../../Recursos/imagenes/historial.png"
                        pasoselect.appendChild(drechazar);
                        pasoselect.appendChild(validar);
                        //pasoselect.appendChild(scanear);
                        pasoselect.appendChild(verHistorial);
                        paso.appendChild(pasoselect);
                    } else if (rechazado == etapa) {
                        paso.className = "pasos rechazado";
                    } else {
                        paso.className = "pasos";
                    }
                    flecharDerecha.className = "pasos flecharDerecha"
                    mapa.appendChild(paso);
                    mapa.appendChild(flecharDerecha);
                }
                $(".rechazar").click(function () { $("#archivo").addClass("ocultar"); $("#cat_rechazo").removeClass("ocultar"); $(".updatebox").height(450); $(".internal").height(370); $.fancybox({ content: $("#Registro").html(), 'padding': 3 }); obtenerSubEstapas($($(this.parentNode).prev()[0]).attr("etapa")); });
                //$(".scanear").click(function () { $("#cat_rechazo").addClass("ocultar"); $("#archivo, #divestaus, #divsubetapas").addClass("ocultar"); $(".updatebox").height(280); $(".internal").height(200); $.fancybox({ content: $("#Registro").html(), 'padding': 3, 'beforeLoad': obtenerSubEstapas($($(this.parentNode).prev()[0]).attr("etapa")) }); });
                $(".validar").click(function () { $("#cat_rechazo").addClass("ocultar"); $("#archivo,  #divsubetapas").removeClass("ocultar"); $(".updatebox").height(410); $(".internal").height(330); $.fancybox({ content: $("#Registro").html(), 'padding': 3 }); obtenerSubEstapas($($(this.parentNode).prev()[0]).attr("etapa")); });

                $(".termindo, .rechazado, .verHistorial").click(function () {
                    NuevoSeleccionSecuencial("Historial de la vacante.", [
                        { esConsulta: true, idTabla: "t-desglose", url: urlBase_WS + 'NCatalogoVacantes.aspx', parametros: { op: "obtenerHistorial", seccion: "catalogoVacante", vacante: _Vacante, num_plantilla: _Puesto }, campos: ['numvacante', 'vacante', 'estatus', 'fecha', 'hora', 'usuario', 'comentarios'], formatos: { fecha: "date" }, encabezado: { titulo: "", columnas: ['No.', 'Vacante', 'Estatus', 'Fecha', 'Hora', 'Usuario modificó', 'Comentarios']} }
                    ], "base", function (divR) {
                        try { QuitarEspera(); } catch (e) { }
                        var divTmp = document.createElement("div");
                        divTmp.appendChild(divR);
                        $.fancybox({
                            type: 'html'
                            , content: $(divTmp)
                            , preload: false
                            , openEffect: 'elastic'
                        });
                    },
                    function (seleccion) {
                        $.fancybox.close();
                    }
                    , true
                    );
                });
            });
        });
    }

    function obtenerSubEstapas(etapa){
        LlenarSelect(urlBase_WS + "NCatalogoCandidatos.aspx?seccion=filtros&op=obtenerSubEstapas&etapa=" + etapa, "subetapas", "--Seleccione Sub-Etapa--", "cve_subetapa", "descripcion", "pantalla", function (selectCargado, xmlDoc) { $.fancybox({ content: $("#Registro").html(), 'padding': 3 }); });
    }

    function preValidar() { }

    function CargarExamenesCandidato(RFC) {
        //$.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerExamenesCandidato",RFC:RFC}).done(function (xmlDoc) {
        CargarUnExamenResuelto(RFC,1,_Vacante);
        //});   
    }


    function VerPerfilPuesto(numplantilla, cve_puesto) {
        window.top.AgregarNuevoTab("/Modulos/Contrataciones/ContratacionUI/CN_mostrarPerfil.aspx?callbackInicio=callbackVerDescripcionPuesto&offset=0&numplantilla=" + numplantilla + "&puesto=" + cve_puesto, "Perfil de puesto");
    }

    function CargarUnExamenResuelto(RFC,cve_examen,cve_vacante) {
        var frm=document.createElement("form");
        frm.action = urlBase_WS + "NExamenes.aspx?op=ObtenerRespuestasCandidato&RFC=" + RFC + "&cve_examen=" + cve_examen + "&cve_vacante=" + cve_vacante;
        //frm.style.display = "none";
        document.body.appendChild(frm);
        frm.method = "post";
        frm.submit();
        //  $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerRespuestasCandidato", RFC: RFC, cve_examen: cve_examen, cve_vacante: cve_vacante}).done(function (xmlDoc) {
        //  document.getElementById("examenes").innerHTML=
        //});
    }

function Cancelar() {
    MostrarCatalogo();
}

function verCV(RFC) {
    window.open("../ContratacionNegocio/NCatalogoCandidatos.aspx?RFC=" + RFC + "&vacante=" + _Vacante + "&op=obtenerCV&seccion=Candidato", "CV_Word", "height=200,width=200");
}

function irPorCandidatos() {
    var agencias = document.getElementById("agencias")
    $.ajaxSetup({ async: false });
    $.post(urlBase_WS + "NCatalogoCandidatos.aspx", { seccion: "Candidatos", op: "obtenerCandidatos", agencia: $(agencias).val(), vacante: _Vacante }).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            window.location.reload();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
            $.fancybox.close();
        }
    });
}

function Guardar() {
    //$("#cve_subestado").val();
    console.log($("#pagina").val());
    $.fancybox.close();
    window.top.AgregarNuevoTab($("#pagina").val(), $("#subestado").val());
}

function seleccion(obj) {
    $("#pagina").val($(obj.options[obj.selectedIndex]).attr("attached"));
    $("#cve_subestado").val($(obj).val());
    $("#subestado").val($(obj.options[obj.selectedIndex]).attr("title"));
}