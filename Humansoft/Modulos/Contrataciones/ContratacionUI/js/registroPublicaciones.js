var CVE_Vacante;
var ordenador;

function iniciar(publicacion) {
    CVE_Vacante = publicacion;

    var calendario = document.getElementById("fecha");
    $(calendario).datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: "-40:+0"
    });
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogo(1);
    LlenarSelect(urlBase_WS + "NCatalogoVacantes.aspx?seccion=publicaciones&op=obtenerAgencias", "agencia", "--Seleccione pagina--", "cve_agencia", "nombre");
    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogo(1, criterio);
}

function cargarCatalogo(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined){
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NCatalogoVacantes.aspx", { seccion: "publicaciones", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_solicitudvacante: CVE_Vacante }).done(function (xmlDoc) {
        QuitarEspera();
        var Apartado = xmlDoc.getElementsByTagName("Table");
        var listaApartado = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaApartado).html("");
        var totalregistros;
        for (var i = 0; i < Apartado.length; i++) {
            var cve_publico = GetValor(Apartado[i], "cve_publico");
            var nombre = GetValor(Apartado[i], "nombre");
            var fechapublico = GetValor(Apartado[i], "fechapublico", "date");
            var costo = GetValor(Apartado[i], "costo");
            var vigencia = GetValor(Apartado[i], "vigencia");
            var emppublico = GetValor(Apartado[i], "emppublico");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(Apartado[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditar(' + cve_publico + ')"></button></td>' +
                '<td><label class="clave">' + nombre + '</label></td>' +
                '<td><label class="detalle">' + fechapublico + '</label></td>' +
                '<td><label class="valor">' + vigencia + '</label> </td>' +
                '<td><label class="valor">' + costo + '</label> </td>' +
                '<td><label class="estatus">' + emppublico + '</label> </td>'
            );
            listaApartado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogo);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NCatalogoVacantes.aspx", "seccion=publicaciones&op=nuevo&cve_vacante=" + CVE_Vacante + "&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogo();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function MostrarNuevo() {
    var frmApartado = document.getElementById("frmNuevo");
    frmApartado.reset();
    frmApartado.esEditar = false;
    MostrarFormulario();
}

function Guardar() {
    
    if (!validacion()) { return false; }
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmApartado = document.getElementById("frmNuevo");
        if (!frmApartado.esEditar) {
            crearNuevo();
        } else {
            GuardarEdicion();
        }
    }
    else {
        MostrarCatalogo();
    }
}


function validacion() {
    var result = true;
    var agencia = document.getElementById("agencia");
    if (agencia.value == 0) {
        alert("Seleccione la agencia");
        result = false; 
    }
return result;
}

function MostrarEditar(Apartado) {
    var frmApartado = document.getElementById("frmNuevo");
    frmApartado.esEditar = true;
    MostrarFormulario();
    CargarDatos(Apartado);
}

function CargarDatos(Apartado) {
    $.post(urlBase_WS + "NCatalogoVacantes.aspx", { seccion: "publicaciones", op: "obtenerRegistro", cve_publico: Apartado, cve_vacante: CVE_Vacante}).done(function (xmlDoc) {
        var tblApartado = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tblApartado, "cve_publico", "cve_publico");
        SetValor(tblApartado, "fechapublico", "fecha","date");
        SetValor(tblApartado, "vigencia", "vigencia");
        SetValor(tblApartado, "emppublico", "publicador");
        SetValor(tblApartado, "costo", "costo");
        SetValor(tblApartado, "comentario", "comentario");
        SetValor(tblApartado, "cve_agencia", "agencia");
    });
}

function GuardarEdicion() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NCatalogoVacantes.aspx", "seccion=publicaciones&op=editar&cve_vacante=" + CVE_Vacante + "&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogo();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function Cancelar(){
    MostrarCatalogo();
}