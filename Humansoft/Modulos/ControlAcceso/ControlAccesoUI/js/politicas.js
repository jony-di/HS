function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    CargarCatalogoPoliticas(1);
    ObtenerCatUnidadesTiempo('cve_dado');
    ObtenerCatPoliticas('cve_politica');
}

function MostrarAuxiliares(objeto) {
    var cve_politica=$.trim(document.getElementById("cve_politica").value);
    if (cve_politica == 5) {
        if (new RegExp('quincena', 'gi').test(objeto.options[objeto.selectedIndex].innerHTML)) {
            document.getElementById('quincena').style.display = 'block';
        } else {
            document.getElementById('quincena').style.display = 'none';
        }
    }
}

function BuscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoPolitica(1, criterio);
}

function MostrarNuevoPolitica() {
    var frmPolitica = document.getElementById("frmNuevoPolitica");
    frmPolitica.reset();
    frmPolitica.esEditar = false;
    $.post(urlBase_WS + "NPoliticas.aspx", { op: "ObtenerSiguienteClave", seccion: "Politicas" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "indice", "indice");
        MostrarFormulario();
    });
}

function LimpiarCampos(idContenedor) {
    var campos = document.getElementById(idContenedor).getElementsByTagName("input");
    for (var i = 0; i < campos.length; i++) {
        campos[i].value = "";
    }
}

var ordenador;
function CargarCatalogoPoliticas(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPoliticas.aspx", { op: "ObtenerCatalogo", seccion: "Politicas", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "") }).done(function (xmlDoc) {
        QuitarEspera();
        var dbPoliticas = xmlDoc.getElementsByTagName("Table");
        var listaPolitica = document.getElementById("contenedorLista");
        $(listaPolitica).html("");
        var totalregistros;
        for (var i = 0; i < dbPoliticas.length; i++) {
            var indice = GetValor(dbPoliticas[i], "indice");
            var Descripcion = GetValor(dbPoliticas[i], "descripcion");
            var Cantidad = GetValor(dbPoliticas[i], "cantidad");
            var periodo = GetValor(dbPoliticas[i], "periodo");
            var activo = GetValor(dbPoliticas[i], "activo", "bool", "Si:No");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(dbPoliticas[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            itemLista.indice = indice;
            itemLista.onclick = function () {
                MostrarEditarPolitica(this.indice);
            }
            $(itemLista).html(
                 '<td>' + indice + '</td>' +
                '<td>' + Descripcion + '</td>'+
                '<td>' + Cantidad + '</td>'+
                '<td>' + periodo + '</td>'+
                '<td>' + activo + '</td>'
            );
            listaPolitica.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoPoliticas);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPolitica() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPolitica = document.getElementById("frmNuevoPolitica");
        if (!frmPolitica.esEditar) {
            GuardarEdicionPolitica("Nuevo");
        } else {
            GuardarEdicionPolitica("Editar");
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarPolitica(cve) {
    var frmPolitica = document.getElementById("frmNuevoPolitica");
    frmPolitica.reset();
    frmPolitica.esEditar = true;
    MostrarFormulario();
    CargarDatosPolitica(cve);
}

function CargarDatosPolitica(cve) {
    $.post(urlBase_WS + "NPoliticas.aspx", { op: "ObtenerDetallePolitica", seccion: "Politicas", indice: cve }).done(function (xmlDoc) {        
        var dbPolitica = xmlDoc.getElementsByTagName("Table");
        SetValor(dbPolitica[0], "indice", "indice");
        SetValor(dbPolitica[0], "cve_politica", "cve_politica");
        SetValor(dbPolitica[0], "cantidad", "cantidad");
        SetValor(dbPolitica[0], "frecuencia", "frecuencia");
        SetValor(dbPolitica[0], "cve_dado", "cve_dado");
        SetValor(dbPolitica[0], "aux1", "diaInicio");
        SetValor(dbPolitica[0], "aux2", "diaFin");
        SetValor(dbPolitica[0], "aux3", "diasig");
        SetValor(dbPolitica[0], "aux4", "diaFin2");
        MostrarAuxiliares(document.getElementById("cve_dado"));
    });
}

function GuardarEdicionPolitica(op) {
    var frmNuevoPolitica = document.getElementById("frmNuevoPolitica");
    var parametros = $(frmNuevoPolitica).serialize();
    $.post(urlBase_WS + "NPoliticas.aspx?op=" + op + "&seccion=Politicas" + "&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            CargarCatalogoPoliticas();
        });
    });
}

function DesactivarPolitica(cve_departamento) {
    $.post(urlBase_WS + "NPolitica.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        document.getElementById("frmNuevoPolitica").esEditar = true;
        cargarCatalogoPolitica();
    })
}

