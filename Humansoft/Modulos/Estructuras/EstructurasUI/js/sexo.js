function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoSexo(1);
}

function crearNuevoSexo() {
    var frmNuevoSexo = document.getElementById("frmNuevoSexo");
    var parametros = $(frmNuevoSexo).serialize();
    $.post(urlBase_WS + "NSexo.aspx", "op=NuevoSexo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoSexo(1);
            document.getElementById("frmNuevoSexo").reset();
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
    cargarCatalogoSexo(1, criterio);
}

function MostrarNuevoSexo() {
    var frmSexo = document.getElementById("frmNuevoSexo");
    frmSexo.reset();
    frmSexo.esEditar = false;
    $.post(urlBase_WS + "NSexo.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "sexo");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoSexo(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NSexo.aspx", { op: "obtenerCatalogoSexo", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_sexo: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var sexo = xmlDoc.getElementsByTagName("Table");
        var listaSexo = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaSexo).html("");
        var totalregistros;
        for (var i = 0; i < sexo.length; i++) {
            var CveSexo = GetValor(sexo[i], "cve_sexo");
            var Descripcion = GetValor(sexo[i], "descripcion");
            var estatus = GetValor(sexo[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(sexo[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarSexo(' + CveSexo + ')"></button></td>' +
                 '<td><label class="sexo">' + CveSexo + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaSexo.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoSexo);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarSexo() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmSexo = document.getElementById("frmNuevoSexo");
        if (!frmSexo.esEditar) {
            crearNuevoSexo();
        } else {
            GuardarEdicionSexo();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarSexo(cve_sexo) {
    var frmSexo = document.getElementById("frmNuevoSexo");
    frmSexo.reset();
    frmSexo.esEditar = true;
    MostrarFormulario();
    CargarDatosSexo(cve_sexo);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosSexo(cve_sexo) {
    $.post(urlBase_WS + "NSexo.aspx", { op: "obtenerCatalogoSexo", pagina: 1, longitudPagina: 5, criterio: "",
        cve_sexo: cve_sexo
    }).done(function (xmlDoc) {
        var sexo = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(sexo, "cve_sexo", "sexo");
        SetValor(sexo, "descripcion", "descripcion");
        SetValor(sexo, "activo", "estatus", "bool");
    });
}

function GuardarEdicionSexo() {
    var frmNuevoSexo = document.getElementById("frmNuevoSexo");
    var parametros = $(frmNuevoSexo).serialize();
    $.post(urlBase_WS + "NSexo.aspx", "op=EditarSexo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoSexo();
            document.getElementById("frmNuevoSexo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarSexo(cve_sexo) {
    $.post(urlBase_WS + "NSexo.aspx", { op: "CambiarEstatusActivo", cve_sexo: cve_sexo, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoSexo();
    })
}

function CancelarSexo(){
    MostrarCatalogo();
 }