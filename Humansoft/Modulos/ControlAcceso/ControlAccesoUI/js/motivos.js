function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    //$("#fechaInicio").datepicker({
    //    dateFormat: 'dd/mm/yy',
    //    changeMonth: true,
    //    changeYear: true
    //});
    CargarCatalogoMotivos(1);
    ObtenerCatTipoJustificacion("cve_tipojustificacion");
    ObtenerCatUnidadesTiempo("cve_dadotolerancia");
    ObtenerCatUnidadesTiempo("cve_dadoplazo");
    ObtenerFlujosIncidencias("cve_flujo");
}

function BuscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    CargarCatalogoMotivos(1, criterio);
}

function MostrarNuevoMotivo() {
    LimpiarCampos("frmNuevoMotivo");
    var frmMotivo = document.getElementById("frmNuevoMotivo");
    frmMotivo.reset();
    frmMotivo.esEditar = false;
    $.post(urlBase_WS + "NMotivos.aspx", { op: "ObtenerSiguienteClave",seccion:"Motivos" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_motivo", "cve_motivo");
    });
    MostrarFormulario();
}

function LimpiarCampos(idContenedor) {
    //var campos=document.getElementById(idContenedor).getElementsByTagName("input");
    //for (var i = 0; i < campos.length; i++) {
    //    campos[i].value = undefined;
    //}
}

var ordenador;
function CargarCatalogoMotivos(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NMotivos.aspx", { op: "ObtenerCatalogo",seccion:"Motivos", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "")}).done(function (xmlDoc) {
        QuitarEspera();
        var dbMotivos = xmlDoc.getElementsByTagName("Table");
        var listaMotivo = document.getElementById("contenedorLista");
        $(listaMotivo).html("");
        var totalregistros;
        for (var i = 0; i < dbMotivos.length; i++) {
            var CveMotivo = GetValor(dbMotivos[i], "cve_motivo");
            var Descripcion = GetValor(dbMotivos[i], "descripcion");
            var sTipoJustificacion = GetValor(dbMotivos[i], "sTipoJustificacion");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(dbMotivos[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            itemLista.cve_Motivo = CveMotivo;
            itemLista.onclick = function () {
                MostrarEditarMotivo(this.cve_Motivo);
            }
            $(itemLista).html(
                 '<td>' + CveMotivo + '</td>' +
                '<td>' + sTipoJustificacion + '</td>' +
                '<td>' + Descripcion + '</td>'
            );
            listaMotivo.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoMotivos);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarMotivo() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmMotivo = document.getElementById("frmNuevoMotivo");
        if (!frmMotivo.esEditar) {
            GuardarEdicionMotivo("Nuevo");
        } else {
            GuardarEdicionMotivo("Editar");
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarMotivo(cve) {
    LimpiarCampos("frmNuevoMotivo");
    var frmMotivo = document.getElementById("frmNuevoMotivo");
    frmMotivo.reset();
    frmMotivo.esEditar = true;
    MostrarFormulario();
    CargarDatosMotivo(cve);
}

function CargarDatosMotivo(cve) {
    $.post(urlBase_WS + "NMotivos.aspx", { op: "ObtenerDetalleMotivo", seccion: "Motivos", pagina: 1, longitudPagina: 50, criterio: "", cve_motivo: cve }).done(function (xmlDoc) {
        var dbMotivo = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbMotivo, "cve_tipojustificacion", "cve_tipojustificacion");
        SetValor(dbMotivo, "cve_motivo", "cve_motivo");
        SetValor(dbMotivo, "descripcion", "descripcion");
        SetValor(dbMotivo, "activo", "activo", "bool");
        SetValor(dbMotivo, "tolerancia", "tolerancia");
        SetValor(dbMotivo, "cve_dadotolerancia", "cve_dadotolerancia");
        SetValor(dbMotivo, "permitejustifica", "permitejustifica", "bool");
        SetValor(dbMotivo, "permitejustifica", "permitejustifica", "bool");
        SetValor(dbMotivo, "escaneo", "escaneo", "bool");
        SetValor(dbMotivo, "congose", "congose", "bool");
        SetValor(dbMotivo, "plazo", "plazo");
        SetValor(dbMotivo, "cve_dadoplazo", "cve_dadoplazo");
        SetValor(dbMotivo, "cve_flujo", "cve_flujo");
        SetValor(dbMotivo, "aplicaparapolitica", "aplicaparapolitica","bool");
        SetValor(dbMotivo, "permitereponerdia", "permitereponerdia", "bool");
    });
}

function GuardarEdicionMotivo(op){
    var frmNuevoMotivo = document.getElementById("frmNuevoMotivo");
    var parametros = $(frmNuevoMotivo).serialize();
    $.post(urlBase_WS + "NMotivos.aspx", "op=" + op + "&seccion=Motivos&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function (){
            CargarCatalogoMotivos();
        });
    });
}

function DesactivarMotivo(cve_departamento) {
    $.post(urlBase_WS + "NMotivo.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoMotivo();
    })
}

