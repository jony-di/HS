function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NPerfiles.aspx", "seccion=Perfiles&op=Nuevo&" + parametros).done(function (xmlDoc) {
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
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function MostrarNuevo() {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = false;
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "Perfiles", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoItemCat(pagina, criterio, cve_catalogo) {
    if (!cve_catalogo) cve_catalogo = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "Perfiles", op: "obtenerPerfiles", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_catalogo: cve_catalogo }).done(function (xmlDoc) {
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
            var CveItemCat = GetValor(ItemCat[i], "cve_catalogo");
            var Descripcion = GetValor(ItemCat[i], "descripcion");
            var estatus = GetValor(ItemCat[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarItemCat(' + CveItemCat + ')"></button></td>' +
                 '<td><label class="ItemCat">' + CveItemCat + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' +
                '<td><label class="seleccionar"><img class="seleccionar" onclick="VerDetalleCatalogoGenerico(' + CveItemCat + ',this)" src="/Recursos/imagenes/select.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function VerDetalleCatalogoGenerico(cveCatalogo, row) {
    PonerEnEspera();
    IntercambioVisual("pantallaAuxiliar","formulario");
    window.frames["pantallaAuxiliar"].location.href = "../ContratacionUI/CN_catalogoGenerico.aspx?callbackInicio=callbackInicioVerDetalleCatalogoGenerico&offset=0&CatalogoGenerico=" + cveCatalogo;
} /// /Modulos/Contrataciones/ContratacionUI/CN_catalogoGenerico.aspx


function callbackInicioVerDetalleCatalogoGenerico() {
    QuitarEspera();
    DesplazarElemento('principal', -900);
    QuitarEspera();
}

function Guardar() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar) {
            crearNuevo();
        } else {
            GuardarEdicioNPerfiles();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarItemCat(CveItemCat) {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = true;
    MostrarFormulario();
    CargarDatosItemCat(CveItemCat);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosItemCat(cve_ItemCat) {
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "CatalogoGenerico", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_catalogo: cve_ItemCat
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_catalogo", "clave");
        SetValor(ItemCat, "descripcion", "descripcion");
        SetValor(ItemCat, "label1", "Etiqueta1");
        SetValor(ItemCat, "label2", "Etiqueta2");
        SetValor(ItemCat, "activo", "estatus", "bool");
    });
}

function GuardarEdicioNPerfiles() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NPerfiles.aspx", "seccion=CatalogoGenerico&op=Editar&" + parametros).done(function (xmlDoc) {
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

function DesactivarItemCat(cve_departamento) {
    $.post(urlBase_WS + "NPerfiles.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoItemCat();
    })
}

function Cancelar() {
    MostrarCatalogo();
}

