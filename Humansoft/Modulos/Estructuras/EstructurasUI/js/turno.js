function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTurno(1);
}

function crearNuevoTurno() {
    var frmNuevoTurno = document.getElementById("frmNuevoTurno");
    var parametros = $(frmNuevoTurno).serialize();
    $.post(urlBase_WS + "NTurno.aspx", "op=NuevoTurno&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTurno(1);
            document.getElementById("frmNuevoTurno").reset();
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
    cargarCatalogoTurno(1, criterio);
}

function MostrarNuevoTurno() {
    var frmTurno = document.getElementById("frmNuevoTurno");
    frmTurno.reset();
    frmTurno.esEditar = false;
    $.post(urlBase_WS + "NTurno.aspx", { op: "ObtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoTurno(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTurno.aspx", { op: "obtenerCatalogoTurno", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_turno: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var turno = xmlDoc.getElementsByTagName("Table");
        var listaTurno = document.getElementById("contenedorLista");
        $(listaTurno).html("");
        var totalregistros;
        for (var i = 0; i < turno.length; i++) {
            var cveTurno = GetValor(turno[i], "cve_turno");
            var Descripcion = GetValor(turno[i], "descripcion");
            var estatus = GetValor(turno[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(turno[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTurno(' + cveTurno + ')"></button></td>' +
                '<td><label class="clave">' + cveTurno + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaTurno.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTurno);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTurno() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTurno = document.getElementById("frmNuevoTurno");
        if (!frmTurno.esEditar) {
            crearNuevoTurno();
        } else {
            GuardarEdicionTurno();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarTurno(cve_turno) {
    var frmTurno = document.getElementById("frmNuevoTurno");
    frmTurno.reset();
    frmTurno.esEditar = true;
    MostrarFormulario();
    CargarDatosTurno(cve_turno);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTurno(cve_turno) {
    $.post(urlBase_WS + "NTurno.aspx", { op: "obtenerCatalogoTurno", pagina: 1, longitudPagina: 5, criterio: "",
        cve_turno: cve_turno
    }).done(function (xmlDoc) {
        var turno = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(turno, "cve_turno", "clave");
        SetValor(turno, "descripcion", "descripcion");
        SetValor(turno, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTurno() {
    var frmNuevoTurno = document.getElementById("frmNuevoTurno");
    var parametros = $(frmNuevoTurno).serialize();
    $.post(urlBase_WS + "NTurno.aspx", "op=EditarTurno&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTurno();
            document.getElementById("frmNuevoTurno").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTurno(cve_turno) {
    $.post(urlBase_WS + "NTurno.aspx", { op: "CambiarEstatusActivo", cve_turno: cve_turno, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTurno();
    })
}

function CancelarTurno() {
    MostrarCatalogo();
}