function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoEstado(1);
}

function crearNuevoEstado() {
    var frmNuevoEstado = document.getElementById("frmNuevoEstado");
    var parametros = $(frmNuevoEstado).serialize();
    $.post(urlBase_WS + "NEstado.aspx", "op=NuevoEstado&" + parametros).done(function (xmlDoc){
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoEstado(1);
            document.getElementById("frmNuevoEstado").reset();
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
    cargarCatalogoEstado(1, criterio);
}

function MostrarNuevoEstado() {
    var frmEstado = document.getElementById("frmNuevoEstado");
    frmEstado.reset();
    frmEstado.esEditar = false;
    $.post(urlBase_WS + "NEstado.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "estado");
    });
    var selectPais = document.getElementById("pais");
    LlenarCatalogoPaises(selectPais, function () {
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = true;
        MostrarFormulario();
    });
}

var ordenador;
function cargarCatalogoEstado(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NEstado.aspx", { op: "obtenerCatalogoEstado", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cveestado: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var estado = xmlDoc.getElementsByTagName("Table");
        var listaEstado = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaEstado).html("");
        var totalregistros;
        for (var i = 0; i < estado.length; i++) {
            var CveEstado = GetValor(estado[i], "cveestado");
            var Nombre = GetValor(estado[i], "nombreestado");
            var Pais = GetValor(estado[i], "nombrepais");
            var estatus = GetValor(estado[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(estado[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarEstado(' + CveEstado + ')"></button></td>' +
                 '<td><label class="estado">' + CveEstado + '</label></td>' +
                '<td><label class="nombre">' + Nombre + '</label></td>' +
                '<td><label class="pais">' + Pais + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaEstado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoEstado);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarEstado() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmEstado = document.getElementById("frmNuevoEstado");
        if (!frmEstado.esEditar) {
            crearNuevoEstado();
        } else {
            GuardarEdicionEstado();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarEstado(cveestado) {
    var frmEstado = document.getElementById("frmNuevoEstado");
    frmEstado.reset();
    frmEstado.esEditar = true;
    MostrarFormulario();
     var selectPais = document.getElementById("pais");
       LlenarCatalogoPaises(selectPais, function () {
    CargarDatosEstado(cveestado);
});
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosEstado(cveestado) {
    $.post(urlBase_WS + "NEstado.aspx", { op: "obtenerCatalogoEstado", pagina: 1, longitudPagina: 5, criterio: "",
        cveestado: cveestado
    }).done(function (xmlDoc) {
        var estado = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(estado, "cveestado", "estado");
        SetValor(estado, "nombreestado", "nombre");
        SetValor(estado, "cvepais", "pais");
        SetValor(estado, "activo", "estatus", "bool");
    });
}

function GuardarEdicionEstado() {
    var frmNuevoEstado = document.getElementById("frmNuevoEstado");
    var parametros = $(frmNuevoEstado).serialize();
    $.post(urlBase_WS + "NEstado.aspx", "op=EditarEstado&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoEstado();
            document.getElementById("frmNuevoEstado").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarEstado(cveestado) {
    $.post(urlBase_WS + "NEstado.aspx", { op: "CambiarEstatusActivo", cveestado: cveestado, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoEstado();
    })
}

function CancelarEstado() {
    MostrarCatalogo();
}