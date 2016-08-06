var CVE_Config = 0;
var Jefe = "";

function iniciar(clave) {
    CVE_Config = clave;
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "catalogoConfigAsig", op: "seleccConfig", clave: clave }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(ItemCat, "cve_asignacion", "lblClave");
        SetValor(ItemCat, "nombre", "lblNombre");
        SetValor(ItemCat, "Jefe", "lblJefe", "bool","Si:No");
        Jefe = GetValor(ItemCat, "Jefe", "lblJefe", "bool");
        llenarRegion();
        llenarReclutadores();
        llenarDepartamentos();
        llenarPuestos();
    });

    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}

function Cancelar() {
    MostrarCatalogo();
}

function eliminarRegion(CVE_REGION) {

    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "eliminarRegion", cve_config: CVE_Config, cve_region: CVE_REGION }).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus === "") {
            notificacion.className = "alert-box error ocultar";
            llenarRegion();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function eliminarDep(CVE_EMPRESA, CVE_DEPARTAMENTO) {
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "eliminarDep", cve_config: CVE_Config, cve_empresa: CVE_EMPRESA, cve_departamento: CVE_DEPARTAMENTO }).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus === "") {
            notificacion.className = "alert-box error ocultar";
            llenarDepartamentos();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function eliminarReclutadores(CVE_USUARIO) {
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "eliminarReclutadores", cve_config: CVE_Config, cve_usuario: CVE_USUARIO }).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus === "") {
            notificacion.className = "alert-box error ocultar";
            llenarReclutadores();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function eliminarPuestos(CVE_PUESTO) {
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "eliminarPuestos", cve_config: CVE_Config, cve_puesto: CVE_PUESTO }).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus === "") {
            notificacion.className = "alert-box error ocultar";
            llenarPuestos();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function llenarRegion() {
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "llenarRegion", cve_config: CVE_Config }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("tRegion");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var cve_region = GetValor(ItemCat[i], "cve_region");
            var nombre = GetValor(ItemCat[i], "nombre");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><label >' + nombre + '</label></td>' +
                '<td><label ><img class="seleccionar" onclick="eliminarRegion(' + cve_region + ')" src="/Recursos/imagenes/eliminar.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        //paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("contenedorRegion");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

 function llenarReclutadores() {

    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "llenarReclutadores", cve_config: CVE_Config }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("tReclutadores");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var cve_usuario = GetValor(ItemCat[i], "cve_usuario");
            var nombre = GetValor(ItemCat[i], "nombre");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><label >' + nombre + '</label></td>' +
                '<td><label ><img class="seleccionar" onclick="eliminarReclutadores(' + cve_usuario + ')" src="/Recursos/imagenes/eliminar.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        //paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("contenedorReclutadores");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function llenarDepartamentos() {
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "llenarDepartamentos", cve_config: CVE_Config }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("tDep");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var cve_empresa = GetValor(ItemCat[i], "cve_empresa");
            var cve_departamento = GetValor(ItemCat[i], "cve_departamento");
            var nombredep = GetValor(ItemCat[i], "nombredep");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><label >' + nombredep + '</label></td>' +
                '<td><label ><img class="seleccionar" onclick="eliminarDep(' + cve_empresa + ',' + cve_departamento + ')" src="/Recursos/imagenes/eliminar.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        //paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("contenedorDep");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function llenarPuestos() {
    $.post(urlBase_WS + "NconfigAsignacion.aspx", { seccion: "detalleConfigAsig", op: "llenarPuestos", cve_config: CVE_Config }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("tPuestos");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var cve_puesto = GetValor(ItemCat[i], "cve_puesto");
            var nombre = GetValor(ItemCat[i], "Nombre_Puesto");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><label >' + nombre + '</label></td>' +
                '<td><label ><img class="seleccionar" onclick="eliminarPuestos(' + cve_puesto + ')" src="/Recursos/imagenes/eliminar.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        //paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("contenedorPuestos");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function mostrarRegion() {
    NuevoSeleccionSecuencial("Seleccionar Las Region que desea", [
        { esMultiSeleccion: true, url: urlBase_WS + 'NconfigAsignacion.aspx', parametros: { seccion: "detalleConfigAsig", op: "obtenerRegion", cve_config: CVE_Config }, campos: ['cve_region', 'nombre'], ocultos: [0], encabezado: { titulo: "Zona", columnas: ["Region", "Nombre"]} }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            var obj = seleccion[0];
            var insert= "";
            var coma = "";
            for (var x = 0; x < obj.length; x++) {
                insert += coma + '(' + CVE_Config + ',' + obj[x]["cve_region"] + ')';
                coma = ",";
            }
            $.post(urlBase_WS + "NconfigAsignacion.aspx", "seccion=detalleConfigAsig&op=agregarRegion&valores=" + insert ).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                var notificacion = document.getElementById("notificacion");
                var mensajeNotificacion = document.getElementById("mensaje-alerta");
                $(mensajeNotificacion).html(mensaje);
                if (estatus == 1) {
                    notificacion.className = "alert-box error ocultar";
                    llenarRegion();
                }
                else if (estatus < 0) {
                    notificacion.className = "alert-box error mostrar";
                }
            });
        }
        $.fancybox.close();
    });
}

function mostrarReclutadores() {
    var OP = "";
    if (Jefe==="true") {
        OP = "obtenerJefesReclutadores";
    }
    else {
        OP = "obtenerReclutadores";
    }
    NuevoSeleccionSecuencial("Seleccionar Los Reclutadores que desea", [
        { esMultiSeleccion: true, url: urlBase_WS + 'NconfigAsignacion.aspx', parametros: { seccion: "detalleConfigAsig", op: OP, cve_config: CVE_Config }, campos: ['cve_usuario', 'nombre'], ocultos: [0], encabezado: { titulo: "Reclutador", columnas: ["Usuario", "Nombre"]} }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            var obj = seleccion[0];
            var insert = "";
            var coma = "";
            for (var x = 0; x < obj.length; x++) {
                insert += coma + '(' + CVE_Config + ',' + obj[x]["cve_usuario"]  + ')';
                coma = ",";
            }
            $.post(urlBase_WS + "NconfigAsignacion.aspx", "seccion=detalleConfigAsig&op=agregarReclutadores&valores=" + insert).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                var notificacion = document.getElementById("notificacion");
                var mensajeNotificacion = document.getElementById("mensaje-alerta");
                $(mensajeNotificacion).html(mensaje);
                if (estatus == 1) {
                    notificacion.className = "alert-box error ocultar";
                    llenarReclutadores();
                }
                else if (estatus < 0) {
                    notificacion.className = "alert-box error mostrar";
                }
            });
        }
        $.fancybox.close();
    });
}

function mostrarDepartamentos() {
    NuevoSeleccionSecuencial("Seleccionar Los Departamentos que desea", [
        { esMultiSeleccion: true, url: urlBase_WS + 'NconfigAsignacion.aspx', parametros: { seccion: "detalleConfigAsig", op: "obtenerDepartamentos", cve_config: CVE_Config }, campos: ['cve_empresa','cve_departamento','nombredep'], ocultos: [0,1], encabezado: { titulo: "Zona", columnas: ["Empresa", "Departamento", "Nombre"]} }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            var obj = seleccion[0];
            var insert = "";
            var coma = "";
            for (var x = 0; x < obj.length; x++) {
                insert += coma + '(' + CVE_Config + ',' + obj[x]["cve_empresa"] + ',' + obj[x]["cve_departamento"] + ')';
                coma = ",";
            }
            $.post(urlBase_WS + "NconfigAsignacion.aspx", "seccion=detalleConfigAsig&op=agregarDep&valores=" + insert).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                var notificacion = document.getElementById("notificacion");
                var mensajeNotificacion = document.getElementById("mensaje-alerta");
                $(mensajeNotificacion).html(mensaje);
                if (estatus == 1) {
                    notificacion.className = "alert-box error ocultar";
                    llenarDepartamentos();
                }
                else if (estatus < 0) {
                    notificacion.className = "alert-box error mostrar";
                }
            });
        }
        $.fancybox.close();
    });
}

function mostrarPuestos() {
    NuevoSeleccionSecuencial("Seleccionar Los Puestos que desea", [
        { esMultiSeleccion: true, url: urlBase_WS + 'NconfigAsignacion.aspx', parametros: { seccion: "detalleConfigAsig", op: "obtenerPuestos", cve_config: CVE_Config }, campos: ['cve_puesto', 'Nombre_Puesto'], ocultos: [0],encabezado: { titulo: "Zona", columnas: ["cve", "Puesto"]} }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            var obj = seleccion[0];
            var insert = "";
            var coma = "";
            for (var x = 0; x < obj.length; x++) {
                insert += coma + '(' + CVE_Config + ',' + obj[x]["cve_puesto"] + ')';
                coma = ",";
            }
            $.post(urlBase_WS + "NconfigAsignacion.aspx", "seccion=detalleConfigAsig&op=agregarPuestos&valores=" + insert).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                var notificacion = document.getElementById("notificacion");
                var mensajeNotificacion = document.getElementById("mensaje-alerta");
                $(mensajeNotificacion).html(mensaje);
                if (estatus == 1) {
                    notificacion.className = "alert-box error ocultar";
                    llenarPuestos();
                }
                else if (estatus < 0) {
                    notificacion.className = "alert-box error mostrar";
                }
            });
        }
        $.fancybox.close();
    });
}