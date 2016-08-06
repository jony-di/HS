function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTipoPlantilla(1);
}

function crearNuevoTipoPlantilla() {
    var frmNuevoTipoPlantilla = document.getElementById("frmNuevoTipoPlantilla");
    var parametros = $(frmNuevoTipoPlantilla).serialize();
    $.post(urlBase_WS + "NTipoPlantilla.aspx", "op=NuevoTipoPlantilla&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoPlantilla(1);
            document.getElementById("frmNuevoTipoPlantilla").reset();
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
    cargarCatalogoTipoPlantilla(1, criterio);
}

function MostrarNuevoTipoPlantilla() {
    var frmTipoPlantilla = document.getElementById("frmNuevoTipoPlantilla");
    frmTipoPlantilla.esEditar = false;
    $.post(urlBase_WS + "NTipoPlantilla.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "tipoplantilla");
    });
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoTipoPlantilla(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipoPlantilla.aspx", { op: "obtenerCatalogoTipoPlantilla", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipoplantilla: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var tipoplantilla = xmlDoc.getElementsByTagName("Table");
        var listaTipoPlantilla = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTipoPlantilla).html("");
        var totalregistros;
        for (var i = 0; i < tipoplantilla.length; i++) {
            var CveTipoPlantilla = GetValor(tipoplantilla[i], "cve_tipoplantilla");
            var Descripcion = GetValor(tipoplantilla[i], "descripcion");
            var estatus = GetValor(tipoplantilla[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tipoplantilla[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTipoPlantilla(' + CveTipoPlantilla + ')"></button></td>' +
                 '<td><label class="tipoplantilla">' + CveTipoPlantilla + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTipoPlantilla.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTipoPlantilla);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTipoPlantilla() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTipoPlantilla = document.getElementById("frmNuevoTipoPlantilla");
        if (!frmTipoPlantilla.esEditar) {
            crearNuevoTipoPlantilla();
        } else {
            GuardarEdicionTipoPlantilla();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTipoPlantilla(cve_tipoplantilla) {
    var frmTipoPlantilla = document.getElementById("frmNuevoTipoPlantilla");
    frmTipoPlantilla.esEditar = true;
    MostrarFormulario();
    CargarDatosTipoPlantilla(cve_tipoplantilla);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTipoPlantilla(cve_tipoplantilla) {
    $.post(urlBase_WS + "NTipoPlantilla.aspx", { op: "obtenerCatalogoTipoPlantilla", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipoplantilla: cve_tipoplantilla
    }).done(function (xmlDoc) {
        var tipoplantilla = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tipoplantilla, "cve_tipoplantilla", "tipoplantilla");
        SetValor(tipoplantilla, "descripcion", "descripcion");
        SetValor(tipoplantilla, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTipoPlantilla() {
    var frmNuevoTipoPlantilla = document.getElementById("frmNuevoTipoPlantilla");
    var parametros = $(frmNuevoTipoPlantilla).serialize();
    $.post(urlBase_WS + "NTipoPlantilla.aspx", "op=EditarTipoPlantilla&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoPlantilla();
            document.getElementById("frmNuevoTipoPlantilla").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";

        }
    });
}

function DesactivarTipoPlantilla(cve_tipoplantilla) {
    $.post(urlBase_WS + "NTipoPlantilla.aspx", { op: "CambiarEstatusActivo", cve_tipoplantilla: cve_tipoplantilla, activo: false }).done(function (xmlDoc) {
        cargarCatalogoTipoPlantilla();
    })
}

function CancelarTipoPlantilla(){
    MostrarCatalogo();
 }