function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoSegmentos(1);
}

function crearNuevoSegmentos() {
    var frmNuevoSegmentos = document.getElementById("frmNuevoSegmentos");
    var parametros = $(frmNuevoSegmentos).serialize();
    $.post(urlBase_WS + "NSegmento.aspx", "op=NuevoSegmentos&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoSegmentos(1);
            document.getElementById("frmNuevoSegmentos").reset();
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
    cargarCatalogoSegmentos(1, criterio);
}

function MostrarNuevoSegmentos() {
    var frmSegmentos = document.getElementById("frmNuevoSegmentos");
    frmSegmentos.reset();
    frmSegmentos.esEditar = false;
    $.post(urlBase_WS + "NSegmento.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "segmentos");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoSegmentos(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NSegmento.aspx", { op: "obtenerCatalogoSegmentos", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_segmento: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var segmentos = xmlDoc.getElementsByTagName("Table");
        var listaSegmentos = document.getElementById("contenedorLista");
        $(listaSegmentos).html("");
        var totalregistros;
        for (var i = 0; i < segmentos.length; i++) {
            var CveSegmentos = GetValor(segmentos[i], "cve_segmento");
            var Descripcion = GetValor(segmentos[i], "descripcion");
            var estatus = GetValor(segmentos[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(segmentos[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarSegmentos(' + CveSegmentos + ')"></button></td>' +
                 '<td><label class="segmentos">' + CveSegmentos + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaSegmentos.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoSegmentos);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarSegmentos() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmSegmentos = document.getElementById("frmNuevoSegmentos");
        if (!frmSegmentos.esEditar) {
            crearNuevoSegmentos();
        } else {
            GuardarEdicionSegmentos();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarSegmentos(cve_segmento) {
    var frmSegmentos = document.getElementById("frmNuevoSegmentos");
    frmSegmentos.reset();
    frmSegmentos.esEditar = true;
    MostrarFormulario();
    CargarDatosSegmentos(cve_segmento);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosSegmentos(cve_segmento) {
    $.post(urlBase_WS + "NSegmento.aspx", { op: "obtenerCatalogoSegmentos", pagina: 1, longitudPagina: 5, criterio: "",
        cve_segmento: cve_segmento
    }).done(function (xmlDoc) {
        var segmentos = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(segmentos, "cve_segmento", "segmentos");
        SetValor(segmentos, "descripcion", "descripcion");
        SetValor(segmentos, "activo", "estatus", "bool");
    });
}

function GuardarEdicionSegmentos() {
    var frmNuevoSegmentos = document.getElementById("frmNuevoSegmentos");
    var parametros = $(frmNuevoSegmentos).serialize();
    $.post(urlBase_WS + "NSegmento.aspx", "op=EditarSegmentos&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoSegmentos();
            document.getElementById("frmNuevoSegmentos").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarSegmentos(cve_segmento) {
    $.post(urlBase_WS + "NSegmento.aspx", { op: "CambiarEstatusActivo", cve_segmento: cve_segmento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoSegmentos();
    })
}

function CancelarSegmentos(){
    MostrarCatalogo();
 }