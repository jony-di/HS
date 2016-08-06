function PreviewImagen(objInput, idImagen) {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(objInput.files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById(idImagen).src = oFREvent.target.result;
    };
};

$(function () {
    window.onresize();
});

window.onresize = function () {
    var scrollables = $(".scrollable");
    var alturaWindow = $(window).innerHeight();
    var framesVentanas = $("iframe.ventana");
    var i;
    for (i = 0; i < framesVentanas.length; i++) {
        framesVentanas[i].style.height = $(window).innerHeight() + "px";
    }
    for (i = 0; i < scrollables.length; i++) {
        scrollables[i].style.height = (alturaWindow - parseInt(scrollables[i].getAttribute("offset"), 10)) + "px";
    }
}

function AgregarInputFile(id, name) {
    var contenedor = document.getElementById(id);
    var olCont;
    if (contenedor.getElementsByTagName("ol").length == 0){
        olCont = document.createElement("ol");
        contenedor.appendChild(olCont);
    } else {
        olCont = contenedor.getElementsByTagName("ol")[0];
    }
    var btnCerrar = document.createElement("btn");
    btnCerrar.className = "btnFormularios";
    btnCerrar.innerHTML = "x";
    btnCerrar.style.padding = "2px";
    btnCerrar.onclick = function () {
        this.parentNode.parentNode.removeChild(this.parentNode);
    }
    var liItem = document.createElement("li");
    var inFile = document.createElement("input");
    inFile.type = "file";
    inFile.name = name;
    liItem.appendChild(inFile);
    liItem.appendChild(btnCerrar);
    olCont.appendChild(liItem);
}

function SoloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode;
    return ((key >= 48 && key <= 57) || key == 8 || key == 127 || 0);
}

function SoloFecha(e) {
    return SoloNumeros(e);
}

function EliminarCriterio(ev, objeto, callback) {
    ev = ev || window.event;
    if (ev.target.tagName.toLowerCase() == "button") {
        objeto.parentNode.parentNode.removeChild(objeto.parentNode);
        if (callback) {
            try {
                callback();
            } catch (e) { }
        }
    }
}


function NuevoElemento(padre, tipo, clase, valor, id) {
    var elemento = document.createElement(tipo);
    elemento.className = clase;
    if (tipo == "input") {
        elemento.value = valor;
    } else {
        elemento.innerHTML = valor;
    }
    elemento.id = id;
    padre.appendChild(elemento);
    return elemento;
}

function MostrarFormulario(_idFormulario) {
    var formulario = undefined;
    try {
        formulario = document.getElementById(_idFormulario);
        formulario.reset();
    } catch (e) { }
    var divprincipal = document.getElementById("principal");
    $(divprincipal).animate({ left: "-900px" }, 500, function () { });
    var notificacion = document.getElementById("notificacion");
    notificacion.getElementsByTagName("span")[0].innerHTML = "";
    notificacion.className = "alert-box ocultarV";
}

function IntercambioVisual(idVisible, idOculto) {
    $("#" + idOculto).css({ display: "none" });
    $("#" + idVisible).css({ display: "block" });
}

function MostrarCatalogo() {
    var divprincipal = document.getElementById("principal");
    $(divprincipal).animate({ left: "0px" }, 500, function () { });
}

function PonerEnEspera() {
    var inicio = document.getElementById("inicio");
    inicio.className = "fondo desenfocado";
    var imagenEspera = document.createElement("img");
    imagenEspera.id = "imagenEspera";
    imagenEspera.className = "imagenEspera";
    imagenEspera.src = "/Recursos/imagenes/loading_blue.gif";
    document.body.appendChild(imagenEspera);
}

function QuitarEspera() {
    var inicio = document.getElementById("inicio");
    inicio.className = "";
    var imagenEspera = document.getElementById("imagenEspera");
    try { imagenEspera.parentNode.removeChild(imagenEspera); } catch (e) { }
}

function SetValorDx(domElemento,valor){
    SetValor(undefined, undefined, undefined, undefined, undefined, domElemento, valor);
}

function SetValor(domXML, tag, idDomElemento, tipo, alias,_domElemento, _valor) {
    var valor = "";
    var domElemento = idDomElemento ? document.getElementById(idDomElemento) : _domElemento;
    if (domXML) {
        try { valor = domXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue; } catch (e) { }
    } else {
        valor = _valor;
    }
    if (tipo == "bool") {
        valor = valor.toString();
    }
    else if (tipo === "date") {
        var meses = [
                "Ene", "Feb", "Mar",
                "Abr", "May", "Jun", "Jul",
                "Ago", "Sep", "Oct",
                "Nov", "Dic"
                ];

        var data = valor.split("/");
        var fechas = new Date(data[2], data[1], data[0]);
        valor = fechas.getDate() + '/' + meses[fechas.getMonth()-1] + '/' + fechas.getFullYear();
    }
    if (alias) {
        valor = valor == "true" ? alias.split(":")[0] : alias.split(":")[1];
    }
    if (domElemento.tagName == "INPUT" || domElemento.tagName == "TEXTAREA"){
        if (tipo == "bool" && domElemento.tagName == "INPUT") {
            domElemento.checked = ((valor == "1")||(valor.toString() == "true"));
        } else {
            domElemento.value = valor;
        }
    } else if (domElemento.tagName == "SELECT") {
        var opciones = domElemento.options;
        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].value.toString() == valor.toString()){
                domElemento.selectedIndex = i
            }
        }
    } else {
        domElemento.innerHTML = valor;
    }
    return valor
}


function GetValor(domXML, tag, tipo, alias) {
    var valor = "";
    try { valor = domXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue; } catch (e) { }
    if (tipo == "bool") {
        if (alias != undefined) {
            if (valor.toString() == "true" || valor.toString() == "1") {
                valor = alias.split(":")[0];
            } else { valor = alias.split(":")[1]; }

        } else {
            valor = (valor == 1);
        }
    }
    else if (tipo === "date") {
        var meses = [
                "Ene", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Ago", "Sep", "Oct",
                "Nov", "Dic"
                ];

        var data = valor.split("/");
        var fechas = new Date(data[2], data[1], data[0]);
        valor = fechas.getDate() + '/' + meses[fechas.getMonth()-1] + '/' + fechas.getFullYear();
    }
    return valor.toString();
}

paginarTabla = function (paginaActual, totalRegistros, proceso, paramPaginador) {
    var paginador = document.getElementById("paginador");
    if (paramPaginador) {
        paginador = paramPaginador;
    }
    if (paginaActual == undefined) {
        paginaActual = paginador.paginaActual == undefined ? 1 : paginaActual;
    }
    var total;
    if (totalRegistros == undefined) {
        total = parseInt(paginador.getAttribute("total"), 10);
    } else {
        total = totalRegistros;
    }
    paginador.paginaActual = paginaActual;
    var tamPagina = paginador.getAttribute("tamPagina");
    var numeroPaginas = (total % tamPagina) > 0 ? Math.floor(total / tamPagina) + 1 : Math.floor(total / tamPagina);
    if (numeroPaginas > 0) {
        $(paginador).paginate({
            count: numeroPaginas,
            start: paginaActual,
            display: (numeroPaginas > 6) ? 6 : numeroPaginas,
            border: true,
            border_color: '#dae0d4',
            text_color: '#626161',
            background_color: '#f5f8f1',
            text_hover_color: '#2573AF',
            background_hover_color: 'none',
            images: false,
            mouse: 'press',
            onChange: function (pagina) {
                proceso(pagina);
            }
        });
    }
}

function ObtenerParentNode(elemento, tag, atributo, valor) {
    if (!elemento.parentNode || elemento.parentNode.tagName.toString().toLowerCase() == "body") {
        return null;
    } else if(elemento.parentNode.tagName.toString().toLowerCase() == tag && elemento.parentNode.getAttribute(atributo) == valor) {
        return elemento.parentNode;
    } else {
        return ObtenerParentNode(elemento.parentNode, tag, atributo, valor);
    }
}

function TablaCatalogo() { }
TablaCatalogo.iniciarTablaCatalogo = function (idContenedor, url, parametrosAjax, campos, clave, callbackItem, callback, tipoLista) {
    var contenedorTabla = document.getElementById(idContenedor);
    contenedorTabla.url = url;
    contenedorTabla.parametrosAjax = parametrosAjax;
    contenedorTabla.campos = campos;
    contenedorTabla.clave = clave;
    contenedorTabla.callbackItem = callbackItem;
    contenedorTabla.callback = callback;
    contenedorTabla.innerHTML = "";
    var tablaCatalogo = document.createElement("table");
    tablaCatalogo.className = "__tablaDinamica";
    var theader = document.createElement("thead");
    var strAux = "<tr>";
    contenedorTabla.campoTotalRegistros = campos.campoTotalRegistros ? campos.campoTotalRegistros : "totalRegistros";
    for (var i = 0; i < campos.length; i++) {
        strAux += "<th width='" + campos[i].ancho + "'><label>" + campos[i].etiqueta + "</label></th>";
    }
    theader.innerHTML = strAux + "</tr>";
    tablaCatalogo.appendChild(theader);
    var lista = document.createElement("tbody");
    contenedorTabla.lista = lista;
    tablaCatalogo.appendChild(lista);
    contenedorTabla.appendChild(tablaCatalogo);
    TablaCatalogo.cambiarPagina(contenedorTabla.getAttribute("id"), 1, "");
}
TablaCatalogo.cambiarPagina = function (idContenedor, pagina, criterio) {
    var oContenedorTabla = document.getElementById(idContenedor);
    $(oContenedorTabla.lista).html("");
    oContenedorTabla.parametrosAjax["pagina"] = pagina;
    oContenedorTabla.parametrosAjax["criterio"] = criterio;
    //alert($.param(oContenedorTabla.parametrosAjax));
    $.post(oContenedorTabla.url, oContenedorTabla.parametrosAjax).done(function (xmlDoc) {
        var oContenedorTabla_tmp = document.getElementById(idContenedor);
        var trBody;
        var strAux = "";
        var totalRegistros;
        var items = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < items.length; i++) {
            trBody = document.createElement("tr");
            eval("trBody." + oContenedorTabla_tmp.clave + " = GetValor(items[i], oContenedorTabla.clave)");
            trBody.onclick = oContenedorTabla_tmp.callbackItem;
            strAux = "";
            totalRegistros = GetValor(items[i], oContenedorTabla_tmp.campoTotalRegistros);
            for (var j = 0; j < oContenedorTabla_tmp.campos.length; j++) {
                strAux += "<td >" + GetValor(items[i], oContenedorTabla_tmp.campos[j].parametro); +"</td>";
            }
            trBody.innerHTML = strAux;
            oContenedorTabla_tmp.lista.appendChild(trBody);
        }
        var paginador = oContenedorTabla_tmp.paginador ? oContenedorTabla_tmp.paginador : document.createElement("div");
        oContenedorTabla_tmp.paginador = paginador;
        oContenedorTabla_tmp.appendChild(paginador);
        var tamPagina = oContenedorTabla_tmp.parametrosAjax.longitudPagina;
        var total = totalRegistros;
        var numeroPaginas = (total % tamPagina) > 0 ? Math.floor(total / tamPagina) + 1 : Math.floor(total / tamPagina);
        var paginaActual = oContenedorTabla_tmp.parametrosAjax.pagina;
        if (numeroPaginas > 0) {
            $(paginador).paginate({
                count: numeroPaginas,
                start: paginaActual,
                display: (numeroPaginas > 6) ? 6 : numeroPaginas,
                border: true,
                border_color: '#dae0d4',
                text_color: '#626161',
                background_color: '#f5f8f1',
                text_hover_color: '#2573AF',
                background_hover_color: 'none',
                images: false,
                mouse: 'press',
                onChange: function (pagina) {
                    TablaCatalogo.cambiarPagina(idContenedor, pagina, oContenedorTabla.parametrosAjax["criterio"]);
                }
            });
        }
        if (oContenedorTabla_tmp.callback != undefined) {
            oContenedorTabla_tmp.callback();
        }
    });
}

function mostrarNotificacion(xmlDoc, idAlertas, callback, _estatus, _mensaje) {
    var estatus = _estatus;
    var mensaje = _mensaje;
    if (!_estatus) {
        estatus = GetValor(xmlDoc, "estatus");
        mensaje = GetValor(xmlDoc, "mensaje");
    }
    var notificacion = document.getElementById(idAlertas);
    var mensajeNotificacion = notificacion.getElementsByTagName("span")[0];
    $(mensajeNotificacion).html(mensaje);
    if (estatus == 1) {
        notificacion.className = "alert-box success";
        notificacion.style.visibility = "visible";
        window.setTimeout(function () {
            notificacion.style.visibility = "hidden";
            $(mensajeNotificacion).html("");
        }, 2000);
        if (callback) callback();
    }
    else if (estatus < 0) {
        notificacion.className = "alert-box error";
        notificacion.style.visibility = "visible";
        var notificacion = document.getElementById(idAlertas);
    }
}

function LlenarSelect(url, idSelect, leyenda, clave, descripcion, callback, parametros) {
    var selectUI;
    if (idSelect) {
        selectUI = document.getElementById(idSelect);
    } else {
        selectUI = document.createElement("select");
    }
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = leyenda;
    optionitem.value = "";
    selectUI.appendChild(optionitem);
    $.post(url).done(function (xmlDoc) {
        var dbItem = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < dbItem.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(dbItem[i], descripcion);
            optionitem.title = GetValor(dbItem[i], descripcion);
            optionitem.value = GetValor(dbItem[i], clave);
            optionitem.nodoXML = dbItem[i];
            if (parametros) {
                for(var j = 0; j < parametros.length; j++){
                    optionitem[parametros[j]] = GetValor(dbItem[i], parametros[j]);
                }
            }
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined){
            callback(selectUI);
        }
    });
}

AgregarCriterioBusqueda = function (placeholder, criterio, idPadre, tipo, url, leyenda, descripcion, clave, callbackkeyup, callbackclose,debePermanecer,width) {
    var numeroFiltros = document.getElementById(idPadre).children.length;
    if (numeroFiltros < 6) {
        if (!tipo || tipo == "input" || tipo == "date" ) {
            var nuevoFiltro = NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "<input name='" + criterio + "' placeholder='" + placeholder + "' />", "");
            if (debePermanecer) { } else {
                var btnCerrar = document.createElement("b");
                btnCerrar.className = 'btnFormularios';
                btnCerrar.onclick = function (ev) { EliminarCriterio(ev, this, callbackclose); };
                btnCerrar.innerHTML = "x";
                nuevoFiltro.appendChild(btnCerrar);
            }
            var campo = nuevoFiltro.getElementsByTagName("input")[0];
            campo.onkeyup = function (ev) {
                callbackkeyup();
            }
            if (tipo == "date") {
                campo.style.width="83px";
                $(campo).datepicker({dateFormat:"dd/M/yy"});
            }
        } else if(tipo == "select"){
            LlenarSelect(url, undefined, leyenda, clave, descripcion, function (selectRelleno) {
                if (selectRelleno.options[0].value == '0') {
                    selectRelleno.options[0].value = "";
                }
                selectRelleno.setAttribute("name", criterio);
                selectRelleno.onchange = callbackkeyup;
                var spanCriterio = NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "", "");
                spanCriterio.appendChild(selectRelleno);
                if (debePermanecer) { } else {
                    var btnCerrar = document.createElement("b");
                    btnCerrar.className = 'btnFormularios';
                    btnCerrar.onclick = function (ev) { EliminarCriterio(ev, this, callbackclose); };
                    btnCerrar.innerHTML = "x";
                    spanCriterio.appendChild(btnCerrar);
                }
            });
        }
    }
}

function ToggleMenu(id) {
    var lista = document.getElementById(id);
    if (lista.style.display == "none") {
        lista.style.display = "block";
    } else {
        lista.style.display = "none";
    }
}

function Capitalize(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function MostrarPantallaFrame(objeto, yaTieneParametros) {
    var url = objeto.getAttribute("url");
    if (!yaTieneParametros) {
        document.getElementById("pantallaAuxiliar").src = url + "?id_empleado=" + objeto.getAttribute("id_empleado") + "&nombre=" + objeto.getAttribute("nombre");
    } else {
        document.getElementById("pantallaAuxiliar").src = url;
    }
    DesplazarElemento("principal", -1800);
    ToggleOpcionesEmpleado();
}

function MostrarSigFrame(url, desplazamiento, idFrame, idOcultar) {
    var idFrameAux = idFrame ? idFrame : "pantallaAuxiliar";
    document.getElementById(idFrameAux).src = url;
    DesplazarElemento("principal", desplazamiento);
    //ToggleOpcionesEmpleado();
    if (idOcultar) {
        IntercambioVisual(idFrameAux, idOcultar);
    }
}

function DesplazarElemento(idelemento, cambio) {
    var divPrincipal = document.getElementById(idelemento);
    $(divPrincipal).animate({ left: cambio + "px" }, 500, function () { });
};
function RecorrerElemento(idelemento, cambio) {
    var divPrincipal = document.getElementById(idelemento);
    var fCambio = ($.trim(cambio.toString())[0] == '+' || $.trim(cambio.toString())[0] == '-') ? parseInt($(divPrincipal).css("left"), 10) + parseInt(cambio, 10) : parseInt(cambio, 10);
    $(divPrincipal).animate({ left: fCambio + "px" }, 500, function () { });
};

function DesplazarElementoPorOtro(idelemento,idOtro,cambio) {
    var divPrincipal = document.getElementById(idelemento);
    var divOtro = document.getElementById(idelemento);
    divPrincipal.style.display = "block";
    divOtro.style.display = "none";
    var fCambio = ($.trim(cambio.toString())[0] == '+' || $.trim(cambio.toString())[0] == '-') ? parseInt($(divPrincipal).css("left"), 10) + parseInt(cambio, 10) : cambio;
    $(divPrincipal).animate({ left: fCambio + "px" }, 500, function () { });
};