        function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoBanco(1);
}

function crearNuevoBanco() {
    var frmNuevoBanco = document.getElementById("frmNuevoBanco");
    var parametros = $(frmNuevoBanco).serialize();
    $.post(urlBase_WS + "NBanco.aspx", "op=NuevoBanco&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoBanco(1);
            document.getElementById("frmNuevoBanco").reset();
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
    cargarCatalogoBanco(1, criterio);
}

function MostrarNuevoBanco() {
    var frmBanco = document.getElementById("frmNuevoBanco");
    frmBanco.reset();
    frmBanco.esEditar = false;
    $.post(urlBase_WS + "NBanco.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
       SetValor(xmlDoc, "clave", "clave");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoBanco(pagina, criterio){
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NBanco.aspx", { op: "obtenerCatalogoBanco", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_banco: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var banco = xmlDoc.getElementsByTagName("Table");
        var listaBanco = document.getElementById("contenedorLista");
        $(listaBanco).html("");
        var totalregistros;
        for (var i = 0; i < banco.length; i++) {
            var cveBanco = GetValor(banco[i], "cve_banco");
            var Nombre = GetValor(banco[i], "nombre");
            var estatus = GetValor(banco[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(banco[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarBanco(' + cveBanco + ')"></button></td>' +
                '<td><label class="clave">' + cveBanco + '</label></td>' +
                '<td><label class="nombre">' + Nombre + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaBanco.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoBanco);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarBanco() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmBanco = document.getElementById("frmNuevoBanco");
        if (!frmBanco.esEditar) {
            crearNuevoBanco();
        } else {
            GuardarEdicionBanco();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarBanco(cve_banco) {
    var frmBanco = document.getElementById("frmNuevoBanco");
    frmBanco.reset();
    frmBanco.esEditar = true;
    MostrarFormulario();
    CargarDatosBanco(cve_banco);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosBanco(cve_banco) {
    $.post(urlBase_WS + "NBanco.aspx", { op: "obtenerCatalogoBanco", pagina: 1, longitudPagina: 5, criterio: "",
        cve_banco: cve_banco
    }).done(function (xmlDoc) {
        var banco = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(banco, "cve_banco", "clave");
        SetValor(banco, "nombre", "nombre");
        SetValor(banco, "activo", "estatus", "bool");
    });
}

function GuardarEdicionBanco() {
    var frmNuevoBanco = document.getElementById("frmNuevoBanco");
    var parametros = $(frmNuevoBanco).serialize();
    $.post(urlBase_WS + "NBanco.aspx", "op=EditarBanco&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoBanco();
            document.getElementById("frmNuevoBanco").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarBanco(cve_banco) {
    $.post(urlBase_WS + "NBanco.aspx", { op: "CambiarEstatusActivo", cve_banco: cve_banco, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoBanco();
    })
}

function CancelarBanco(){
    MostrarCatalogo();
 }