var Menuactivo = false;
var Opcionesactivo = false;
function iniciar() {
    redimensionarPantalla();
    ObtenerMenusPerfil("arbolPrincipal", 0, false, "");
    ObtenerNotificacionesUsuario();
}

function ObtenerNotificacionesUsuario() {
    $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", { op: "ObtenerNotificacionesUsuario", seccion: "Comunes" }).done(function (xmlDoc) {
        var items = xmlDoc.getElementsByTagName("Table");
        var lista = document.getElementById("listaNotificaciones");
        $(lista).html('<li class="titulo">Notificaciones</li>');
        var totalregistros, itemLista;
        document.getElementById("numeroNotificaciones").innerHTML = items.length;
        for (var i = 0; i < items.length; i++) {
            itemLista = document.createElement("li");
            itemLista.referencia = GetValor(items[i], "referencia");
            itemLista.urlPantalla = GetValor(items[i], "pagina");
            itemLista.requiereConfirmacion = GetValor(items[i], "requiereConfirmacion", "bool");
            itemLista.fechaNotificacion = GetValor(items[i], "fecha");
            itemLista.onclick = function () { verNotificacion(this); };
            itemLista.innerHTML = GetValor(items[i], "nota") + " <i>" + GetValor(items[i], "fecha") + "</i>";
            lista.appendChild(itemLista);
        }
    });
}

function verNotificacion(notificacion) {
    AgregarNuevoTab(notificacion.urlPantalla + "&esNotificacion=true", "Solicitud de Vacaciones", undefined, { fechaNotificacion: notificacion.fechaNotificacion });
    if (notificacion.requiereConfirmacion !== "true") {
        $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", { op: "EliminarNotificacionPorReferencia", seccion: "Comunes", referencia: notificacion.referencia }).done(function (xmlDoc) {
            var notificaciones = document.getElementById("listaNotificaciones").getElementsByTagName("li").length - 1;
            notificacion.parentNode.removeChild(notificacion);
            document.getElementById("numeroNotificaciones").innerHTML = notificaciones - 1;
        });

    }
}

function EliminarNotificacion(_iframeLoc) {
    var tabs = document.getElementById("tabsApp").getElementsByTagName("li");
    var tabEfectivo;
    var notificaciones = document.getElementById("listaNotificaciones").getElementsByTagName("li");    
    //Eliminar del servidor
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].iframeTab.contentWindow.location.href == _iframeLoc) {
            tabEfectivo=tabs[i];
            $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", { op: "EliminarNotificacionUsuario", seccion: "Comunes", fechaNotificacion: tabEfectivo.fechaNotificacion }).done(function (xmlDoc) {});
            break;
        }
    }
    //Eliminar de la lista
    for (i = 0; i < notificaciones.length; i++) {
        if (notificaciones[i].fechaNotificacion == tabEfectivo.fechaNotificacion) {
            notificaciones[i].parentNode.removeChild(notificaciones[i]);
            document.getElementById("numeroNotificaciones").innerHTML = notificaciones.length -1;
            break;
        }
    }
}

function redimensionarPantalla() {
    var alturaEspacioTrabajo = $(window).innerHeight();
    var alturaDivSpliter = alturaEspacioTrabajo - 61;
    var divSpliterLeft = document.getElementById("arbolPrincipal");
    var divSpliterRight = document.getElementById("spliterRight");
    divSpliterLeft.style.height = (alturaDivSpliter - 60) + "px";
    divSpliterRight.style.height = alturaDivSpliter + "px";
    CambiarEstiloElementosTag("iframe", "spliterRight", "height", alturaDivSpliter + "px");    
}

function ToggleLista(objeto, id) {
    var lista = document.getElementById(id);
    if (lista.style.display=="none") {
        $(lista).show("fade", { direction: "up" }, 500);
    } else {
        $(lista).hide("fade", { direction: "up" }, 500);
    }
}

function ToggleMostrarMenu() {
    var menu = document.getElementById("spliterLeft");
    var btnMostrarMenu = document.getElementById("btnMenu");
    if (!Menuactivo) {
        btnMostrarMenu.widthOriginal = parseInt($(menu).css("width"));
        btnMostrarMenu.widthFrameOriginal = parseInt($("#spliterRight").css("width"));
        $(menu).animate({ left: "-" + (btnMostrarMenu.widthOriginal - 35) + "px" }, function () {
            $("#arbolPrincipal").css("width", (btnMostrarMenu.widthOriginal - 35) + "px");
            $("#spliterRight").css("width", (btnMostrarMenu.widthOriginal + btnMostrarMenu.widthFrameOriginal - 35) + "px");
            $("#tabsApp").css("width", $("#spliterRight").css("width"));
        });
        Menuactivo = true;
    } else {
        $(menu).animate({ left: "0px" }, function () {
            $("#arbolPrincipal").css("width", btnMostrarMenu.widthOriginal + "px");
            $("#spliterRight").css("width", btnMostrarMenu.widthFrameOriginal + "px");
            $("#tabsApp").css("width", $("#spliterRight").css("width"));
        });
        Menuactivo = false;
    }
}


function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    ObtenerMenusPerfil("arbolPrincipal", 0, false, objeto.value);
}

function AgregarNuevoTab(url, nombre, nameIframe, atributos) {
    var lblTab = document.createElement("li");
    for (var atributo in atributos) {
        lblTab[atributo] = atributos[atributo];
        lblTab.setAttribute(atributo, atributos[atributo]);
    }
    var objs = document.getElementById("tabsApp").getElementsByTagName("li");
    for (var x = 0; x < objs.length; x++) {
        var urls = objs[x].iframeTab.getAttribute("src");
        if (urls === url) {
            objs[x].onclick(objs[x]);
            return 0;
        }
    }
    lblTab.onclick = mostrarTab;
    lblTab.innerHTML = nombre + "<b onclick='CerrarTab(this);'>x</b>";
    var tabs = document.getElementById("tabsApp");
    tabs.setAttribute("title","Haz click para actualizar la sección.");
    tabs.activo = lblTab;
    tabs.appendChild(lblTab);
    var lbls = tabs.getElementsByTagName("li");
    CambiarAtributoElementosTag("li", "tabsApp", "class","");
    lblTab.className = "activo";

    var iframeTab = document.createElement("iframe");
    if (nameIframe) { iframeTab.setAttribute("name", nameIframe); }
    lblTab.iframeTab = iframeTab;
    iframeTab.className = "spliter-right";
    iframeTab.src = url;
    CambiarEstiloElementosTag("iframe", "spliterRight","display","none");
    iframeTab.style.display = "block";
    document.getElementById("spliterRight").appendChild(iframeTab);
    redimensionarPantalla();
}

function mostrarTab (obj) {
    var tab = obj.target || obj || this;
    if (tab.iframeTab && tab.iframeTab.style.display == "block") {
        tab.iframeTab.contentWindow.location = tab.iframeTab.contentWindow.location;
    } else if (tab.iframeTab){
        CambiarEstiloElementosTag("iframe", "spliterRight", "display", "none");
        CambiarAtributoElementosTag("li", "tabsApp", "class", "");
        tab.className = "activo";
        tab.iframeTab.style.display = "block";
    }
}

function CerrarTab(objeto) {
    objeto.parentNode.iframeTab.parentNode.removeChild(objeto.parentNode.iframeTab);
    objeto.parentNode.parentNode.removeChild(objeto.parentNode);
}


function CerrarTabDesdeFrame(_iframeLoc) {
    var tabs = document.getElementById("tabsApp").getElementsByTagName("li");
    for(var i = 0; i < tabs.length; i++){
        if (tabs[i].iframeTab.contentWindow.location.href == _iframeLoc) {
            CerrarTab(tabs[i].getElementsByTagName("b")[0]); break;
        }
    }
}

function CambiarRutaFrame(_iframeLoc, nuevaURL) {
    var tabs = document.getElementById("tabsApp").getElementsByTagName("li");
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].iframeTab.contentWindow.location.href == _iframeLoc) {
            tabs[i].iframeTab.contentWindow.location.href = nuevaURL; break;
        }
    }
}

function CambiarEstiloElementosTag(tipo, idContenedor,propiedad,valor) {
    var contenedor = document.getElementById(idContenedor);
    var elementos = contenedor.getElementsByTagName(tipo);
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].style[propiedad] = valor;
    }
}

function CambiarAtributoElementosTag(tipo, idContenedor, atributo, valor) {
    var contenedor = document.getElementById(idContenedor);
    var elementos = contenedor.getElementsByTagName(tipo);
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].setAttribute(atributo,valor);
    }
}
