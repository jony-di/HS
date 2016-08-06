function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoGrado(1);
}

function crearNuevoGrado() {
    var frmNuevoGrado = document.getElementById("frmNuevoGrado");
    var parametros = $(frmNuevoGrado).serialize();
    $.post(urlBase_WS + "NGrado.aspx", "op=NuevoGrado&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoGrado(1);
            document.getElementById("frmNuevoGrado").reset();
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
    cargarCatalogoGrado(1, criterio);
}

function MostrarNuevoGrado() {
    var frmGrado = document.getElementById("frmNuevoGrado");
    frmGrado.reset();
    frmGrado.esEditar = false;
    $.post(urlBase_WS + "NGrado.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "grado");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoGrado(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NGrado.aspx", { op: "obtenerCatalogoGrado", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_grado: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var grado = xmlDoc.getElementsByTagName("Table");
        var listaGrado = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaGrado).html("");
        var totalregistros;
        for (var i = 0; i < grado.length; i++) {
            var CveGrado = GetValor(grado[i], "cve_grado");
            var Descripcion = GetValor(grado[i], "descripcion");
            var estatus = GetValor(grado[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(grado[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarGrado(' + CveGrado + ')"></button></td>' +
                 '<td><label class="grado">' + CveGrado + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaGrado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoGrado);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarGrado() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmGrado = document.getElementById("frmNuevoGrado");
        if (!frmGrado.esEditar) {
            crearNuevoGrado();
        } else {
            GuardarEdicionGrado();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarGrado(CveGrado) {
    var frmGrado = document.getElementById("frmNuevoGrado");
    frmGrado.reset();
    frmGrado.esEditar = true;
    MostrarFormulario();
    CargarDatosGrado(CveGrado);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosGrado(cve_grado) {
    $.post(urlBase_WS + "NGrado.aspx", { op: "obtenerCatalogoGrado", pagina: 1, longitudPagina: 5, criterio: "",
        cve_grado: cve_grado
    }).done(function (xmlDoc) {
        var grado = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(grado, "cve_grado", "grado");
        SetValor(grado, "descripcion", "descripcion");
        SetValor(grado, "activo", "estatus", "bool");
    });
}

function GuardarEdicionGrado() {
    var frmNuevoGrado = document.getElementById("frmNuevoGrado");
    var parametros = $(frmNuevoGrado).serialize();
    $.post(urlBase_WS + "NGrado.aspx", "op=EditarGrado&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoGrado();
            document.getElementById("frmNuevoGrado").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarGrado(cve_departamento) {
    $.post(urlBase_WS + "NGrado.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoGrado();
    })
}

function CancelarGrado(){
    MostrarCatalogo();
 }