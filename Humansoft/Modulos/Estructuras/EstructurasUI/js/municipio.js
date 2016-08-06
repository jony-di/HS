function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoMunicipio(1);
    var selectPais = document.getElementById("pais");
    LlenarCatalogoPaises(selectPais, function () {
        var selectEstado = document.getElementById("estado");
        LlenarCatalogoEstados(selectEstado, function () { });
    });
}

function crearNuevoMunicipio() {
    var frmNuevoMunicipio = document.getElementById("frmNuevoMunicipio");
    var parametros = $(frmNuevoMunicipio).serialize();
    $.post(urlBase_WS + "NMunicipio.aspx", "op=NuevoMunicipio&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoMunicipio(1);
            document.getElementById("frmNuevoMunicipio").reset();
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
    cargarCatalogoMunicipio(1, criterio);
}

function MostrarNuevoMunicipio() {
    var frmMunicipio = document.getElementById("frmNuevoMunicipio");
    frmMunicipio.reset();
    frmMunicipio.esEditar = false;
    $.post(urlBase_WS + "NMunicipio.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
        var selectPais = document.getElementById("pais");
        LlenarCatalogoPaises(selectPais, function () {
            var selectEstado = document.getElementById("estado");
            LlenarCatalogoEstados(selectEstado, function () {});
        });
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoMunicipio(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NMunicipio.aspx", { op: "obtenerCatalogoMunicipio", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_municipio: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var municipio = xmlDoc.getElementsByTagName("Table");
        var listaMunicipio = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaMunicipio).html("");
        var totalregistros;
        for (var i = 0; i < municipio.length; i++) {
            var cveMunicipio = GetValor(municipio[i], "cve_municipio");
            var nombre = GetValor(municipio[i], "nombremuni");
            var pais = GetValor(municipio[i], "nombrepais");
            var estado = GetValor(municipio[i], "nombreestado");
            var estatus = GetValor(municipio[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(municipio[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarMunicipio(' + cveMunicipio + ')"></button></td>' +
                '<td><label class="clave">' + cveMunicipio + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="pais">' + pais + '</label></td>' +
                '<td><label class="estado">' + estado + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaMunicipio.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoMunicipio);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarMunicipio() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmMunicipio = document.getElementById("frmNuevoMunicipio");
        if (!frmMunicipio.esEditar) {
            crearNuevoMunicipio();
        } else {
            GuardarEdicionMunicipio();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarMunicipio(cve_municipio) {
    var frmMunicipio = document.getElementById("frmNuevoMunicipio");
    frmMunicipio.reset();
    frmMunicipio.esEditar = true;
    MostrarFormulario();
    CargarDatosMunicipio(cve_municipio);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosMunicipio(cve_municipio) {
    $.post(urlBase_WS + "NMunicipio.aspx", { op: "obtenerCatalogoMunicipio", pagina: 1, longitudPagina: 5, criterio: "",
        cve_municipio: cve_municipio
    }).done(function (xmlDoc) {
        var municipio = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(municipio, "cve_municipio", "clave");
        SetValor(municipio, "nombremuni", "nombre");
        SetValor(municipio, "cve_pais", "pais");
        SetValor(municipio, "cve_estado", "estado");
        SetValor(municipio, "activo", "estatus", "bool");
    });
}

function GuardarEdicionMunicipio() {
    var frmNuevoMunicipio = document.getElementById("frmNuevoMunicipio");
    var parametros = $(frmNuevoMunicipio).serialize();
    $.post(urlBase_WS + "NMunicipio.aspx", "op=EditarMunicipio&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoMunicipio();
            document.getElementById("frmNuevoMunicipio").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarMunicipio(cve_municipio) {
    $.post(urlBase_WS + "NMunicipio.aspx", { op: "CambiarEstatusActivo", cve_municipio: cve_municipio, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoMunicipio();
    })
}

function CancelarMunicipio(){
    MostrarCatalogo();
 }