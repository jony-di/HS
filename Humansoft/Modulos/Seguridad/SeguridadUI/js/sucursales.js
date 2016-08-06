function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";

    cargarCatalogoSucursales(1);

}


function crearNuevoSucursal() {
    var frmNuevoSucursal = document.getElementById("frmNuevoSucursal");
    var parametros = $(frmNuevoSucursal).serialize();
    $.post(urlBase_WS + "NSucursales.aspx", "op=Nuevo&seccion=Sucursales&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoSucursales(1);
            document.getElementById("frmNuevoSucursal").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoSucursales(1, criterio);
}

function MostrarNuevoSucursal() {
    var frmSucursal = document.getElementById("frmNuevoSucursal");
    frmSucursal.esEditar = false;
    $.post(urlBase_WS + "NSucursales.aspx", { seccion: "Sucursales", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        document.getElementById("clave").setAttribute("value", SetValor(xmlDoc, "clave", "clave"));
        var selectEmpresa = document.getElementById("cve_empresa");
        LlenarCatalogoEmpresas(selectEmpresa, function () {
            var selectTipo = document.getElementById("cve_tipo");
            LlenarCatalogoTipos(selectTipo, function () {
                var selectRegion = document.getElementById("cve_region");
                LlenarCatalogoRegiones(selectRegion, function () {
                    var selectZona = document.getElementById("cve_zona");
                    LlenarCatalogoZonas(selectZona, function () {                       
                    });
                });
            });
        });
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoSucursales(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NSucursales.aspx", { seccion: "Sucursales", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_sucursal: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var sucursales = xmlDoc.getElementsByTagName("Table");
        var listaSucursales = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaSucursales).html("");
        var totalregistros;
        for (var i = 0; i < sucursales.length; i++) {
            var cveSucursal = GetValor(sucursales[i], "cve_sucursal");
            var nombre = GetValor(sucursales[i], "nombre");
            var empresa = GetValor(sucursales[i], "empresa");
            var estatus = GetValor(sucursales[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(sucursales[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarSucursal(' + cveSucursal + ')"></button></td>' +
                '<td><label class="clave">' + cveSucursal + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="empresa">' + empresa + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaSucursales.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoSucursales);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarSucursal() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmSucursal = document.getElementById("frmNuevoSucursal");
        if (!frmSucursal.esEditar) {
            crearNuevoSucursal();
        } else {
            GuardarEdicionSucursal();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarSucursal(cve_sucursal) {
    var frmSucursal = document.getElementById("frmNuevoSucursal");
    frmSucursal.esEditar = true;
    MostrarFormulario();
        var selectEmpresa = document.getElementById("cve_empresa");
            LlenarCatalogoEmpresas(selectEmpresa, function () {
            var selectTipo = document.getElementById("cve_tipo");
                LlenarCatalogoTipos(selectTipo, function () {
                var selectRegion = document.getElementById("cve_region");
                    LlenarCatalogoRegiones(selectRegion, function () {
                    var selectZona = document.getElementById("cve_zona");
                    LlenarCatalogoZonas(selectZona, function () {
                    var selectUsuarios = document.getElementById("id_responsable");        
                        CargarDatosSucursal(cve_sucursal);
                    });
                });
            });
        });
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosSucursal(cve_sucursal) {
    $.post(urlBase_WS + "NSucursales.aspx", { seccion: "Sucursales", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_sucursal: cve_sucursal
    }).done(function (xmlDoc) {
        var sucursales = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(sucursales, "cve_sucursal", "clave");
        SetValor(sucursales, "nombre", "nombre");
        SetValor(sucursales, "cve_empresa", "cve_empresa");
        SetValor(sucursales, "calle", "calle");
        SetValor(sucursales, "colonia", "colonia");
        SetValor(sucursales, "delgamunic", "delgamunic");
        SetValor(sucursales, "estado", "estado");
        SetValor(sucursales, "cp", "cp")
        SetValor(sucursales, "entrecalles", "entrecalles");
        SetValor(sucursales, "id_responsable", "id_responsable");
        SetValor(sucursales, "numreferencia", "numreferencia");
        SetValor(sucursales, "cve_tipo", "cve_tipo");
        SetValor(sucursales, "cve_region", "cve_region");
        SetValor(sucursales, "cve_zona", "cve_zona");
        SetValor(sucursales, "activo", "estatus", "bool");
    });
}

function GuardarEdicionSucursal() {
    var frmNuevoSucursal = document.getElementById("frmNuevoSucursal");
    var parametros = $(frmNuevoSucursal).serialize();
    $.post(urlBase_WS + "NSucursales.aspx", "op=Editar&seccion=Sucursales&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoSucursales();
            document.getElementById("frmNuevoSucursal").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarSucursal(cve_sucursal) {
    $.post(urlBase_WS + "NSucursales.aspx", { op: "CambiarEstatusActivo", cve_region: cve_region, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoSucursales();
    })

}

function CancelarSucursal(){
    MostrarCatalogo();
 }

