function iniciar(id_empleado) {
    cargarCatalogoTelefonoEmpl(id_empleado,1);
}

function crearNuevaTelefonoEmpl() {
    var frmNuevaTelefonoEmpl = document.getElementById("frmNuevaTelefonoEmpl");
    var parametros = $(frmNuevaTelefonoEmpl).serialize();
    $.post(urlBase_WS + "NTelefonoEmpl.aspx", "op=NuevaTelefonoEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            var empleado = document.getElementById("empleado").innerHTML;
            cargarCatalogoTelefonoEmpl(empleado, 1);
            document.getElementById("frmNuevaTelefonoEmpl").reset();
            MostrarCatalogo("frmNuevaTelefonoEmpl");
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoTelefonoEmpl(1, criterio);
}

function MostrarNuevaTelefonoEmpl() {
    var frmTelefonoEmpl = document.getElementById("frmNuevaTelefonoEmpl");
    frmTelefonoEmpl.reset();
    frmTelefonoEmpl.esEditar = false;
    $.post(urlBase_WS + "NTelefonoEmpl.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        document.getElementById("empleado").setAttribute("value", document.getElementById("idEmpleado").innerHTML);
        document.getElementById("telefonoempl").setAttribute("value", SetValor(xmlDoc, "clave", "telefonoempl"));
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = true;
        MostrarFormulario("frmNuevaTelefonoEmpl");
    });
}

var ordenador;
function cargarCatalogoTelefonoEmpl(id_empleado, pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTelefonoEmpl.aspx", { op: "obtenerCatalogoTelefonoEmpl", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_telefono: 0, id_empleado: id_empleado }).done(function (xmlDoc) {
        QuitarEspera();
        var telefonoempl = xmlDoc.getElementsByTagName("Table");
        var listaEmpleado = document.getElementById("contenedorLista");
        $(listaEmpleado).html("");
        var totalregistros;
        for (var i = 0; i < telefonoempl.length; i++) {
            var cveTelefono = GetValor(telefonoempl[i], "cve_telefono");
            var cveEmpleado = GetValor(telefonoempl[i], "id_empleado");
            var area = GetValor(telefonoempl[i], "area");
            var ntelefono = GetValor(telefonoempl[i], "no_telefono");
            var tipollamada = GetValor(telefonoempl[i], "tipollamada_id");
            var estatus = GetValor(telefonoempl[i], "activo", "bool", "Activo:Baja");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(telefonoempl[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarTelefonoEmpl(' + cveTelefono + ')"></button></td>' +
                '<td><label class="telefonoempl">' + cveTelefono + '</label></td>' +
                '<td><label class="empleado">' + cveEmpleado + '</label></td>' +
                '<td><label class="area">' + area + '</label></td>' +
                '<td><label class="ntelefono">' + ntelefono + '</label></td>' +
                '<td><label class="tipollamada">' + tipollamada + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaEmpleado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoTelefonoEmpl, paginador);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTelefonoEmpl() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTelefonoEmpl = document.getElementById("frmNuevaTelefonoEmpl");
        if (!frmTelefonoEmpl.esEditar) {
            crearNuevaTelefonoEmpl();
        } else {
            GuardarEdicioNTelefonoEmpl();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarTelefonoEmpl(cve_telefono) {
    var frmTelefonoEmpl = document.getElementById("frmNuevaTelefonoEmpl");
    frmTelefonoEmpl.reset();
    frmTelefonoEmpl.esEditar = true;
    MostrarFormulario("frmNuevaTelefonoEmpl")
    CargarDatosTelefono(cve_telefono); 
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}


function CargarDatosTelefono(cve_telefono) {
    $.post(urlBase_WS + "NTelefonoEmpl.aspx", { op: "obtenerCatalogoTelefonoEmpl", pagina: 1, longitudPagina: 5, criterio: "",
        cve_telefono: cve_telefono, id_empleado: document.getElementById("idEmpleado").innerHTML 
    }).done(function (xmlDoc) {
        var telefonoempl = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(telefonoempl, "cve_telefono", "telefonoempl");
        SetValor(telefonoempl, "id_empleado", "empleado");
        SetValor(telefonoempl, "area", "area");
        SetValor(telefonoempl, "no_telefono", "ntelefono");
        SetValor(telefonoempl, "fecha", "fecha");
        SetValor(telefonoempl, "tipored", "tipored");
        SetValor(telefonoempl, "tipollamada_id", "tipollamada");
        SetValor(telefonoempl, "extension", "extension");
        SetValor(telefonoempl, "activo", "estatus", "bool");
    });
}

function GuardarEdicioNTelefonoEmpl() {
    var frmTelefonoEmpl = document.getElementById("frmNuevaTelefonoEmpl");
    var parametros = $(frmTelefonoEmpl).serialize();
    $.post(urlBase_WS + "NTelefonoEmpl.aspx", "op=EditarTelefonoEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            var empleado = document.getElementById("empleado").innerHTML;
            cargarCatalogoTelefonoEmpl(empleado, 1);
            document.getElementById("frmNuevaTelefonoEmpl").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarTelefonoEmpl(cve_telefono) {
    $.post(urlBase_WS + "NTelefonoEmpl.aspx", { op: "CambiarEstatusActivo", cve_telefono: cve_telefono, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTelefonoEmpl();
    });
}

function CancelarTelefonoEmpl(){
    MostrarCatalogo();
 }