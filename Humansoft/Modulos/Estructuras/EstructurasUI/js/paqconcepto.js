function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoPaqConcepto(1);
}

function crearNuevoPaqConcepto() {
    var frmNuevoPaqConcepto = document.getElementById("frmNuevoPaqConcepto");
    var parametros = $(frmNuevoPaqConcepto).serialize();
    $.post(urlBase_WS + "NPaqConcepto.aspx", "op=NuevoPaqConcepto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1){
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPaqConcepto(1);
            document.getElementById("frmNuevoPaqConcepto").reset();
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
    cargarCatalogoPaqConcepto(1, criterio);
}

function MostrarNuevoPaqConcepto() {
    var frmPaqConcepto = document.getElementById("frmNuevoPaqConcepto");
    frmPaqConcepto.reset();
    frmPaqConcepto.esEditar = false;
    $.post(urlBase_WS + "NPaqConcepto.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoPaqConcepto(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPaqConcepto.aspx", { op: "obtenerCatalogoPaqConcepto", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_concepto: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var paqconcepto = xmlDoc.getElementsByTagName("Table");
        var listaPaqConcepto = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPaqConcepto).html("");
        var totalregistros;
        for (var i = 0; i < paqconcepto.length; i++) {
            var cvePaqConcepto = GetValor(paqconcepto[i], "cve_concepto");
            var cveDado = GetValor(paqconcepto[i], "cve_dado");
            var cvetipo = GetValor(paqconcepto[i], "cve_tipo");
            var descripcion = GetValor(paqconcepto[i], "descripcion");
            var calculo = GetValor(paqconcepto[i], "Caculo");
            var estatus = GetValor(paqconcepto[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(paqconcepto[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPaqConcepto(' + cvePaqConcepto + ')"></button></td>' +
                '<td><label class="clave">' + cvePaqConcepto + '</label></td>' +
                '<td><label class="dado">' + cveDado + '</label></td>' +
                '<td><label class="tipo">' + cvetipo + '</label></td>' +
                '<td><label class="descripcion">' + descripcion + '</label></td>' +
                '<td><label class="calculo">' + calculo + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaPaqConcepto.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoPaqConcepto);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPaqConcepto() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPaqConcepto = document.getElementById("frmNuevoPaqConcepto");
        if (!frmPaqConcepto.esEditar) {
            crearNuevoPaqConcepto();
        } else {
            GuardarEdicionPaqConcepto();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPaqConcepto(cve_concepto) {
    var frmPaqConcepto = document.getElementById("frmNuevoPaqConcepto");
    frmPaqConcepto.reset();
    frmPaqConcepto.esEditar = true;
    MostrarFormulario();
    CargarDatosPaqConcepto(cve_concepto);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosPaqConcepto(cve_concepto) {
    $.post(urlBase_WS + "NPaqConcepto.aspx", { op: "obtenerCatalogoPaqConcepto", pagina: 1, longitudPagina: 5, criterio: "",
        cve_concepto: cve_concepto
    }).done(function (xmlDoc) {
        var paqconcepto = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(paqconcepto, "cve_concepto", "clave");
        SetValor(paqconcepto, "cve_dado", "dado");
        SetValor(paqconcepto, "cve_tipo", "tipo");
        SetValor(paqconcepto, "descripcion", "descripcion");
        SetValor(paqconcepto, "Caculo", "calculo");
        SetValor(paqconcepto, "activo", "estatus", "bool");
    });
}

function GuardarEdicionPaqConcepto() {
    var frmNuevoPaqConcepto = document.getElementById("frmNuevoPaqConcepto");
    var parametros = $(frmNuevoPaqConcepto).serialize();
    $.post(urlBase_WS + "NPaqConcepto.aspx", "op=EditarPaqConcepto&" + parametros).done(function (xmlDoc){
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPaqConcepto();
            document.getElementById("frmNuevoPaqConcepto").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarPaqConcepto(cve_concepto) {
    $.post(urlBase_WS + "NPaqConcepto.aspx", { op: "CambiarEstatusActivo", cve_concepto: cve_concepto, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPaqConcepto();
    })
}

function CancelarPaqConcepto(){
    MostrarCatalogo();
 }