var POSICION_SELECCIONADA;
var NUMERO_POSICIONES=0;

ReubicarContextMenu = function () {
    var menuMovimientos = document.getElementById("opcionesPosiciones");
    if (menuMovimientos.wrapper) {
        menuMovimientos.style.display = "none";
        menuMovimientos.style.left = "";
        menuMovimientos.style.top = "";
        menuMovimientos.wrapper.appendChild(menuMovimientos);
    }
}

function ObtenerArbolPosiciones(idFrmCriterios, idTreeView, criterio, esSeleccion, nivelTabular,estatus) {
    var parametros = $("#" + idFrmCriterios).serialize();
    var s_nivelTabular = nivelTabular ? "&s_estatus=" + estatus + "&nivelTabular=" + nivelTabular : "";//ESTATUS VACANTE
    PonerEnEspera();
    var widthSpan = 280;//Ancho de columna de pposiciones
    $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", "op=ObtenerEstructura&tipoConsulta=ESTRUCTURA&" + parametros + s_nivelTabular).done(function (xmlDoc) {
        QuitarEspera();
        var items = xmlDoc.getElementsByTagName("Table");
        var arbolContenedor = document.getElementById(idTreeView);
        NUMERO_POSICIONES = items.length;
        if (items.length > 0) {
            $(arbolContenedor).html("");
            var encabezado = document.createElement("div");
            encabezado.className = "encabezado";
            encabezado.innerHTML = "<span class='c c-0'>Editar</span><span class='wrap-nodos' id='posicion-header'>Puesto</span><span class='c'>Posición</span><span class='c'>Empleado</span><span class='c'>Departamento</span><span class='c'>Tipo</span><span class='c'>Estatus</span>";
            arbolContenedor.appendChild(encabezado);
            var ulArbol = document.createElement("ul");
            ulArbol.esRaiz = true;
            ulArbol.className = "arbol";
            try {
                //                window.top.document.body.addEventListener("click", window.ReubicarContextMenu);
                window.top.document.body.addEventListener("scroll", window.ReubicarContextMenu);
            } catch (e) { }
            //            document.body.addEventListener("click", ReubicarContextMenu);
            document.body.addEventListener("scroll", ReubicarContextMenu);
            arbolContenedor.appendChild(ulArbol);
            var item, pagina, padre, itemAux, num_plantilla, num_plantilladep, ulHijos, vinculo, btnDesplegar, checkOpcion, icono, spanAuxTree, idEmpleado, campo0, campo1, campo2, campo3, campo4, campo5, imgEditar, row, nivel, parametrosCadena;
            for (var i = 0; i < items.length; i++) {
                num_plantilla = GetValor(items[i], "num_plantilla");
                num_plantilladep = GetValor(items[i], "num_plantilladep");
                pagina = GetValor(items[i], "pagina");
                item = document.createElement("li");
                item.num_plantilladep = num_plantilladep;
                item.setAttribute("id", "nodo_" + num_plantilla);
                item.className = "hoja";
                vinculo = document.createElement("a");
                vinculo.innerHTML = GetValor(items[i], "puesto");
                vinculo.setAttribute("title", GetValor(items[i], "puesto"));
                btnDesplegar = document.createElement("button");
                btnDesplegar.vinculo = vinculo;
                btnDesplegar.innerHTML = "";
                item.btnDesplegar = btnDesplegar;
                spanAuxTree = document.createElement("span");
                spanAuxTree.appendChild(btnDesplegar);
                spanAuxTree.className = "wrap-nodos";
                if (esSeleccion) {
                    checkOpcion = document.createElement("input");
                    checkOpcion.setAttribute("type", "checkbox");
                    checkOpcion.setAttribute("value", num_plantilla);
                    item.checkOpcion = checkOpcion;
                    btnDesplegar.checkOpcion = checkOpcion;
                    spanAuxTree.appendChild(checkOpcion);
                    item.checkOpcion.checked = GetValor(items[i], "esDePerfil").toString() == "1";
                    item.checkOpcion.onclick = function () {
                        marcarHijos(this);
                        marcarPadres(this);
                    }
                }
                spanAuxTree.appendChild(vinculo);
                row = document.createElement("div");
                row.className = "item";
                row.numPosicion = num_plantilla;
                row.onclick = function () { MarcarPosicion(this); }
                //                row.oncontextmenu = function (e) {
                //                    if (POSICION_SELECCIONADA && POSICION_SELECCIONADA == this) {
                //                        if (!e) {
                //                            e = window.event;
                //                        }
                //                        var menuMovimientos = document.getElementById("opcionesPosiciones");

                //                        menuMovimientos.style.left = e.pageX + "px";
                //                        menuMovimientos.style.top = (e.pageY - parseInt($(menuMovimientos).css("height")) / 2) + "px";

                //                        menuMovimientos.wrapper = menuMovimientos.parentNode;
                //                        menuMovimientos.style.display = "block";
                //                        this.appendChild(menuMovimientos);
                //                    }
                //                };

                campo0 = NuevoElemento(row, "span", "c c-0", "", "");
                imgEditar = NuevoElemento(campo0, "img", "", "", "");
                imgEditar.src = "/Recursos/imagenes/editar.png";
                imgEditar.num_plantilla = GetValor(items[i], "num_plantilla");
                imgEditar.onclick = function () {
                    MostrarEditarEmpleado(this.num_plantilla);
                };
                row.appendChild(spanAuxTree);
                NuevoElemento(row, "span", "c c-3", GetValor(items[i], "num_plantilla"), "");
                var sEstatus = GetValor(items[i], "s_estatus");
                if (sEstatus == "VACANTE") {
                    vinculo.style.backgroundImage = "url(/Recursos/imagenes/empl_vacante.png)";
                } else if (sEstatus == "SUSPENDIDA") {
                    vinculo.style.backgroundImage = "url(/Recursos/imagenes/empl_suspendida.png)";
                } else if (sEstatus == "CANCELADA") {
                    vinculo.style.backgroundImage = "url(/Recursos/imagenes/empl_cancelada.png)";
                } else if (sEstatus == "BAJA") {
                    vinculo.style.backgroundImage = "url(/Recursos/imagenes/empl_baja.png)";
                } else if (sEstatus == "OCUPADA") {
                    vinculo.style.backgroundImage = "url(/Recursos/imagenes/empl_ocupada.png)";
                }
                NuevoElemento(row, "span", "c c-1", GetValor(items[i], "id_empleado"), "");
                campo4 = NuevoElemento(row, "span", "c c-2", GetValor(items[i], "nombredep"), "");
                campo4.setAttribute("title", GetValor(items[i], "cve_departamento"));
                campo3 = NuevoElemento(row, "span", "c c-5", GetValor(items[i], "descripcion"), "");
                campo3.setAttribute("title", GetValor(items[i], "tipoplantilla"));
                NuevoElemento(row, "span", "c c-4", sEstatus, "");
                item.appendChild(row);
                item.btnDesplegar.nivel = GetValor(items[i], "nivelOrden");
                padre = document.getElementById("nodo_" + num_plantilladep);
                if (padre) {
                    var paddingPadre = padre.btnDesplegar.style.paddingLeft;
                    paddingPadre = paddingPadre ? parseInt(paddingPadre) : 0;
                    btnDesplegar.style.paddingLeft = (paddingPadre + 20) + "px";
                    vinculo.style.width = (widthSpan - parseInt(btnDesplegar.style.paddingLeft) - 60) + "px";
                    ulHijos = padre.getElementsByTagName("ul");
                    if (ulHijos.length > 0) {
                        itemAux = ulHijos[0];
                        itemAux.appendChild(item);
                    } else {
                        itemAux = document.createElement("ul");
                        if (parseInt(GetValor(items[i], "nivelOrden")) > 1) {
                            itemAux.style.display = "none";
                            itemAux.visible = true;
                        }
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
                                this.innerHTML = "+";
                                this.listaHijos.style.display = "none";
                                this.listaHijos.visible = false;
                            } else {
                                this.innerHTML = "-";
                                this.listaHijos.style.display = "block";
                                this.listaHijos.visible = true;
                            }
                        }
                    }
                    nivel = 0;
                    parametrosCadena = "";
                    var arrayParametros = parametros.split("&");
                    var k = 0;
                    for (k = 0; k < arrayParametros.length; k++) {
                        parametrosCadena += arrayParametros[k].split("=")[1];
                    }
                    try {
                        nivel = parseInt(GetValor(items[i], "nivel"), 10);
                    } catch (e) { }
                    if (nivel > 2 && $.trim(parametrosCadena).length == 0) {
                        padre.btnDesplegar.listaHijos.style.display = "none";
                        padre.btnDesplegar.innerHTML = "+";                           
                        padre.btnDesplegar.listaHijos.visible = false;
                    } else {
                        padre.btnDesplegar.listaHijos.style.display = "block";
                        padre.btnDesplegar.innerHTML = "-";
                        padre.btnDesplegar.listaHijos.visible = true;                        
                    }
                } else {
                    ulArbol.appendChild(item);
                }
            }
        } else {
            $(arbolContenedor).html("<h3 style='text-align:center;'>No hay posiciones disponibles</h3>");
        }
    });
}

MarcarPosicion = function (item) {
    if (POSICION_SELECCIONADA) {
        POSICION_SELECCIONADA.className = "item";
    }
    item.className = "item-seleccionado";
    POSICION_SELECCIONADA = item;
}