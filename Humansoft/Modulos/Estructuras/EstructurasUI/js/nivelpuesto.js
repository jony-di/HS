function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoNivelPuesto(1);
}

function crearNuevoNivelPuesto() {
    var frmNuevoNivelPuesto = document.getElementById("frmNuevoNivelPuesto");
    var parametros = $(frmNuevoNivelPuesto).serialize();
    $.post(urlBase_WS + "NNivelPuesto.aspx", "op=NuevoNivelPuesto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoNivelPuesto(1);
            document.getElementById("frmNuevoNivelPuesto").reset();
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
    cargarCatalogoNivelPuesto(1, criterio);
}

function MostrarNuevoNivelPuesto() {
    var frmNivelPuesto = document.getElementById("frmNuevoNivelPuesto");
    frmNivelPuesto.reset();
    frmNivelPuesto.esEditar = false;
    $.post(urlBase_WS + "NNivelPuesto.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "cve_nivel");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoNivelPuesto(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NNivelPuesto.aspx", { op: "obtenerCatalogoNivelPuesto", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_nivel: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var nivelpuesto = xmlDoc.getElementsByTagName("Table");
        var listaNivelPuesto = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaNivelPuesto).html("");
        var totalregistros;
        for (var i = 0; i < nivelpuesto.length; i++) {
            var cveNivelPuesto = GetValor(nivelpuesto[i], "cve_nivel");
            var Puesto = GetValor(nivelpuesto[i], "cve_puesto");
            var estatus = GetValor(nivelpuesto[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(nivelpuesto[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarNivelPuesto(' + cveNivelPuesto + ')"></button></td>' +
                 '<td><label class="nivelpuesto">' + cveNivelPuesto + '</label></td>' +
                '<td><label class="puesto">' + Puesto + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaNivelPuesto.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoNivelPuesto);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarNivelPuesto() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmNivelPuesto = document.getElementById("frmNuevoNivelPuesto");
        if (!frmNivelPuesto.esEditar) {
            crearNuevoNivelPuesto();
        } else {
            GuardarEdicionNivelPuesto();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarNivelPuesto(cve_nivel) {
    var frmNivelPuesto = document.getElementById("frmNuevoNivelPuesto");
    frmNivelPuesto.reset();
    frmNivelPuesto.esEditar = true;
    MostrarFormulario();
    CargarDatosNivelPuesto(cve_nivel);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosNivelPuesto(cve_nivel) {
    $.post(urlBase_WS + "NNivelPuesto.aspx", { op: "obtenerCatalogoNivelPuesto", pagina: 1, longitudPagina: 5, criterio: "",
        cve_nivel: cve_nivel
    }).done(function (xmlDoc) {
        var nivelpuesto = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(nivelpuesto, "cve_nivel", "cve_nivel");
        SetValor(nivelpuesto, "cve_puesto", "puesto");
        SetValor(nivelpuesto, "activo", "estatus", "bool");
    });
}

function GuardarEdicionNivelPuesto() {
    var frmNuevoNivelPuesto = document.getElementById("frmNuevoNivelPuesto");
    var parametros = $(frmNuevoNivelPuesto).serialize();
    $.post(urlBase_WS + "NNivelPuesto.aspx", "op=EditarNivelPuesto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoNivelPuesto();
            document.getElementById("frmNuevoNivelPuesto").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarNivelPuesto(cve_nivel) {
    $.post(urlBase_WS + "NNivelPuesto.aspx", { op: "CambiarEstatusActivo", cve_nivel: cve_nivel, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoNivelPuesto();
    })
}

function CancelarNivelPuesto(){
    MostrarCatalogo();
 }