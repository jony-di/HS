function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoPeriosidad(1);
}

function crearNuevoPeriosidad() {
    var frmNuevoPeriosidad = document.getElementById("frmNuevoPeriosidad");
    var parametros = $(frmNuevoPeriosidad).serialize();
    $.post(urlBase_WS + "NPeriosidad.aspx", "op=NuevoPeriosidad&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPeriosidad(1);
            document.getElementById("frmNuevoPeriosidad").reset();
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
    cargarCatalogoPeriosidad(1, criterio);
}

function MostrarNuevoPeriosidad() {
    var frmPeriosidad = document.getElementById("frmNuevoPeriosidad");
    frmPeriosidad.reset();
    frmPeriosidad.esEditar = false;
    $.post(urlBase_WS + "NPeriosidad.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "periosidad");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoPeriosidad(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPeriosidad.aspx", { op: "obtenerCatalogoPeriosidad", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_periosidad: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var periosidad = xmlDoc.getElementsByTagName("Table");
        var listaPeriosidad = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPeriosidad).html("");
        var totalregistros;
        for (var i = 0; i < periosidad.length; i++) {
            var CvePeriosidad = GetValor(periosidad[i], "cve_periosidad");
            var Descripcion = GetValor(periosidad[i], "descripcion");
            var estatus = GetValor(periosidad[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(periosidad[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPeriosidad(' + CvePeriosidad + ')"></button></td>' +
                 '<td><label class="periosidad">' + CvePeriosidad + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaPeriosidad.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoPeriosidad);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPeriosidad() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPeriosidad = document.getElementById("frmNuevoPeriosidad");
        if (!frmPeriosidad.esEditar) {
            crearNuevoPeriosidad();
        } else {
            GuardarEdicionPeriosidad();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPeriosidad(cve_periosidad) {
    var frmPeriosidad = document.getElementById("frmNuevoPeriosidad");
    frmPeriosidad.reset();
    frmPeriosidad.esEditar = true;
    MostrarFormulario();
    CargarDatosPeriosidad(cve_periosidad);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosPeriosidad(cve_periosidad) {
    $.post(urlBase_WS + "NPeriosidad.aspx", { op: "obtenerCatalogoPeriosidad", pagina: 1, longitudPagina: 5, criterio: "",
        cve_periosidad: cve_periosidad
    }).done(function (xmlDoc) {
        var periosidad = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(periosidad, "cve_periosidad", "periosidad");
        SetValor(periosidad, "descripcion", "descripcion");
        SetValor(periosidad, "activo", "estatus", "bool");
    });
}

function GuardarEdicionPeriosidad() {
    var frmNuevoPeriosidad = document.getElementById("frmNuevoPeriosidad");
    var parametros = $(frmNuevoPeriosidad).serialize();
    $.post(urlBase_WS + "NPeriosidad.aspx", "op=EditarPeriosidad&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPeriosidad();
            document.getElementById("frmNuevoPeriosidad").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarPeriosidad(cve_periosidad) {
    $.post(urlBase_WS + "NPeriosidad.aspx", { op: "CambiarEstatusActivo", cve_periosidad: cve_periosidad, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPeriosidad();
    })
}

function CancelarPeriosidad(){
    MostrarCatalogo();
 }