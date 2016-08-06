function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoLugarTrabajo(1);
}

function crearNuevoLugarTrabajo() {
    var frmNuevoLugarTrabajo = document.getElementById("frmNuevoLugarTrabajo");
    var parametros = $(frmNuevoLugarTrabajo).serialize();
    $.post(urlBase_WS + "NLugarTrabajo.aspx", "op=NuevoLugarTrabajo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoLugarTrabajo(1);
            document.getElementById("frmNuevoLugarTrabajo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoLugarTrabajo(1, criterio);
}

function MostrarNuevoLugarTrabajo() {
    var frmLugarTrabajo = document.getElementById("frmNuevoLugarTrabajo");
    frmLugarTrabajo.reset();
    frmLugarTrabajo.esEditar = false;
    $.post(urlBase_WS + "NLugarTrabajo.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "lugartrabajo");
    });
            var selectEstados = document.getElementById("estado");
        LlenarCatalogoEstados(selectEstados, function () {
                var selectMunicipio = document.getElementById("municipio");
                LlenarCatalogoMunicipio(selectMunicipio, function () {
                });
            });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoLugarTrabajo(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NLugarTrabajo.aspx", { op: "obtenerCatalogoLugarTrabajo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_lugar: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var lugartrabajo = xmlDoc.getElementsByTagName("Table");
        var listaLugarTrabajo = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaLugarTrabajo).html("");
        var totalregistros;
        for (var i = 0; i < lugartrabajo.length; i++) {
            var cveLugarTrabajo = GetValor(lugartrabajo[i], "cve_lugar");
            var Descripcion = GetValor(lugartrabajo[i], "descripcion");
            var estatus = GetValor(lugartrabajo[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(lugartrabajo[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarLugarTrabajo(' + cveLugarTrabajo + ')"></button></td>' +
                 '<td><label class="lugartrabajo">' + cveLugarTrabajo + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaLugarTrabajo.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoLugarTrabajo);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarLugarTrabajo() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmLugarTrabajo = document.getElementById("frmNuevoLugarTrabajo");
        if (!frmLugarTrabajo.esEditar) {
            crearNuevoLugarTrabajo();
        } else {
            GuardarEdicionLugarTrabajo();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarLugarTrabajo(cve_lugar) {
    var frmLugarTrabajo = document.getElementById("frmNuevoLugarTrabajo");
    frmLugarTrabajo.reset();
    frmLugarTrabajo.esEditar = true;
    MostrarFormulario();
        var selectEstados = document.getElementById("estado");
        LlenarCatalogoEstados(selectEstados, function () {
                var selectMunicipio = document.getElementById("municipio");
                LlenarCatalogoMunicipio(selectMunicipio, function () {;
    CargarDatosLugarTrabajo(cve_lugar);
});
});
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosLugarTrabajo(cve_lugar) {
    $.post(urlBase_WS + "NLugarTrabajo.aspx", { op: "obtenerCatalogoLugarTrabajo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_lugar: cve_lugar
    }).done(function (xmlDoc) {
        var lugartrabajo = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(lugartrabajo, "cve_lugar", "lugartrabajo");
        SetValor(lugartrabajo, "descripcion", "descripcion");
        SetValor(lugartrabajo, "calle", "calle");
        SetValor(lugartrabajo, "colonia", "colonia");
        SetValor(lugartrabajo, "cve_municipio", "municipio");
        SetValor(lugartrabajo, "cveestado", "estado");
        SetValor(lugartrabajo, "CP", "cp");
        SetValor(lugartrabajo, "entrecalles", "entrecalles");
        SetValor(lugartrabajo, "activo", "estatus", "bool");
    });
}

function GuardarEdicionLugarTrabajo() {
    var frmNuevoLugarTrabajo = document.getElementById("frmNuevoLugarTrabajo");
    var parametros = $(frmNuevoLugarTrabajo).serialize();
    $.post(urlBase_WS + "NLugarTrabajo.aspx", "op=EditarLugarTrabajo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoLugarTrabajo();
            document.getElementById("frmNuevoLugarTrabajo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarLugarTrabajo(cve_lugar) {
    $.post(urlBase_WS + "NLugarTrabajo.aspx", { op: "CambiarEstatusActivo", cve_lugar: cve_lugar, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoLugarTrabajo();
    })
}

function CancelarLugarTrabajo() {
    MostrarCatalogo();
}