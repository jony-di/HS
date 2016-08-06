var CLAVE_GrupoPoliticaVacaciones;
function iniciar(clavePolitica) {
    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
    CLAVE_GrupoPoliticaVacaciones = clavePolitica;
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoPoliticaVacaciones(1);
}

function crearNuevoPoliticaVacaciones() {
    var frmNuevoPoliticaVacaciones = document.getElementById("frmNuevoPoliticaVacaciones");
    var parametros = $(frmNuevoPoliticaVacaciones).serialize();
    $.post(urlBase_WS + "NPoliticaVacaciones.aspx", "op=Nuevo&seccion=PoliticaVacacionesDetalle&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPoliticaVacaciones(1);
            document.getElementById("frmNuevoPoliticaVacaciones").reset();
            MostrarCatalogo();
        }else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoPoliticaVacaciones(1, criterio);
}

function MostrarNuevoPoliticaVacaciones() {
    var frmPoliticaVacaciones = document.getElementById("frmNuevoPoliticaVacaciones");
    frmPoliticaVacaciones.esEditar = false;
    frmPoliticaVacaciones.reset();
    $.post(urlBase_WS + "NPoliticaVacaciones.aspx", { op: "obtenerSiguienteClave", seccion: "PoliticaVacacionesDetalle" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoPoliticaVacaciones(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPoliticaVacaciones.aspx", { seccion: "PoliticaVacacionesDetalle", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : ""), cve_grupopolitica: CLAVE_GrupoPoliticaVacaciones, cve_politica:0 }).done(function (xmlDoc) {
        QuitarEspera();
        var PoliticaVacaciones = xmlDoc.getElementsByTagName("Table");
        var listaPoliticaVacaciones = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPoliticaVacaciones).html("");
        var totalregistros;
        for (var i = 0; i < PoliticaVacaciones.length; i++) {
            var CLAVE_GrupoPoliticaVacaciones = GetValor(PoliticaVacaciones[i], "cve_politica");
            var anios = GetValor(PoliticaVacaciones[i], "anios");
            var prestamos = GetValor(PoliticaVacaciones[i], "diastomar");
            var primavacacional = GetValor(PoliticaVacaciones[i], "primavacacional");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(PoliticaVacaciones[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPoliticaVacaciones(' + CLAVE_GrupoPoliticaVacaciones + ',' + GetValor(PoliticaVacaciones[i], "cve_grupopoliticas") + ')"></button></td>' +
                '<td><label class="clave">' + CLAVE_GrupoPoliticaVacaciones + '</label></td>' +
                '<td><label class="annos">' + anios + '</label></td>' +
                '<td><label class="prestamos">' + prestamos + '</label></td>' +
                '<td><label class="primavacacional">' + primavacacional + '</label> </td>' 
            );
            listaPoliticaVacaciones.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoPoliticaVacaciones);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
    
}


function GuardarPoliticaVacaciones() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPoliticaVacaciones = document.getElementById("frmNuevoPoliticaVacaciones");
        if (!frmPoliticaVacaciones.esEditar) {
            crearNuevoPoliticaVacaciones();
        } else {
            GuardarEdicionPoliticaVacaciones();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPoliticaVacaciones(PoliticaVacaciones, grupoPoliticas) {
    var frmPoliticaVacaciones = document.getElementById("frmNuevoPoliticaVacaciones");
    frmPoliticaVacaciones.esEditar = true;
    MostrarFormulario();
    CargarDatosPoliticaVacaciones(PoliticaVacaciones, grupoPoliticas);

}

function CargarDatosPoliticaVacaciones(PoliticaVacaciones, grupoPoliticas) {
    $.post(urlBase_WS + "NPoliticaVacaciones.aspx", { seccion: "PoliticaVacacionesDetalle", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_politica: PoliticaVacaciones, cve_grupopolitica: grupoPoliticas,
    }).done(function (xmlDoc) {
        var PoliticaVacaciones = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(PoliticaVacaciones, "cve_politica", "clave");
        SetValor(PoliticaVacaciones, "anios", "annos");
        SetValor(PoliticaVacaciones, "diastomar", "prestamos");
        SetValor(PoliticaVacaciones, "primavacacional", "primavacacional");
    });
}

function GuardarEdicionPoliticaVacaciones() {
    var frmNuevoPoliticaVacaciones = document.getElementById("frmNuevoPoliticaVacaciones");
    var parametros = $(frmNuevoPoliticaVacaciones).serialize();
    $.post(urlBase_WS + "NPoliticaVacaciones.aspx", "op=Editar&seccion=PoliticaVacacionesDetalle&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPoliticaVacaciones();
            document.getElementById("frmNuevoPoliticaVacaciones").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";

        }
    });
}



function DesactivarPoliticaVacaciones(PoliticaVacaciones) {
    $.post(urlBase_WS + "NPoliticaVacaciones.aspx", { op: "CambiarEstatusActivo", PoliticaVacaciones: PoliticaVacaciones, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPoliticaVacaciones();
    })

}

function CancelarPoliticaVacaciones(){
    MostrarCatalogo();
 }

