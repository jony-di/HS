var ordenador;

function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    var frm = document.getElementById("frmNuevo");
    frm.reset();
    cargarCatalogo();
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NCataloAgencias.aspx", "seccion=Agencias&op=nuevaAgencia&" + "&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus === 1) {
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

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogo(1, criterio);
}

function MostrarNuevo() {
    var frm = document.getElementById("frmNuevo");
    frm.reset();
    frm.esEditar = false;
    document.getElementById("archivoescaneado").className = "ocultar";
    document.getElementById("mostrarEscaneo").className = "mostrar";
    $.post(urlBase_WS + "NCataloAgencias.aspx", "seccion=Agencias&op=obtenerSiguienteClave").done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "cve_agencia");
    });
    var selectestatus = document.getElementById("activa");
    selectestatus.disabled = true;
    MostrarFormulario();
}

function cargarCatalogo(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina === undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NCataloAgencias.aspx", { seccion: "Agencias", op: "obtenerAgencias", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : "") }).done(function (xmlDoc) {
        QuitarEspera();
        var Agencias = xmlDoc.getElementsByTagName("Table");
        var lista = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(lista).html("");
        var totalregistros;
        for (var i = 0; i < Agencias.length; i++) {
            var Clave = GetValor(Agencias[i], "cve_agencia");
            var Nombre = GetValor(Agencias[i], "nombre");
            var Destino = GetValor(Agencias[i], "destino");
            var estatus = GetValor(Agencias[i], "activa", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(Agencias[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditar(' + Clave + ')"></button></td>' +
                '<td><label class="clave">' + Clave + '</label></td>' +
                '<td><label class="detalle">' + Nombre + '</label></td>' +
                '<td><label class="valor">' + Destino + '</label> </td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            lista.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogo);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function Guardar() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frm = document.getElementById("frmNuevo");
        if (!frm.esEditar) {
            crearNuevo();
        } else {
            GuardarEdicion();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditar(Agencia) {
    var frm = document.getElementById("frmNuevo");
    frm.esEditar = true;
    MostrarFormulario();
    CargarDatos(Agencia);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatos(Agencia) {
    $.post(urlBase_WS + "NCataloAgencias.aspx", { seccion: "Agencias", op: "obtenerAgencia", clave: Agencia }).done(function (xmlDoc) {
        var CatalogoG = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(CatalogoG, "cve_agencia", "cve_agencia");
        SetValor(CatalogoG, "nombre", "nombre");
        SetValor(CatalogoG, "usuario", "usuario");
        SetValor(CatalogoG, "password", "password");
        SetValor(CatalogoG, "destino", "pagina");
        SetValor(CatalogoG, "activa", "activa", "bool");
        var pagina = GetValor(CatalogoG, "destino");
        if (pagina !== "") {
            document.getElementById("archivoescaneado").className = "mostrar";
            document.getElementById("mostrarEscaneo").className = "ocultar";
        }
        else {
            document.getElementById("archivoescaneado").className = "ocultar";
            document.getElementById("mostrarEscaneo").className = "mostrar";
        }
    });
}

function GuardarEdicion() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NCataloAgencias.aspx", "seccion=Agencias&op=editarAgencia&" + parametros).done(function (xmlDoc) {
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

function Cancelar() {
    MostrarCatalogo();
}


function CargarEscaneo() {
    var pathfile = document.getElementById("pathfile");
    var perfilscan = document.getElementById("perfilscan");
    //var formData = new FormData();
    var file = perfilscan.files[0];
    var ext = perfilscan.value.split(".");
    pathfile.value = perfilscan.value;
//    formData.append("FileUpload", file);
//    formData.append("puesto", CVE_PUESTO);
//    $.ajax({
//        type: "POST",
//        url: urlBase_WS + "NPuestosGenericos.aspx",
//        data: formData,
//        dataType: 'json',
//        contentType: false,
//        processData: false,
//        success: function (msg) {
//            var mensajeNotificacion = document.getElementById("mensaje-alerta");
//            var notificacion = document.getElementById("notificacion");
//            document.getElementById("archivoescaneado").className = "";
//            document.getElementById("mostrarEscaneo").className = "ocultar";
//            $(mensajeNotificacion).html("Se guardo correctamente");
//            notificacion.className = "alert-box success mostrar";
//            document.getElementById("ligaEscaneo").setAttribute("onclick", "abrirImagen('/Expedientes/Puestos/Perfiles/" + CVE_PUESTO + "." + ext[ext.length - 1] + "')");

//        },
//        error: function (error) {
//            var mensajeNotificacion = document.getElementById("mensaje-alerta");
//            var notificacion = document.getElementById("notificacion");
//            $(mensajeNotificacion).html("No se guardo correctamente");
//            notificacion.className = "alert-box error mostrar";
//        }
//    });
}