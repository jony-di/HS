function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";

    cargarCatalogoPais(1);

}


function crearNuevoPais() {
    var frmNuevoPais = document.getElementById("frmNuevoPais");
    var parametros = $(frmNuevoPais).serialize();
    $.post(urlBase_WS + "NPais.aspx", "op=Nuevo&seccion=Pais&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoPais(1);
            document.getElementById("frmNuevoPais").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoPais(1, criterio);
}

function MostrarNuevoPais() {
    var frmPais = document.getElementById("frmNuevoPais");
    frmPais.esEditar = false;
    $.post(urlBase_WS + "NPais.aspx", { seccion: "Pais", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoPais(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPais.aspx", { seccion: "Pais", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_pais: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var pais = xmlDoc.getElementsByTagName("Table");
        var listaPais = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPais).html("");
        var totalregistros;
        for (var i = 0; i < pais.length; i++) {
            var cvePais = GetValor(pais[i], "cve_pais");
            var nombre = GetValor(pais[i], "nombre");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(pais[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPais(' + cvePais + ')"></button></td>' +
                '<td><label class="clave">' + cvePais + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' 
            );
            listaPais.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoPais);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarPais() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPais = document.getElementById("frmNuevoPais");
        if (!frmPais.esEditar) {
            crearNuevoPais();
        } else {
            GuardarEdicionPais();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPais(cve_pais) {
    var frmPais = document.getElementById("frmNuevoPais");
    frmPais.esEditar = true;
    MostrarFormulario();
    CargarDatosPais(cve_pais);

}

function CargarDatosPais(cve_pais) {
    $.post(urlBase_WS + "NPais.aspx", { seccion: "Pais", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_pais: cve_pais
    }).done(function (xmlDoc) {
        var pais = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(pais, "cve_pais", "clave");
        SetValor(pais, "nombre", "nombre");
    });
}

function GuardarEdicionPais() {
    var frmNuevoPais = document.getElementById("frmNuevoPais");
    var parametros = $(frmNuevoPais).serialize();
    $.post(urlBase_WS + "NPais.aspx", "op=Editar&seccion=Pais&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoPais();
            document.getElementById("frmNuevoPais").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarPais(cve_pais) {
    $.post(urlBase_WS + "NPais.aspx", { op: "CambiarEstatusActivo", cve_pais: cve_pais, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPais();
    })

}

function CancelarPais(){
    MostrarCatalogo();
 }

