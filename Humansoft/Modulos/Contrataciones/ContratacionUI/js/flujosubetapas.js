var CLAVE_GrupoFlujoSubetapas;
function iniciar(cve_etapa) {
    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
    CLAVE_GrupoFlujoSubetapas = cve_etapa;
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoFlujoSubetapas(1);
}

function crearNuevoFlujoSubetapas() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NFlujoSubetapas.aspx", "op=Nuevo&seccion=FlujoSubetapas&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoFlujoSubetapas(1);
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoFlujoSubetapas(1, criterio);
}

function MostrarNuevo(cve) {
    var frmNuevo = document.getElementById("frmNuevo");
    frmNuevo.esEditar = false;
    frmNuevo.reset();
    $.post(urlBase_WS + "NFlujoSubetapas.aspx", { op: "obtenerSiguienteClave", seccion: "FlujoSubetapas", cve_etapa:cve }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoFlujoSubetapas(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NFlujoSubetapas.aspx", { seccion: "FlujoSubetapas", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : ""), cve_etapa: CLAVE_GrupoFlujoSubetapas, cve_subetapa:0 }).done(function (xmlDoc) {
        QuitarEspera();
        var FlujoSubetapas = xmlDoc.getElementsByTagName("Table");
        var listaFlujoSubetapas = document.getElementById("contenedorLista");       
        $(listaFlujoSubetapas).html("");
        var totalregistros;
        for (var i = 0; i < FlujoSubetapas.length; i++) {
            var cve_etapa = GetValor(FlujoSubetapas[i], "cve_etapa");
            var cve_subetapa = GetValor(FlujoSubetapas[i], "cve_subetapa");
            var descripcion = GetValor(FlujoSubetapas[i], "descripcion");
            var url = GetValor(FlujoSubetapas[i], "pantalla");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(FlujoSubetapas[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarFlujoSubetapas(' + cve_etapa + ',' + cve_subetapa + ')"></button></td>' +
                '<td><label >' + cve_subetapa + '</label></td>' +
                '<td><label >' + descripcion + '</label></td>' +
                '<td><label>' + url + '</label></td>'
            );
            listaFlujoSubetapas.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoFlujoSubetapas);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
    
}


function GuardarFlujoSubetapas() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmFlujoSubetapas = document.getElementById("frmNuevo");
        if (!frmFlujoSubetapas.esEditar) {
            crearNuevoFlujoSubetapas();
        } else {
            GuardarEdicionFlujoSubetapas();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarFlujoSubetapas(cve_etapa, cve_subetapa) {
    var frmFlujoSubetapas = document.getElementById("frmNuevo");
    frmFlujoSubetapas.esEditar = true;
    MostrarFormulario();
    CargarDatosFlujoSubetapas(cve_etapa, cve_subetapa);

}

function CargarDatosFlujoSubetapas(cve_etapa, cve_subetapa) {
    $.post(urlBase_WS + "NFlujoSubetapas.aspx", { seccion: "FlujoSubetapas", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_etapa: cve_etapa, cve_subetapa: cve_subetapa,
    }).done(function (xmlDoc) {
        var FlujoSubetapas = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(FlujoSubetapas, "cve_etapa", "cve_etapa");
        SetValor(FlujoSubetapas, "cve_subetapa", "clave");
        SetValor(FlujoSubetapas, "descripcion", "descripcion");
        SetValor(FlujoSubetapas, "pantalla", "pantalla");
    });
}

function GuardarEdicionFlujoSubetapas() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NFlujoSubetapas.aspx", "op=Editar&seccion=FlujoSubetapas&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoFlujoSubetapas();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";

        }
    });
}



function DesactivarFlujoSubetapas(FlujoSubetapas) {
    $.post(urlBase_WS + "NFlujoSubetapas.aspx", { op: "CambiarEstatusActivo", FlujoSubetapas: FlujoSubetapas, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoFlujoSubetapas();
    })

}

