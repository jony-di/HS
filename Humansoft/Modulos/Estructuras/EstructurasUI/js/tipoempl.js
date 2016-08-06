function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTipoEmpl(1);
}

function crearNuevoTipoEmpl() {
    var frmNuevoTipoEmpl = document.getElementById("frmNuevoTipoEmpl");
    var parametros = $(frmNuevoTipoEmpl).serialize();
    $.post(urlBase_WS + "NTipoEmpl.aspx", "op=NuevoTipoEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoEmpl(1);
            document.getElementById("frmNuevoTipoEmpl").reset();
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
    cargarCatalogoTipoEmpl(1, criterio);
}

function MostrarNuevoTipoEmpl() {
    var frmTipoEmpl = document.getElementById("frmNuevoTipoEmpl");
    frmTipoEmpl.reset();
    frmTipoEmpl.esEditar = false;
    $.post(urlBase_WS + "NTipoEmpl.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "tipoempl");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoTipoEmpl(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipoEmpl.aspx", { op: "obtenerCatalogoTipoEmpl", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipoemp: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var tipoempl = xmlDoc.getElementsByTagName("Table");
        var listaTipoEmpl = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTipoEmpl).html("");
        var totalregistros;
        for (var i = 0; i < tipoempl.length; i++) {
            var CveTipoEmpl = GetValor(tipoempl[i], "cve_tipoemp");
            var Descripcion = GetValor(tipoempl[i], "descripcion");
            var estatus = GetValor(tipoempl[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tipoempl[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTipoEmpl(' + CveTipoEmpl + ')"></button></td>' +
                 '<td><label class="tipoempl">' + CveTipoEmpl + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTipoEmpl.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTipoEmpl);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTipoEmpl() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTipoEmpl = document.getElementById("frmNuevoTipoEmpl");
        if (!frmTipoEmpl.esEditar) {
            crearNuevoTipoEmpl();
        } else {
            GuardarEdicionTipoEmpl();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTipoEmpl(cve_tipoemp) {
    var frmTipoEmpl = document.getElementById("frmNuevoTipoEmpl");
    frmTipoEmpl.reset();
    frmTipoEmpl.esEditar = true;
    MostrarFormulario();
    CargarDatosTipoEmpl(cve_tipoemp);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTipoEmpl(cve_tipoemp) {
    $.post(urlBase_WS + "NTipoEmpl.aspx", { op: "obtenerCatalogoTipoEmpl", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipoemp: cve_tipoemp
    }).done(function (xmlDoc) {
        var tipoempl = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tipoempl, "cve_tipoemp", "tipoempl");
        SetValor(tipoempl, "descripcion", "descripcion");
        SetValor(tipoempl, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTipoEmpl() {
    var frmNuevoTipoEmpl = document.getElementById("frmNuevoTipoEmpl");
    var parametros = $(frmNuevoTipoEmpl).serialize();
    $.post(urlBase_WS + "NTipoEmpl.aspx", "op=EditarTipoEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoEmpl();
            document.getElementById("frmNuevoTipoEmpl").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTipoEmpl(cve_tipoemp) {
    $.post(urlBase_WS + "NTipoEmpl.aspx", { op: "CambiarEstatusActivo", cve_tipoemp: cve_tipoemp, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTipoEmpl();
    })
}

function CancelarTipoEmpl(){
    MostrarCatalogo();
 }