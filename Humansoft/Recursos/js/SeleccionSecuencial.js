var NuevoSeleccionSecuencial = function (stitulo, descripcionListas, claseCss, callback, OnSeleccion, esConsulta,formato,ocultarSeleccion) {
    var contenedorPrincipal = document.createElement("div");
    descripcionListas.callbackPincipal=callback;
    var contenedorListas = document.createElement("div");
    contenedorPrincipal.className = claseCss;
    try{
        contenedorPrincipal.style.width = formato.width;
    }catch(e){}
    var titulo = document.createElement("h3");
    titulo.innerHTML = stitulo;
    var agrupador = document.createElement("div");
    if (!esConsulta) {
        var lblseleccion = document.createElement("h4");
        agrupador.style.display = (ocultarSeleccion ? "none" : "block");
        var btnSeleccion = document.createElement("button");
        btnSeleccion.innerHTML = "Aceptar";
        btnSeleccion.className = "btn agregar";
        btnSeleccion.onclick = function () { OnSeleccion(contenedorListas.seleccion); }
        agrupador.appendChild(btnSeleccion);
        contenedorListas.btnSeleccion = btnSeleccion;
        agrupador.className = "lblseleccion";
        agrupador.appendChild(lblseleccion);
        contenedorListas.lblseleccion = lblseleccion;
    }
    var pie = document.createElement("div");
    contenedorPrincipal.appendChild(titulo);
    contenedorPrincipal.appendChild(agrupador);
    contenedorPrincipal.appendChild(contenedorListas);
    contenedorPrincipal.appendChild(pie);
    contenedorListas.descripcionListas = descripcionListas;
    contenedorListas.ocultarSeleccion = ocultarSeleccion;
    try{
        contenedorListas.formato = formato;
    }catch(e){}
    contenedorListas.contenedorPadre = contenedorPrincipal;
    AgregarLista(contenedorListas, callback, 0);
}

function AgregarLista(contenedorListas, callback, indice) {
    if (contenedorListas.descripcionListas){
        $.post(contenedorListas.descripcionListas[indice].url, contenedorListas.descripcionListas[indice].parametros).done(function (xmlDoc) {
            NuevoListaDinamica(contenedorListas, xmlDoc, indice);
            if(callback){
                callback(contenedorListas.contenedorPadre);
            }
        });
    }
}

var NuevoListaDinamica = function (contenedorListas, xmlDoc, indice) {
    var ocultos = contenedorListas.descripcionListas[indice].ocultos;
    var ulLista = document.createElement("table");
    if (contenedorListas.descripcionListas[indice].esMultiSeleccion) {
        var trBusqueda = document.createElement("tr");
        var tdBusqueda = document.createElement("td");
        tdBusqueda.setAttribute("colspan", contenedorListas.descripcionListas[indice].colspan == undefined ? contenedorListas.descripcionListas[indice].encabezado.columnas.length : contenedorListas.descripcionListas[indice].colspan);
        var inputBusqueda = document.createElement("input");
        inputBusqueda.setAttribute("style", "width:99%;margin:0px;display:block;margin:auto;");
        inputBusqueda.setAttribute("placeholder", contenedorListas.descripcionListas[indice].placeHolder == undefined ? "" : contenedorListas.descripcionListas[indice].placeHolder);
        tdBusqueda.appendChild(inputBusqueda);
        trBusqueda.appendChild(tdBusqueda);
        ulLista.appendChild(trBusqueda);
        inputBusqueda.onkeyup = function () {
            var inputLocal = this;
            contenedorListas.descripcionListas[indice].parametros["criterio"] = this.value;
            $.post(contenedorListas.descripcionListas[indice].url, contenedorListas.descripcionListas[indice].parametros).done(function (xmlDoc) {
                LlenarBodyTabla(inputLocal.bodyTabla, contenedorListas, xmlDoc, indice,ocultos);
            });
        }
    }
    ulLista.indice = indice;
    ulLista.contenedorListas = contenedorListas;
    ulLista.alias = contenedorListas.descripcionListas[indice].alias;
    var thoptionitem, tdCampo, campos, formatos, columnas;
    var head = document.createElement("thead");
    thoptionitem = document.createElement("tr");
    head.appendChild(thoptionitem);
    columnas = contenedorListas.descripcionListas[indice].encabezado.columnas;
    for (var k = 0; k < columnas.length; k++) {
        tdCampo = document.createElement("th");
        tdCampo.innerHTML = columnas[k].split("|")[0];
        tdCampo.style = columnas[k].split("|")[1] ? columnas[k].split("|")[1] : (columnas[k].length*12 + 'px');
        tdCampo.style.display = ($.inArray(k, ocultos)) > -1 ? "none" : "";
        thoptionitem.appendChild(tdCampo);
    }
    ulLista.appendChild(head);
    var bodyTabla = document.createElement("tbody");
    bodyTabla.setAttribute("id", contenedorListas.descripcionListas[indice].idTabla);
    if (contenedorListas.descripcionListas[indice].esMultiSeleccion) {
        inputBusqueda.bodyTabla = bodyTabla;
    }
    LlenarBodyTabla(bodyTabla, contenedorListas, xmlDoc, indice,ocultos);

    if (contenedorListas.ocultarSeleccion){
        var wrappTabla = document.createElement("div");
        wrappTabla.className = "wrappTabla";
        wrappTabla.appendChild(ulLista);
        var wrapdatatable = document.createElement("div");
        wrapdatatable.className = "wraptable";
        var datatable = document.createElement("table");
        wrapdatatable.appendChild(datatable);
        datatable.appendChild(bodyTabla);
        wrappTabla.appendChild(wrapdatatable);
        contenedorListas.appendChild(wrappTabla);
    } else {
        ulLista.appendChild(bodyTabla);
        contenedorListas.appendChild(ulLista);
    }
}

function LlenarBodyTabla(bodyTabla, contenedorListas, xmlDocx, indice, ocultos) {
    bodyTabla.innerHTML = "";
    var optionitem; var campos;
    var items = xmlDocx.getElementsByTagName("Table");
    for (var i = 0; i < items.length; i++) {
        optionitem = document.createElement("tr");
        optionitem.indice = indice;
        campos = contenedorListas.descripcionListas[indice].campos;
        formatos = contenedorListas.descripcionListas[indice].formatos || Object;
        optionitem.valor = {};var tdCampo;
        for (var j = 0; j < campos.length; j++) {
            tdCampo = document.createElement("td");
            if (typeof campos[j] == "object") {
                campo = campos[j].col;
                tdCampo.innerHTML = (campos[j].pre == undefined ? "" : campos[j].pre) + GetValor(items[i], campos[j].col) + (campos[j].post == undefined ? "" : campos[j].post);
                tdCampo.style.display = (campos[j].className == undefined ? "" : campos[j].className);
            } else {
                campo = campos[j].split("|")[0];
                if (campos[j].split("|")[1]) tdCampo.className = campos[j].split("|")[1];
                tdCampo.innerHTML = GetValor(items[i], campo, formatos[campo]);
                tdCampo.style.display = ($.inArray(j, ocultos)) > -1 ? "none" : "";
            }
            optionitem.appendChild(tdCampo);
            optionitem.valor[campo] = tdCampo.innerHTML;
        }
        if (contenedorListas.descripcionListas[indice].callbackAfterRow) {
            contenedorListas.descripcionListas[indice].callbackAfterRow(optionitem);
        }
        optionitem.onclick = function () {
            if (!contenedorListas.descripcionListas[indice].esConsulta) {
                if (this.className != "seleccionado") {
                    if (this.parentNode.parentNode.activo && this.parentNode.parentNode.activo.className == "seleccionado" && !contenedorListas.descripcionListas[indice].esMultiSeleccion) {
                        this.parentNode.parentNode.activo.className = "";                        
                    }
                    this.className = "seleccionado";
                    this.parentNode.parentNode.activo = this;
                    if (!contenedorListas.descripcionListas[indice].esMultiSeleccion) {
                        this.parentNode.parentNode.valor = this.valor;
                    } else {                       
                        if (!this.parentNode.parentNode.valores) {
                            this.parentNode.parentNode.valores = [];
                        } 
                        this.parentNode.parentNode.valores.push(this.valor);
                        if (contenedorListas.descripcionListas[indice].onSeleccionar) {
                            contenedorListas.descripcionListas[indice].onSeleccionar(this.valor);
                        }
                    }
                    try{
                        var listasExistentes = contenedorListas.getElementsByTagName("table");

                        var numeroListas = listasExistentes.length;
                        for (var n = indice + 1; n < numeroListas; n++) {
                            contenedorListas.removeChild(listasExistentes[n]);
                            n--;
                            numeroListas = listasExistentes.length;
                        }
                    
                        for (var propiedad in contenedorListas.descripcionListas[indice].sigSolicitud) {
                            contenedorListas.descripcionListas[indice + 1].parametros[propiedad] = this.valor[contenedorListas.descripcionListas[indice].sigSolicitud[propiedad]];
                        }
                    
                        //Asignar valores a la seleccion
                        var tablas = contenedorListas.getElementsByTagName("table");
                        contenedorListas.lblseleccion.innerHTML = "";
                        contenedorListas.seleccion = [];
                        for (var k = 0; k < tablas.length; k++) {
                            if (tablas[k].activo) {
                                if (!contenedorListas.descripcionListas[k].esMultiSeleccion) {
                                    contenedorListas.seleccion.push(tablas[k].valor);
                                    contenedorListas.lblseleccion.innerHTML += "::" + tablas[k].alias + "=" + tablas[k].valor[contenedorListas.descripcionListas[k].display];
                                } else {
                                    contenedorListas.seleccion.push(tablas[k].valores);
                                }
                            }
                        }

                        //Mostrar los valores selecciondos
                        //            for (var param in contenedorListas.seleccion) {
                        //                alert(param + ":" + contenedorListas.seleccion[param]);
                        //            }

                        if ((this.parentNode.parentNode.indice + 1) < this.parentNode.parentNode.contenedorListas.descripcionListas.length) {
                            AgregarLista(this.parentNode.parentNode.contenedorListas, undefined, this.parentNode.parentNode.indice + 1);
                        }
                    }catch(e){}
                } else {
                    if (!contenedorListas.descripcionListas[indice].esMultiSeleccion) {
                        this.parentNode.parentNode.activo = undefined;
                        this.parentNode.parentNode.valor = undefined;
                    } else {
                        if (contenedorListas.descripcionListas[indice].onDeseleccionar) {
                            contenedorListas.descripcionListas[indice].onDeseleccionar(this.valor);
                        }
                        if (this.parentNode.parentNode.valores) {
                            for (var b = 0; b < this.parentNode.parentNode.valores.length; b++) {
                                if (this.parentNode.parentNode.valores[b] == this.valor){
                                    this.parentNode.parentNode.valores.splice(b, 1);
                                }
                            }
                        }
                    }
                    this.className = "";
                }
            }
        }
        bodyTabla.appendChild(optionitem);
    }
}

