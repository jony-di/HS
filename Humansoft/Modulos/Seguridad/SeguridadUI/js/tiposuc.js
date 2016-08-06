function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";

    cargarCatalogoTipoSuc(1);

}


function crearNuevoTipoSuc() {
    var frmNuevoTipo = document.getElementById("frmNuevoTipoSuc");
    var parametros = $(frmNuevoTipo).serialize();
    $.post(urlBase_WS + "NTipoSuc.aspx", "op=Nuevo&seccion=TipoSuc&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoTipoSuc(1);
            document.getElementById("frmNuevoTipoSuc").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoTipoSuc(1, criterio);
}

function MostrarNuevoTipoSuc() {
    var frmTipo = document.getElementById("frmNuevoTipoSuc");
    frmTipo.esEditar = false;
    $.post(urlBase_WS + "NTipoSuc.aspx", { seccion: "TipoSuc", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoTipoSuc(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipoSuc.aspx", { seccion: "TipoSuc", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipo: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var tipo = xmlDoc.getElementsByTagName("Table");
        var listaTipoSuc = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTipoSuc).html("");
        var totalregistros;
        for (var i = 0; i < tipo.length; i++) {
            var cveTipo = GetValor(tipo[i], "cve_tipo");
            var nombre = GetValor(tipo[i], "nombre");
            var estatus = GetValor(tipo[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tipo[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTipoSuc(' + cveTipo + ')"></button></td>' +
                '<td><label class="clave">' + cveTipo + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaTipoSuc.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoTipoSuc);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarTipoSuc() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTipo = document.getElementById("frmNuevoTipoSuc");
        if (!frmTipo.esEditar) {
            crearNuevoTipoSuc();
        } else {
            GuardarEdicionTipoSuc();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTipoSuc(cve_tipo) {
    var frmTipo = document.getElementById("frmNuevoTipoSuc");
    frmTipo.esEditar = true;
    MostrarFormulario();
    CargarDatosTipoSuc(cve_tipo);

    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosTipoSuc(cve_tipo) {
    $.post(urlBase_WS + "NTipoSuc.aspx", { seccion: "TipoSuc", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipo: cve_tipo
    }).done(function (xmlDoc) {
        var tipo = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tipo, "cve_tipo", "clave");
        SetValor(tipo, "nombre", "nombre");
        SetValor(tipo, "activo", "estatus", "bool");
    });
}

function GuardarEdicionTipoSuc() {
    var frmNuevoTipoSuc = document.getElementById("frmNuevoTipoSuc");
    var parametros = $(frmNuevoTipoSuc).serialize();
    $.post(urlBase_WS + "NTipoSuc.aspx", "op=Editar&seccion=TipoSuc&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoTipoSuc(1);
            document.getElementById("frmNuevoTipoSuc").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarTipoSuc(cve_tipo) {
    $.post(urlBase_WS + "NTipoSuc.aspx", { op: "CambiarEstatusActivo", cve_region: cve_region, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTipoSuc();
    })

}

function CancelarTipoSuc(){
    MostrarCatalogo();
 }

