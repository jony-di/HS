function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";

    cargarCatalogoRegion(1);

}


function crearNuevoRegion() {
    var frmNuevoRegion = document.getElementById("frmNuevoRegion");
    var parametros = $(frmNuevoRegion).serialize();
    $.post(urlBase_WS + "NRegion.aspx", "op=Nuevo&seccion=Region&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoRegion(1);
            document.getElementById("frmNuevoRegion").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoRegion(1, criterio);
}

function MostrarNuevoRegion() {
    var frmRegion = document.getElementById("frmNuevoRegion");
    frmRegion.esEditar = false;
    $.post(urlBase_WS + "NRegion.aspx", { seccion: "Region", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoRegion(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NRegion.aspx", { seccion: "Region", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_region: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var region = xmlDoc.getElementsByTagName("Table");
        var listaRegion = document.getElementById("contenedorLista");
        $(listaRegion).html("");
        var totalregistros;
        for (var i = 0; i < region.length; i++) {
            var cveRegion = GetValor(region[i], "cve_region");
            var nombre = GetValor(region[i], "nombre");
            var estatus = GetValor(region[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(region[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarRegion(' + cveRegion + ')"></button></td>' +
                '<td><label class="clave">' + cveRegion + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaRegion.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoRegion);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });

}


function GuardarRegion() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmRegion = document.getElementById("frmNuevoRegion");
        if (!frmRegion.esEditar) {
            crearNuevoRegion();
        } else {
            GuardarEdicionRegion();

        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarRegion(cve_region) {
    var frmRegion = document.getElementById("frmNuevoRegion");
    frmRegion.esEditar = true;
    MostrarFormulario();
    CargarDatosRegion(cve_region);

    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosRegion(cve_region) {
    $.post(urlBase_WS + "NRegion.aspx", { seccion: "Region", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_region: cve_region}).done(function (xmlDoc) {
        var region = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(region, "cve_region", "clave");
        SetValor(region, "nombre", "nombre");
        SetValor(region, "activo", "estatus", "bool");
    });
}

function GuardarEdicionRegion() {
    var frmNuevoRegion = document.getElementById("frmNuevoRegion");
    var parametros = $(frmNuevoRegion).serialize();
    $.post(urlBase_WS + "NRegion.aspx", "op=Editar&seccion=Region&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoRegion();
            document.getElementById("frmNuevoRegion").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarRegion(cve_region) {
    $.post(urlBase_WS + "NRegion.aspx", { op: "CambiarEstatusActivo", cve_region: cve_region, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoRegion();
    })

}

function CancelarRegion() {
    MostrarCatalogo();
}

