function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoGiros(1);

}


function crearNuevoGiro() {
    var frmNuevoGiro = document.getElementById("frmNuevoGiros");
    var parametros = $(frmNuevoGiro).serialize();
    $.post(urlBase_WS + "NGiro.aspx", "op=Nuevo&seccion=Giro&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoGiros(1);
            document.getElementById("frmNuevoGiros").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoGiros(1, criterio);
}

function MostrarNuevoGiro() {
    var frmGiro = document.getElementById("frmNuevoGiros");
    frmGiro.esEditar = false;
    $.post(urlBase_WS + "NGiro.aspx", { seccion: "Giro", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoGiros(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NGiro.aspx", { seccion: "Giro", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_giro: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var giros = xmlDoc.getElementsByTagName("Table");
        var listaGiros = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaGiros).html("");
        var totalregistros;
        for (var i = 0; i < giros.length; i++) {
            var cveGiro = GetValor(giros[i], "cve_giro");
            var nombre = GetValor(giros[i], "nombre");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(giros[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarGiro(' + cveGiro + ')"></button></td>' +
                '<td><label class="clave">' + cveGiro + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' 
            );
            listaGiros.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoGiros);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarGiro() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmGiro = document.getElementById("frmNuevoGiros");
        if (!frmGiro.esEditar) {
            crearNuevoGiro();
        } else {
            GuardarEdicionGiro();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarGiro(cve_giro) {
    var frmGiro = document.getElementById("frmNuevoGiros");
    frmGiro.esEditar = true;
    MostrarFormulario();
    CargarDatosGiro(cve_giro);


}

function CargarDatosGiro(cve_giro) {
    $.post(urlBase_WS + "NGiro.aspx", { seccion: "Giro", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_giro: cve_giro
    }).done(function (xmlDoc) {
        var giros = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(giros, "cve_giro", "clave");
        SetValor(giros, "nombre", "nombre");
    });
}

function GuardarEdicionGiro() {
    var frmNuevoGiro = document.getElementById("frmNuevoGiros");
    var parametros = $(frmNuevoGiro).serialize();
    $.post(urlBase_WS + "NGiro.aspx", "op=Editar&seccion=Giro&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoGiros(1);
            document.getElementById("frmNuevoGiros").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarGiro(cve_giro) {
    $.post(urlBase_WS + "NGiro.aspx", { op: "CambiarEstatusActivo", cve_giro: cve_giro, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoGiros();
    })

}

function CancelarGiro(){
    MostrarCatalogo();
 }

