var CLAVE_TABULADOR;
function iniciar(claveTabulador) {
    CLAVE_TABULADOR = claveTabulador;
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTabulador(1);
    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}

function crearNuevoTabulador() {
    var frmNuevoTabulador = document.getElementById("frmNuevoTabulador");
    var parametros = $(frmNuevoTabulador).serialize();
    $.post(urlBase_WS + "NTabulador.aspx", "op=NuevoTabulador&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1){
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTabulador(1);
            document.getElementById("frmNuevoTabulador").reset();
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
    cargarCatalogoTabulador(1, criterio);
}

function MostrarNuevoTabulador() {
    var frmTabulador = document.getElementById("frmNuevoTabulador");
    frmTabulador.reset();
    frmTabulador.esEditar = false;
    $.post(urlBase_WS + "NTabulador.aspx", { op: "obtenerSiguienteClave", tabulador: CLAVE_TABULADOR }).done(function (xmlDoc) {
        SetValor(xmlDoc, "nivel", "nivel");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoTabulador(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTabulador.aspx", { op: "obtenerCatalogoTabulador", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), tabulador: CLAVE_TABULADOR }).done(function (xmlDoc) {
        QuitarEspera();
        var tabulador = xmlDoc.getElementsByTagName("Table");
        var listaTabulador = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTabulador).html("");
        var totalregistros;
        for (var i = 0; i < tabulador.length; i++) {
            var Clave_Tabulador = GetValor(tabulador[i], "tabulador");
            var nivel = GetValor(tabulador[i], "nivel");
            var contratacion = GetValor(tabulador[i], "contratacion");
            var minimo = GetValor(tabulador[i], "minimo");
            var medio = GetValor(tabulador[i], "medio");
            var maximo = GetValor(tabulador[i], "maximo");
            var estatus = GetValor(tabulador[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tabulador[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTabulador(' + Clave_Tabulador +',' + nivel + ')"></button></td>' +
                '<td><label class="nivel">' + nivel + '</label></td>' +
                '<td><label class="contratacion">$ ' + contratacion + '</label></td>' +
                '<td><label class="minimo">$ ' + minimo + '</label> </td>' +
                '<td><label class="minimo">$ ' + medio + '</label> </td>' +
                '<td><label class="maximo">$ ' + maximo + '</label> </td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTabulador.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTabulador);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
    
}

function GuardarTabulador() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTabulador = document.getElementById("frmNuevoTabulador");
        if (!frmTabulador.esEditar) {
            crearNuevoTabulador();
        } else {
            GuardarEdicionTabulador();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTabulador(tabulador,nivel) {
    var frmTabulador = document.getElementById("frmNuevoTabulador");
    frmTabulador.reset();
    frmTabulador.esEditar = true;
    MostrarFormulario();
    CargarDatosTabulador(tabulador,nivel);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTabulador(tabulador, nivel) {
    $.post(urlBase_WS + "NTabulador.aspx", { op: "obtenerCatalogoTabulador", pagina: 1, longitudPagina: 5, criterio: "",
        tabulador: tabulador, nivel: nivel
    }).done(function (xmlDoc) {
        var tabulador = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tabulador, "tabulador", "clave");
        SetValor(tabulador, "nivel", "nivel");
        SetValor(tabulador, "p_min", "pmin");
        SetValor(tabulador, "p_max", "pmax");
        SetValor(tabulador, "minimo", "minimo");
        SetValor(tabulador, "contratacion", "contratacion");
        SetValor(tabulador, "medio", "medio");
        SetValor(tabulador, "maximo", "maximo");
        SetValor(tabulador, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTabulador() {
    var frmNuevoTabulador = document.getElementById("frmNuevoTabulador");
    var parametros = $(frmNuevoTabulador).serialize();
    $.post(urlBase_WS + "NTabulador.aspx", "op=EditarTabulador&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoTabulador();
            document.getElementById("frmNuevoTabulador").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTabulador(tabulador) {
    $.post(urlBase_WS + "NTabulador.aspx", { op: "CambiarEstatusActivo", tabulador: tabulador, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTabulador();
    })
}

function CancelarTabulador(){
    MostrarCatalogo();
 }