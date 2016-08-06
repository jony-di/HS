function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTipoCurso(1);
}

function crearNuevoTipoCurso() {
    var frmNuevoTipoCurso = document.getElementById("frmNuevoTipoCurso");
    var parametros = $(frmNuevoTipoCurso).serialize();
    $.post(urlBase_WS + "NTipoCurso.aspx", "op=NuevoTipoCurso&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoCurso(1);
            document.getElementById("frmNuevoTipoCurso").reset();
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
    cargarCatalogoTipoCurso(1, criterio);
}

function MostrarNuevoTipoCurso() {
    var frmTipoCurso = document.getElementById("frmNuevoTipoCurso");
    frmTipoCurso.reset();
    frmTipoCurso.esEditar = false;
    $.post(urlBase_WS + "NTipoCurso.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "tipocurso");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoTipoCurso(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipoCurso.aspx", { op: "obtenerCatalogoTipoCurso", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipocurso: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var tipocurso = xmlDoc.getElementsByTagName("Table");
        var listaTipoCurso = document.getElementById("contenedorLista");
        $(listaTipoCurso).html("");
        var totalregistros;
        for (var i = 0; i < tipocurso.length; i++) {
            var CveTipoCurso = GetValor(tipocurso[i], "cve_tipocurso");
            var Descripcion = GetValor(tipocurso[i], "descripcion");
            var estatus = GetValor(tipocurso[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tipocurso[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTipoCurso(' + CveTipoCurso + ')"></button></td>' +
                 '<td><label class="tipocurso">' + CveTipoCurso + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTipoCurso.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTipoCurso);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTipoCurso() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTipoCurso = document.getElementById("frmNuevoTipoCurso");
        if (!frmTipoCurso.esEditar) {
            crearNuevoTipoCurso();
        } else {
            GuardarEdicionTipoCurso();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTipoCurso(cve_tipocurso) {
    var frmTipoCurso = document.getElementById("frmNuevoTipoCurso");
    frmTipoCurso.reset();
    frmTipoCurso.esEditar = true;
    MostrarFormulario();
    CargarDatosTipoCurso(cve_tipocurso);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTipoCurso(cve_tipocurso) {
    $.post(urlBase_WS + "NTipoCurso.aspx", { op: "obtenerCatalogoTipoCurso", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipocurso: cve_tipocurso
    }).done(function (xmlDoc) {
        var tipocurso = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tipocurso, "cve_tipocurso", "tipocurso");
        SetValor(tipocurso, "descripcion", "descripcion");
        SetValor(tipocurso, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTipoCurso() {
    var frmNuevoTipoCurso = document.getElementById("frmNuevoTipoCurso");
    var parametros = $(frmNuevoTipoCurso).serialize();
    $.post(urlBase_WS + "NTipoCurso.aspx", "op=EditarTipoCurso&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTipoCurso();
            document.getElementById("frmNuevoTipoCurso").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTipoCurso(cve_tipocurso) {
    $.post(urlBase_WS + "NTipoCurso.aspx", { op: "CambiarEstatusActivo", cve_tipocurso: cve_tipocurso, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTipoCurso();
    })
}

function CancelarTipoCurso(){
    MostrarCatalogo();
 }