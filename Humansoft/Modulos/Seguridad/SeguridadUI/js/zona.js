function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";

    cargarCatalogoZona(1);

}


function crearNuevoZona() {
    var frmNuevoZona = document.getElementById("frmNuevoZona");
    var parametros = $(frmNuevoZona).serialize();
    $.post(urlBase_WS + "NZona.aspx", "op=Nuevo&seccion=Zona&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoZona(1);
            document.getElementById("frmNuevoZona").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoZona(1, criterio);
}

function MostrarNuevoZona() {
    var frmZona = document.getElementById("frmNuevoZona");
    frmZona.esEditar = false;
    $.post(urlBase_WS + "NZona.aspx", { seccion: "Zona", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        document.getElementById("clave").setAttribute("value", SetValor(xmlDoc, "clave", "clave"));
        var selectRegion = document.getElementById("cve_region");
        LlenarCatalogoRegiones(selectRegion, function () {
        });
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoZona(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NZona.aspx", { seccion: "Zona", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_zona: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var zona = xmlDoc.getElementsByTagName("Table");
        var listaZona = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaZona).html("");
        var totalregistros;
        for (var i = 0; i < zona.length; i++) {
            var cveZona = GetValor(zona[i], "cve_zona");
            var region = GetValor(zona[i], "region");
            var nombre = GetValor(zona[i], "nombre");
            var estatus = GetValor(zona[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(zona[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarZona(' + cveZona + ')"></button></td>' +
                '<td><label class="clave">' + cveZona + '</label></td>' +
                '<td><label class="region">' + region + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaZona.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoZona);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });

}


function GuardarZona() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmZona = document.getElementById("frmNuevoZona");
        if (!frmZona.esEditar) {
            crearNuevoZona();
        } else {
            GuardarEdicionZona();

        }
    } else {
        MostrarCatalogo();
    }
}


function MostrarEditarZona(cve_zona) {
    var frmZona = document.getElementById("frmNuevoZona");
    frmZona.esEditar = true;
    MostrarFormulario();
        var selectRegion = document.getElementById("cve_region");
        LlenarCatalogoRegiones(selectRegion, function () {
            CargarDatosZona(cve_zona);
        });
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosZona(cve_zona) {
    $.post(urlBase_WS + "NZona.aspx", { seccion: "Zona", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_zona: cve_zona
    }).done(function (xmlDoc) {
        var zona = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(zona, "cve_zona", "clave");
        SetValor(zona, "cve_region", "cve_region");
        SetValor(zona, "nombre", "nombre");
        SetValor(zona, "activo", "estatus", "bool");
    });
}

function GuardarEdicionZona() {
    var frmNuevoZona = document.getElementById("frmNuevoZona");
    var parametros = $(frmNuevoZona).serialize();
    $.post(urlBase_WS + "NZona.aspx", "op=Editar&seccion=Zona&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoZona();
            document.getElementById("frmNuevoZona").reset();
            MostrarCatalogo();
        });
    });
}


function DesactivarZona(cve_zona) {
    $.post(urlBase_WS + "NZona.aspx", { op: "CambiarEstatusActivo", cve_zona: cve_zona, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoZona();
    })

}

function CancelarZona() {
    MostrarCatalogo();
}



