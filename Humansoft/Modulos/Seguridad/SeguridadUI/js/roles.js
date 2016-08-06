function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";

    cargarCatalogoRoles(1);
    LlenarCatalogoModulos(document.getElementById("selectModulos"));

}

function MostrarSiguienteClave(cve_modulo) {
    $.post(urlBase_WS + "NRoles.aspx", { seccion: "Roles", op: "obtenerSiguienteClave",cve_modulo:cve_modulo }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
}


function crearNuevoRole() {
    var frmNuevoRole = document.getElementById("frmNuevoRoles");
    var parametros = $(frmNuevoRole).serialize();
    $.post(urlBase_WS + "NRoles.aspx", "op=Nuevo&seccion=Roles&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoRoles(1);
            document.getElementById("frmNuevoRoles").reset();
            MostrarCatalogo();
        });
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoRoles(1, criterio);
}

function MostrarNuevoRole() {
    var frmRole = document.getElementById("frmNuevoRoles");
    frmRole.esEditar = false;   
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoRoles(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NRoles.aspx", { seccion: "Roles", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_role: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var roles = xmlDoc.getElementsByTagName("Table");
        var listaRoles = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaRoles).html("");
        var totalregistros;
        for (var i = 0; i < roles.length; i++) {
            var cveRole = GetValor(roles[i], "cve_role");
            var nombre = GetValor(roles[i], "nombrerole");
            var nombreModulo = GetValor(roles[i], "nombremodulo");
            var estatus = GetValor(roles[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(roles[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarRole(' + cveRole + ',' + GetValor(roles[i], "cve_modulo") + ')"></button></td>' +
                '<td><label class="clave">' + cveRole + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="nombre">' + nombreModulo + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' +
                '<td><button class="eliminar" onclick="DesactivarRole(' + cveRole + ')"></button> </td>'
            );
            listaRoles.appendChild(itemLista);

        }

        paginarTabla(pagina, totalregistros, cargarCatalogoRoles);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();


    });
    
}


function GuardarRole() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmRole = document.getElementById("frmNuevoRoles");
        if (!frmRole.esEditar) {
            crearNuevoRole();
        } else {
            GuardarEdicionRole();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarRole(cve_role, cve_modulo) {
    var frmRole = document.getElementById("frmNuevoRoles");
    frmRole.esEditar = true;
    MostrarFormulario();
    CargarDatosRole(cve_role, cve_modulo);

    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosRole(cve_role, cve_modulo) {
    $.post(urlBase_WS + "NRoles.aspx", { seccion: "Roles", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_role: cve_role, cve_modulo: cve_modulo
    }).done(function (xmlDoc) {
        var roles = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(roles, "cve_role", "clave");
        SetValor(roles, "nombrerole", "nombrerole");
        SetValor(roles, "cve_modulo", "selectModulos");
        SetValor(roles, "activo", "estatus", "bool");
    });
}

function GuardarEdicionRole() {
    var frmNuevoRole = document.getElementById("frmNuevoRoles");
    var parametros = $(frmNuevoRole).serialize();
    $.post(urlBase_WS + "NRoles.aspx", "op=Editar&seccion=Roles&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoRoles();
            document.getElementById("frmNuevoRoles").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarRole(cve_role) {
    $.post(urlBase_WS + "NRoles.aspx", { op: "CambiarEstatusActivo", cve_role: cve_role, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoRoles();
    })

}

function CancelarRole(){
    MostrarCatalogo();
 }

