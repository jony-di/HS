function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoPerfiles(1);
    try { ObtenerRadBtn_TiposEstructura("fs_tiposEstructura"); } catch (e) { alert(e.message); }
    ObtenerMenusPerfil("arbolMenus", 0, true);
    $("#tabsPerfiles").tabs();

}

function MostrarconfigurarPerfil() {
    //IntercambioVisual("configuracionPerfil", "edicionPerfil");
    var cve_perfil = document.getElementById("clave").value;
    if (cve_perfil.toString().length > 0) {
        var divprincipal = document.getElementById("principal");
        verConfiguracionPerfil(cve_perfil);
        $(divprincipal).animate({ left: "-1800px" }, 1000, function () { });        
    }
}

function crearNuevoPerfil() {
    var frmNuevoPerfil = document.getElementById("frmNuevoPerfiles");
    var parametros = $(frmNuevoPerfil).serialize();
    $.post(urlBase_WS + "NPerfiles.aspx", "op=NuevoPerfil&" + parametros).done(function (xmlDoc) {        
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoPerfiles(1);
            document.getElementById("frmNuevoPerfiles").reset();
            MostrarCatalogo();        
        });
    });


}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoPerfiles(1, criterio);
}

function MostrarNuevoPerfil() {
    var frmPerfil = document.getElementById("frmNuevoPerfiles");
    frmPerfil.esEditar = false;
    document.getElementById("btnConfigurar").innerHTML = '';
    $.post(urlBase_WS + "NPerfiles.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoPerfiles(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPerfiles.aspx", { op: "obtenerCatalogoPerfiles", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_perfil: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var perfiles = xmlDoc.getElementsByTagName("Table");
        var listaPerfiles = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPerfiles).html("");
        var totalregistros;
        for (var i = 0; i < perfiles.length; i++) {
            var cvePerfil = GetValor(perfiles[i], "cve_perfil");
            var nombre = GetValor(perfiles[i], "nombre");
            var puedevertodo = GetValor(perfiles[i], "puedevertodo", "bool", "Si:No");
            var estatus = GetValor(perfiles[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(perfiles[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPerfil(' + cvePerfil + ')"></button></td>' +
                '<td><label class="clave">' + cvePerfil + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="estatus">' + puedevertodo + '</label> </td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' +
                '<td><button class="eliminar" onclick="DesactivarPerfil(' + cvePerfil + ')"></button> </td>'
            );
            listaPerfiles.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoPerfiles);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarPerfil() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPerfil = document.getElementById("frmNuevoPerfiles");
        if (!frmPerfil.esEditar) {
            crearNuevoPerfil();
        } else {
            GuardarEdicionPerfil();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPerfil(cve_perfil) {
    var frmPerfil = document.getElementById("frmNuevoPerfiles");
    frmPerfil.esEditar = true;
    document.getElementById("btnConfigurar").innerHTML = '<button class="configurar btnFormularios" onclick="MostrarconfigurarPerfil()">Configurar</button>';
    MostrarFormulario();
    CargarDatosPerfil(cve_perfil);

    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false; 
}

function CargarDatosPerfil(cve_perfil) {
    $.post(urlBase_WS + "NPerfiles.aspx", { op: "obtenerCatalogoPerfiles", pagina: 1, longitudPagina: 5, criterio: "",
        cve_perfil: cve_perfil
    }).done(function (xmlDoc) {
        var perfiles = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(perfiles, "cve_perfil", "clave");
        SetValor(perfiles, "nombre", "nombre");
        SetValor(perfiles, "puedevertodo", "puedevertodo", "bool");
        SetValor(perfiles, "activo", "estatus", "bool");
        var tiposAcceso = document.getElementById("fs_tiposEstructura").getElementsByTagName("input");
        for (var i = 0; i < tiposAcceso.length; i++) {
            if (tiposAcceso[i].getAttribute("value") == GetValor(perfiles, "cve_tipoestructura")) {
                tiposAcceso[i].checked = true;
            } else {
                tiposAcceso[i].checked = false;
            }
        }
    });
}

function GuardarEdicionPerfil() {
    var frmNuevoPerfil= document.getElementById("frmNuevoPerfiles");
    var parametros = $(frmNuevoPerfil).serialize();
    $.post(urlBase_WS + "NPerfiles.aspx", "op=EditarPerfil&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoPerfiles(1);
            document.getElementById("frmNuevoPerfiles").reset();
            MostrarCatalogo();
        });        
    });
}



function DesactivarPerfil(cve_perfil) {
    $.post(urlBase_WS + "NPerfiles.aspx", { op: "CambiarEstatusActivo", cve_perfil: cve_perfil, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPerfiles();
    })

}

function CancelarPerfil() {
    var divprincipal = document.getElementById("principal");
    $(divprincipal).animate({ left: "-900px" }, 500, function () { });
 }

