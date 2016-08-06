function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTipoContrato(1);
}

function crearNuevoTipoContrato() {
    var frmNuevoTipoContrato = document.getElementById("frmNuevoTipoContrato");
    var parametros = $(frmNuevoTipoContrato).serialize();
    $.post(urlBase_WS + "NTipoContrato.aspx", "op=NuevoTipoContrato&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoContrato(1);
            document.getElementById("frmNuevoTipoContrato").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoTipoContrato(1, criterio);
}

function MostrarNuevoTipoContrato() {
    var frmTipoContrato = document.getElementById("frmNuevoTipoContrato");
    frmTipoContrato.reset();
    frmTipoContrato.esEditar = false;
    $.post(urlBase_WS + "NTipoContrato.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "tipocontrato");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoTipoContrato(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipoContrato.aspx", { op: "obtenerCatalogoTipoContrato", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipocontrato: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var tipocontrato = xmlDoc.getElementsByTagName("Table");
        var listaTipoContrato = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTipoContrato).html("");
        var totalregistros;
        for (var i = 0; i < tipocontrato.length; i++) {
            var CveTipoContrato = GetValor(tipocontrato[i], "cve_tipocontrato");
            var Descripcion = GetValor(tipocontrato[i], "descripcion");
            var estatus = GetValor(tipocontrato[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tipocontrato[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTipoContrato(' + CveTipoContrato + ')"></button></td>' +
                 '<td><label class="tipocontrato">' + CveTipoContrato + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTipoContrato.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTipoContrato);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTipoContrato() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTipoContrato = document.getElementById("frmNuevoTipoContrato");
        if (!frmTipoContrato.esEditar) {
            crearNuevoTipoContrato();
        } else {
            GuardarEdicionTipoContrato();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTipoContrato(cve_tipocontrato) {
    var frmTipoContrato = document.getElementById("frmNuevoTipoContrato");
    frmTipoContrato.reset();
    frmTipoContrato.esEditar = true;
    MostrarFormulario();
    CargarDatosTipoContrato(cve_tipocontrato);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTipoContrato(cve_tipocontrato) {
    $.post(urlBase_WS + "NTipoContrato.aspx", { op: "obtenerCatalogoTipoContrato", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipocontrato: cve_tipocontrato
    }).done(function (xmlDoc) {
        var tipocontrato = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tipocontrato, "cve_tipocontrato", "tipocontrato");
        SetValor(tipocontrato, "descripcion", "descripcion");
        SetValor(tipocontrato, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTipoContrato() {
    var frmNuevoTipoContrato = document.getElementById("frmNuevoTipoContrato");
    var parametros = $(frmNuevoTipoContrato).serialize();
    $.post(urlBase_WS + "NTipoContrato.aspx", "op=EditarTipoContrato&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoContrato();
            document.getElementById("frmNuevoTipoContrato").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTipoContrato(cve_tipocontrato) {
    $.post(urlBase_WS + "NTipoContrato.aspx", { op: "CambiarEstatusActivo", cve_tipocontrato: cve_tipocontrato, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTipoContrato();
    })
}

function CancelarTipoContrato(){
    MostrarCatalogo();
 }