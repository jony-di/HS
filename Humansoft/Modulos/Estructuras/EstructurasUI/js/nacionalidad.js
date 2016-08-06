function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoNacionalidad(1);
}

function crearNuevoNacionalidad() {
    var frmNuevoNacionalidad = document.getElementById("frmNuevoNacionalidad");
    var parametros = $(frmNuevoNacionalidad).serialize();
    $.post(urlBase_WS + "NNacionalidad.aspx", "op=NuevoNacionalidad&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoNacionalidad(1);
            document.getElementById("frmNuevoNacionalidad").reset();
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
    cargarCatalogoNacionalidad(1, criterio);
}

function MostrarNuevoNacionalidad() {
    var frmNacionalidad = document.getElementById("frmNuevoNacionalidad");
    frmNacionalidad.reset();
    frmNacionalidad.esEditar = false;
    $.post(urlBase_WS + "NNacionalidad.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "nacionalidad");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoNacionalidad(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NNacionalidad.aspx", { op: "obtenerCatalogoNacionalidad", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_nacionalidad: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var nacionalidad = xmlDoc.getElementsByTagName("Table");
        var listaNacionalidad = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaNacionalidad).html("");
        var totalregistros;
        for (var i = 0; i < nacionalidad.length; i++) {
            var CveNacionalidad = GetValor(nacionalidad[i], "cve_nacionalidad");
            var Descripcion = GetValor(nacionalidad[i], "descripcion");
            var estatus = GetValor(nacionalidad[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(nacionalidad[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarNacionalidad(' + CveNacionalidad + ')"></button></td>' +
                 '<td><label class="nacionalidad">' + CveNacionalidad + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaNacionalidad.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoNacionalidad);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarNacionalidad() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmNacionalidad = document.getElementById("frmNuevoNacionalidad");
        if (!frmNacionalidad.esEditar) {
            crearNuevoNacionalidad();
        } else {
            GuardarEdicionNacionalidad();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarNacionalidad(cve_nacionalidad) {
    var frmNacionalidad = document.getElementById("frmNuevoNacionalidad");
    frmNacionalidad.reset();
    frmNacionalidad.esEditar = true;
    MostrarFormulario();
    CargarDatosNacionalidad(cve_nacionalidad);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosNacionalidad(cve_nacionalidad) {
    $.post(urlBase_WS + "NNacionalidad.aspx", { op: "obtenerCatalogoNacionalidad", pagina: 1, longitudPagina: 5, criterio: "",
        cve_nacionalidad: cve_nacionalidad
    }).done(function (xmlDoc) {
        var nacionalidad = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(nacionalidad, "cve_nacionalidad", "nacionalidad");
        SetValor(nacionalidad, "descripcion", "descripcion");
        SetValor(nacionalidad, "activo", "estatus", "bool");
    });
}

function GuardarEdicionNacionalidad() {
    var frmNuevoNacionalidad = document.getElementById("frmNuevoNacionalidad");
    var parametros = $(frmNuevoNacionalidad).serialize();
    $.post(urlBase_WS + "NNacionalidad.aspx", "op=EditarNacionalidad&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoNacionalidad();
            document.getElementById("frmNuevoNacionalidad").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarNacionalidad(cve_nacionalidad) {
    $.post(urlBase_WS + "NNacionalidad.aspx", { op: "CambiarEstatusActivo", cve_nacionalidad: cve_nacionalidad, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoNacionalidad();
    })
}

function CancelarNacionalidad(){
    MostrarCatalogo();
 }