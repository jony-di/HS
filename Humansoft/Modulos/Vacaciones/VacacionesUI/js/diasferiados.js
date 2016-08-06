function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
    LlenarSelect(urlBase_WS + "NDiasFeriados.aspx?op=ObtenerAplicaFeriado&seccion=DiasFeriados", "cve_aplica", "Seleccione a quién aplica.", "cve_aplica", "descripcion");
}


function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NDiasFeriados.aspx", "op=Nuevo&seccion=DiasFeriados&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoItemCat(1);
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}


function buscarCoincidencias(ev, objeto){
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function MostrarNuevo() {
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    document.getElementById("cve_aplica").selectedIndex = 3;
    frmItemCat.esEditar = false;
    $.post(urlBase_WS + "NDiasFeriados.aspx", { seccion: "DiasFeriados", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoItemCat(pagina, criterio, cve_dia) {
    if (!cve_dia) cve_dia = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NDiasFeriados.aspx", { seccion: "DiasFeriados", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_dia: cve_dia }).done(function (xmlDoc) {
        QuitarEspera();
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var clave = GetValor(ItemCat[i], "cve_dia");
            var fecha = GetValor(ItemCat[i], "fecha");
            var descripcion = GetValor(ItemCat[i], "descripcion");
            var mediodia = GetValor(ItemCat[i], "mediodia","bool","Si:No");
            var aplicaPara = GetValor(ItemCat[i], "aplicaPara");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarItemCat(' + clave + ')"></button></td>' +
                 '<td>' + clave + '</td>' +
                '<td>' + fecha + '</td>' +
                '<td>' + descripcion + '</td>' +
                '<td>' + mediodia + '</td>' +
                '<td>' + aplicaPara + '</td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}



function callbackInicioVerDetallePolitica() {
   //QuitarEspera();
}


function Guardar() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar){
            crearNuevo();
        } else {
            GuardarEdicioNCatalogosDiasFeriadosMaes();

        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarItemCat(clave) {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.esEditar = true;
    MostrarFormulario();
    CargarDatosItemCat(clave);

    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosItemCat(cve_ItemCat) {
    $.post(urlBase_WS + "NDiasFeriados.aspx", { seccion: "DiasFeriados", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_dia: cve_ItemCat
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_dia", "clave");
        SetValor(ItemCat, "fecha", "fecha");
        SetValor(ItemCat, "descripcion", "descripcion");
        SetValor(ItemCat, "mediodia", "mediodia","bool");
        SetValor(ItemCat, "cve_aplica", "cve_aplica");
    });
}

function GuardarEdicioNCatalogosDiasFeriadosMaes() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NDiasFeriados.aspx", "op=Editar&seccion=DiasFeriados&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoItemCat();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";

        }
    });
}




function Cancelar() {
    MostrarCatalogo();
}

