function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTelefonos(1);
}

function crearNuevoTelefonos() {
    var frmNuevoTelefonos = document.getElementById("frmNuevoTelefonos");
    var parametros = $(frmNuevoTelefonos).serialize();
    $.post(urlBase_WS + "NTelefono.aspx", "op=NuevoTelefono&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTelefonos(1);
            document.getElementById("frmNuevoTelefonos").reset();
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
    cargarCatalogoTelefonos(1, criterio);
}

function MostrarNuevoTelefonos() {
    var frmTelefonos = document.getElementById("frmNuevoTelefonos");
    frmTelefonos.reset();
    frmTelefonos.esEditar = false;
    $.post(urlBase_WS + "NTelefono.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoTelefonos(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTelefono.aspx", { op: "obtenerCatalogoTelefonos", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_telefono: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var telefonos = xmlDoc.getElementsByTagName("Table");
        var listaTelefonos = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTelefonos).html("");
        var totalregistros;
        for (var i = 0; i < telefonos.length; i++) {
            var cve_telefono = GetValor(telefonos[i], "cve_telefono");
            var cveEmpleado = GetValor(telefonos[i], "id_empleado");
            var descripcion = GetValor(telefonos[i], "descripcion");
            var numero = GetValor(telefonos[i], "numerotel");
            var estatus = GetValor(telefonos[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(telefonos[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTelefonos(' + cve_telefono + ')"></button></td>' +
                '<td><label class="clave">' + cveEmpleado + '</label></td>' +
                '<td><label class="telefono">' + cve_telefono + '</label></td>' +
                '<td><label class="descripcion">' + descripcion + '</label></td>' +
                '<td><label class="numero">' + numero + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTelefonos.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTelefonos);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTelefonos() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTelefonos = document.getElementById("frmNuevoTelefonos");
        if (!frmTelefonos.esEditar) {
            crearNuevoTelefonos();
        } else {
            GuardarEdicionTelefonos();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTelefonos(cve_telefono) {
    var frmTelefonos = document.getElementById("frmNuevoTelefonos");
    frmTelefonos.reset();
    frmTelefonos.esEditar = true;
    MostrarFormulario();
    CargarDatosTelefonos(cve_telefono);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTelefonos(cve_telefono) {
    $.post(urlBase_WS + "NTelefono.aspx", { op: "obtenerCatalogoTelefonos", pagina: 1, longitudPagina: 5, criterio: "",
        cve_telefono: cve_telefono
    }).done(function (xmlDoc) {
        var telefonos = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(telefonos, "cve_telefono", "clave");
        SetValor(telefonos, "id_empleado", "id_empleado");
        SetValor(telefonos, "descripcion", "descripcion");
        SetValor(telefonos, "numerotel", "numero");
        SetValor(telefonos, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTelefonos() {
    var frmNuevoTelefonos = document.getElementById("frmNuevoTelefonos");
    var parametros = $(frmNuevoTelefonos).serialize();
    $.post(urlBase_WS + "NTelefono.aspx", "op=EditarTelefonos&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTelefonos();
            document.getElementById("frmNuevoTelefonos").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTelefonos(cve_telefono) {
    $.post(urlBase_WS + "NTelefono.aspx", { op: "CambiarEstatusActivo", cve_telefono: cve_telefono, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTelefonos();
    })
}

function CancelarTelefonos(){
    MostrarCatalogo();
 }