function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoEstatusEmpl(1);
}

function crearNuevoEstatusEmpl() {
    var frmNuevoEstatusEmpl = document.getElementById("frmNuevoEstatusEmpl");
    var parametros = $(frmNuevoEstatusEmpl).serialize();
    $.post(urlBase_WS + "NEstatusEmpl.aspx", "op=NuevoEstatusEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoEstatusEmpl(1);
            document.getElementById("frmNuevoEstatusEmpl").reset();
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
    cargarCatalogoEstatusEmpl(1, criterio);
}

function MostrarNuevoEstatusEmpl() {
    var frmEstatusEmpl = document.getElementById("frmNuevoEstatusEmpl");
    frmEstatusEmpl.reset();
    frmEstatusEmpl.esEditar = false;
    $.post(urlBase_WS + "NEstatusEmpl.aspx", { op: "ObtenerSiguienteClave" }).done(function (xmlDoc) {
       SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoEstatusEmpl(pagina, criterio){
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NEstatusEmpl.aspx", { op: "obtenerCatalogoEstatusEmpl", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_estatus: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var estatusempl = xmlDoc.getElementsByTagName("Table");
        var listaEstatusEmpl = document.getElementById("contenedorLista");
        $(listaEstatusEmpl).html("");
        var totalregistros;
        for (var i = 0; i < estatusempl.length; i++) {
            var cveEstatusEmpl = GetValor(estatusempl[i], "cve_estatus");
            var Descripcion = GetValor(estatusempl[i], "descripcion");
            var estatus = GetValor(estatusempl[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(estatusempl[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarEstatusEmpl(' + cveEstatusEmpl + ')"></button></td>' +
                '<td><label class="clave">' + cveEstatusEmpl + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaEstatusEmpl.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoEstatusEmpl);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });    
}

function GuardarEstatusEmpl() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmEstatusEmpl = document.getElementById("frmNuevoEstatusEmpl");
        if (!frmEstatusEmpl.esEditar) {
            crearNuevoEstatusEmpl();
        } else {
            GuardarEdicionEstatusEmpl();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarEstatusEmpl(cve_estatus) {
    var frmEstatusEmpl = document.getElementById("frmNuevoEstatusEmpl");
    frmEstatusEmpl.reset();
    frmEstatusEmpl.esEditar = true;
    MostrarFormulario();
    CargarDatosEstatusEmpl(cve_estatus);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosEstatusEmpl(cve_estatus) {
    $.post(urlBase_WS + "NEstatusEmpl.aspx", { op: "obtenerCatalogoEstatusEmpl", pagina: 1, longitudPagina: 5, criterio: "",
        cve_estatus: cve_estatus
    }).done(function (xmlDoc) {
        var estatusempl = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(estatusempl, "cve_estatus", "clave");
        SetValor(estatusempl, "descripcion", "descripcion");
        SetValor(estatusempl, "activo", "estatus", "bool");
    });
}

function GuardarEdicionEstatusEmpl() {
    var frmNuevoEstatusEmpl = document.getElementById("frmNuevoEstatusEmpl");
    var parametros = $(frmNuevoEstatusEmpl).serialize();
    $.post(urlBase_WS + "NEstatusEmpl.aspx", "op=EditarEstatusEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoEstatusEmpl();
            document.getElementById("frmNuevoEstatusEmpl").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarEstatusEmpl(cve_estatus) {
    $.post(urlBase_WS + "NEstatusEmpl.aspx", { op: "CambiarEstatusActivo", cve_estatus: cve_estatus, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoEstatusEmpl();
    })
}

function CancelarEstatusEmpl(){
    MostrarCatalogo();
 }