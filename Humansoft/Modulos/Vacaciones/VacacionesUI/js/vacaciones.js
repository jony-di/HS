var urlBase_WS = "/Modulos/Vacaciones/VacacionesNegocio/";

$(document).ready(function () {
    var x = window.top;
    if (x.location.href.indexOf("inicio.aspx") < 0) { window.location.href = "/default.htm"; }
});


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




function SalirSolicitud() {
    window.parent.DesplazarElemento("principal",0);
}

function ObtenerDiasFeriados(callback) {
    $.post(urlBase_WS + "NVacaciones.aspx", { seccion: "Comunes", op: "ObtenerDiasFeriados", num_empleado: ID_EMPLEADO }).done(function (xmlDoc){
    var diasFeriados = [];
        var fechas = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < fechas.length; i++) {
            diasFeriados.push(GetValor(fechas[i], "dia").replace(new RegExp("/", "gi"), "-"));
        }
        callback(diasFeriados);
    });
}

function ObtenerDiasVacacionesEmpleado(callback){
    $.post(urlBase_WS + "NVacaciones.aspx", { seccion: "Comunes", op: "ObtenerDiasVacaciones", num_empleado: ID_EMPLEADO }).done(function (xmlDoc) {
        var diasVacaciones = [];
        var fechas = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < fechas.length; i++) {
            diasVacaciones.push(GetValor(fechas[i], "dia").replace(new RegExp("/", "gi"), "-"));
        }
        callback(diasVacaciones);
    });
}

function ObtenerEncabezadoEmpledo(idEmpleado) {
    try { PonerEnEspera(); } catch (e) { }
    var metodo = { op: "ObtenerEncabezadoVacacionesEmpleadoSesion", seccion: 'Comunes' };
    if (idEmpleado) {
        metodo = { op: "ObtenerEncabezadoVacacionesEmpleadoId", seccion: 'Comunes', num_empleado: idEmpleado };
    }
    $.post(urlBase_WS + "NVacaciones.aspx", metodo).done(function (xmlDoc) {
        try { QuitarEspera(); } catch (e) { }
        var nombre = SetValor(xmlDoc, "nombre", "nombre");
        var departamento = SetValor(xmlDoc, "departamento", "departamento");
        var puesto = SetValor(xmlDoc, "puesto", "puesto");
        var fechaIngreso = SetValor(xmlDoc, "fechaIngreso", "fechaIngreso");
        var fechaSolicitud = SetValor(xmlDoc, "fechaSolicitud", "fechaSolicitud");
        var lugarTrabajo = SetValor(xmlDoc, "lugarTrabajo", "lugarTrabajo");
        var diasDerecho = SetValor(xmlDoc, "diasDerecho", "diasDerecho");
        if (diasDerecho.length == 0) {
            document.getElementById("diasDerecho").innerHTML = "--";
        }
    }).always(function(){
        try { QuitarEspera(); } catch (e) { }
    });
}


function ObtenerDetalleSolicitud(idContenedor, num_empleado, num_solicitud, idDiasSolicitados, idEstatusSolicitud) {
    try { PonerEnEspera(); } catch (e) { }
    var metodo = { op: "ObtenerDetalleSolicitud", seccion: 'Comunes', num_empleado: num_empleado, num_solicitud: num_solicitud };
    $.post(urlBase_WS + "NVacaciones.aspx", metodo).done(function (xmlDoc) {
        try { QuitarEspera(); } catch (e) { }
        var items = xmlDoc.getElementsByTagName("Table");
        SetValor(xmlDoc, "estatus", idEstatusSolicitud);
        document.getElementById(idDiasSolicitados).innerHTML = items.length;
        var lista = document.getElementById(idContenedor);        
        sLinkEscaneo = GetValor(xmlDoc, "escaneo");
        var linkEscaneo =  document.getElementById("linkEscaneo");
        if (linkEscaneo && sLinkEscaneo.length > 0) {
            linkEscaneo.setAttribute("href", "/Expedientes/Empleados" + sLinkEscaneo);
            linkEscaneo.parentNode.style.display = "block";
            document.getElementById("frmEscaneo").style.display = "none";
        } else {
            linkEscaneo.parentNode.style.display = "none";
            document.getElementById("frmEscaneo").style.display = "block";
        }
        var tr;
        for (var i = 0; i < items.length; i++){
            tr = document.createElement("tr");
            $(tr).html("<td>" + GetValor(items[i], "periodo") + "</td><td>" + GetValor(items[i], "fechadia") + "</td>");
            lista.appendChild(tr);
        }
    }).always(function () {
        try { QuitarEspera(); } catch (e) { }
    });
}

function MostrarDesglosePeriodos(idEmpleado) {
    try { PonerEnEspera(); } catch (e) { }
    var parametros = { op: "ObtenerDiasDerechoVacaciones", seccion: 'Comunes' };
    if (idEmpleado) {
        parametros = { op: "ObtenerDiasDerechoVacacionesEmpleadoId", seccion: 'Comunes', num_empleado: idEmpleado };
    }
    NuevoSeleccionSecuencial("Desglose de periodos de vacaciones.", [
            { esConsulta:true, idTabla: "t-desglose", url: '/Modulos/Vacaciones/VacacionesNegocio/NVacaciones.aspx', parametros: parametros, campos: ['num_empleado', 'periodo', 'totaldias', 'diastomados', 'saldo'], encabezado: { titulo: "Desglose de periodos de vacaciones", columnas: ["No. empleado", "Periodo", "Días con derecho", "Días tomados", "Saldo"] }, display: "periodo", sigSolicitud: { periodo: 'periodo', num_empleado:"num_empleado" } }            
        ], "base", function (divR) {
            try { QuitarEspera(); } catch (e) { }
            var divTmp = document.createElement("div");
            divTmp.appendChild(divR);
            $.fancybox({
                type: 'html'
                , content: $(divTmp)
                , preload: false
                , openEffect: 'elastic'
                , afterShow: function () {
                    var trs = document.getElementById("t-desglose").getElementsByTagName("tr");
                    var suma = 0;
                    for(var k=0;k<trs.length;k++){
                        suma += parseInt(trs[k].valor.saldo);
                    }
                    var labelPie = document.createElement("td");
                    labelPie.innerHTML = "Le restan un total de " + suma + " días de vacaciones.";
                    var tr = document.createElement("tr");
                    tr.className = "pie-tabla";
                    labelPie.setAttribute("colspan",5);
                    tr.appendChild(labelPie);
                    document.getElementById("t-desglose").appendChild(tr);
                }
            });
        },
        function (seleccion) {
            $.fancybox.close();
        }
        , true
    );
}

function ObtenerDiasDerecho(idEmpleado, idTablaBody) {
    try { PonerEnEspera(); } catch (e) { }
    var metodo = {op: "ObtenerDiasDerechoVacaciones", seccion: 'Comunes' };
    if (idEmpleado){
        metodo = { op: "ObtenerDiasDerechoVacacionesEmpleadoId", seccion: 'Comunes', num_empleado: idEmpleado };
    }
    $.post(urlBase_WS + "NVacaciones.aspx", metodo).done(function (xmlDoc) {
        try { QuitarEspera(); } catch (e) { }
        var tabla = document.getElementById(idTablaBody);
        var tr, td;
        var items = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < items.length; i++) {
            tr = document.createElement("tr");

            td = document.createElement("td");
            td.innerHTML = GetValor(items[i], "periodo") + "-" + GetValor(items[i], "PeriodoFin");
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = GetValor(items[i], "totaldias");
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = parseInt(GetValor(items[i], "totaldias"),10) - parseInt(GetValor(items[i], "diaspendientes"),10);
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = GetValor(items[i], "diaspendientes");
            tr.appendChild(td);

            tabla.appendChild(tr);
        }
    }).always(function () {
        try { QuitarEspera(); } catch (e) { }
    });
}



function EliminarCriterio(objeto, callback) {
    objeto.parentNode.parentNode.removeChild(objeto.parentNode);
    if (callback) {
        try {
            callback();
        } catch (e) { }
    }
}


function ToggleMenu(idMenu) {
    var lista = document.getElementById(idMenu);
    if (!lista.activo) {
        lista.style.display = "block";
        lista.activo = true;
    } else {
        lista.style.display = "none";
        lista.activo = false;
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
    imagenEspera.parentNode.removeChild(imagenEspera);
}

function SetValor(domXML, tag, idDomElemento, tipo, alias) {
    var valor = "";
    var domElemento = document.getElementById(idDomElemento);
    try { valor = domXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue; } catch (e) { }
    if (tipo == "bool") {
        valor = valor.toString();
    }
    if (alias) {
        valor = valor == "true" ? alias.split(":")[0] : alias.split(":")[1];
    }
    if (domElemento.tagName == "INPUT" || domElemento.tagName == "TEXTAREA") {
        if (tipo == "bool" && domElemento.tagName == "INPUT") {
            domElemento.checked = (valor == "1") || (valor == "true");
        } else {
            domElemento.value = valor;
        }
    } else if (domElemento.tagName == "SELECT") {
        var opciones = domElemento.options;
        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].value.toString() == valor.toString()) {
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
            if (valor.toString() == "true") {
                valor = alias.split(":")[0];
            } else { valor = alias.split(":")[1]; }

        } else {
            valor = (valor == 1);
        }
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
    }
    else if (estatus < 0) {
        notificacion.className = "alert-box error";
        notificacion.style.visibility = "visible";
        var notificacion = document.getElementById(idAlertas);
    }
    callback();
}



function LlenarSelect(url, idSelect, leyenda, clave, descripcion, callback) {
    var selectUI;
    if (idSelect) {
        selectUI = document.getElementById(idSelect);
    } else {
        selectUI = document.createElement("select");
    }
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = leyenda;
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(url).done(function (xmlDoc) {
        var departamento = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < departamento.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(departamento[i], descripcion);
            optionitem.title = GetValor(departamento[i], descripcion);
            optionitem.value = GetValor(departamento[i], clave);
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback(selectUI);
        }
    });
}



 function MostrarPantallaFrame(objeto) {
    var url = objeto.getAttribute("url");
    document.getElementById("pantallaAuxiliar").src = url + "?id_empleado=" + objeto.getAttribute("id_empleado") + "&nombre=" + objeto.getAttribute("nombre");
    DesplazarElemento("principal", -1800);
    ToggleOpcionesEmpleado();
}

function MostrarSigFrame(url, desplazamiento, idFrame) {
    document.getElementById(idFrame ? idFrame : "pantallaAuxiliar").src = url;
    DesplazarElemento("principal", desplazamiento);
    //ToggleOpcionesEmpleado();
}


function DesplazarElemento(idelemento, cambio) {
    var divPrincipal = document.getElementById(idelemento);
    $(divPrincipal).animate({ left: cambio + "px" }, 500, function () { });
};