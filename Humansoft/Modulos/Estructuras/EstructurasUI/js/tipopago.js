function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTipoPago(1);

}


function crearNuevoTipoPago() {
    var frmNuevoTipoPago = document.getElementById("frmNuevoTipoPago");
    var parametros = $(frmNuevoTipoPago).serialize();
    $.post(urlBase_WS + "NTipoPago.aspx", "op=NuevoTipoPago&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoPago(1);
            document.getElementById("frmNuevoTipoPago").reset();
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
    cargarCatalogoTipoPago(1, criterio);
}

function MostrarNuevoTipoPago() {
    var frmTipoPago = document.getElementById("frmNuevoTipoPago");
    frmTipoPago.reset();
    frmTipoPago.esEditar = false;
    $.post(urlBase_WS + "NTipoPago.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "tipopago");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoTipoPago(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipoPago.aspx", { op: "obtenerCatalogoTipoPago", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipopago: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var tipopago = xmlDoc.getElementsByTagName("Table");
        var listaTipoPago = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTipoPago).html("");
        var totalregistros;
        for (var i = 0; i < tipopago.length; i++) {
            var CveTipoPago = GetValor(tipopago[i], "cve_tipopago");
            var Descripcion = GetValor(tipopago[i], "descripcion");
            var estatus = GetValor(tipopago[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tipopago[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTipoPago(' + CveTipoPago + ')"></button></td>' +
                 '<td><label class="tipopago">' + CveTipoPago + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTipoPago.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTipoPago);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTipoPago() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTipoPago = document.getElementById("frmNuevoTipoPago");
        if (!frmTipoPago.esEditar) {
            crearNuevoTipoPago();
        } else {
            GuardarEdicionTipoPago();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTipoPago(cve_tipopago) {
    var frmTipoPago = document.getElementById("frmNuevoTipoPago");
    frmTipoPago.reset();
    frmTipoPago.esEditar = true;
    MostrarFormulario();
    CargarDatosTipoPago(cve_tipopago);

    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTipoPago(cve_tipopago) {
    $.post(urlBase_WS + "NTipoPago.aspx", { op: "obtenerCatalogoTipoPago", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipopago: cve_tipopago
    }).done(function (xmlDoc) {
        var tipopago = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tipopago, "cve_tipopago", "tipopago");
        SetValor(tipopago, "descripcion", "descripcion");
        SetValor(tipopago, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTipoPago() {
    var frmNuevoTipoPago = document.getElementById("frmNuevoTipoPago");
    var parametros = $(frmNuevoTipoPago).serialize();
    $.post(urlBase_WS + "NTipoPago.aspx", "op=EditarTipoPago&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoPago();
            document.getElementById("frmNuevoTipoPago").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTipoPago(cve_tipopago) {
    $.post(urlBase_WS + "NTipoPago.aspx", { op: "CambiarEstatusActivo", cve_tipopago: cve_tipopago, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTipoPago();
    })
}

function CancelarTipoPago(){
    MostrarCatalogo();
 }