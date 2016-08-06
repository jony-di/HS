var CVE_seccion;

function iniciar(claveApartado) {
   CVE_seccion = claveApartado;
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoApartado(1);
    LlenarSelect(urlBase_WS + "NperfilApartados.aspx?seccion=filtros&op=obtenerControles", "tipocontrol", "--Seleccione el tipo de control--", "cve_tipocontrol", "descripcion");
    LlenarSelect(urlBase_WS + "NperfilApartados.aspx?seccion=filtros&op=obtenerCatalogos", "lstcatalogos", "--Seleccione la fuente de datos--", "cve_catalogo", "descripcion");
    LlenarSelect(urlBase_WS + "NperfilApartados.aspx?seccion=filtros&op=obtenertipocatalogo", "tipocatalogo", "--Seleccione el tipo de datos--", "cve_tipocatalogo", "descripcion");
    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}

function crearNuevoApartado() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NperfilApartados.aspx", "seccion=apartados&op=Nuevo&cve_seccion=" + CVE_seccion + "&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoApartado();
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
    cargarCatalogoApartado(1, criterio);
}

function MostrarNuevoApartado() {
    var frmApartado = document.getElementById("frmNuevo");
    frmApartado.reset();
    var Multivalor = document.getElementById("Multivalor");
    Multivalor.removeAttribute("checked");
    frmApartado.esEditar = false;
    $.post(urlBase_WS + "NperfilApartados.aspx", "seccion=apartados&op=obtenerSiguienteClave&cve_seccion=" +CVE_seccion).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
        SetValor(xmlDoc, "secuencia", "secuencia");
    });
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoApartado(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NperfilApartados.aspx", { seccion: "apartados", op: "obtenerApartados", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_seccion: CVE_seccion }).done(function (xmlDoc) {
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
            var cve_subseccion = GetValor(Apartado[i], "cve_subseccion");
            var descripcion = GetValor(Apartado[i], "descripcion");
            var multivalores = GetValor(Apartado[i], "multivalores", "bool", "Si:No");
            var secuencia = GetValor(Apartado[i], "secuencia");
            var estatus = GetValor(Apartado[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(Apartado[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarApartado(' + cve_subseccion + ')"></button></td>' +
                '<td><label class="clave">' + cve_subseccion + '</label></td>' +
                '<td><label class="detalle">' + descripcion + '</label></td>' +
                '<td><label class="valor">' + multivalores + '</label> </td>' +
                '<td><label class="valor">' + secuencia + '</label> </td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaApartado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoApartado);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarApartado() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmApartado = document.getElementById("frmNuevo");
        if (!frmApartado.esEditar) {
            crearNuevoApartado();
        } else {
            GuardarEdicionApartado();
        }
    }
    else {
        MostrarCatalogo();
    }
}

function MostrarEditarApartado(Apartado) {
    var frmApartado = document.getElementById("frmNuevo");
    frmApartado.esEditar = true;
    MostrarFormulario();
    CargarDatosApartado(Apartado);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
    
}

function CargarDatosApartado(Apartado) {
    $.post(urlBase_WS + "NperfilApartados.aspx", { seccion: "apartados", op: "obtenerApartado", clave: Apartado, cve_seccion: CVE_seccion, pagina: 1, longitudPagina: 5
    }).done(function (xmlDoc) {
        var tblApartado = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tblApartado, "cve_subseccion", "clave");
        SetValor(tblApartado, "descripcion", "descripcion");
        SetValor(tblApartado, "multivalores", "Multivalor");
        SetValor(tblApartado, "secuencia", "secuencia");
        SetValor(tblApartado, "activo", "estatus", "bool");
        SetValor(tblApartado, "cve_catalogo", "lstcatalogos");
        SetValor(tblApartado, "cve_tipocatalogo", "tipocatalogo");
    });
    
}

function GuardarEdicionApartado() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NperfilApartados.aspx", "seccion=apartados&op=Editar&cve_seccion=" +CVE_seccion + "&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoApartado();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarApartado(Apartado) {
    $.post(urlBase_WS + "NperfilApartados.aspx", { op: "CambiarEstatusActivo", Apartado: Apartado, activo: false }).done(function (xmlDoc) {
        cargarCatalogoApartado();
    })
}

function CancelarApartado(){
    MostrarCatalogo();
}
