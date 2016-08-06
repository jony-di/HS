var ordenador;

function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function cargarCatalogoItemCat(pagina, criterio, cve_catalogo) {
    if (!cve_catalogo) cve_catalogo = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "catalogoConfigAsig", op: "obtenerconfig", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_catalogo: cve_catalogo }).done(function (xmlDoc) {
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
            var clave = GetValor(ItemCat[i], "cve_asignacion");
            var nombre = GetValor(ItemCat[i], "nombre");
            var Asignacion = GetValor(ItemCat[i], "MaximoAsignacion");
            var SMin = GetValor(ItemCat[i], "SalarioMinimo");
            var SMax = GetValor(ItemCat[i], "SalarioMaximo");
            var Prioridad = GetValor(ItemCat[i], "Prioridad");
            var Jefe = GetValor(ItemCat[i], "Jefe", "bool", "Si:No");
            var estatus = GetValor(ItemCat[i], "Activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarItemCat(' + clave + ')"></button></td>' +
                '<td><label >' + nombre + '</label></td>' +
                '<td><label >' + Asignacion + '</label></td>' +
                '<td><label >' + SMin + '</label></td>' +
                '<td><label >' + SMax + '</label></td>' +
                '<td><label >' + estatus + '</label> </td>' +
                '<td><label ><img class="seleccionar" onclick="VerDetalle(' + clave + ')" src="/Recursos/imagenes/select.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function MostrarEditarItemCat(CveItemCat) {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = true;
    MostrarFormulario();
    CargarDatosItemCat(CveItemCat);
    var selectestatus = document.getElementById("activo");
    selectestatus.disabled = false;
}

function CargarDatosItemCat(CveItemCat) {
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "catalogoConfigAsig", op: "seleccConfig", clave: CveItemCat }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_asignacion", "clave");
        SetValor(ItemCat, "nombre", "nombre");
        SetValor(ItemCat, "MaximoAsignacion", "max");
        SetValor(ItemCat, "SalarioMinimo", "smin");
        SetValor(ItemCat, "SalarioMaximo", "smax");
        SetValor(ItemCat, "Prioridad", "prioridad");
        SetValor(ItemCat, "Jefe", "jefe", "bool");
        SetValor(ItemCat, "Activo", "activo", "bool");
    });
}

function MostrarNuevo() {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = false;
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "catalogoConfigAsig", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    var selectestatus = document.getElementById("activo");
    selectestatus.disabled = true;
    MostrarFormulario();
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NconfigAsignacion.aspx", "seccion=catalogoConfigAsig&op=Nuevo&" + parametros).done(function (xmlDoc) {
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

function GuardarEdicion() {
    var frmNuevo = document.getElementById("frmNuevo");
    var jefe = document.getElementById("jefe");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NconfigAsignacion.aspx", "seccion=catalogoConfigAsig&op=editConfig&" + parametros).done(function (xmlDoc) {
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

function Guardar() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar) {
            crearNuevo();
        } else {
            GuardarEdicion();
        }
    } else {
        MostrarCatalogo();
    }
}

function Cancelar() {
    MostrarCatalogo();
}

function VerDetalle(cveCatalogo) {
    PonerEnEspera();
    IntercambioVisual("pantallaAuxiliar", "formulario");
    
    window.frames["pantallaAuxiliar"].location.href = "../ContratacionUI/CN_configAsignacionSecciones.aspx?callbackInicio=callbackInicioVerDetalle&offset=0&clave=" + cveCatalogo;
}

function callbackInicioVerDetalle() {
    QuitarEspera();
    DesplazarElemento('principal', -901);
    QuitarEspera();
}