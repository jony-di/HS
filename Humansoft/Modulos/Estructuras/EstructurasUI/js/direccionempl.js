function iniciar(id_empleado) {   
    cargarCatalogoDireccionEmpl(id_empleado,1);
}

function crearNuevaDireccionEmpl() {
    var frmNuevaDireccionEmpl = document.getElementById("frmNuevaDireccionEmpl");
    var parametros = $(frmNuevaDireccionEmpl).serialize();
    $.post(urlBase_WS + "NDireccionEmpl.aspx", "op=NuevaDireccionEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDireccionEmpl(undefined, 1);
            document.getElementById("frmNuevaDireccionEmpl").reset();
            MostrarCatalogo("frmNuevaDireccionEmpl");
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoDireccionEmpl(1, criterio);
}

function MostrarNuevaDireccionEmpl() {
    var frmDireccionEmpl = document.getElementById("frmNuevaDireccionEmpl");
    frmDireccionEmpl.reset();
    frmDireccionEmpl.esEditar = false;
    $.post(urlBase_WS + "NDireccionEmpl.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        document.getElementById("direccion").setAttribute("value", SetValor(xmlDoc, "clave", "direccion"));
        var selectEstados = document.getElementById("estado");
        LlenarCatalogoEstados(selectEstados, function () {
            var selectPais = document.getElementById("pais");
            LlenarCatalogoPaises(selectPais, function () {
                var selectMunicipio = document.getElementById("municipio");
                LlenarCatalogoMunicipio(selectMunicipio, function () {
                    document.getElementById("empleado").value = document.getElementById("idEmpleado").innerHTML;
                });
            });
        });
        //document.getElementById("empleado").focus();
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = true;
        MostrarFormulario("frmNuevaDireccionEmpl");
    });
}

var ordenador;
function cargarCatalogoDireccionEmpl(id_empleado, pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NDireccionEmpl.aspx", { op: "obtenerCatalogoDireccionEmpl", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_direccionempl: 0, id_empleado: id_empleado }).done(function (xmlDoc) {
        QuitarEspera();
        var direccionempl = xmlDoc.getElementsByTagName("Table");
        var listaEmpleado = document.getElementById("contenedorLista");
        $(listaEmpleado).html("");
        var totalregistros;
        for (var i = 0; i < direccionempl.length; i++) {
            var cveDireccion = GetValor(direccionempl[i], "cve_direccionempl");
            var cveEmpleado = GetValor(direccionempl[i], "id_empleado");
            var calle = GetValor(direccionempl[i], "calle");
            var colonia = GetValor(direccionempl[i], "colonia");
            var ciudad = GetValor(direccionempl[i], "ciudad");
            var cp = GetValor(direccionempl[i], "cp");
            var estatus = GetValor(direccionempl[i], "activo", "bool", "Activo:Baja");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(direccionempl[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarDireccionEmpl(' + cveDireccion + ')"></button></td>' +
                '<td><label class="empleado">' + cveEmpleado + '</label></td>' +
                '<td><label class="calle">' + calle + '</label></td>' +
                '<td><label class="colonia">' + colonia + '</label></td>' +
                '<td><label class="ciudad">' + ciudad + '</label></td>' +
                '<td><label class="cp">' + cp + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>'
            );
            listaEmpleado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoDireccionEmpl, paginador);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });    
}

function GuardarDireccionEmpl() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmDireccionEmpl = document.getElementById("frmNuevaDireccionEmpl");
        if (!frmDireccionEmpl.esEditar) {
            crearNuevaDireccionEmpl();
        } else {
            GuardarEdicioNDireccionEmpl();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarDireccionEmpl(cve_direccionempl) {
    var frmDireccionEmpl = document.getElementById("frmNuevaDireccionEmpl");
    frmDireccionEmpl.reset();
    frmDireccionEmpl.esEditar = true;
    MostrarFormulario("frmNuevaDireccionEmpl");
            var selectEstados = document.getElementById("estado");
            LlenarCatalogoEstados(selectEstados, function () {
                var selectPais = document.getElementById("pais");
                LlenarCatalogoPaises(selectPais, function () {
                    var selectMunicipio = document.getElementById("municipio");
                    LlenarCatalogoMunicipio(selectMunicipio, function () {
                        CargarDatosEmpleado(cve_direccionempl); 
                    });
                });
            });
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = false;
}

function CargarDatosEmpleado(cve_direccionempl) {
    $.post(urlBase_WS + "NDireccionEmpl.aspx", { op: "obtenerCatalogoDireccionEmpl", pagina: 1, longitudPagina: 5, criterio: "",
        cve_direccionempl: cve_direccionempl, id_empleado: document.getElementById("idEmpleado").innerHTML 
    }).done(function (xmlDoc) {
        var direccionempl = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(direccionempl, "cve_direccionempl", "direccion");
        SetValor(direccionempl, "id_empleado", "empleado");
        SetValor(direccionempl, "calle", "calle");
        SetValor(direccionempl, "colonia", "colonia");
        SetValor(direccionempl, "cve_municipio", "municipio");
        SetValor(direccionempl, "ciudad", "ciudad");
        SetValor(direccionempl, "cveestado", "estado");
        SetValor(direccionempl, "cvepais", "pais");
        SetValor(direccionempl, "cp", "cp");
        SetValor(direccionempl, "activo", "estatus", "bool");
    });
}

function GuardarEdicioNDireccionEmpl() {
    var frmDireccionEmpl = document.getElementById("frmNuevaDireccionEmpl");
    var parametros = $(frmDireccionEmpl).serialize();
    $.post(urlBase_WS + "NDireccionEmpl.aspx", "op=EditarDireccionEmpl&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoDireccionEmpl();
            document.getElementById("frmNuevaDireccionEmpl").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarDireccionEmpl(cve_direccionempl) {
    $.post(urlBase_WS + "NDireccionEmpl.aspx", { op: "CambiarEstatusActivo", cve_direccionempl: cve_direccionempl, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoDireccionEmpl();
    });
}

function CancelarDireccionEmpl(){
    MostrarCatalogo();
 }