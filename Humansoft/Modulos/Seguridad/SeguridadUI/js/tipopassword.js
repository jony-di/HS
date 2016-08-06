function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoTipoPassword(1);

}


function crearNuevoTipoPassword() {
    var frmNuevoTipoPassword = document.getElementById("frmNuevoTipoPassword");
    var parametros = $(frmNuevoTipoPassword).serialize();
    $.post(urlBase_WS + "NTipoPassword.aspx", "op=Nuevo&seccion=TipoPassword&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoTipoPassword(1);
            document.getElementById("frmNuevoTipoPassword").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoTipoPassword(1, criterio);
}

function MostrarNuevoTipoPassword() {
    var frmTipoPassword = document.getElementById("frmNuevoTipoPassword");
    frmTipoPassword.esEditar = false;
    $.post(urlBase_WS + "NTipoPassword.aspx", { seccion: "TipoPassword", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "cve_tipopassword");
    });
    //document.getElementById("nombre").focus();
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoTipoPassword(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTipoPassword.aspx", { seccion: "TipoPassword", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_tipopassword: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var tipopassword = xmlDoc.getElementsByTagName("Table");
        var listaTiposPassword = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaTiposPassword).html("");
        var totalregistros;
        for (var i = 0; i < tipopassword.length; i++) {
            var cveTipopassword = GetValor(tipopassword[i], "cve_tipopassword");
            var descripcion = GetValor(tipopassword[i], "descripcion");
            var nombre = GetValor(tipopassword[i], "nombre");
            var validaanterior = GetValor(tipopassword[i], "validaanterior", "bool", "Si:No");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(tipopassword[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTipoPassword(' + cveTipopassword + ')"></button></td>' +
                '<td><label class="clave">' + cveTipopassword + '</label></td>' +
                '<td><label class="descripcion">' + descripcion + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="validaanterior">' + validaanterior + '</label> </td>' 
            );
            listaTiposPassword.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoTipoPassword);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarTipoPassword() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTipoPassword = document.getElementById("frmNuevoTipoPassword");
        if (!frmTipoPassword.esEditar) {
            crearNuevoTipoPassword();
        } else {
            GuardarEdicionTipoPassword();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTipoPassword(cve_tipopassword) {
    var frmTipoPassword = document.getElementById("frmNuevoTipoPassword");
    frmTipoPassword.esEditar = true;
    MostrarFormulario();
    CargarDatosTipoPassword(cve_tipopassword);
}

function CargarDatosTipoPassword(cve_tipopassword) {
    $.post(urlBase_WS + "NTipoPassword.aspx", { seccion: "TipoPassword", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_tipopassword: cve_tipopassword
    }).done(function (xmlDoc) {
        var tipospassword = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(tipospassword, "cve_tipopassword", "cve_tipopassword");
        SetValor(tipospassword, "descripcion", "descripcion");
        SetValor(tipospassword, "nombre", "nombre");
        SetValor(tipospassword, "validaanterior", "validaanterior", "bool");
    });
}

function GuardarEdicionTipoPassword() {
    var frmNuevoTipoPassword = document.getElementById("frmNuevoTipoPassword");
    var parametros = $(frmNuevoTipoPassword).serialize();
    $.post(urlBase_WS + "NTipoPassword.aspx", "op=Editar&seccion=TipoPassword&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoTipoPassword();
            document.getElementById("frmNuevoTipoPassword").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarTipoPassword(cve_tipopassword) {
    $.post(urlBase_WS + "NTipoPassword.aspx", { op: "CambiarEstatusActivo", cve_tipopassword: cve_tipopassword, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTipoPassword();
    })

}

function CancelarTipoPassword(){
    MostrarCatalogo();
 }

