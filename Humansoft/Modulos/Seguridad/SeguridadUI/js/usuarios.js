
function iniciar() {
    cargarCatalogoUsuario(1);

}


function crearNuevoUsuario() {
    var frmNuevoUsuario = document.getElementById("frmNuevoUsuario");
    var parametros = $(frmNuevoUsuario).serialize();
    $.post(urlBase_WS + "NUsuarios.aspx", "op=Nuevo&seccion=Usuarios&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoEmpresas(1);
            MostrarCatalogo();
        });
    });
}



function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoUsuario(1, criterio);
}


function MostrarNuevoUsuario() {
    var frmUsuario = document.getElementById("frmNuevoUsuario");
    frmUsuario.esEditar = false;
    $.post(urlBase_WS + "NUsuarios.aspx", { seccion: "Usuarios", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        document.getElementById("clave").setAttribute("value",SetValor(xmlDoc, "clave", "clave"));
        var selectPerfil = document.getElementById("cve_perfil");
        LlenarCatalogoPerfiles(selectPerfil, function () {
                var selectTipoPassword = document.getElementById("cve_tipopassword");
                LlenarCatalogoTipoPassword(selectTipoPassword, function () {
                    var selectSucursales = document.getElementById("cve_sucursal");
                    LlenarCatalogoSucursales(selectSucursales, function () {
                    });
                });
            });
        //document.getElementById("usuario").focus();
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = true;
        MostrarFormulario();
    });
}

var ordenador;
function cargarCatalogoUsuario(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NUsuarios.aspx", { seccion: "Usuarios", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_usuario: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var usuarios = xmlDoc.getElementsByTagName("Table");
        var listaUsuario = document.getElementById("contenedorLista");
        $(listaUsuario).html("");
        var totalregistros;
        for (var i = 0; i < usuarios.length; i++) {
            var cveUsuario = GetValor(usuarios[i], "cve_usuario");
            var empleado = GetValor(usuarios[i], "num_empleado");
            var nombre = GetValor(usuarios[i], "nombre");
            var perfil = GetValor(usuarios[i], "nombrePerfil");
            var sucursal = GetValor(usuarios[i], "nombreSucursal");
            var cuentabloqueada = GetValor(usuarios[i], "cuentabloqueada","bool", "Si:No");
            var estatus = GetValor(usuarios[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(usuarios[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarUsuario(' + cveUsuario + ')"></button></td>' +
                '<td><label class="empleado">' + empleado + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="perfil">' + perfil + '</label></td>' +
                '<td><label class="sucursal">' + sucursal + '</label></td>' +
                '<td><label class="cuentabloqueada">' + cuentabloqueada + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 

            );
            listaUsuario.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoUsuario, paginador);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });    
}


function GuardarUsuario() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmUsuario = document.getElementById("frmNuevoUsuario");
        if (!frmUsuario.esEditar) {
            crearNuevoUsuario();
        } else {
            GuardarEdicioNUsuarios();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarUsuario(cve_usuario) {
    var frmUsuario = document.getElementById("frmNuevoUsuario");
    frmUsuario.esEditar = true;
    MostrarFormulario();
    var selectPerfil = document.getElementById("cve_perfil");
    LlenarCatalogoPerfiles(selectPerfil, function () {
            var selectTipoPassword = document.getElementById("cve_tipopassword");
            LlenarCatalogoTipoPassword(selectTipoPassword, function () {
                var selectSucursales = document.getElementById("cve_sucursal");
                LlenarCatalogoSucursales(selectSucursales, function () {
                CargarDatosUsuario(cve_usuario);
            });
        });
   
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = false;
    });
}


function CargarDatosUsuario(cve_usuario) {
    $.post(urlBase_WS + "NUsuarios.aspx", { seccion: "Usuarios", op: "obtenerCatalogo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_usuario: cve_usuario
    }).done(function (xmlDoc) {
        var usuarios = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(usuarios, "cve_usuario", "clave");
        SetValor(usuarios, "num_empleado", "empleado");
        SetValor(usuarios, "nombre", "nombre");
        SetValor(usuarios, "usuario", "usuario");
        SetValor(usuarios, "password", "password");
        SetValor(usuarios, "email", "email");
        SetValor(usuarios, "cve_perfil", "cve_perfil");
        SetValor(usuarios, "cve_sucursal", "cve_sucursal");
        SetValor(usuarios, "cve_seguridad", "seguridad");
        SetValor(usuarios, "cuentabloqueada", "cuentabloqueada");
        SetValor(usuarios, "cve_tipopassword", "cve_tipopassword");
        SetValor(usuarios, "periodocambiap", "periodo");
        SetValor(usuarios, "cambiap", "cambiap");
        SetValor(usuarios, "veceslogin", "veceslogin");
        SetValor(usuarios, "activo", "estatus", "bool");
    });
}

function GuardarEdicioNUsuarios() {
    var frmNuevoUsuario= document.getElementById("frmNuevoUsuario");
    var parametros = $(frmNuevoUsuario).serialize();
    $.post(urlBase_WS + "NUsuarios.aspx", "op=Editar&seccion=Usuarios&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoUsuario();
            MostrarCatalogo();
        });
    });
}



function DesactivarUsuario(cve_usuario) {
    $.post(urlBase_WS + "NUsuarios.aspx", { op: "CambiarEstatusActivo", cve_usuario: cve_usuario, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoUsuario();
    });
}

function CancelarUsuario(){
    MostrarCatalogo();
 }

