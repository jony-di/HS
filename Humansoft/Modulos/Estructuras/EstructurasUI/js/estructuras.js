var urlBase_WS = "/Modulos/Estructuras/EstructurasNegocio/";

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

function AgregarCriterio(placeholder, criterio, idPadre, tipo, url, leyenda, descripcion, clave) {
    var numeroFiltros = document.getElementById(idPadre).children.length;
    if (numeroFiltros < 6) {        
        if (!tipo || tipo == "input") {
            NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "<input name='" + criterio + "' placeholder='" + placeholder + "' onkeyup=\"ActualizarPosiciones();\"/><b class='btnFormularios' onclick='EliminarCriterio(this,ActualizarPosiciones);'>x</b>", "");
        } else if (tipo == "select") {
        LlenarSelect(url, undefined, leyenda, clave, descripcion, function (selectRelleno) {
            if (selectRelleno.options[0].value == '0') {
                selectRelleno.options[0].value = "";
            }
            selectRelleno.setAttribute("name", criterio);
            selectRelleno.onchange = ActualizarPosiciones;
            var spanCriterio = NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "", "");
            spanCriterio.appendChild(selectRelleno);
            var btnCerrar = document.createElement("b");
            btnCerrar.className = 'btnFormularios';
            btnCerrar.onclick = function () { EliminarCriterio(this, ActualizarPosiciones); };
            btnCerrar.innerHTML = "x";
            spanCriterio.appendChild(btnCerrar);
        });
        }
    }
}

function ConsultarEmpleados() {
    cargarCatalogoEmpleado(1, '');
}

function ConsultarEmpleadosAdmin() {
    cargarCatalogoEmpleadoAdmin(1, '');
}


function AgregarCriterioEmpleado(placeholder, criterio, idPadre, tipo, url, leyenda, descripcion, clave) {
    var numeroFiltros = document.getElementById(idPadre).children.length;
    if (numeroFiltros < 6) {
        if (!tipo || tipo == "input") {
            NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "<input name='" + criterio + "' placeholder='" + placeholder + "' onkeyup=\"cargarCatalogoEmpleado(1,'');\"/><b class='btnFormularios' onclick='EliminarCriterio(this,ConsultarEmpleados)'>x</b>", "");
        } else if (tipo == "select") {
            LlenarSelect(url, undefined, leyenda, clave, descripcion, function (selectRelleno) {
                if (selectRelleno.options[0].value == '0') {
                    selectRelleno.options[0].value = "";
                }
                selectRelleno.setAttribute("name", criterio);
                selectRelleno.onchange = ConsultarEmpleados;
                var spanCriterio = NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "", "");
                spanCriterio.appendChild(selectRelleno);
                var btnCerrar = document.createElement("b");
                btnCerrar.className = 'btnFormularios';
                btnCerrar.onclick = function () { EliminarCriterio(this, ConsultarEmpleados); };
                btnCerrar.innerHTML = "x";
                spanCriterio.appendChild(btnCerrar);
            });
        }
    }
}

function AgregarCriterioEmpleadoAdmin(placeholder, criterio, idPadre, tipo, url, leyenda, descripcion, clave) {
    var numeroFiltros = document.getElementById(idPadre).children.length;
    if (numeroFiltros < 6) {
        if (!tipo || tipo == "input") {
            NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "<input name='" + criterio + "' placeholder='" + placeholder + "' onkeyup=\"cargarCatalogoEmpleadoAdmin(1,'');\"/><b class='btnFormularios' onclick='EliminarCriterio(this,ConsultarEmpleadosAdmin)'>x</b>", "");
        } else if (tipo == "select") {
        LlenarSelect(url, undefined, leyenda, clave, descripcion, function (selectRelleno) {
            if (selectRelleno.options[0].value == '0') {
                selectRelleno.options[0].value = "";
            }
            selectRelleno.setAttribute("name", criterio);
            selectRelleno.onchange = cargarCatalogoEmpleadoAdmin;
            var spanCriterio = NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "", "");
            spanCriterio.appendChild(selectRelleno);
            var btnCerrar = document.createElement("b");
            btnCerrar.className = 'btnFormularios';
            btnCerrar.onclick = function () { EliminarCriterio(this, function () { cargarCatalogoEmpleadoAdmin(1, '') }); };
            btnCerrar.innerHTML = "x";
            spanCriterio.appendChild(btnCerrar);
        });
        }
    }
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
        $(lista).show("slide", { direction: "up" }, 500);
        lista.activo = true;
    } else {
        $(lista).hide("slide", { direction: "up" }, 500);
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
    try {
        formulario = document.getElementById(_idFormulario);
        formulario.reset();
    } catch (e) { }    
    var divprincipal = document.getElementById("principal");
    $(divprincipal).animate({ left: "-900px" }, 500, function () {});
    var notificacion = document.getElementById("notificacion");
    notificacion.className = "alert-box ocultarV";
}

function IntercambioVisual(idVisible, idOculto) {
    $("#" + idOculto).css({ display: "none" });
    $("#" + idVisible).css({ display: "block" });
}

function MostrarCatalogo() {
    var divprincipal = document.getElementById("principal");
    var buscar = document.getElementById("buscar");
    if(buscar){
        buscar.focus();
    }
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

function QuitarEspera(){
    var inicio = document.getElementById("inicio");
    inicio.className = "";
    var  imagenEspera = document.getElementById("imagenEspera");
    imagenEspera.parentNode.removeChild(imagenEspera);    
}

function SetValor(domXML, tag, idDomElemento, tipo, alias) {
    var valor = "";
    var domElemento = document.getElementById(idDomElemento);
    try { valor = domXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue; } catch (e) { }    
    if (tipo == "bool") {
        valor = valor.toString();
    } else if (tipo == "float") {
        valor = parseInt(valor).toFixed(2);
    }
    if (alias) {
        valor = valor=="true" ? alias.split(":")[0] : alias.split(":")[1]; 
    }
    if (domElemento.tagName == "INPUT" || domElemento.tagName == "TEXTAREA") {
        if (tipo == "bool" && domElemento.tagName == "INPUT") {
            domElemento.checked = ((valor=="1")||(valor.toLowerCase()=="true"));
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
            if (valor.toString() == "true" || valor.toString() == "1") {
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
                var inCriterio = document.getElementById("buscar");
                var criterio;
                if (inCriterio) {
                    criterio = inCriterio.value;
                }
                proceso(pagina,criterio);
            }
        });
    }
}

function TablaCatalogo(){}
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
    TablaCatalogo.cambiarPagina(contenedorTabla.getAttribute("id"),1,"");
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
    var estatus=_estatus;
    var mensaje=_mensaje;
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
        window.setTimeout(function(){
            notificacion.style.visibility = "hidden";
            $(mensajeNotificacion).html("");
        }, 2000);
    }
    else if (estatus < 0) {
        notificacion.className = "alert-box error";
        notificacion.style.visibility = "visible";
        var notificacion = document.getElementById(idAlertas);
    }
    if(callback) callback();
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

function LlenarCatalogoDepartamento(selectUI, callback, cve_dga) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Departamento";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NDepartamento.aspx", { op: "obtenerCatalogoDepartamento", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_departamento: 0, dga_agru: (cve_dga ? cve_dga : 0)
    }).done(function (xmlDoc) {
        var departamento = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < departamento.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(departamento[i], "nombredep");
            optionitem.value = GetValor(departamento[i], "cve_departamento");
            optionitem.setAttribute("centro_costos",GetValor(departamento[i], "c_costos"));
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoConcepto(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Concepto";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NConcepto.aspx", { op: "obtenerCatalogoConcepto", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_concepto: 0
    }).done(function (xmlDoc) {
        var concepto = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < concepto.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(concepto[i], "descripcion");
            optionitem.value = GetValor(concepto[i], "cve_concepto");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoDga(selectUI, callback, cve_empresa) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona DGA";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NDga.aspx", { op: "obtenerCatalogoDga", pagina: 1, longitudPagina: 1000, criterio: "",
        dga_agru: "", cve_empresa: (cve_empresa ? cve_empresa : 0)
    }).done(function (xmlDoc) {
        var dga = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < dga.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(dga[i], "DGA");
            optionitem.value = GetValor(dga[i], "DGA_AGRUP");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoEstatusEmpleado(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Estatus Empleado";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NEstatusEmpl.aspx", { op: "obtenerCatalogoEstatusEmpl", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_estatus: 0
    }).done(function (xmlDoc) {
        var estatusempl = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < estatusempl.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(estatusempl[i], "descripcion");
            optionitem.value = GetValor(estatusempl[i], "cve_estatus");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined){
            callback();
        }
    });
}

function LlenarCatalogoEstadoCivil(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Estado Civl";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NEstadoCivil.aspx", { op: "obtenerCatalogoEstadoCivil", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_estadocivil: 0
    }).done(function (xmlDoc) {
        var estadocivil = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < estadocivil.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(estadocivil[i], "descripcion");
            optionitem.value = GetValor(estadocivil[i], "cve_estadocivil");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoBanco(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Banco";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NBanco.aspx", { op: "obtenerCatalogoBanco", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_banco: 0
    }).done(function (xmlDoc) {
        var banco = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < banco.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(banco[i], "nombre");
            optionitem.value = GetValor(banco[i], "cve_banco");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoPaises(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona País";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post("/Modulos/Seguridad/SeguridadNegocio/" + "NPais.aspx", { op: "obtenerCatalogo", seccion: "Pais", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_pais: 0
    }).done(function (xmlDoc) {
        var pais = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < pais.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(pais[i], "nombre");
            optionitem.value = GetValor(pais[i], "cve_pais");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoEmpresa(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Empresa";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post("/Modulos/Seguridad/SeguridadNegocio/" + "NEmpresas.aspx", { op: "obtenerCatalogo", seccion:"Empresas", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_empresa: 0
    }).done(function (xmlDoc) {
        var empresa = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < empresa.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(empresa[i], "nombre");
            optionitem.value = GetValor(empresa[i], "cve_empresa");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoLugarTrabajo(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Lugar de Trabajo";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NLugarTrabajo.aspx", { op: "obtenerCatalogoLugarTrabajo", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_lugar: 0
    }).done(function (xmlDoc) {
        var empresa = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < empresa.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(empresa[i], "descripcion");
            optionitem.value = GetValor(empresa[i], "cve_lugar");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoGrado(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Grado";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NGrado.aspx", { op: "obtenerCatalogoGrado", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_grado: 0
    }).done(function (xmlDoc) {
        var grado = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < grado.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(grado[i], "descripcion");
            optionitem.value = GetValor(grado[i], "cve_grado");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoTipoEmpleado(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Tipo Empleado";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NTipoEmpl.aspx", { op: "obtenerCatalogoTipoEmpl", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_tipoemp: 0
    }).done(function (xmlDoc) {
        var tipoempleado = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < tipoempleado.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(tipoempleado[i], "descripcion");
            optionitem.value = GetValor(tipoempleado[i], "cve_tipoemp");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoSexo(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Sexo";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NSexo.aspx", { op: "obtenerCatalogoSexo", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_sexo: 0
    }).done(function (xmlDoc) {
        var sexo = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < sexo.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(sexo[i], "descripcion");
            optionitem.value = GetValor(sexo[i], "cve_sexo");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoEstados(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Estado";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NEstado.aspx", { op: "obtenerCatalogoEstado", pagina: 1, longitudPagina: 1000, criterio: "",
        cveestado: 0
    }).done(function (xmlDoc) {
        var estado = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < estado.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(estado[i], "nombreestado");
            optionitem.value = GetValor(estado[i], "cveestado");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoMunicipio(selectUI, callback,cveestado) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Municipio";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NMunicipio.aspx", { op: "obtenerCatalogoMunicipio", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_municipio: 0,cveestado:cveestado
    }).done(function (xmlDoc) {
        var municipio = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < municipio.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(municipio[i], "nombremuni");
            optionitem.value = GetValor(municipio[i], "cve_municipio");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoPuesto(selectUI, callback, cve_departamento) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Puesto";
    optionitem.value = "";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NPuestosGenericos.aspx", { op: "obtenerCatalogo", seccion: "PuestoGenerico", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_puesto: "", cve_departamento: (cve_departamento ? cve_departamento : 0)
    }).done(function (xmlDoc) {
        var puesto = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < puesto.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(puesto[i], "nombrepuesto");
            optionitem.value = GetValor(puesto[i], "cve_puesto");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoPuestosDepartamento(selectUI, callback, cve_departamento) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Puesto";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NPuestosGenericos.aspx", { op: "obtenerCatalogo", seccion: "PuestosDepartamentos", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_departamento: (cve_departamento ? cve_departamento : 0)
    }).done(function (xmlDoc) {
        var puesto = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < puesto.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(puesto[i], "nombre_puesto");
            optionitem.value = GetValor(puesto[i], "cve_puesto");
            optionitem.setAttribute("tabulador", GetValor(puesto[i], "tabulador"));
            optionitem.setAttribute("stabulador", GetValor(puesto[i], "stabulador"));
            optionitem.setAttribute("nivel", GetValor(puesto[i], "nivel"));
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoFamiliaPuesto(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Familia Puesto";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NFamiliaPuesto.aspx", { op: "obtenerCatalogoFamiliaPuesto", pagina: 1, longitudPagina: 1000, criterio: "",
        fampuesto: 0
    }).done(function (xmlDoc) {
        var fampuesto = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < fampuesto.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(fampuesto[i], "descripcion");
            optionitem.value = GetValor(fampuesto[i], "fampuesto");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoTipoPlantilla(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Tipo Plantilla";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NTipoPlantilla.aspx", { op: "obtenerCatalogoTipoPlantilla", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_tipoplantilla: 0
    }).done(function (xmlDoc) {
        var  tipoplantilla = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < tipoplantilla.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(tipoplantilla[i], "descripcion");
            optionitem.value = GetValor(tipoplantilla[i], "cve_tipoplantilla");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoNivel(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Nivel Puesto";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NNivelPuesto.aspx", { op: "obtenerCatalogoNivelPuesto", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_nivel: 0
    }).done(function (xmlDoc) {
        var nivel = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < nivel.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(nivel[i], "cve_puesto");
            optionitem.value = GetValor(nivel[i], "cve_nivel");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoSegmento(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Segmento";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NSegmento.aspx", { op: "obtenerCatalogoSegmentos", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_segmento: 0
    }).done(function (xmlDoc) {
        var segmento = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < segmento.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(segmento[i], "descripcion");
            optionitem.value = GetValor(segmento[i], "cve_segmento");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoTurno(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Turno";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NTurno.aspx", { op: "obtenerCatalogoTurno", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_turno: 0
    }).done(function (xmlDoc) {
        var turno = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < turno.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(turno[i], "descripcion");
            optionitem.value = GetValor(turno[i], "cve_turno");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoGrupoPago(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Grupo Pago";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NGrupoPago.aspx", { op: "obtenerCatalogoGrupoPago", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_grupopago: 0
    }).done(function (xmlDoc) {
        var grupopago = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < grupopago.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(grupopago[i], "descripcion");
            optionitem.value = GetValor(grupopago[i], "cve_grupopago");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoTabuladorNivel(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Nivel Tabulador";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NTabulador.aspx", { op: "obtenerCatalogoTabulador", pagina: 1, longitudPagina: 1000, criterio: "",
        tabulador: 0
    }).done(function (xmlDoc) {
        var niveltabular = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < niveltabular.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(niveltabular[i], "nivel");
            optionitem.value = GetValor(niveltabular[i], "tabulador");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoTabulador(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Tabulador";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NCatalogosTresCampos.aspx", { op: "obtenerCatalogo", seccion: "TabuladorDescripciones", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_tabulador: 0
    }).done(function (xmlDoc) {
        var tabulador = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < tabulador.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(tabulador[i], "descripcion");
            optionitem.value = GetValor(tabulador[i], "cve_tabulador");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function ToggleOpcionesEmpleado() {
    var lista = document.getElementById("opcionesEmpleado");
    if (!lista.activo) {
        $(lista).show("blind", { direction: "up" }, 500);
        lista.activo = true;
    } else {
        $(lista).hide("blind", { direction: "up" }, 500);
        lista.activo = false;
    }
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
    if (idOcultar){
        IntercambioVisual(idFrameAux, idOcultar);
    }
}

function DesplazarElemento(idelemento, cambio) {
    var divPrincipal = document.getElementById(idelemento);
    $(divPrincipal).animate({ left: cambio + "px" }, 500, function () { });
};