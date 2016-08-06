function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat();
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function MostrarEditarItemCat(CveItemCat) {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = true;
    MostrarFormulario();
    CargarDatosItemCat(CveItemCat);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosItemCat(vacante) {
    $.post(urlBase_WS + "NCatalogoVacantes.aspx", { seccion: "catalogoVacante", op: "obtenerDetalleVacante", vacante: vacante }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_solicitudvacante", "clave");
        var numplantilla = SetValor(ItemCat, "num_plantilla", "posicion");
        SetValor(ItemCat, "NombrePuesto", "puesto");
        SetValor(ItemCat, "nombredep", "departamento");
        SetValor(ItemCat, "nombre", "asignado");
        SetValor(ItemCat, "fechaSolicitud", "fsolicitud", "date");
        SetValor(ItemCat, "fechaContratacion", "fcontratacion");
        SetValor(ItemCat, "cve_estatus", "estatus");
        SetValor(ItemCat, "sueldo", "sueldo");
        SetValor(ItemCat, "detalle", "detalle");
        var cve_puesto = GetValor(ItemCat, "cve_puesto");
        //var numplantilla = GetValor(ItemCat, "num_plantilla", "posicion");
        var btnVerperfil = document.getElementById("btnVerperfil");
        btnVerperfil.setAttribute("onclick", "VerPerfilPuesto(" + numplantilla + ", " + cve_puesto + ");")
        var btnPublivacion = document.getElementById("btnPublicar");
        btnPublivacion.setAttribute("onclick", "mostrarPublicaciones(" + vacante + ");")
        $.post(urlBase_WS + "NCatalogoVacantes.aspx", { seccion: "catalogoVacante", op: "esJefe", vacante: vacante }).done(function (xmlDoc) {
            var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
            var esJefe = GetValor(ItemCat, "esJefe");
            if (esJefe==1) {
                var cambiarReclutador = document.getElementById("cambiarReclutador");
                cambiarReclutador.setAttribute("onclick", "MostrarReclutadores(" + vacante + ");")
                cambiarReclutador.className = "btnFormularios peque";
            }
            else {
                var cambiarReclutador = document.getElementById("cambiarReclutador");
                cambiarReclutador.className = "ocultar";
            }
        });

    });
}

var ordenador;
function cargarCatalogoItemCat(pagina, criterio, cve_catalogo) {
    if (!cve_catalogo) cve_catalogo = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NCatalogoVacantes.aspx", { seccion: "catalogoVacante", op: "obtenerVacantes", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_catalogo: cve_catalogo }).done(function (xmlDoc) {
        QuitarEspera();
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var idVacante = GetValor(ItemCat[i], "idVacante");
            var Vacante = GetValor(ItemCat[i], "Vacante");
            var Puesto = GetValor(ItemCat[i], "Puesto");
            var cve_puesto = GetValor(ItemCat[i], "cve_puesto");
            var Departamento = GetValor(ItemCat[i], "Departamento");
            var Fecha = GetValor(ItemCat[i], "Fecha", "date");
            var asignado = GetValor(ItemCat[i], "asignado");
            var Estatus = GetValor(ItemCat[i], "Estatus");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><label class="idVacante"><a href="#"  onclick="MostrarEditarItemCat(' + idVacante + ')">' + idVacante + '</a></label></td>' +
                '<td><label class="posicion">' + Vacante + '</label></td>' +
                '<td><label class="puesto">' + Puesto + '</label></td>' +
                '<td><label class="departamento">' + Departamento + '</label></td>' +
                '<td><label class="fecha">' + Fecha + '</label></td>' +
                '<td><label class="asignado"></label>' + asignado + '</td>' +
                '<td><label class="estatus">' + Estatus + '</label> </td>' +
                '<td><label class="historial"><img class="historial" title="Historial" onclick="VerDetalleHistorial(' + idVacante + ',' + Vacante + ')" src="/Recursos/imagenes/verhistorial.png"/>' +
                '<img  class="perfil" title="Perfil" onclick="VerPerfilPuesto(' + Vacante + ',' + cve_puesto + ')" src="/Recursos/imagenes/perfil.png"/>' +
                '<img class="cv" onclick="VerCandidatos(' + idVacante + ',' + cve_puesto + ',\'' + Puesto + '\')" src="/Recursos/imagenes/verDetalle.png" title="Candidatos"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function VerDetalleHistorial(idVacante, numplantilla) {
    NuevoSeleccionSecuencial("Historial de la vacante.", [
            { esConsulta: true, idTabla: "t-desglose", url: urlBase_WS + 'NCatalogoVacantes.aspx', parametros: { op: "obtenerHistorial", seccion: "catalogoVacante", vacante: idVacante, num_plantilla: numplantilla }, campos: ['numvacante', 'vacante', 'estatus','fecha', 'hora','usuario', 'comentarios'],formatos:{fecha:"date"}, encabezado: { titulo: "", columnas: ['No.', 'Vacante', 'Estatus' ,'Fecha', 'Hora', 'Usuario modificó', 'Comentarios']} }
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
}

function VerPerfilPuesto(numplantilla, cve_puesto) {
    window.top.AgregarNuevoTab("/Modulos/Contrataciones/ContratacionUI/CN_mostrarPerfil.aspx?callbackInicio=callbackVerDescripcionPuesto&offset=0&numplantilla=" + numplantilla + "&puesto=" + cve_puesto, "Perfil de puesto");
}

function VerCandidatos(numplantilla, cve_puesto, Puesto) {
    window.top.AgregarNuevoTab("/Modulos/Contrataciones/ContratacionUI/CN_catalogoCandidatos.aspx?callbackInicio=callbackcatalogoCandidatos&offset=0&numplantilla=" + numplantilla + "&puesto=" + cve_puesto + "&vacante=" + Puesto, "Candidatos de " + Puesto);
}

function callbackcatalogoCandidatos() {
    QuitarEspera();
    DesplazarElemento('principal', -900);
    QuitarEspera();
}

function Cancelar() {
    cargarCatalogoItemCat();
    MostrarCatalogo();
}

function mostrarPublicaciones(vacante) {
    var detalle = document.getElementById("detalle").value;
    if (detalle !== "") {
        PonerEnEspera();
        $.post(urlBase_WS + "NCatalogoVacantes.aspx", "seccion=catalogoVacante&op=editarDetalle" + "&cve_vacante=" + vacante + "&detalle=" + detalle).done(function (xmlDoc) {
            var estatus = GetValor(xmlDoc, "estatus");
            var mensaje = GetValor(xmlDoc, "mensaje");
            var notificacion = document.getElementById("notificacion");
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            $(mensajeNotificacion).html(mensaje);
            if (estatus == 1) {
                IntercambioVisual("pantallaAuxiliar", "formulario");
                window.frames["pantallaAuxiliar"].location.href = "../ContratacionUI/CN_registroPublicaciones.aspx?callbackInicio=callbackInicioPublicaciones&offset=0&Vacante=" + vacante;
            }
            else if (estatus < 0) {
                QuitarEspera();
                notificacion.className = "alert-box error mostrar";
            }
        });
       
    }
    else {
        var mensaje = "Falta el detalle de la vacante";
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        notificacion.className = "alert-box error mostrar"; 
    }
    
}

function callbackInicioPublicaciones() {
    QuitarEspera();
    DesplazarElemento('principal', -900);
    QuitarEspera();
}

function MostrarReclutadores(idVacante) {
    NuevoSeleccionSecuencial("Seleccionar El nuevo reclutador que desea", [
        { esMultiSeleccion: false, url: urlBase_WS + 'NCatalogoVacantes.aspx', parametros: { seccion: "catalogoVacante", op: "mostrarReclutadores", vacante: idVacante }, campos: ['cve_usuario', 'nombre'], ocultos: [0], encabezado: { titulo: "nombre", columnas: ["nombre"] }, display: "nombre" }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            var cve_usuario = seleccion[0]["cve_usuario"];
            var nombre = seleccion[0]["nombre"];
            $.post(urlBase_WS + "NCatalogoVacantes.aspx", "seccion=catalogoVacante&op=cambiarReclutador&vacante=" + idVacante + "&reclutador=" + cve_usuario).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                var notificacion = document.getElementById("notificacion");
                var mensajeNotificacion = document.getElementById("mensaje-alerta");
                $(mensajeNotificacion).html(mensaje);
                if (estatus == 1) {
                    notificacion.className = "alert-box success mostrar";
                    document.getElementById("asignado").value = nombre;
                }
                else if (estatus < 0) {
                    notificacion.className = "alert-box error mostrar";
                }
            });
        }
        $.fancybox.close();
    });
}