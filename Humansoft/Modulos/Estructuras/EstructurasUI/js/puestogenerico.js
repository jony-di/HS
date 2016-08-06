var CVE_PUESTO="";
var Nompuesto="";
function iniciar() {
    //LlenarSelect("/Modulos/Contrataciones/ContratacionNegocio/NPerfiles.aspx?seccion=filtros&op=obtenerPerfilesEmpresa", "plantillasperfil", "--Seleccione la pantilla del perfill--", "cve_Perfil", "nombre");
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
    cargarCatalogoPaquetesExamenes();
}

function cargarCatalogoPaquetesExamenes() {
    LlenarSelect("/Modulos/Contrataciones/ContratacionNegocio/NPaqExamenes.aspx?op=ObtenerCatalogo&seccion=PaqExamenes&pagina=1&longitudPagina=200", "cve_paqexamen", "Selecciona exámenes", "cve_paqexamen", "descripcion", function () {});
}

function crearNuevo() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NPuestosGenericos.aspx", "op=Nuevo&seccion=PuestoGenerico&" + parametros).done(function (xmlDoc) {
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
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function MostrarSeleccionTabuladores(){
    NuevoSeleccionSecuencial("Seleccionar Tabulador", [
             { alias: "Tabulador", url: '/Modulos/Estructuras/EstructurasNegocio/NCatalogosTresCampos.aspx', parametros: { seccion: "TabuladorDescripciones", op: "obtenerCatalogo", pagina: 1, longitudPagina: 1000, criterio: "", cve_tabulador: 0 }, campos: ['cve_tabulador', 'descripcion'], encabezado: { titulo: "Tabuladores Disponibles", columnas: ["Clave", "Tabulador"] }, display: "descripcion", sigSolicitud: { tabulador: 'cve_tabulador'} }
           , { alias: "Nivel", url: '/Modulos/Estructuras/EstructurasNegocio/NTabulador.aspx', parametros: { op: "obtenerCatalogoTabulador", pagina: 1, longitudPagina: 1000, criterio: "", tabulador: 1 }, campos: ["tabulador", "nivel", "p_min", "p_max", {pre:"$ ", col:"minimo"}, {pre:"$ ",col:"medio"}, {pre:"$ ",col:"maximo"}], encabezado: { titulo: "", columnas: ["Tabulador", "Nivel", "Puntos Min", "Puntos Max", "Mínimo", "Medio", "Máximo"] }, display: "nivel" }
        ], "base", function (divR){
            var divTmp = document.createElement("div");
            divTmp.appendChild(divR);
            $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
        },
        function (seleccion){
            if (seleccion[0] && seleccion[1]){
                document.getElementById("tabulador").value = (seleccion[0]["cve_tabulador"] ? seleccion[0]["cve_tabulador"] : 0);
                document.getElementById("stabulador").value = (seleccion[0]["descripcion"] ? seleccion[0]["descripcion"] : "");
                document.getElementById("niveltabular").value = (seleccion[1]["nivel"] ? seleccion[1]["nivel"] : 0);
            } else {
                alert("Debe completar selección.");
            }
            $.fancybox.close();
        });
}

function MostrarDetalleTabulador() {
    NuevoSeleccionSecuencial("Detalle del tabulador:",[
           { esConsulta: true, alias: "Nivel", url: '/Modulos/Estructuras/EstructurasNegocio/NTabulador.aspx', parametros: { op: "obtenerCatalogoTabulador", pagina: 1, longitudPagina: 1000, criterio: "", tabulador: $.trim(document.getElementById("tabulador").value), nivel: $.trim(document.getElementById("niveltabular").value) }, campos: ["tabulador|anchoA", "nivel|anchoA", "p_min|anchoB", "p_max|anchoC", { pre: "$ ", col: "minimo", className: "anchoD" }, { pre: "$ ", col: "medio" }, { pre: "$ ", col: "maximo" }], encabezado: { titulo: "", columnas: ["Tabulador", "Nivel", "Puntos Min", "Puntos Max", "Mínimo", "Medio", "Máximo"] }, display: "nivel" }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.style.height = "140px";
        divTmp.style.overflow = "hidden";
        divTmp.appendChild(divR);
        $.fancybox({
            type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic', afterShow: function () {
                var tablas = $(divTmp).find(".wrappTabla table");
                var ths = tablas[0].getElementsByTagName("tr")[0].getElementsByTagName("th");
                var tds = tablas[1].getElementsByTagName("tr")[0].getElementsByTagName("td");
                for (var b = 0; b < tds.length; b++) {
                    ths[b].style.width = $(tds[b]).css("width");
                }
            }
        });
    },
      function (seleccion) {
          $.fancybox.close();
      }, true, { width: '900px'}
      , true
   );
}

function buscarCoincidencias(ev, objeto){
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function MostrarNuevo() {
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = false;
    btnAgregar = document.getElementById("agregarPerfil");
    btnMostrar = document.getElementById("mostrarPerfil");
    btnAgregar.className = "ocultar";
    btnMostrar.className = "ocultar";
    document.getElementById("archivoescaneado").className = "ocultar";
    document.getElementById("mostrarEscaneo").className = "ocultar";

    $.post(urlBase_WS + "NPuestosGenericos.aspx", { seccion: "PuestoGenerico", op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
        var selectTabulador = document.getElementById("tabulador");
        LlenarCatalogoTabulador(selectTabulador, function () {
            var selectTabuladorNivel = document.getElementById("niveltabular");
            LlenarCatalogoTabuladorNivel(selectTabuladorNivel, function () {});
        });
    }); 
    MostrarFormulario();
}

var ordenador;
function cargarCatalogoItemCat(pagina, criterio, cve_puesto) {
    if (!cve_puesto) cve_puesto = 0;
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPuestosGenericos.aspx", { seccion: "PuestoGenerico", op: "obtenerCatalogo", pagina: pagina, longitudPagina: 10, criterio: (criterio ? criterio : ""), cve_puesto: cve_puesto }).done(function (xmlDoc) {
        QuitarEspera();
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var clave = GetValor(ItemCat[i], "cve_puesto");
            var puntos = GetValor(ItemCat[i], "puntos");
            var nivelmercer = GetValor(ItemCat[i], "nivelmercer");
            var tabulador = GetValor(ItemCat[i], "nombretabulador");
            var niveltabular = GetValor(ItemCat[i], "niveltabular");
            var nombre = GetValor(ItemCat[i], "nombre_puesto");
            var extra = GetValor(ItemCat[i], "cve_extra");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarItemCat(' + clave + ')"></button></td>' +
                 '<td><label class="puesto">' + clave + '</label></td>' +
                '<td><label class="nombrepuesto">' + nombre + '</label></td>' +
                '<td><label class="nivel">' + nivelmercer + '</label></td>' +
                '<td><label class="tabulador">' + tabulador + '</label> </td>' +
                '<td><label class="niveltabular">' + niveltabular + '</label></td>' 
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function callbackInicioVerDetallePolitica() {
   //QuitarEspera();
}

function GuardarPuestoGenerico() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmItemCat = document.getElementById("frmNuevo");
        if (!frmItemCat.esEditar){
            crearNuevo();
        } else {
            GuardarEdicioNCatalogosPuestoGenerico();
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarItemCat(clave) {
    CVE_PUESTO = clave;
    IntercambioVisual("formulario", "pantallaAuxiliar");
    var frmItemCat = document.getElementById("frmNuevo");
    frmItemCat.reset();
    frmItemCat.esEditar = true;
    MostrarFormulario();
    CargarDatosItemCat(clave);
    var selectTabulador = document.getElementById("tabulador");
    LlenarCatalogoTabulador(selectTabulador, function () {
        var selectTabuladorNivel = document.getElementById("niveltabular");
        LlenarCatalogoTabuladorNivel(selectTabuladorNivel, function () {
        });
    });
//    var selectestatus = document.getElementById("estatus");
//    selectestatus.disabled = false;
}

function CargarDatosItemCat(cve_ItemCat) {
    $.post(urlBase_WS + "NPuestosGenericos.aspx", { seccion: "PuestoGenerico", op: "obtenerCatalogo", pagina: 1, longitudPagina: 10, criterio: "",
        cve_puesto: cve_ItemCat
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_puesto", "clave");
        SetValor(ItemCat, "puntos", "puntos");
        SetValor(ItemCat, "nivelmercer", "nivel");
        SetValor(ItemCat, "tabulador", "tabulador");
        SetValor(ItemCat, "nombretabulador", "stabulador");
        SetValor(ItemCat, "niveltabular", "niveltabular");
        SetValor(ItemCat, "nombre_puesto", "nombre");
        SetValor(ItemCat, "cve_extra", "extra");
        SetValor(ItemCat, "cve_paqexamen", "cve_paqexamen");
        Nompuesto = GetValor(ItemCat, "nombre_puesto");
        var perfilescaneado = GetValor(ItemCat, "perfilescaneado");
        var tienePerfil = GetValor(ItemCat, "tienePerfil");
        var btnAgregar;
        var btnMostrar;
        if (tienePerfil === 'false') {
            btnAgregar = document.getElementById("agregarPerfil");
            btnMostrar = document.getElementById("mostrarPerfil");
            btnAgregar.className = "guardar btnFormularios";
            btnMostrar.className = "guardar btnFormularios ocultar";
            document.getElementById("archivoescaneado").className = "ocultar";
        }
        else {
            btnAgregar = document.getElementById("agregarPerfil");
            btnMostrar = document.getElementById("mostrarPerfil");
            btnAgregar.className = "guardar btnFormularios ocultar";
            btnMostrar.className = "guardar btnFormularios";
            if (perfilescaneado === 'false') {
                document.getElementById("archivoescaneado").className = "ocultar";
                document.getElementById("mostrarEscaneo").className = "";

            } else {
                document.getElementById("archivoescaneado").className = "";
                document.getElementById("mostrarEscaneo").className = "ocultar";
            }
        }
    });

    $.post(urlBase_WS + "NPuestosGenericos.aspx", { seccion: "PuestoGenerico", op: "PerfilesEscaneados",cve_puesto: cve_ItemCat
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Archivos")[0];
        var Ext = GetValor(ItemCat, "Ext");
        document.getElementById("ligaEscaneo").setAttribute("onclick", "abrirImagen('/Expedientes/Puestos/Perfiles/" + cve_ItemCat + Ext + "')");
    });
    
}

function GuardarEdicioNCatalogosPuestoGenerico() {
    var frmNuevo = document.getElementById("frmNuevo");
    var parametros = $(frmNuevo).serialize();
    $.post(urlBase_WS + "NPuestosGenericos.aspx", "op=Editar&seccion=PuestoGenerico&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoItemCat();
            document.getElementById("frmNuevo").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function CancelarPuestoGenerico() {
    MostrarCatalogo();
}

function VerDescripcionPuesto(numplantilla) {
    if (numplantilla) {
        PonerEnEspera();
        IntercambioVisual("pantallaAuxiliar", "formulario");
        window.frames["pantallaAuxiliar"].location.href = "/Modulos/Contrataciones/ContratacionUI/CN_llenarPerfil.aspx?callbackInicio=callbackVerDescripcionPuesto&offset=0&numplantilla=" + numplantilla + "&numpuesto=" + CVE_PUESTO + "&nompuesto=" + Nompuesto;
    }else{
    NuevoSeleccionSecuencial('Seleccionar La plantilla que desea llenar', [
            { alias: '', url:'/Modulos/Contrataciones/ContratacionNegocio/NPerfiles.aspx', parametros: { seccion: 'filtros', op:'obtenerPerfilesEmpresa' }, campos: ['cve_Perfil', 'nombre'], encabezado: { titulo: 'Plantillas del perfil', columnas: ['Clave', 'Nombre'] }, display: 'nombre'}
        ],'base', function (divR) {
            var divTmp = document.createElement("div");
            divTmp.appendChild(divR);
            $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
        },
        function (seleccion) {
            if (seleccion[0]) {
                numplantilla = seleccion[0]["cve_Perfil"];
                PonerEnEspera();
                IntercambioVisual("pantallaAuxiliar", "formulario");
                window.frames["pantallaAuxiliar"].location.href = "/Modulos/Contrataciones/ContratacionUI/CN_llenarPerfil.aspx?callbackInicio=callbackVerDescripcionPuesto&offset=0&numplantilla=" + numplantilla + "&numpuesto=" + CVE_PUESTO + "&nompuesto=" + Nompuesto;
            }
            $.fancybox.close();
        });
    }
}

function callbackVerDescripcionPuesto() {
    QuitarEspera();
    DesplazarElemento('principal', -900);
}

function CargarEscaneo() {
    var pathfile = document.getElementById("pathfile");
    var perfilscan = document.getElementById("perfilscan");
    var formData = new FormData();
    var file = perfilscan.files[0];
    var ext = perfilscan.value.split(".");
    pathfile.value = perfilscan.value;
    formData.append("FileUpload", file);
    formData.append("puesto", CVE_PUESTO);
    $.ajax({
        type: "POST",
        url: urlBase_WS + "NPuestosGenericos.aspx",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (msg) {
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            var notificacion = document.getElementById("notificacion");
            document.getElementById("archivoescaneado").className = "";
            document.getElementById("mostrarEscaneo").className = "ocultar";
            $(mensajeNotificacion).html("Se guardo correctamente");
            notificacion.className = "alert-box success mostrar";
            document.getElementById("ligaEscaneo").setAttribute("onclick", "abrirImagen('/Expedientes/Puestos/Perfiles/" + CVE_PUESTO + "." + ext[ext.length - 1] + "')");
        },
        error: function (error) {
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            var notificacion = document.getElementById("notificacion");
            $(mensajeNotificacion).html("No se guardo correctamente");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function eliminarEscaneo(){
  $.post(urlBase_WS + "NPuestosGenericos.aspx", "op=EliminarEscaneo&seccion=PuestoGenerico&puesto=" + CVE_PUESTO).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        if (estatus === "1") {
            document.getElementById("archivoescaneado").className = "ocultar";
            document.getElementById("mostrarEscaneo").className = "";
        }
        else {
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            var notificacion = document.getElementById("notificacion");
            $(mensajeNotificacion).html("No se pudo borrar el archivo");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function abrirImagen(url) {
    window.top.AgregarNuevoTab("../../../Utilidades/UtilidadesUI/visualizador/visualizador.aspx?urlImagen=" + url, "Perfil del puesto " + CVE_PUESTO);
}