function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoPlazas(1);
}

function crearNuevoPlazas() {
    var frmNuevoPlazas = document.getElementById("frmNuevoPlazas");
    var parametros = $(frmNuevoPlazas).serialize();
    $.post(urlBase_WS + "NPlaza.aspx", "op=NuevoPlazas&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPlazas(1);
            document.getElementById("frmNuevoPlazas").reset();
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
    cargarCatalogoPlazas(1, criterio);
}

function MostrarNuevoPlazas() {
    var frmPlazas = document.getElementById("frmNuevoPlazas");
    frmPlazas.reset();
    frmPlazas.esEditar = false;
    $.post(urlBase_WS + "NPlaza.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "plazas");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoPlazas(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPlaza.aspx", { op: "obtenerCatalogoPlazas", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_plaza: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var plazas = xmlDoc.getElementsByTagName("Table");
        var listaPlazas = document.getElementById("contenedorLista");
        $(listaPlazas).html("");
        var totalregistros;
        for (var i = 0; i < plazas.length; i++) {
            var cvePlaza = GetValor(plazas[i], "cve_plaza");
            var Descripcion = GetValor(plazas[i], "descripcion");
            var estatus = GetValor(plazas[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(plazas[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPlazas(' + cvePlaza + ')"></button></td>' +
                 '<td><label class="plazas">' + cvePlaza + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaPlazas.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoPlazas);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPlazas() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPlazas = document.getElementById("frmNuevoPlazas");
        if (!frmPlazas.esEditar) {
            crearNuevoPlazas();
        } else {
            GuardarEdicionPlazas();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPlazas(cve_plaza) {
    var frmPlazas = document.getElementById("frmNuevoPlazas");
    frmPlazas.reset();
    frmPlazas.esEditar = true;
    MostrarFormulario();
    CargarDatosPlazas(cve_plaza);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosPlazas(cve_plaza) {
    $.post(urlBase_WS + "NPlaza.aspx", { op: "obtenerCatalogoPlazas", pagina: 1, longitudPagina: 5, criterio: "",
        cve_plaza: cve_plaza
    }).done(function (xmlDoc) {
        var plazas = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(plazas, "cve_plaza", "plazas");
        SetValor(plazas, "descripcion", "descripcion");
        SetValor(plazas, "activo", "estatus", "bool");
    });
}

function GuardarEdicionPlazas() {
    var frmNuevoPlazas = document.getElementById("frmNuevoPlazas");
    var parametros = $(frmNuevoPlazas).serialize();
    $.post(urlBase_WS + "NPlaza.aspx", "op=EditarPlazas&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPlazas();
            document.getElementById("frmNuevoPlazas").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarPlazas(cve_plaza) {
    $.post(urlBase_WS + "NPlaza.aspx", { op: "CambiarEstatusActivo", cve_plaza: cve_plaza, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPlazas();
    })
}

function CancelarPlazas(){
    MostrarCatalogo();
 }