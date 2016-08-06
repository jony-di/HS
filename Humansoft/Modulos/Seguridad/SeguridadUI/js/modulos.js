function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoModulos(1);

}


function crearNuevoModulo() {
    var frmNuevoModulo = document.getElementById("frmNuevoModulos");
    var parametros = $(frmNuevoModulo).serialize();
    $.post(urlBase_WS + "NModulos.aspx", "op=Nuevo&seccion=Modulos&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoModulos(1);
            document.getElementById("frmNuevoModulos").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoModulos(1, criterio);
}

function MostrarNuevoModulo() {
    var frmModulo = document.getElementById("frmNuevoModulos");
    frmModulo.esEditar = false;
    $.post(urlBase_WS + "NModulos.aspx", { seccion: "Modulos", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoModulos(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NModulos.aspx", { seccion: "Modulos", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_modulo: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var modulos = xmlDoc.getElementsByTagName("Table");
        var listaModulos = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaModulos).html("");
        var totalregistros;
        for (var i = 0; i < modulos.length; i++) {
            var cveModulo = GetValor(modulos[i], "cve_modulo");
            var nombre = GetValor(modulos[i], "nombre");
            var estatus = GetValor(modulos[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(modulos[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarModulo(' + cveModulo + ')"></button></td>' +
                '<td><label class="clave">' + cveModulo + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaModulos.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoModulos);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarModulo() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmModulo = document.getElementById("frmNuevoModulos");
        if (!frmModulo.esEditar) {
            crearNuevoModulo();
        } else {
            GuardarEdicionModulo();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarModulo(cve_modulo) {
    var frmModulo = document.getElementById("frmNuevoModulos");
    frmModulo.esEditar = true;
    MostrarFormulario();
    CargarDatosModulo(cve_modulo);

    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosModulo(cve_modulo) {
    $.post(urlBase_WS + "NModulos.aspx", { seccion: "Modulos", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_modulo: cve_modulo
    }).done(function (xmlDoc) {
        var modulos = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(modulos, "cve_modulo", "clave");
        SetValor(modulos, "nombre", "nombre");
        SetValor(modulos, "activo", "estatus", "bool");
    });
}

function GuardarEdicionModulo() {
    var frmNuevoModulo = document.getElementById("frmNuevoModulos");
    var parametros = $(frmNuevoModulo).serialize();
    $.post(urlBase_WS + "NModulos.aspx", "op=Editar&seccion=Modulos&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoModulos();
            document.getElementById("frmNuevoModulos").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarModulo(cve_modulo) {
    $.post(urlBase_WS + "NModulos.aspx", { op: "CambiarEstatusActivo", cve_modulo: cve_modulo, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoModulos();
    })

}

function CancelarModulo(){
    MostrarCatalogo();
 }

