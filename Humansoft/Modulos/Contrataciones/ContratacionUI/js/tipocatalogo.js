function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NTipocatalogo.aspx", "op=Nuevo&seccion=Tipocatalogo&" + parametros).done(function (xmlDoc) {
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

function MostrarNuevo(){
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.esEditar = false;
    $.post(urlBase_WS + "NTipocatalogo.aspx", { seccion: "Tipocatalogo", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    }); 
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoItemCat(pagina, criterio, cve_tipocatalogo) {
    if (!cve_tipocatalogo) cve_tipocatalogo = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipocatalogo.aspx", { seccion: "Tipocatalogo", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipocatalogo: cve_tipocatalogo }).done(function (xmlDoc) {
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
            var clave = GetValor(ItemCat[i], "cve_tipocatalogo");
            var descripcion = GetValor(ItemCat[i], "descripcion");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarItemCat(' + clave + ')"></button></td>' +
                 '<td><label class="clave">' + clave + '</label></td>' +
                '<td><label class="descripcion">' + descripcion + '</label></td>' 
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarCatalogo() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar){
            crearNuevo();
        } else {
            GuardarEdicioNCatalogo();
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
}

function CargarDatosItemCat(cve_ItemCat) {
    $.post(urlBase_WS + "NTipocatalogo.aspx", { seccion: "Tipocatalogo", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipocatalogo: cve_ItemCat
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_tipocatalogo", "clave");
        SetValor(ItemCat, "descripcion", "descripcion");
    });
}

function GuardarEdicioNCatalogo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NTipocatalogo.aspx", "op=Editar&seccion=Tipocatalogo&" + parametros).done(function (xmlDoc) {
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

function CancelarCatalogo() {
    MostrarCatalogo();
}