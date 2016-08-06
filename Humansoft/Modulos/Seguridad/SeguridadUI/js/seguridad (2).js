var urlBase_WS = "/NegocioSeguridad/";

function MostrarTipoPasword(idParrafo) {
    $.post(urlBase_WS + "Nseguridad.aspx", { op: "ObtenerDescripcionTipoPassword" }).done(function (xmlDoc) {
        document.getElementById(idParrafo).innerHTML = GetValor(xmlDoc, "descripcion");
        if (new RegExp("alto","gi").test(document.getElementById(idParrafo).innerHTML)) {
            document.getElementById("nuevopassword").value = "";
            document.getElementById("nuevopassword").setAttribute("readonly", "readonly");
        } else {
            document.getElementById("nuevopassword").removeAttribute("readonly");
        }
    });
}

function GuardarCambioPassword() {
    var frmCambiarPassword = document.getElementById("frmCambiarPassword");
    var parametros = $(frmCambiarPassword).serialize();
    $.post(urlBase_WS + "Nseguridad.aspx", "op=CambiarPassword&" + parametros).done(function (xmlDoc) {
        document.getElementById("nuevopassword").value= GetValor(xmlDoc, "passwordNuevo");
        mostrarNotificacion(xmlDoc, "notificacion", function () {});         
    });
}

function CerrarSesion(){
    $.post(urlBase_WS + "NSeguridad.aspx", { op: "CerrarSesion" }).done(function (xmlDoc) {
        window.top.location.href = "/default.htm";
    });
}

function ValidarEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function MostrarFormulario() {
    var divprincipal = document.getElementById("principal");
    var formulario = divprincipal.getElementsByTagName("form")[0];
    formulario.reset();
    $(divprincipal).animate({ left: "-900px" }, 1000, function () {});
    var notificacion = document.getElementById("notificacion");
    notificacion.className = "alert-box ocultar";

}

function IntercambioVisual(idVisible, idOculto) {
    $("#" + idOculto).css({ display: "none" });
    $("#" + idVisible).css({ display: "block" });
}

function MostrarCatalogo() {
    var divprincipal = document.getElementById("principal");
    $(divprincipal).animate({ left: "0px" }, 1000, function () {});
    var btnAgregar = document.getElementById("btnagregar");
    btnAgregar.style.visibility = "visible";
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
    var  imagenEspera = document.getElementById("imagenEspera");
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
        valor = valor=="true" ? alias.split(":")[0] : alias.split(":")[1]; 
    }
    if (domElemento.tagName == "INPUT" || domElemento.tagName == "TEXTAREA") {
        domElemento.value = valor;
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

function LlenarCatalogoIdiomas(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Idioma";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NIdiomas.aspx", { op: "obtenerCatalogoIdiomas", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_idioma: 0
    }).done(function (xmlDoc) {        
        var idiomas = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < idiomas.length; i++){
            optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(idiomas[i], "idioma");
            optionitem.value = GetValor(idiomas[i], "cve_idioma");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
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

function BuscarImagenes(ev, objeto,idDiv,proceso) {
    var criterio = $.trim(objeto.value);
    LlenarCatalogoImagenes(1, criterio, idDiv,proceso);
}

function LlenarCatalogoImagenes(pagina, _criterio, idDiv, callback) {
    var tamPagina = 20;
    var divUI;
    if (idDiv != undefined) {
        divUI = document.getElementById(idDiv);
        divUI.callback = callback;
    }
    var criterio = _criterio;
    if (_criterio!=undefined) {
        divUI.criterio = _criterio;
        criterio = _criterio;
    }else{
        criterio = divUI.criterio;
    }
    var existeLista = ($("#" + divUI.id + " > ul.lista-imagenes").lenght == 0);
    if (!existeLista) {
        divUI.innerHTML = "";
        listaImagenes = document.createElement("ul");
        listaImagenes.className = "lista-imagenes";
        divUI.appendChild(listaImagenes);
    } else {
        $(listaImagenes).html("");
    }
    $.post(urlBase_WS + "NImagenes.aspx", { op: "obtenerCatalogoImagenes", pagina: pagina, longitudPagina: tamPagina, criterio: (criterio ? criterio : ""), cve_imagen: 0 }).done(function (xmlDoc) {
        var imagenes = xmlDoc.getElementsByTagName("Table");
        var listaImagenes = $("#" + idDiv + " > ul.lista-imagenes")[0];
        var divAux = document.getElementById(idDiv);
        $(listaImagenes).html("");
        var totalregistros;
        for (var i = 0; i < imagenes.length; i++) {
            var cveImagen = GetValor(imagenes[i], "cve_imagen");
            var path = GetValor(imagenes[i], "path");
            var itemLista = document.createElement("li");
            totalregistros = GetValor(imagenes[i], "totalRegistros");
            var imagen = document.createElement("img");
            imagen.cveImagen = cveImagen;
            imagen.src = "/Recursos/iconos-imagenes" + path;
            if (divAux.callback) {
                imagen.onclick = divAux.callback;
            }
            itemLista.appendChild(imagen);
            listaImagenes.appendChild(itemLista);
        }
        var paginador = document.createElement("div");
        paginador.setAttribute("tamPagina", tamPagina); //Importante para crear el paginador
        divUI.appendChild(paginador);
        paginarTabla(pagina, totalregistros, function (pagina) { LlenarCatalogoImagenes(pagina, undefined, idDiv); }, paginador);
    });
}

function LlenarCatalogoMenus(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Menú";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NMenus.aspx", { op: "ObtenerCatalogoMenus", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_menu: 0
    }).done(function (xmlDoc) {
        var subPadre = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < subPadre.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(subPadre[i], "nombre");
            optionitem.value = GetValor(subPadre[i], "cve_menu");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}


function ObtenerMenusPerfil(idTreeView, esSeleccion) {
    $.post(urlBase_WS + "NConfiguracionPerfiles.aspx", "op=ObtenerMenusPefil").done(function (xmlDoc) {
        var arbolContenedor = document.getElementById(idTreeView);
        var ulArbol = document.createElement("ul");
        ulArbol.esRaiz = true;
        ulArbol.className = "arbol";
        arbolContenedor.appendChild(ulArbol);
        var items = xmlDoc.getElementsByTagName("Table");
        var item, pagina, padre, itemAux, cve_submenu, cve_padremenu, ulHijos, vinculo, btnDesplegar, checkOpcion;
        for (var i = 0; i < items.length; i++) {
            cve_submenu = GetValor(items[i], "cve_menu");
            cve_padremenu = GetValor(items[i], "cve_padremenu");
            pagina = GetValor(items[i], "pagina");
            item = document.createElement("li");
            item.setAttribute("id", "nodo_" + cve_submenu);
            item.className = "hoja";

            vinculo = document.createElement("a");
            vinculo.innerHTML = GetValor(items[i], "nombre");
            vinculo.href = "inicio.aspx?url=" + pagina;
            vinculo.setAttribute("title", GetValor(items[i], "tooltip"));

            btnDesplegar = document.createElement("button");
            btnDesplegar.vinculo = vinculo;
            item.btnDesplegar = btnDesplegar;
            item.appendChild(btnDesplegar);

            if (esSeleccion) {
                checkOpcion = document.createElement("input");
                checkOpcion.setAttribute("type", "checkbox");
                item.checkOpcion = checkOpcion;
                btnDesplegar.checkOpcion = checkOpcion;
                item.appendChild(checkOpcion);
                item.checkOpcion.onclick = function () {
                    marcarHijos(this);
                    marcarPadres(this);
                }
            }
            item.appendChild(vinculo);
            padre = document.getElementById("nodo_" + cve_padremenu);
            if (padre) {
                ulHijos = padre.getElementsByTagName("ul");
                if (ulHijos.length > 0) {
                    itemAux = ulHijos[0];
                    itemAux.appendChild(item);
                } else {
                    itemAux = document.createElement("ul");
                    padre.btnDesplegar.listaHijos = itemAux;
                    if (esSeleccion) {
                        padre.checkOpcion.listaHijos = itemAux;
                    }
                    itemAux.appendChild(item);
                    itemAux.style.display = "block";
                    itemAux.visible = true;
                    padre.appendChild(itemAux);
                }
                if (padre.className != "padre") {
                    padre.className = "padre";
                    padre.btnDesplegar.onclick = function () {
                        if (this.listaHijos.visible) {
                            this.listaHijos.style.display = "none";
                            this.listaHijos.visible = false;
                        } else {
                            this.listaHijos.style.display = "block";
                            this.listaHijos.visible = true;
                        }
                    }
                }
            } else {
                ulArbol.appendChild(item);
            }
        }

    });
}


function marcarPadres(itemCheckOpcion) {
    var ulItem = itemCheckOpcion.parentNode.parentNode;
    var hijosUL = ulItem.children;
    var auxRevision=true;
    if(!ulItem.esRaiz){
        for (var i = 0; i < hijosUL.length; i++) {
            if (!hijosUL[i].checkOpcion.checked) {
                auxRevision = false;
                break;
            }
        }
        ulItem.parentNode.checkOpcion.checked = auxRevision;
        marcarPadres(ulItem.parentNode.checkOpcion); 
    }
}

function marcarHijos(item) {
    if (item.listaHijos){
        var checks = item.listaHijos.getElementsByTagName("input");
        if (item.checked) {
            item.checked = true;
            for (var i = 0; i < checks.length; i++) {
                checks[i].checked = true;
            }
        } else {
            item.checked = false;
            for (var i = 0; i < checks.length; i++) {
                checks[i].checked = false;
            }
        }
    }
}


function LlenarCatalogoPerfiles(selectUI, callback) {
    selectUI.innerHTML = "";

    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Perfil";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NPerfiles.aspx", { op: "obtenerCatalogoPerfiles", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_perfil: 0
    }).done(function (xmlDoc) {
        var perfil = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < perfil.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(perfil[i], "nombre");
            optionitem.value = GetValor(perfil[i], "cve_perfil");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}



function LlenarCatalogoTipoPassword(selectUI, callback) {
    selectUI.innerHTML = "";

    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona TipoPassword";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NTipoPassword.aspx", { op: "obtenerCatalogoTiposPassword", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_tipopassword: 0
    }).done(function (xmlDoc) {
        var tipopassword = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < tipopassword.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(tipopassword[i], "nombre");
            optionitem.value = GetValor(tipopassword[i], "cve_tipopassword");
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

    $.post(urlBase_WS + "NPaises.aspx", { op: "obtenerCatalogoPais", pagina: 1, longitudPagina: 1000, criterio: "",
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



function LlenarCatalogoEstados(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Estado";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NEstado.aspx", { op: "obtenerCatalogoEstado", pagina: 1, longitudPagina: 1000, criterio: "",
        estado: 0
    }).done(function (xmlDoc) {
        var estado = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < estado.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(estado[i], "nombreestado");
            optionitem.value = GetValor(estado[i], "estado");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}






function LlenarCatalogoGiros(selectUI, callback) {
    selectUI.innerHTML = "";

    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Giro";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NGiros.aspx", { op: "obtenerCatalogoGiros", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_giro: 0
    }).done(function (xmlDoc) {
        var giro = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < giro.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(giro[i], "nombre");
            optionitem.value = GetValor(giro[i], "cve_giro");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}




function LlenarCatalogoRegiones(selectUI, callback) {
    selectUI.innerHTML = "";

    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Región";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NRegion.aspx", { op: "obtenerCatalogoRegion", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_region: 0
    }).done(function (xmlDoc) {
        var region = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < region.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(region[i], "nombre");
            optionitem.value = GetValor(region[i], "cve_region");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}




function LlenarCatalogoEmpresas(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Empresa";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NEmpresas.aspx", { op: "obtenerCatalogoEmpresas", pagina: 1, longitudPagina: 1000, criterio: "",
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


function LlenarCatalogoTipos(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Tipo";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);

    $.post(urlBase_WS + "NTiposSuc.aspx", { op: "obtenerCatalogoTipoSuc", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_tipo: 0
    }).done(function (xmlDoc) {
        var tipo = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < tipo.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(tipo[i], "nombre");
            optionitem.value = GetValor(tipo[i], "cve_tipo");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}


function LlenarCatalogoZonas(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Zona";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NZona.aspx", { op: "obtenerCatalogoZona", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_zona: 0
    }).done(function (xmlDoc) {
        var zona = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < zona.length; i++){
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(zona[i], "nombre");
            optionitem.value = GetValor(zona[i], "cve_zona");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}



function LlenarCatalogoSucursales(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Sucursal";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NSucursales.aspx", { op: "obtenerCatalogoSucursales", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_sucursal: 0
    }).done(function (xmlDoc) {
        var sucursal = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < sucursal.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(sucursal[i], "nombre");
            optionitem.value = GetValor(sucursal[i], "cve_sucursal");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
        }
    });
}

function LlenarCatalogoUsuarios(selectUI, callback) {
    selectUI.innerHTML = "";
    var optionitem = document.createElement("option");
    optionitem.innerHTML = "Selecciona Usuario";
    optionitem.value = "0";
    selectUI.appendChild(optionitem);
    $.post(urlBase_WS + "NUsuarios.aspx", { op: "ObtenerCatalogoUsuarios", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_usuario: 0
    }).done(function (xmlDoc) {
        var usuario = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < usuario.length; i++) {
            var optionitem = document.createElement("option");
            optionitem.innerHTML = GetValor(usuario[i], "nombre");
            optionitem.value = GetValor(usuario[i], "cve_usuario");
            selectUI.appendChild(optionitem);
        }
        if (callback != undefined) {
            callback();
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
        $(notificacion).animate({ visibility: "visible" }, 500);
        callback();
        window.setTimeout(function () { $(notificacion).animate({visibility:"hidden"},500); }, 2000);
    }
    else if (estatus < 0) {
        notificacion.className = "alert-box error";
        $(notificacion).animate({ visibility: "visible" }, 500);
        var notificacion = document.getElementById(idAlertas);

    }
}

