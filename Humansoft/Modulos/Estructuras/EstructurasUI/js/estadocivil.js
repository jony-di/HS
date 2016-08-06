function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoEstadoCivil(1);
}

function crearNuevoEstadoCivil() {
    var frmNuevoEstadoCivil = document.getElementById("frmNuevoEstadoCivil");
    var parametros = $(frmNuevoEstadoCivil).serialize();
    $.post(urlBase_WS + "NEstadoCivil.aspx", "op=NuevoEstadoCivil&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoEstadoCivil(1);
            document.getElementById("frmNuevoEstadoCivil").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0){
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoEstadoCivil(1, criterio);
}

function MostrarNuevoEstadoCivil() {
    var frmEstadoCivil = document.getElementById("frmNuevoEstadoCivil");
    frmEstadoCivil.reset();
    frmEstadoCivil.esEditar = false;
    $.post(urlBase_WS + "NEstadoCivil.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoEstadoCivil(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NEstadoCivil.aspx", { op: "obtenerCatalogoEstadoCivil", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_estadocivil: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var estadocivil = xmlDoc.getElementsByTagName("Table");
        var listaEstadoCivil = document.getElementById("contenedorLista");
        $(listaEstadoCivil).html("");
        var totalregistros;
        for (var i = 0; i < estadocivil.length; i++){
            var CveEstadoCivil = GetValor(estadocivil[i], "cve_estadocivil");
            var Descripcion = GetValor(estadocivil[i], "descripcion");
            var estatus = GetValor(estadocivil[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(estadocivil[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarEstadoCivil(' + CveEstadoCivil + ')"></button></td>' +
                 '<td><label class="estadocivil">' + CveEstadoCivil + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaEstadoCivil.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoEstadoCivil);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();        
    });
}

function GuardarEstadoCivil() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmEstadoCivil = document.getElementById("frmNuevoEstadoCivil");
        if (!frmEstadoCivil.esEditar) {
            crearNuevoEstadoCivil();
        } else {
            GuardarEdicionEstadoCivil();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarEstadoCivil(cve_departamento) {
    var frmEstadoCivil = document.getElementById("frmNuevoEstadoCivil");
    frmEstadoCivil.reset();
    frmEstadoCivil.esEditar = true;
    MostrarFormulario();
    CargarDatosEstadoCivil(cve_departamento);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosEstadoCivil(cve_estadocivil) {
    $.post(urlBase_WS + "NEstadoCivil.aspx", { op: "obtenerCatalogoEstadoCivil", pagina: 1, longitudPagina: 5, criterio: "",
        cve_estadocivil: cve_estadocivil
    }).done(function (xmlDoc) {
        var estadocivil = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(estadocivil, "cve_estadocivil", "clave");
        SetValor(estadocivil, "descripcion", "descripcion");
        SetValor(estadocivil, "activo", "estatus", "bool");
    });
}

function GuardarEdicionEstadoCivil() {
    var frmNuevoEstadoCivil = document.getElementById("frmNuevoEstadoCivil");
    var parametros = $(frmNuevoEstadoCivil).serialize();
    $.post(urlBase_WS + "NEstadoCivil.aspx", "op=EditarEstadoCivil&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoEstadoCivil();
            document.getElementById("frmNuevoEstadoCivil").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarEstadoCivil(cve_departamento) {
    $.post(urlBase_WS + "NEstadoCivil.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoEstadoCivil();
    })
}

function CancelarEstadoCivil(){
    MostrarCatalogo();
 }