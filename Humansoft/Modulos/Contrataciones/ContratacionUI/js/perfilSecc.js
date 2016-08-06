function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarSeccItemCat(1);
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NperfilSecc.aspx", "seccion=PerfilSecciones&op=Nuevo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarSeccItemCat(1);
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
    cargarSeccItemCat(1, criterio);
}

function MostrarNuevo() {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = false;
    $.post(urlBase_WS + "NperfilSecc.aspx", { seccion: "PerfilSecciones", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
        SetValor(xmlDoc, "secuencia", "secuencia");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarSeccItemCat(pagina, criterio, cve_Secc) {
    if (!cve_Secc) cve_Secc = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NperfilSecc.aspx", { seccion: "PerfilSecciones", op: "obtenerSecciones", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_Secc: cve_Secc }).done(function (xmlDoc) {
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
            var CveItemCat = GetValor(ItemCat[i], "cve_seccion");
            var Descripcion = GetValor(ItemCat[i], "descripcion");
            var Secuencia = GetValor(ItemCat[i], "secuencia");
            var estatus = GetValor(ItemCat[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarItemCat(' + CveItemCat + ')"></button></td>' +
                 '<td><label class="ItemCat">' + CveItemCat + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="ItemCat">' + Secuencia + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' +
                '<td><label class="seleccionar"><img class="seleccionar" onclick="VerDetalleSecc(' + CveItemCat + ',this)" src="/Recursos/imagenes/select.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarSeccItemCat);
        var tableSecc = document.getElementById("tableSecc");
        ordenador = $(tableSecc).tablesorter();
    });
}

function VerDetalleSecc(cveSecc, row) {
    PonerEnEspera();
    IntercambioVisual("pantallaAuxiliar", "formulario");
    window.frames["pantallaAuxiliar"].location.href = "/Modulos/Contrataciones/ContratacionUI/CN_pefilApartados.aspx?callbackInicio=callbackInicioVerDetalleperfilApartados&offset=0&perfilApartados=" + cveSecc;
}

function callbackInicioVerDetalleperfilApartados() {
    QuitarEspera();
    DesplazarElemento('principal', -900);
}

function Guardar() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar) {
            crearNuevo();
        } else {
            GuardarEdicioNperfilApartadoss();
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
    $.post(urlBase_WS + "NperfilSecc.aspx", { seccion: "PerfilSecciones", op: "obtenerSeccion", pagina: 1, longitudPagina: 5, criterio: "",
        cve_Secc: cve_ItemCat
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_seccion", "clave");
        SetValor(ItemCat, "descripcion", "descripcion");
        SetValor(ItemCat, "secuencia", "secuencia");
        SetValor(ItemCat, "activo", "estatus", "bool");
    });
}

function GuardarEdicioNperfilApartadoss() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NperfilSecc.aspx", "seccion=PerfilSecciones&op=Editar&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarSeccItemCat();
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
    $.post(urlBase_WS + "NperfilSecc.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarSeccItemCat();
    })
}

function Cancelar() {
    MostrarCatalogo();
}