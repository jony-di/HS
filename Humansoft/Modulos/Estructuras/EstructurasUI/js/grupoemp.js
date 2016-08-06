function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoGrupoEmp(1);
}

function crearNuevoGrupoEmp() {
    var frmNuevoGrupoEmp = document.getElementById("frmNuevoGrupoEmp");
    var parametros = $(frmNuevoGrupoEmp).serialize();
    $.post(urlBase_WS + "NGrupoEmp.aspx", "op=NuevoGrupoEmp&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoGrupoEmp(1);
            document.getElementById("frmNuevoGrupoEmp").reset();
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
    cargarCatalogoGrupoEmp(1, criterio);
}

function MostrarNuevoGrupoEmp() {
    var frmGrupoEmp = document.getElementById("frmNuevoGrupoEmp");
    frmGrupoEmp.reset();
    frmGrupoEmp.esEditar = false;
    $.post(urlBase_WS + "NGrupoEmp.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "grupoemp");
    });
    //document.getElementById("nombre").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoGrupoEmp(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NGrupoEmp.aspx", { op: "obtenerCatalogoGrupoEmp", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_grupoemp: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var grupoemp = xmlDoc.getElementsByTagName("Table");
        var listaGrupoEmp = document.getElementById("contenedorLista");
        $(listaGrupoEmp).html("");
        var totalregistros;
        for (var i = 0; i < grupoemp.length; i++) {
            var CveGrupoEmp = GetValor(grupoemp[i], "cve_grupoempl");
            var Descripcion = GetValor(grupoemp[i], "descripcion");
            var estatus = GetValor(grupoemp[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(grupoemp[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarGrupoEmp(' + CveGrupoEmp + ')"></button></td>' +
                 '<td><label class="grupoemp">' + CveGrupoEmp + '</label></td>' +
                '<td><label class="descripcion">' + Descripcion + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaGrupoEmp.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoGrupoEmp);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarGrupoEmp() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmGrupoEmp = document.getElementById("frmNuevoGrupoEmp");
        if (!frmGrupoEmp.esEditar) {
            crearNuevoGrupoEmp();
        } else {
            GuardarEdicionGrupoEmp();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarGrupoEmp(cve_grupoemp) {
    var frmGrupoEmp = document.getElementById("frmNuevoGrupoEmp");
    frmGrupoEmp.reset();
    frmGrupoEmp.esEditar = true;
    MostrarFormulario();
    CargarDatosGrupoEmp(cve_grupoemp);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosGrupoEmp(cve_grupoemp) {
    $.post(urlBase_WS + "NGrupoEmp.aspx", { op: "obtenerCatalogoGrupoEmp", pagina: 1, longitudPagina: 5, criterio: "",cve_grupoemp: cve_grupoemp}).done(function (xmlDoc) {
        var grupoemp = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(grupoemp, "cve_grupoempl", "grupoemp");
        SetValor(grupoemp, "descripcion", "descripcion");
        SetValor(grupoemp, "activo", "estatus", "bool");
    });
}

function GuardarEdicionGrupoEmp() {
    var frmNuevoGrupoEmp = document.getElementById("frmNuevoGrupoEmp");
    var parametros = $(frmNuevoGrupoEmp).serialize();
    $.post(urlBase_WS + "NGrupoEmp.aspx", "op=EditarGrupoEmp&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoGrupoEmp();
            document.getElementById("frmNuevoGrupoEmp").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarGrupoEmp(cve_departamento) {
    $.post(urlBase_WS + "NGrupoEmp.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoGrupoEmp();
    })
}

function CancelarGrupoEmp(){
    MostrarCatalogo();
 }