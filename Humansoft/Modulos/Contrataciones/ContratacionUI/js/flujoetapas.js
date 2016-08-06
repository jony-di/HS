function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
}

function crearNuevo(){
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NFlujosEtapas.aspx", "op=Nuevo&seccion=EtapasFlujo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoItemCat(1);
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto){
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function MostrarNuevo() {
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.esEditar = false;
    $.post(urlBase_WS + "NFlujosEtapas.aspx", { seccion: "EtapasFlujo", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    //var selectestatus = document.getElementById("estatus");
    //selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoItemCat(pagina, criterio, cve_etapa) {
    if (!cve_etapa) cve_etapa = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NFlujosEtapas.aspx", { seccion: "EtapasFlujo", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_etapa: cve_etapa }).done(function (xmlDoc) {
        QuitarEspera();
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var clave = GetValor(ItemCat[i], "cve_etapa");
            var nombre = GetValor(ItemCat[i], "descripcion");
            var resolucionauto = GetValor(ItemCat[i], "resolucionauto","bool", "Activo:Inactivo");            
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarItemCat(' + clave + ')"></button></td>' +
                 '<td><label >' + clave + '</label></td>' +
                '<td><label >' + nombre + '</label></td>' +
                '<td><label >' + resolucionauto + '</label></td>' +
                '<td><label class="seleccionar"><img class="seleccionar"  onclick="VerSubetapas(' + clave + ',this)" src="/Recursos/imagenes/select.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function VerSubetapas(clave, row) {
    IntercambioVisual("pantallaAuxiliar", "formulario");
    var referencia = "/Modulos/Contrataciones/ContratacionUI/CN_flujosubetapas.aspx?callbackInicio=callbackInicioVerSubetapas&offset=0&cve_etapa=" + clave;
    MostrarSigFrame(referencia, -900, "pantallaAuxiliar");
    
    //$.fancybox({ type: 'iframe', href: referencia, scrolling: 'no', preload: false, width: '900', height: '650', openEffect: 'elastic' });
}

function callbackInicioVerDetallePolitica() {
   //QuitarEspera();
}


function Guardar() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar){
            crearNuevo();
        } else {
            GuardarEdicioNCatalogosFlujosEtapas();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarItemCat(clave) {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.esEditar = true;
    MostrarFormulario();
    CargarDatosItemCat(clave);

    //var selectestatus = document.getElementById("estatus");
    //selectestatus.disabled = false;
}

function CargarDatosItemCat(cve_ItemCat) {
    $.post(urlBase_WS + "NFlujosEtapas.aspx", { seccion: "EtapasFlujo", op: "obtenerCatalogo", pagina: 1, longitudPagina: 1, criterio: "",
        cve_etapa: cve_ItemCat
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_etapa", "clave");
        SetValor(ItemCat, "descripcion", "descripcion");
        SetValor(ItemCat, "resolucionAutomatica", "resolucionautomatica", "bool");
    });
}

function GuardarEdicioNCatalogosFlujosEtapas() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NFlujosEtapas.aspx", "op=Editar&seccion=EtapasFlujo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoItemCat();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";

        }
    });
}




function Cancelar() {
    MostrarCatalogo();
}

