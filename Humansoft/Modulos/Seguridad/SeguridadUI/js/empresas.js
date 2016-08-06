function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    var calendario = document.getElementById("fechaalta");
    $(calendario).datepicker({ dateFormat: 'dd/mm/yy' });
    cargarCatalogoEmpresas(1);

    var selectGiro = document.getElementById("cve_giro");
    LlenarCatalogoGiros(selectGiro, function () { });

    var selectPais = document.getElementById("cve_pais");
    LlenarCatalogoPaises(selectPais, function () { });
}

function crearNuevoEmpresa() {
    var frmNuevoEmpresa = document.getElementById("frmNuevoEmpresa");
    var parametros = $(frmNuevoEmpresa).serialize();
    $.post(urlBase_WS + "NEmpresas.aspx", "op=Nuevo&seccion=Empresas&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoEmpresas(1);
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoEmpresas(1, criterio);
}

function MostrarNuevoEmpresa() {
    var frmEmpresa = document.getElementById("frmNuevoEmpresa");
    frmEmpresa.esEditar = false;
    $.post(urlBase_WS + "NEmpresas.aspx", { seccion: "Empresas", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        document.getElementById("clave").setAttribute("value", SetValor(xmlDoc, "clave", "clave"));
        
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoEmpresas(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NEmpresas.aspx", { seccion: "Empresas", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_empresa: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var empresas = xmlDoc.getElementsByTagName("Table");
        var listaEmpresas = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaEmpresas).html("");
        var totalregistros;
        for (var i = 0; i < empresas.length; i++) {
            var cveEmpresa = GetValor(empresas[i], "cve_empresa");
            var nombre = GetValor(empresas[i], "nombre");
            var rfc = GetValor(empresas[i], "rfc");
            var estatus = GetValor(empresas[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(empresas[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarEmpresa(' + cveEmpresa + ')"></button></td>' +
                '<td><label class="clave">' + cveEmpresa + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="rfc">' + rfc + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaEmpresas.appendChild(itemLista);
        }

        paginarTabla(pagina, totalregistros, cargarCatalogoEmpresas);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
    
}


function GuardarEmpresa() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmEmpresa = document.getElementById("frmNuevoEmpresa");
        if (!frmEmpresa.esEditar) {
            crearNuevoEmpresa();
        } else {
            GuardarEdicionEmpresa();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarEmpresa(cve_empresa) {
    var frmEmpresa = document.getElementById("frmNuevoEmpresa");
    frmEmpresa.esEditar = true;
    MostrarFormulario();
    CargarDatosEmpresa(cve_empresa);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosEmpresa(cve_empresa) {
    $.post(urlBase_WS + "NEmpresas.aspx", { seccion: "Empresas", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_empresa: cve_empresa
    }).done(function (xmlDoc) {
        var empresas = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(empresas, "cve_empresa", "clave");
        SetValor(empresas, "nombre", "nombre");
        SetValor(empresas, "rfc", "rfc");
        var cve_pais=SetValor(empresas, "cve_pais", "cve_pais");
        var selectEstados = document.getElementById("estado");
        LlenarCatalogoEstados(selectEstados, function () {
            SetValor(empresas, "estado", "estado");
        }, cve_pais);
        SetValor(empresas, "fechaalta", "fechaalta");
        SetValor(empresas, "razonsocial", "razonsocial");
        SetValor(empresas, "idusuariocreo", "idusuariocreo");
        SetValor(empresas, "cve_giro", "cve_giro");
        SetValor(empresas, "calle", "calle");
        SetValor(empresas, "colonia", "colonia");
        SetValor(empresas, "delegmunic", "delegmunic");
        SetValor(empresas, "cp", "cp");
        SetValor(empresas, "activo", "estatus", "bool");
    });
}

function GuardarEdicionEmpresa() {
    var frmNuevoEmpresa = document.getElementById("frmNuevoEmpresa");
    var parametros = $(frmNuevoEmpresa).serialize();
    $.post(urlBase_WS + "NEmpresas.aspx", "op=Editar&seccion=Empresas&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoEmpresas(1);
            MostrarCatalogo();
        });  
    });
}



function DesactivarEmpresa(cve_empresa) {
    $.post(urlBase_WS + "NEmpresas.aspx", { op: "CambiarEstatusActivo", cve_empresa: cve_empresa, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoEmpresas();
    })

}

function CancelarEmpresa(){
    MostrarCatalogo();
 }

