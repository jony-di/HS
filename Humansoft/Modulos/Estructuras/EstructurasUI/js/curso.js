function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoCurso(1);
}

function crearNuevoCurso() {
    var frmNuevoCurso = document.getElementById("frmNuevoCurso");
    var parametros = $(frmNuevoCurso).serialize();
    $.post(urlBase_WS + "NCurso.aspx", "op=NuevoCurso&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoCurso(1);
            document.getElementById("frmNuevoCurso").reset();
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
    cargarCatalogoCurso(1, criterio);
}

function MostrarNuevoCurso() {
    var frmCurso = document.getElementById("frmNuevoCurso");
    frmCurso.reset();
    frmCurso.esEditar = false;
    $.post(urlBase_WS + "NCurso.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoCurso(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NCurso.aspx", { op: "obtenerCatalogoCurso", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), clave_curso: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var curso = xmlDoc.getElementsByTagName("Table");
        var listaCurso = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaCurso).html("");
        var totalregistros;
        for (var i = 0; i < curso.length; i++) {
            var Clave_Curso = GetValor(curso[i], "clave_curso");
            var nombre = GetValor(curso[i], "nombre_curso");
            var descripcion = GetValor(curso[i], "descripcion");
            var dias = GetValor(curso[i], "dias");
            var horas = GetValor(curso[i], "horas");
            var estatus = GetValor(curso[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(curso[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarCurso(' + Clave_Curso + ')"></button></td>' +
                '<td><label class="clave">' + Clave_Curso + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="descripcion">' + descripcion + '</label></td>' +
                '<td><label class="dias">' + dias + '</label> </td>' +
                '<td><label class="horas">' + horas + '</label> </td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaCurso.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoCurso);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarCurso() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmCurso = document.getElementById("frmNuevoCurso");
        if (!frmCurso.esEditar) {
            crearNuevoCurso();
        } else {
            GuardarEdicionCurso();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarCurso(ID_Empleado) {
    var frmCurso = document.getElementById("frmNuevoCurso");
    frmCurso.reset();
    frmCurso.esEditar = true;
    MostrarFormulario();
    CargarDatosCurso(ID_Empleado);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosCurso(ID_Empleado) {
    $.post(urlBase_WS + "NCurso.aspx", { op: "obtenerCatalogoCurso", pagina: 1, longitudPagina: 5, criterio: "",
        clave_curso: ID_Empleado
    }).done(function (xmlDoc) {
        var curso = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(curso, "clave_curso", "clave");
        SetValor(curso, "cvecurso_emp", "cursoemp");
        SetValor(curso, "nombre_curso", "nombre");
        SetValor(curso, "descripcion", "descripcion");
        SetValor(curso, "dias", "dias");
        SetValor(curso, "todospuesto", "todospuesto","bool");
        SetValor(curso, "horas", "horas");
        SetValor(curso, "tipo_curso", "tipocurso");
        SetValor(curso, "frecuencia", "frecuencia");
        SetValor(curso, "activo", "estatus", "bool");
    });
}

function GuardarEdicionCurso() {
    var frmNuevoCurso = document.getElementById("frmNuevoCurso");
    var parametros = $(frmNuevoCurso).serialize();
    $.post(urlBase_WS + "NCurso.aspx", "op=EditarCurso&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoCurso();
            document.getElementById("frmNuevoCurso").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarCurso(ID_Empleado) {
    $.post(urlBase_WS + "NCurso.aspx", { op: "CambiarEstatusActivo", clave_curso: clave_curso, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoCurso();
    })
}

function CancelarCurso(){
    MostrarCatalogo();
 }