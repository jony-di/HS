function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoConcepto(1);
}

function crearNuevoConcepto() {
    var frmNuevoConcepto = document.getElementById("frmNuevoConcepto");
    var parametros = $(frmNuevoConcepto).serialize();
    $.post(urlBase_WS + "NConcepto.aspx", "op=NuevoConcepto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoConcepto(1);
            document.getElementById("frmNuevoConcepto").reset();
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
    cargarCatalogoConcepto(1, criterio);
}

function MostrarNuevoConcepto() {
    var frmConcepto = document.getElementById("frmNuevoConcepto");
    frmConcepto.reset();
    frmConcepto.esEditar = false;
    $.post(urlBase_WS + "NConcepto.aspx", { op: "ObtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoConcepto(pagina, criterio){
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NConcepto.aspx", { op: "obtenerCatalogoConcepto", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_concepto: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var concepto = xmlDoc.getElementsByTagName("Table");
        var listaConcepto = document.getElementById("contenedorLista");
        $(listaConcepto).html("");
        var totalregistros;
        for (var i = 0; i < concepto.length; i++) {
            var cveConcepto = GetValor(concepto[i], "cve_concepto");
            var cveDado = GetValor(concepto[i], "cve_dado");
            var Descripcion = GetValor(concepto[i], "descripcion");
            var estatus = GetValor(concepto[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(concepto[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarConcepto(' + cveConcepto + ')"></button></td>' +
                '<td><label class="clave">' + cveConcepto + '</label></td>' +
                '<td><label class="dado">' + cveDado + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaConcepto.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoConcepto);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarConcepto() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmConcepto = document.getElementById("frmNuevoConcepto");
        if (!frmConcepto.esEditar) {
            crearNuevoConcepto();
        } else {
            GuardarEdicionConcepto();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarConcepto(cve_concepto) {
    var frmConcepto = document.getElementById("frmNuevoConcepto");
    frmConcepto.reset();
    frmConcepto.esEditar = true;
    MostrarFormulario();
    CargarDatosConcepto(cve_concepto);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosConcepto(cve_concepto) {
    $.post(urlBase_WS + "NConcepto.aspx", { op: "obtenerCatalogoConcepto", pagina: 1, longitudPagina: 5, criterio: "",
        cve_concepto: cve_concepto
    }).done(function (xmlDoc) {
        var concepto = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(concepto, "cve_concepto", "clave");
        SetValor(concepto, "cve_dado", "dado");
        SetValor(concepto, "descripcion", "descripcion");
        SetValor(concepto, "activo", "estatus", "bool");
    });
}

function GuardarEdicionConcepto() {
    var frmNuevoConcepto = document.getElementById("frmNuevoConcepto");
    var parametros = $(frmNuevoConcepto).serialize();
    $.post(urlBase_WS + "NConcepto.aspx", "op=EditarConcepto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoConcepto();
            document.getElementById("frmNuevoConcepto").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarConcepto(cve_concepto) {
    $.post(urlBase_WS + "NConcepto.aspx", { op: "CambiarEstatusActivo", cve_concepto: cve_concepto, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoConcepto();
    })
}

function CancelarConcepto(){
    MostrarCatalogo();
 }