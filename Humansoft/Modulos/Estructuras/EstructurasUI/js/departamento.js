function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoDepartamento(1);
    var selectEmpresas = document.getElementById("cve_empresa");
    LlenarCatalogoEmpresa(selectEmpresas);
}

function crearNuevoDepartamento() {
    var frmNuevoDepartamento = document.getElementById("frmNuevoDepartamento");
    var parametros = $(frmNuevoDepartamento).serialize();
    $.post(urlBase_WS + "NDepartamento.aspx", "op=NuevoDepartamento&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDepartamento(1);
            document.getElementById("frmNuevoDepartamento").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoDepartamento(1, criterio);
}

function MostrarNuevoDepartamento() {
    var frmDepartamento = document.getElementById("frmNuevoDepartamento");
    frmDepartamento.reset();
    frmDepartamento.esEditar = false;
    $.post(urlBase_WS + "NDepartamento.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = true;
        MostrarFormulario();
  });
}

var ordenador;
function cargarCatalogoDepartamento(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NDepartamento.aspx", { op: "obtenerCatalogoDepartamento", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_departamento: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var departamento = xmlDoc.getElementsByTagName("Table");
        var listaDepartamento = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaDepartamento).html("");
        var totalregistros;
        for (var i = 0; i < departamento.length; i++) {
            var cveDepartamento = GetValor(departamento[i], "cve_departamento");
            var dgaAgru = GetValor(departamento[i], "dirGeneral");
            var nombredep = GetValor(departamento[i], "nombredep");
            var estatus = GetValor(departamento[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(departamento[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarDepartamento(' + cveDepartamento + ')"></button></td>' +
                '<td><label class="clave">' + cveDepartamento + '</label></td>' +
                 '<td><label class="dgagru">' + dgaAgru + '</label></td>' +
                '<td><label class="nombredep">' + nombredep + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaDepartamento.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoDepartamento);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarDepartamento() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmDepartamento = document.getElementById("frmNuevoDepartamento");
        if (!frmDepartamento.esEditar) {
            crearNuevoDepartamento();
        } else {
            GuardarEdicionDepartamento();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarDepartamento(cve_departamento) {
    var frmDepartamento = document.getElementById("frmNuevoDepartamento");
    frmDepartamento.reset();
    frmDepartamento.esEditar = true;
    MostrarFormulario();
    CargarDatosDepartamento(cve_departamento);     
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosDepartamento(cve_departamento) {
    $.post(urlBase_WS + "NDepartamento.aspx", { op: "obtenerCatalogoDepartamento", pagina: 1, longitudPagina: 5, criterio: "",
        cve_departamento: cve_departamento
    }).done(function (xmlDoc) {
        var departamento = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(departamento, "cve_departamento", "clave");
        SetValor(departamento, "dga_agru", "dgagru");
        SetValor(departamento, "nombredep", "nombredep");
        SetValor(departamento, "c_costos", "ccostos");
        var cve_empresa = SetValor(departamento, "cve_empresa", "cve_empresa");
        var selectEmpresa = document.getElementById("cve_empresa");
        LlenarCatalogoDga(document.getElementById('dgagru'), function (dgas) {
            var dga = xmlDoc.getElementsByTagName("Table")[0];
            SetValor(dga, "dga_agru", "dgagru");
        }, selectEmpresa.options[selectEmpresa.selectedIndex].value);
        SetValor(departamento, "activo", "estatus", "bool");
    });
}

function GuardarEdicionDepartamento() {
    var frmNuevoDepartamento = document.getElementById("frmNuevoDepartamento");
    var parametros = $(frmNuevoDepartamento).serialize();
    $.post(urlBase_WS + "NDepartamento.aspx", "op=EditarDepartamento&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDepartamento();
            document.getElementById("frmNuevoDepartamento").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";

        }
    });
}

function DesactivarDepartamento(cve_departamento) {
    $.post(urlBase_WS + "NDepartamento.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoDepartamento();
    })
}

function CancelarDepartamento(){
    MostrarCatalogo();
 }