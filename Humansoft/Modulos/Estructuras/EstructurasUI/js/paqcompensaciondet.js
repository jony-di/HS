function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoPaqCompensacionDet(1);
}

function crearNuevoPaqCompensacionDet() {
    var frmNuevoPaqCompensacionDet = document.getElementById("frmNuevoPaqCompensacionDet");
    var parametros = $(frmNuevoPaqCompensacionDet).serialize();
    $.post(urlBase_WS + "NPaqCompensacionDet.aspx", "op=NuevoPaqCompensacionDet&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPaqCompensacionDet(1);
            document.getElementById("frmNuevoPaqCompensacionDet").reset();
            MostrarCatalogo();
        }else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoPaqCompensacionDet(1, criterio);
}

function MostrarNuevoPaqCompensacionDet() {
    var frmPaqCompensacionDet = document.getElementById("frmNuevoPaqCompensacionDet");
    frmPaqCompensacionDet.reset();
    frmPaqCompensacionDet.esEditar = false;
    $.post(urlBase_WS + "NPaqCompensacionDet.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "paqcompensaciondet");
    });
    //document.getElementById("nombre").focus();
    var selectConcepto = document.getElementById("concepto");
    LlenarCatalogoConcepto(selectConcepto, function () {
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = true;
        MostrarFormulario();
    });
}

var ordenador;
function cargarCatalogoPaqCompensacionDet(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPaqCompensacionDet.aspx", { op: "obtenerCatalogoPaqCompensacionDet", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_paquete: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var paqcompensaciondet = xmlDoc.getElementsByTagName("Table");
        var listaPaqCompensacionDet = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPaqCompensacionDet).html("");
        var totalregistros;
        for (var i = 0; i < paqcompensaciondet.length; i++) {
            var CvePaqCompensacionDet = GetValor(paqcompensaciondet[i], "cve_paquete");
            var concepto = GetValor(paqcompensaciondet[i], "cve_concepto");
            var monto = GetValor(paqcompensaciondet[i], "monto");
            var estatus = GetValor(paqcompensaciondet[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(paqcompensaciondet[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPaqCompensacionDet(' + CvePaqCompensacionDet + ')"></button></td>' +
                 '<td><label class="paqcompensaciondet">' + CvePaqCompensacionDet + '</label></td>' +
                '<td><label class="concepto">' + concepto + '</label></td>' +
                '<td><label class="monto">' + monto + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaPaqCompensacionDet.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoPaqCompensacionDet);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPaqCompensacionDet() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPaqCompensacionDet = document.getElementById("frmNuevoPaqCompensacionDet");
        if (!frmPaqCompensacionDet.esEditar) {
            crearNuevoPaqCompensacionDet();
        } else {
            GuardarEdicionPaqCompensacionDet();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarPaqCompensacionDet(cve_paquete) {
    var frmPaqCompensacionDet = document.getElementById("frmNuevoPaqCompensacionDet");
    frmPaqCompensacionDet.reset();
    frmPaqCompensacionDet.esEditar = true;
    MostrarFormulario();
    CargarDatosPaqCompensacionDet(cve_paquete);
    var selectConcepto = document.getElementById("concepto");
    LlenarCatalogoConcepto(selectConcepto, function () {});
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosPaqCompensacionDet(cve_paquete) {
    $.post(urlBase_WS + "NPaqCompensacionDet.aspx", { op: "obtenerCatalogoPaqCompensacionDet", pagina: 1, longitudPagina: 5, criterio: "",
        cve_paquete: cve_paquete
    }).done(function (xmlDoc) {
        var paqcompensaciondet = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(paqcompensaciondet, "cve_paquete", "paqcompensaciondet");
        SetValor(paqcompensaciondet, "cve_concepto", "concepto");
        SetValor(paqcompensaciondet, "monto", "monto");
        SetValor(paqcompensaciondet, "activo", "estatus", "bool");
    });
}

function GuardarEdicionPaqCompensacionDet() {
    var frmNuevoPaqCompensacionDet = document.getElementById("frmNuevoPaqCompensacionDet");
    var parametros = $(frmNuevoPaqCompensacionDet).serialize();
    $.post(urlBase_WS + "NPaqCompensacionDet.aspx", "op=EditarPaqCompensacionDet&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPaqCompensacionDet();
            document.getElementById("frmNuevoPaqCompensacionDet").reset();
            MostrarCatalogo();
        }else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarPaqCompensacionDet(cve_paquete) {
    $.post(urlBase_WS + "NPaqCompensacionDet.aspx", { op: "CambiarEstatusActivo", cve_paquete: cve_paquete, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPaqCompensacionDet();
    })
}

function CancelarPaqCompensacionDet(){
    MostrarCatalogo();
 }