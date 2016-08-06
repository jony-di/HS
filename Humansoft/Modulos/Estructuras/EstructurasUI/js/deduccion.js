function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoDeduccion(1);
}

function crearNuevoDeduccion() {
    var frmNuevoDeduccion = document.getElementById("frmNuevoDeduccion");
    var parametros = $(frmNuevoDeduccion).serialize();
    $.post(urlBase_WS + "NDeduccion.aspx", "op=NuevoDeduccion&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDeduccion(1);
            document.getElementById("frmNuevoDeduccion").reset();
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
    cargarCatalogoDeduccion(1, criterio);
}

function MostrarNuevoDeduccion() {
    var frmDeduccion = document.getElementById("frmNuevoDeduccion");
    frmDeduccion.reset();
    frmDeduccion.esEditar = false;
    $.post(urlBase_WS + "NDeduccion.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoDeduccion(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NDeduccion.aspx", { op: "obtenerCatalogoDeduccion", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), ID_Empleado: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var deduccion = xmlDoc.getElementsByTagName("Table");
        var listaDeduccion = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaDeduccion).html("");
        var totalregistros;
        for (var i = 0; i < deduccion.length; i++) {
            var idEmpleado = GetValor(deduccion[i], "ID_Empleado");
            var anio = GetValor(deduccion[i], "ANIO");
            var descripcion = GetValor(deduccion[i], "Descripcion");
            var tiene = GetValor(deduccion[i], "Tiene", "bool", "Si:No");
            var estatus = GetValor(deduccion[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(deduccion[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarDeduccion(' + idEmpleado + ')"></button></td>' +
                '<td><label class="clave">' + idEmpleado + '</label></td>' +
                '<td><label class="anio">' + anio + '</label></td>' +
                '<td><label class="descripcion">' + descripcion + '</label></td>' +
                '<td><label class="tiene">' + tiene + '</label> </td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaDeduccion.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoDeduccion);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarDeduccion() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmDeduccion = document.getElementById("frmNuevoDeduccion");
        if (!frmDeduccion.esEditar) {
            crearNuevoDeduccion();
        } else {
            GuardarEdicionDeduccion();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarDeduccion(ID_Empleado) {
    var frmDeduccion = document.getElementById("frmNuevoDeduccion");
    frmDeduccion.reset();
    frmDeduccion.esEditar = true;
    MostrarFormulario();
    CargarDatosDeduccion(ID_Empleado);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosDeduccion(ID_Empleado) {
    $.post(urlBase_WS + "NDeduccion.aspx", { op: "obtenerCatalogoDeduccion", pagina: 1, longitudPagina: 5, criterio: "",
        ID_Empleado: ID_Empleado
    }).done(function (xmlDoc) {
        var deduccion = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(deduccion, "ID_Empleado", "clave");
        SetValor(deduccion, "ANIO", "anio");
        SetValor(deduccion, "Descripcion", "descripcion");
        SetValor(deduccion, "tiene", "tiene", "bool");
        SetValor(deduccion, "activo", "estatus", "bool");
    });
}

function GuardarEdicionDeduccion() {
    var frmNuevoDeduccion = document.getElementById("frmNuevoDeduccion");
    var parametros = $(frmNuevoDeduccion).serialize();
    $.post(urlBase_WS + "NDeduccion.aspx", "op=EditarDeduccion&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDeduccion();
            document.getElementById("frmNuevoDeduccion").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarDeduccion(ID_Empleado) {
    $.post(urlBase_WS + "NDeduccion.aspx", { op: "CambiarEstatusActivo", ID_Empleado: ID_Empleado, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoDeduccion();
    })
}

function CancelarDeduccion(){
    MostrarCatalogo();
 }