function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    //cargarCatalogoHorario(1);
}

function crearNuevoHorario() {
    var frmNuevoHorario = document.getElementById("frmNuevoHorario");
    var parametros = $(frmNuevoHorario).serialize();
    $.post(urlBase_WS + "NHorario.aspx", "op=NuevoHorario&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoHorario(1);
            document.getElementById("frmNuevoHorario").reset();
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
    cargarCatalogoHorario(1, criterio);
}

function MostrarNuevoHorario() {
    var frmHorario = document.getElementById("frmNuevoHorario");
    frmHorario.esEditar = false;
    /*$.post(urlBase_WS + "NHorario.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", cve_horario);
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;*/
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoHorario(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NHorario.aspx", { op: "obtenerCatalogoHorario", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_grupopago: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var grupopago = xmlDoc.getElementsByTagName("Table");
        var listaHorario = document.getElementById("contenedorLista");
        $(listaHorario).html("");
        var totalregistros;
        for (var i = 0; i < grupopago.length; i++) {
            var CveHorario = GetValor(grupopago[i], "cve_grupopago");
            var Descripcion = GetValor(grupopago[i], "descripcion");
            var estatus = GetValor(grupopago[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(grupopago[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarHorario(' + CveHorario + ')"></button></td>' +
                 '<td><label class=cve_horario>' + CveHorario + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaHorario.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoHorario);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarHorario() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmHorario = document.getElementById("frmNuevoHorario");
        if (!frmHorario.esEditar) {
            crearNuevoHorario();
        } else {
            GuardarEdicionHorario();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarHorario(cve_grupopago) {
    var frmHorario = document.getElementById("frmNuevoHorario");
    frmHorario.esEditar = true;
    MostrarFormulario();
    CargarDatosHorario(cve_grupopago);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosHorario(cve_grupopago) {
    $.post(urlBase_WS + "NHorario.aspx", { op: "obtenerCatalogoHorario", pagina: 1, longitudPagina: 5, criterio: "",
        cve_grupopago: cve_grupopago
    }).done(function (xmlDoc) {
        var grupopago = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(grupopago, "cve_grupopago", cve_horario);
        SetValor(grupopago, "descripcion", "descripcion");
        SetValor(grupopago, "activo", "estatus", "bool");
    });
}

function GuardarEdicionHorario() {
    var frmNuevoHorario = document.getElementById("frmNuevoHorario");
    var parametros = $(frmNuevoHorario).serialize();
    $.post(urlBase_WS + "NHorario.aspx", "op=EditarHorario&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoHorario();
            document.getElementById("frmNuevoHorario").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarHorario(cve_departamento) {
    $.post(urlBase_WS + "NHorario.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoHorario();
    })
}

