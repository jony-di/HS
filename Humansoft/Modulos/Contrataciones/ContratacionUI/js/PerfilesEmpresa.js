var ordenador;

function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
    LlenarSelect("/Modulos/Seguridad/SeguridadNegocio/NEmpresas.aspx?seccion=Empresas&op=obtenerCatalogo&pagina=1&longitudPagina=1000", "empresa", "--Seleccione Empresal--", "cve_empresa", "nombre");
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function cargarCatalogoItemCat(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    pagina = pagina || paginador.paginaActual || 1;
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "perfiles", op: "obtenerPerfilesEmpresa", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : "") }).done(function (xmlDoc) {
        
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var plantilla = GetValor(ItemCat[i], "cve_Perfil");
            var Puesto = GetValor(ItemCat[i], "Nombre_Perfil");
            var Empresa = GetValor(ItemCat[i], "Nombre_Empresa");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPerfil(' + plantilla + ')"></button></td>' +
                 '<td><label class="Puesto">' + Puesto + '</label></td>' +
                '<td><label class="Empresa">' + Empresa + '</label></td>' +
                '<td><label class="seleccionar"><img style="width:30px;" title="Perfil" onclick="VerPerfil(' + plantilla + ')" src="/Recursos/imagenes/perfil.png"/>' +
                '<img class="seleccionar" onclick="editarPlantilla(' + plantilla + ',this)" src="/Recursos/imagenes/select.png"/></label></td>'

            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
    QuitarEspera();
}

function MostrarNuevo() {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = false;
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "perfiles", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
    });
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NPerfiles.aspx", "seccion=perfiles&op=nuevo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoItemCat(1);
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function Guardar() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar) {
            crearNuevo();
        } else {
            GuardarEdicionPerfil();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarPerfil(Perfil) {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmPerfil = document.getElementById("frmNuevo");
    frmPerfil.esEditar = true;
    MostrarFormulario();
    CargarDatosPerfil(Perfil);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosPerfil(Perfil) {
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "perfiles", op: "obtenerPerfilEmpresa", clave: Perfil }).done(function (xmlDoc) {
        var CatalogoG = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(CatalogoG, "cve_Perfil", "clave");
        SetValor(CatalogoG, "cve_Empresa", "empresa");
        SetValor(CatalogoG, "nombre", "descripcion");
        SetValor(CatalogoG, "Activa", "estatus", "bool");
    });
}

function GuardarEdicionPerfil() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NPerfiles.aspx", "seccion=perfiles&op=editar&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus ==="") {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoItemCat();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function editarPlantilla(Pantilla) {
    PonerEnEspera();
    IntercambioVisual("pantallaAuxiliar", "formulario");
    window.frames["pantallaAuxiliar"].location.href = "../ContratacionUI/CN_crearPerfil.aspx?callbackInicio=callbackInicioEditarPlantilla&offset=0&Plantilla=" + Pantilla;
}

function callbackInicioEditarPlantilla() {
    QuitarEspera();
    DesplazarElemento('principal', -900);
    QuitarEspera();
}

function Cancelar() {
    MostrarCatalogo();
}

function VerPerfil(numplantilla) {
    PonerEnEspera();
    window.frames["pantallaAuxiliar"].location.href = "/Modulos/Contrataciones/ContratacionUI/CN_llenarPerfil.aspx?callbackInicio=callbackInicioEditarPlantilla&offset=0&numplantilla=" + numplantilla + "&numpuesto=-1" + "&nompuesto=Visualizacion";
    IntercambioVisual("pantallaAuxiliar", "formulario");
}