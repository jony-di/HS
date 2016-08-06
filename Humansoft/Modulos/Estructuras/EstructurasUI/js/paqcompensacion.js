function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoPaqCompensacion(1);
}

function crearNuevoPaqCompensacion() {
    var frmNuevoPaqCompensacion = document.getElementById("frmNuevoPaqCompensacion");
    var parametros = $(frmNuevoPaqCompensacion).serialize();
    $.post(urlBase_WS + "NPaqCompensacion.aspx", "op=NuevoPaqCompensacion&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPaqCompensacion(1);
            document.getElementById("frmNuevoPaqCompensacion").reset();
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
    cargarCatalogoPaqCompensacion(1, criterio);
}

function MostrarNuevoPaqCompensacion() {
    var frmPaqCompensacion = document.getElementById("frmNuevoPaqCompensacion");
    frmPaqCompensacion.reset();
    frmPaqCompensacion.esEditar = false;
    $.post(urlBase_WS + "NPaqCompensacion.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "paqcompensacion");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoPaqCompensacion(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPaqCompensacion.aspx", { op: "obtenerCatalogoPaqCompensacion", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_paquete: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var paqcompensacion = xmlDoc.getElementsByTagName("Table");
        var listaPaqCompensacion = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPaqCompensacion).html("");
        var totalregistros;
        for (var i = 0; i < paqcompensacion.length; i++) {
            var CvePaqCompensacion = GetValor(paqcompensacion[i], "cve_paquete");
            var nombre = GetValor(paqcompensacion[i], "nombre");
            var descripcion = GetValor(paqcompensacion[i], "descripcion");
            var estatus = GetValor(paqcompensacion[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(paqcompensacion[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPaqCompensacion(' + CvePaqCompensacion + ')"></button></td>' +
                 '<td><label class="paqcompensacion">' + CvePaqCompensacion + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="descripcion">' + descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaPaqCompensacion.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoPaqCompensacion);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPaqCompensacion() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPaqCompensacion = document.getElementById("frmNuevoPaqCompensacion");
        if (!frmPaqCompensacion.esEditar) {
            crearNuevoPaqCompensacion();
        } else {
            GuardarEdicionPaqCompensacion();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPaqCompensacion(cve_paquete) {
    var frmPaqCompensacion = document.getElementById("frmNuevoPaqCompensacion");
    frmPaqCompensacion.reset();
    frmPaqCompensacion.esEditar = true;
    MostrarFormulario();
    CargarDatosPaqCompensacion(cve_paquete);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosPaqCompensacion(cve_paquete) {
    $.post(urlBase_WS + "NPaqCompensacion.aspx", { op: "obtenerCatalogoPaqCompensacion", pagina: 1, longitudPagina: 5, criterio: "",
        cve_paquete: cve_paquete
    }).done(function (xmlDoc) {
        var paqcompensacion = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(paqcompensacion, "cve_paquete", "paqcompensacion");
        SetValor(paqcompensacion, "nombre", "nombre");
        SetValor(paqcompensacion, "descripcion", "descripcion");
        SetValor(paqcompensacion, "activo", "estatus", "bool");
    });
}

function GuardarEdicionPaqCompensacion() {
    var frmNuevoPaqCompensacion = document.getElementById("frmNuevoPaqCompensacion");
    var parametros = $(frmNuevoPaqCompensacion).serialize();
    $.post(urlBase_WS + "NPaqCompensacion.aspx", "op=EditarPaqCompensacion&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPaqCompensacion();
            document.getElementById("frmNuevoPaqCompensacion").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarPaqCompensacion(cve_paquete) {
    $.post(urlBase_WS + "NPaqCompensacion.aspx", { op: "CambiarEstatusActivo", cve_paquete: cve_paquete, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPaqCompensacion();
    })
}

function CancelarPaqCompensacion(){
    MostrarCatalogo();
 }