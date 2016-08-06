function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoDga(1);
}


function crearNuevoDga() {
    var frmNuevoDga = document.getElementById("frmNuevoDga");
    var parametros = $(frmNuevoDga).serialize();
    $.post(urlBase_WS + "NDga.aspx", "op=NuevoDga&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDga(1);
            document.getElementById("frmNuevoDga").reset();
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
    cargarCatalogoDga(1, criterio);
}

function MostrarNuevoDga() {
    var frmDga = document.getElementById("frmNuevoDga");
    frmDga.reset();
    frmDga.esEditar = false;
    $.post(urlBase_WS + "NDga.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "dgagru");
    });
    //document.getElementById("nombre").focus();
    var selectEmpresas = document.getElementById("cve_empresa");
    LlenarCatalogoEmpresa(selectEmpresas, function () {});
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoDga(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NDga.aspx", { op: "obtenerCatalogoDga", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), dga_agrup: "" }).done(function (xmlDoc) {
        QuitarEspera();
        var dgas = xmlDoc.getElementsByTagName("Table");
        var listaDga = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaDga).html("");
        var totalregistros;
        for (var i = 0; i < dgas.length; i++) {
            var dgaAgru = GetValor(dgas[i], "DGA_AGRUP");
            var dga = GetValor(dgas[i], "DGA");
            var estatus = GetValor(dgas[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(dgas[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarDga(\'' + dgaAgru + '\')"></button></td>' +
                 '<td><label class="dgagru">' + dgaAgru + '</label></td>' +
                '<td><label class="dga">' + dga + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaDga.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoDga);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarDga() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmDga = document.getElementById("frmNuevoDga");
        if (!frmDga.esEditar) {
            crearNuevoDga();
        } else {
            GuardarEdicionDga();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarDga(dga_agrup) {
    var frmDga = document.getElementById("frmNuevoDga");
    frmDga.reset();
    frmDga.esEditar = true;
    MostrarFormulario();
    var selectEmpresas = document.getElementById("cve_empresa");
    LlenarCatalogoEmpresa(selectEmpresas, function () {
    });
    CargarDatosDga(dga_agrup);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosDga(dga_agrup) {
    $.post(urlBase_WS + "NDga.aspx", { op: "obtenerCatalogoDga", pagina: 1, longitudPagina: 5, criterio: "",
        dga_agrup: dga_agrup
    }).done(function (xmlDoc) {
        var dga = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dga, "DGA_AGRUP", "dgagru");
        SetValor(dga, "DGA", "dga");
        SetValor(dga, "activo", "estatus", "bool");
        SetValor(dga, "cve_empresa", "cve_empresa");
    });
}

function GuardarEdicionDga() {
    var frmNuevoDga = document.getElementById("frmNuevoDga");
    var parametros = $(frmNuevoDga).serialize();
    $.post(urlBase_WS + "NDga.aspx", "op=EditarDga&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDga();
            document.getElementById("frmNuevoDga").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarDga(cve_departamento) {
    $.post(urlBase_WS + "NDga.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoDga();
    })
}

function CancelarDga(){
    MostrarCatalogo();
 }