
function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoIdiomas(1);

}


function crearNuevoIdiomas() {
    var frmNuevoIdiomas = document.getElementById("frmNuevoIdiomas");
    var parametros = $(frmNuevoIdiomas).serialize();
    $.post(urlBase_WS + "NIdiomas.aspx", "op=Nuevo&seccion=Idiomas&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoIdiomas(1);
            document.getElementById("frmNuevoIdiomas").reset();
            MostrarCatalogo();
        });        
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoIdiomas(1, criterio);
}

function MostrarNuevoIdioma() {
    MostrarFormulario();
    var frmIdioma = document.getElementById("frmNuevoIdiomas");
    frmIdioma.esEditar = false;
    $.post(urlBase_WS + "NIdiomas.aspx", { seccion: "Idiomas", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_idioma", "cve_idioma");
        SetValor(xmlDoc, "cve_pais", "cve_pais");

    });
}


var ordenador;
function cargarCatalogoIdiomas(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NIdiomas.aspx", { seccion: "Idiomas", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_idioma: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var idiomas = xmlDoc.getElementsByTagName("Table");
        var listaIdiomas = document.getElementById("contenedorLista");
        $(listaIdiomas).html("");
        var totalregistros;
        for (var i = 0; i < idiomas.length; i++) {
            var cveIdioma = GetValor(idiomas[i], "cve_idioma");
            var idioma = GetValor(idiomas[i], "idioma");
            var pais = GetValor(idiomas[i], "pais");
            var moneda = GetValor(idiomas[i], "nombremoneda");
            var signo = GetValor(idiomas[i], "signomoneda");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(idiomas[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarIdioma(' + cveIdioma + ')"></button></td>' +
                '<td><label class="clave">' + cveIdioma + '</label></td>' +
                '<td><label class="idioma">' + idioma + '</label></td>' +
                '<td><label class="pais">' + pais + '</label></td>' +
                '<td><label class="moneda">' + moneda + '</label></td>' +
                '<td><label class="signo">' + signo + '</label></td>' 
        
            );
            listaIdiomas.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoIdiomas);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarIdioma() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmIdioma = document.getElementById("frmNuevoIdiomas");
        if (!frmIdioma.esEditar) {
            crearNuevoIdiomas();
        } else {
            GuardarEdicionIdioma();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarIdioma(cve_idioma) {
    var frmIdioma = document.getElementById("frmNuevoIdiomas");
    frmIdioma.esEditar = true;
    MostrarFormulario();
    CargarDatosIdioma(cve_idioma);
  
}

function CargarDatosIdioma(cve_idioma) {
    $.post(urlBase_WS + "NIdiomas.aspx", { seccion: "Idiomas", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_idioma: cve_idioma
    }).done(function (xmlDoc) {
        var idiomas = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(idiomas, "cve_idioma", "cve_idioma");
        SetValor(idiomas, "idioma", "idioma");
        SetValor(idiomas, "cve_pais", "cve_pais");
        SetValor(idiomas, "pais", "pais");
        SetValor(idiomas, "nombremoneda", "nombremoneda");
        SetValor(idiomas, "signomoneda", "signomoneda");
    });
}

function GuardarEdicionIdioma() {
    var frmNuevoIdioma = document.getElementById("frmNuevoIdiomas");
    var parametros = $(frmNuevoIdioma).serialize();
    $.post(urlBase_WS + "NIdiomas.aspx", "op=Editar&seccion=Idiomas&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoIdiomas(1);
            document.getElementById("frmNuevoIdiomas").reset();
            MostrarCatalogo();
        });
    });
}



function CancelarIdioma(){
    MostrarCatalogo();
 }

