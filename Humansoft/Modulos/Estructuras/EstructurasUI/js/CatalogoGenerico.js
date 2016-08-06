var CLAVE_CatalogoGenerico;

function iniciar(claveCatalogoGenerico) {
    CLAVE_CatalogoGenerico = claveCatalogoGenerico;
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoCatalogoGenerico(1);
    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}

function crearNuevoCatalogoGenerico() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NCatalogoGenerico.aspx", "seccion=Elemento&op=Nuevo&Catalogoclave="+ CLAVE_CatalogoGenerico + "&" + parametros ).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoCatalogoGenerico();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoCatalogoGenerico(1);
}

function MostrarNuevoCatalogoGenerico() {
    var frmCatalogoGenerico = document.getElementById("frmNuevo");
    frmCatalogoGenerico.reset();
    frmCatalogoGenerico.esEditar = false;
    $.post(urlBase_WS + "NCatalogoGenerico.aspx", "seccion=Elemento&op=obtenerSiguienteClave&clave=" + CLAVE_CatalogoGenerico).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoCatalogoGenerico(pagina) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NCatalogoGenerico.aspx", { seccion: "Elementos", op: "obtenerElementos", pagina: pagina, longitudPagina: 5, cve_catalogo: CLAVE_CatalogoGenerico }).done(function (xmlDoc) {
        QuitarEspera();
        var CatalogoGenerico = xmlDoc.getElementsByTagName("Table");
        var listaCatalogoGenerico = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaCatalogoGenerico).html("");
        var totalregistros;
        for (var i = 0; i < CatalogoGenerico.length; i++) {
            var Clave_CatalogoGenerico = GetValor(CatalogoGenerico[i], "cve_subcatalogo");
            var descripcion = GetValor(CatalogoGenerico[i], "descripcion");
            var valor1 = GetValor(CatalogoGenerico[i], "valor1");
            var valor2 = GetValor(CatalogoGenerico[i], "valor2");
            var estatus = GetValor(CatalogoGenerico[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(CatalogoGenerico[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarCatalogoGenerico(' + Clave_CatalogoGenerico + ')"></button></td>' +
                '<td><label class="clave">' + Clave_CatalogoGenerico + '</label></td>' +
                '<td><label class="detalle">' + descripcion + '</label></td>' +
                '<td><label class="valor">' + valor1 + '</label> </td>' +
                '<td><label class="valor">' + valor2 + '</label> </td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaCatalogoGenerico.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoCatalogoGenerico);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
    
}

function GuardarCatalogoGenerico() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmCatalogoGenerico = document.getElementById("frmNuevo");
        if (!frmCatalogoGenerico.esEditar) {
            crearNuevoCatalogoGenerico();
        } else {
            GuardarEdicionCatalogoGenerico();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarCatalogoGenerico(CatalogoGenerico) {
    var frmCatalogoGenerico = document.getElementById("frmNuevo");
    frmCatalogoGenerico.esEditar = true;
    MostrarFormulario();
    CargarDatosCatalogoGenerico(CatalogoGenerico);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosCatalogoGenerico(CatalogoGenerico) {
    $.post(urlBase_WS + "NCatalogoGenerico.aspx", { seccion: "Elemento", op: "obtenerElemento", clave: CatalogoGenerico, cve_catalogo: CLAVE_CatalogoGenerico, pagina: 1, longitudPagina: 5
    }).done(function (xmlDoc) {
        var CatalogoGenerico = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(CatalogoGenerico, "cve_subcatalogo", "clave");
        SetValor(CatalogoGenerico, "descripcion", "descripcion");
        SetValor(CatalogoGenerico, "valor1", "Valor1");
        SetValor(CatalogoGenerico, "valor2", "Valor2");
        SetValor(CatalogoGenerico, "activo", "estatus", "bool");
    });
}

function GuardarEdicionCatalogoGenerico() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NCatalogoGenerico.aspx", "seccion=Elemento&op=Editar&cve_catalogo=" + CLAVE_CatalogoGenerico + "&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoCatalogoGenerico();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarCatalogoGenerico(CatalogoGenerico) {
    $.post(urlBase_WS + "NCatalogoGenerico.aspx", { op: "CambiarEstatusActivo", CatalogoGenerico: CatalogoGenerico, activo: false }).done(function (xmlDoc) {
        //alert(xmlDoc);
        cargarCatalogoCatalogoGenerico();
    })
}

function CancelarCatalogoGenerico(){
    MostrarCatalogo();
 }