function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoFamiliaPuesto(1);
}

function crearNuevoFamiliaPuesto() {
    var frmNuevoFamiliaPuesto = document.getElementById("frmNuevoFamiliaPuesto");
    var parametros = $(frmNuevoFamiliaPuesto).serialize();
    $.post(urlBase_WS + "NFamiliaPuesto.aspx", "op=NuevoFamiliaPuesto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoFamiliaPuesto(1);
            document.getElementById("frmNuevoFamiliaPuesto").reset();
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
    cargarCatalogoFamiliaPuesto(1, criterio);
}

function MostrarNuevoFamiliaPuesto() {
    var frmFamiliaPuesto = document.getElementById("frmNuevoFamiliaPuesto");
    frmFamiliaPuesto.reset();
    frmFamiliaPuesto.esEditar = false;
    $.post(urlBase_WS + "NFamiliaPuesto.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "fampuesto");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoFamiliaPuesto(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NFamiliaPuesto.aspx", { op: "obtenerCatalogoFamiliaPuesto", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), fampuesto: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var fampuesto = xmlDoc.getElementsByTagName("Table");
        var listaFamiliaPuesto = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaFamiliaPuesto).html("");
        var totalregistros;
        for (var i = 0; i < fampuesto.length; i++) {
            var FamPuesto = GetValor(fampuesto[i], "fampuesto");
            var Descripcion = GetValor(fampuesto[i], "descripcion");
            var estatus = GetValor(fampuesto[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(fampuesto[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarFamiliaPuesto(' + FamPuesto + ')"></button></td>' +
                 '<td><label class="fampuesto">' + FamPuesto + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaFamiliaPuesto.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoFamiliaPuesto);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarFamiliaPuesto() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmFamiliaPuesto = document.getElementById("frmNuevoFamiliaPuesto");
        if (!frmFamiliaPuesto.esEditar) {
            crearNuevoFamiliaPuesto();
        } else {
            GuardarEdicionFamiliaPuesto();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarFamiliaPuesto(fampuesto) {
    var frmFamiliaPuesto = document.getElementById("frmNuevoFamiliaPuesto");
    frmFamiliaPuesto.reset();
    frmFamiliaPuesto.esEditar = true;
    MostrarFormulario();
    CargarDatosFamiliaPuesto(fampuesto);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosFamiliaPuesto(fampuesto) {
    $.post(urlBase_WS + "NFamiliaPuesto.aspx", { op: "obtenerCatalogoFamiliaPuesto", pagina: 1, longitudPagina: 5, criterio: "",
        fampuesto: fampuesto
    }).done(function (xmlDoc) {
        var fampuesto = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(fampuesto, "fampuesto", "fampuesto");
        SetValor(fampuesto, "descripcion", "descripcion");
        SetValor(fampuesto, "activo", "estatus", "bool");
    });
}

function GuardarEdicionFamiliaPuesto() {
    var frmNuevoFamiliaPuesto = document.getElementById("frmNuevoFamiliaPuesto");
    var parametros = $(frmNuevoFamiliaPuesto).serialize();
    $.post(urlBase_WS + "NFamiliaPuesto.aspx", "op=EditarFamiliaPuesto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoFamiliaPuesto();
            document.getElementById("frmNuevoFamiliaPuesto").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarFamiliaPuesto(cve_departamento) {
    $.post(urlBase_WS + "NFamiliaPuesto.aspx", { op: "CambiarEstatusActivo", fampuesto: fampuesto, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoFamiliaPuesto();
    })
}

function CancelarFamiliaPuesto(){
    MostrarCatalogo();
 }