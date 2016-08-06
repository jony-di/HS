var urlBase_WS = "/Modulos/Contrataciones/ContratacionNegocio/";
var Preguntas = function () { }
var Respuestas = function () { }
function MostrarNuevoPaqExamen() {
    var frmPaqExamen = document.getElementById("frmPaqExamen");
    frmPaqExamen.esEditar = false;
    frmPaqExamen.reset();
    $.post(urlBase_WS + "NPaqExamenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_paqexamen", "cve_paqexamen");
    });
    MostrarFormulario();
}

function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";    
    CargarCatalogoPaqExamenes(1);
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    CargarCatalogoExamenes(1, criterio);
}

var ordenador;
function CargarCatalogoPaqExamenes(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPaqExamenes.aspx", { op: "ObtenerCatalogo", seccion: "PaqExamenes", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "") }).done(function (xmlDoc) {
        QuitarEspera();
        var dbItems = xmlDoc.getElementsByTagName("Table");
        var lista = document.getElementById("contenedorLista");
        $(lista).html("");
        var totalregistros;
        for (var i = 0; i < dbItems.length; i++) {
            var cve_paqexamen = GetValor(dbItems[i], "cve_paqexamen");
            var itemLista = document.createElement("tr");
            itemLista.className = "columnas columnas1";
            totalregistros = GetValor(dbItems[i], "totalRegistros");
            itemLista.cve_paqexamen = cve_paqexamen;
            itemLista.onclick = function () {
                MostrarEditarPaqExamen(this.cve_paqexamen);
            }
            $(itemLista).html(
                 '<td>' + cve_paqexamen + '</td>' +
                '<td>' + GetValor(dbItems[i], "descripcion") + '</td>'
            );
            lista.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoPaqExamenes);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPaqExamen() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPaqExamen = document.getElementById("frmPaqExamen");
        if (!frmPaqExamen.esEditar) {
            GuardarEdicionPaqExamen("Nuevo");
        } else {
            GuardarEdicionPaqExamen("Editar");
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarPaqExamen(cve) {
    var frmPaqExamen = document.getElementById("frmPaqExamen");
    frmPaqExamen.reset();
    frmPaqExamen.esEditar = true;
    MostrarFormulario();
    CargarDatosExamen(cve);
}

function CargarDatosExamen(cve) {
    $.post(urlBase_WS + "NPaqExamenes.aspx", { op: "ObtenerDetalle", seccion: "PaqExamenes", pagina: 1, longitudPagina: 50, criterio: "", cve_paqexamen: cve }).done(function (xmlDoc) {
        var dbObjeto = xmlDoc.getElementsByTagName("Table")[0];
        var cve_paqexamen=SetValor(dbObjeto, "cve_paqexamen", "cve_paqexamen");
        var descripcion=SetValor(dbObjeto, "descripcion", "descripcion");
        CargarAsignadorExamenes(cve_paqexamen,descripcion);
    });
}

function CargarAsignadorExamenes(cve_paquete,descripcion){
    NuevoSeleccionSecuencial("Seleccionar exámenes para el paquete: <b>" + descripcion + "</b>", [
            {
                alias: "Paquetes de exámenes", url: urlBase_WS + "NPaqExamenes.aspx", parametros: { op: "ObtenerExamenesPaquete", seccion: "PaqExamenes", pagina: 1, longitudPagina: 100, criterio: "", cve_paqexamen: cve_paquete }, campos: ['cve_examen|colClaveExamen', 'nombre|alinearTxtIzq', 'cve_paqexamen'], ocultos: [2], encabezado: { titulo: "Exámenes", columnas: ["Clave", "Descripción","cve_paq"] }, display: "", esMultiSeleccion: true, placeHolder: "Buscar en todos los exámenes", colspan: 2
                , onSeleccionar: function (valores) {
                    $.post(urlBase_WS + "NPaqExamenes.aspx", { op: "AgregarExamenAlPaquete", seccion: "PaqExamenes", cve_paqexamen: cve_paquete, cve_examen: valores.cve_examen }).done(function (xmlDoc) {
                        mostrarNotificacion(xmlDoc, "notificacion", function () {
                            
                        });
                    });
                }
                , onDeseleccionar: function (valores) {
                    $.post(urlBase_WS + "NPaqExamenes.aspx", { op: "EliminarExamenDelPaquete", seccion: "PaqExamenes", cve_paqexamen: cve_paquete, cve_examen: valores.cve_examen }).done(function (xmlDoc) {
                        mostrarNotificacion(xmlDoc, "notificacion", function () {

                        });
                    });
                }, callbackAfterRow: function (tr) {
                    if ($.trim(tr.valor.cve_paqexamen).length > 0) {
                        tr.className = "seleccionado";
                    }
                }
            }
    ], "base", function (divR) {
        var divTmp = document.getElementById("examenes-asociados");
        divTmp.innerHTML = "";
        divTmp.appendChild(divR);
        var tablas = $(divTmp).find(".wrappTabla table");
        var ths = tablas[0].getElementsByTagName("thead")[0].getElementsByTagName("th");
        var tds = tablas[1].getElementsByTagName("tr")[0].getElementsByTagName("td");
        for (var b = 0; b < tds.length; b++) {
            try{ths[b].style.width = $(tds[b]).css("width");}catch(e){}
        }
    },
    function (seleccion) {}, undefined, { width: '700px' }, true);
}

function GuardarEdicionPaqExamen(op) {
    var frmPaqExamen = document.getElementById("frmPaqExamen");
    var parametros = $(frmPaqExamen).serialize();
    $.post(urlBase_WS + "NPaqExamenes.aspx", "op=" + op + "&seccion=PaqExamenes&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            frmPaqExamen.esEditar = true;
            CargarCatalogoPaqExamenes();
        });
    });
}

function DesactivarExamen(cve_departamento) {
    $.post(urlBase_WS + "NExamen.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoExamen();
    })
}

