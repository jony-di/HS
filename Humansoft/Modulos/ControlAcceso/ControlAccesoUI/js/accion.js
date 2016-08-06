function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoAccion(1);
}

function crearNuevoAccion() {
    var frmNuevoAccion = document.getElementById("frmNuevoAccion");
    var parametros = $(frmNuevoAccion).serialize();
    $.post(urlBase_WS + "NAccion.aspx", "op=NuevoAccion&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoAccion(1);
            document.getElementById("frmNuevoAccion").reset();
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
    cargarCatalogoAccion(1, criterio);
}

function MostrarNuevoAccion() {
    var frmAccion = document.getElementById("frmNuevoAccion");
    frmAccion.reset();
    frmAccion.esEditar = false;
    $.post(urlBase_WS + "NAccion.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "cve_accion");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoAccion(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NAccion.aspx", { op: "obtenerCatalogoAccion", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_accion: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var lugartrabajo = xmlDoc.getElementsByTagName("Table");
        var listaAccion = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaAccion).html("");
        var totalregistros;
        for (var i = 0; i < lugartrabajo.length; i++) {
            var cveAccion = GetValor(lugartrabajo[i], "cve_accion");
            var Descripcion = GetValor(lugartrabajo[i], "descripcion");
            var Activo = GetValor(lugartrabajo[i], "activo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(lugartrabajo[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarAccion(' + cveAccion + ')"></button></td>' +
                 '<td><label class="clave">' + cveAccion + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="activo">' + Activo + '</label> </td>'
            );
            listaAccion.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoAccion);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarAccion() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmAccion = document.getElementById("frmNuevoAccion");
        if (!frmAccion.esEditar) {
            crearNuevoAccion();
        } else {
            GuardarEdicionAccion();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarAccion(cve_accion) {
    var frmAccion = document.getElementById("frmNuevoAccion");
    frmAccion.reset();
    frmAccion.esEditar = true;
    MostrarFormulario();      
    CargarDatosAccion(cve_accion);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosAccion(cve_accion) {
    $.post(urlBase_WS + "NAccion.aspx", { op: "obtenerCatalogoAccion", pagina: 1, longitudPagina: 5, criterio: "",
        cve_accion: cve_accion
    }).done(function (xmlDoc) {
        var lugartrabajo = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(lugartrabajo, "cve_accion", "cve_accion");
        SetValor(lugartrabajo, "descripcion", "descripcion");
        SetValor(lugartrabajo, "activo", "activo");
        SetValor(lugartrabajo, "cve_estatus", "cve_estatus");
        SetValor(lugartrabajo, "accion", "accion");
    });
}

function GuardarEdicionAccion() {
    var frmNuevoAccion = document.getElementById("frmNuevoAccion");
    var parametros = $(frmNuevoAccion).serialize();
    $.post(urlBase_WS + "NAccion.aspx", "op=EditarAccion&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoAccion();
            document.getElementById("frmNuevoAccion").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarAccion(cve_accion) {
    $.post(urlBase_WS + "NAccion.aspx", { op: "CambiarEstatusActivo", cve_accion: cve_accion, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoAccion();
    })
}

function CancelarAccion() {
    MostrarCatalogo();
}