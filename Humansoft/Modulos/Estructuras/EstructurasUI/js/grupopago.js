function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoGrupoPago(1);
}

function crearNuevoGrupoPago() {
    var frmNuevoGrupoPago = document.getElementById("frmNuevoGrupoPago");
    var parametros = $(frmNuevoGrupoPago).serialize();
    $.post(urlBase_WS + "NGrupoPago.aspx", "op=NuevoGrupoPago&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoGrupoPago(1);
            document.getElementById("frmNuevoGrupoPago").reset();
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
    cargarCatalogoGrupoPago(1, criterio);
}

function MostrarNuevoGrupoPago() {
    var frmGrupoPago = document.getElementById("frmNuevoGrupoPago");
    frmGrupoPago.reset();
    frmGrupoPago.esEditar = false;
    $.post(urlBase_WS + "NGrupoPago.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "grupopago");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoGrupoPago(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NGrupoPago.aspx", { op: "obtenerCatalogoGrupoPago", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_grupopago: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var grupopago = xmlDoc.getElementsByTagName("Table");
        var listaGrupoPago = document.getElementById("contenedorLista");
        $(listaGrupoPago).html("");
        var totalregistros;
        for (var i = 0; i < grupopago.length; i++) {
            var CveGrupoPago = GetValor(grupopago[i], "cve_grupopago");
            var Descripcion = GetValor(grupopago[i], "descripcion");
            var estatus = GetValor(grupopago[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(grupopago[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarGrupoPago(' + CveGrupoPago + ')"></button></td>' +
                 '<td><label class="grupopago">' + CveGrupoPago + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaGrupoPago.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoGrupoPago);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarGrupoPago() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmGrupoPago = document.getElementById("frmNuevoGrupoPago");
        if (!frmGrupoPago.esEditar) {
            crearNuevoGrupoPago();
        } else {
            GuardarEdicionGrupoPago();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarGrupoPago(cve_grupopago) {
    var frmGrupoPago = document.getElementById("frmNuevoGrupoPago");
    frmGrupoPago.reset();
    frmGrupoPago.esEditar = true;
    MostrarFormulario();
    CargarDatosGrupoPago(cve_grupopago);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosGrupoPago(cve_grupopago) {
    $.post(urlBase_WS + "NGrupoPago.aspx", { op: "obtenerCatalogoGrupoPago", pagina: 1, longitudPagina: 5, criterio: "",
        cve_grupopago: cve_grupopago
    }).done(function (xmlDoc) {
        var grupopago = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(grupopago, "cve_grupopago", "grupopago");
        SetValor(grupopago, "descripcion", "descripcion");
        SetValor(grupopago, "activo", "estatus", "bool");
    });
}

function GuardarEdicionGrupoPago() {
    var frmNuevoGrupoPago = document.getElementById("frmNuevoGrupoPago");
    var parametros = $(frmNuevoGrupoPago).serialize();
    $.post(urlBase_WS + "NGrupoPago.aspx", "op=EditarGrupoPago&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoGrupoPago();
            document.getElementById("frmNuevoGrupoPago").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarGrupoPago(cve_departamento) {
    $.post(urlBase_WS + "NGrupoPago.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoGrupoPago();
    })
}

function CancelarGrupoPago() {
    MostrarCatalogo();
}