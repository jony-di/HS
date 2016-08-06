var CVE_puesto;
var CVE_perfil;

function iniciar(numperfil, numpuesto) {
    CVE_perfil = numperfil || "";
    CVE_puesto = numpuesto || "";
    $.post(urlBase_WS + "NperfilPuesto.aspx", { seccion: "elementos", op: "obtenersecciones", cve_perfil: CVE_perfil, cve_puesto: CVE_puesto }).done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        var div = document.getElementById("dinamicform");

        for (var j = 0; j < info.length; j++) {
            var Secc = GetValor(info[j], "Seccion");
            var json = GetValor(info[j], "JSON");
            var obj = jQuery.parseJSON(json);
            var field = document.createElement("div");
            field.setAttribute("style", "border:5px none #c9c9c9;width:80%;margin:auto;")
            var legend = document.createElement("h3");
            legend.setAttribute("style", "margin-bottom:-2px;padding:0px;");
            var texto = document.createTextNode(Secc.toUpperCase());
            legend.appendChild(texto);
            field.appendChild(legend);
            var tabla = document.createElement("table");
            tabla.setAttribute("cellspacing", "0");
            tabla.setAttribute("style", "border:1px solid #c9c9c9;margin:auto;");

            for (var x = 0; x < obj.length; x++) {
                var fila = document.createElement("tr");
                var encabezado = document.createElement("th");
                encabezado.setAttribute("style", "background:#e9e9e9;width:150px;text-align:left;padding:10px;border-bottom:1px solid #c9c9c9;");
                texto = document.createElement("div");
                texto.setAttribute("style", "padding:10px;");
                texto.appendChild(document.createTextNode(obj[x].name));
                encabezado.appendChild(texto);

                var span = document.createElement("div");
                span.setAttribute("style", "font-size:12px;font-weight:normal;margin:0px;");
                var publico = document.createElement("input");
                publico.setAttribute("style", "margin:20px 0px 0px 0px;height:auto;");
                publico.type = "checkbox";
                publico.id = "publico:" + obj[x].key;
                texto = document.createTextNode("Publicar");
                span.appendChild(publico);
                span.appendChild(texto);
                span.setAttribute("style", "margin:10px 0px 0px 0px;padding:10px;font-weight:normal;");
                encabezado.appendChild(span);
                fila.appendChild(encabezado);

                var catalogo = obj[x].catalogo;
                var opciones = document.createElement("td");
                opciones.setAttribute("style", "padding:20px;border-bottom:1px solid #c9c9c9;width:450px;");
                var esMultimple = obj[x].multi;
                var esCompuesto = obj[x].compuesto;
                var tipo = obj[x].tipo;
                var keys = Object.keys(catalogo);
                if (keys.length > 0) {
                    var tblcatalogo = document.createElement("table");
                    var checked = true;
                    if (esCompuesto !== "0") {
                        tblcatalogo.setAttribute("style", "width:80%;margin:auto;");
                        tblcatalogo.setAttribute("cellspacing", "5");
                        var etiquetas = esCompuesto.split("-");
                        var nombreCatalogo = etiquetas[0]
                        var ValorPrincipal = etiquetas[1];
                        var ValorSecundario = etiquetas[2];
                        var cabeza = document.createElement("tr");
                        esMultimple = "1";
                        var th0 = document.createElement("th");
                        th0.setAttribute("style", "text-align:right;padding:0px;margin:0px;");
                        th0.innerHTML = "";
                        cabeza.appendChild(th0);

                        var th1 = document.createElement("th");
                        th1.setAttribute("style", "padding:0px;margin:0px;width:100%;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;");
                        th1.innerHTML = nombreCatalogo;
                        cabeza.appendChild(th1);

                        if (ValorPrincipal !== "") {
                            var th2 = document.createElement("th");
                            th2.innerHTML = ValorPrincipal;
                            th2.setAttribute("style", "padding:0px;margin:0px;width:100%;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;");
                            cabeza.appendChild(th2);
                        }

                        if (ValorSecundario !== "") {
                            var th3 = document.createElement("th");
                            th3.innerHTML = ValorSecundario;
                            th3.setAttribute("style", "padding:0px;margin:0px;width:100%;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;");
                            cabeza.appendChild(th3);
                        }

                        tblcatalogo.appendChild(cabeza);
                    }
                    else {
                        tblcatalogo.setAttribute("style", "width:50%;margin:auto;");
                        tblcatalogo.setAttribute("cellspacing", "0");
                    }
                    for (var op in catalogo) {
                        var fila1 = document.createElement("tr");
                        var desc = document.createElement("td");
                        desc.setAttribute("style", "text-align:right;padding:0px;margin:0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:10%;");
                        var valores = catalogo[op].split("|");
                        var check = document.createElement("input");
                        if (esMultimple === "1") {
                            check.type = "checkbox";
                        }
                        else {
                            check.type = "radio";
                            check.checked = checked;
                            checked = false;
                        }
                        check.name = obj[x].key;
                        check.value = op + '-' + valores[1];
                        desc.appendChild(check);
                        fila1.appendChild(desc);
                        var valor = document.createElement("td");
                        valor.setAttribute("style", "text-align:left;padding:0px; white-space:nowrap;overflow:hidden;text-overflow:ellipsis; margin:0px;");
                        texto = document.createTextNode(valores[0]);
                        valor.appendChild(texto);
                        fila1.appendChild(valor);
                        if (esCompuesto !== "0") {
                            var ValorDefault = valores[1].replace(new RegExp("'", "g"), "").split("-");
                            if (ValorPrincipal !== "") {
                                var val1 = document.createElement("td");
                                val1.setAttribute("style", "text-align:right;padding:0px;margin:0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:10%;");
                                var txtVal1 = document.createElement("input");
                                txtVal1.type = "text";
                                txtVal1.Elemento = check;
                                txtVal1.setAttribute("onblur", "cambiaValor(this,2)");
                                txtVal1.value = ValorDefault[0] === 'null' ? "" : ValorDefault[0];
                                val1.appendChild(txtVal1);
                                fila1.appendChild(val1);
                                check.valor1 = txtVal1;
                            }

                            if (ValorSecundario !== "") {
                                var val2 = document.createElement("td");
                                val2.setAttribute("style", "text-align:right;padding:0px;margin:0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:10%;");
                                var txtVal2 = document.createElement("input");
                                txtVal2.type = "text";
                                txtVal2.Elemento = check;
                                txtVal2.setAttribute("onblur", "cambiaValor(this,3)");
                                txtVal2.value = ValorDefault[1] === 'null' ? "" : ValorDefault[1];
                                val2.appendChild(txtVal2);
                                fila1.appendChild(val2);
                                check.valor2 = txtVal2;
                            }
                        }
                        tblcatalogo.appendChild(fila1);
                    }

                    var divcatalogo = document.createElement("div");
                    divcatalogo.setAttribute("style", "clear:both;overflow-y:auto;");
                    divcatalogo.appendChild(tblcatalogo);
                    opciones.appendChild(divcatalogo);
                }
                else if (esMultimple === "1") {

                    var boton = document.createElement("button");
                    texto = document.createTextNode("Agregar");
                    boton.appendChild(texto);
                    boton.setAttribute("class", "btn agregar");
                    boton.setAttribute("onclick", "agregar('" + obj[x].key + "')");
                    opciones.appendChild(boton);
                    var elementos = document.createElement("table");
                    elementos.id = obj[x].key;
                    elementos.setAttribute("style", "clear:both; margin:auto;border:1px solid #e9e9e9;width:90%");
                    elementos.setAttribute("cellspacing", "0");
                    var divcatalogo = document.createElement("div");
                    divcatalogo.appendChild(elementos);
                    opciones.appendChild(divcatalogo);
                } else {
                    var area = document.createElement("textarea");
                    area.setAttribute("style", "height:50px;width:100%;");
                    area.id = obj[x].key;
                    area.name = obj[x].key;
                    opciones.appendChild(area);
                }
                fila.appendChild(opciones);
                tabla.appendChild(fila);
            }
            field.appendChild(tabla);
            div.appendChild(field);
        }
        if (numpuesto === -1) {
            var regresar = document.getElementById("regresar");
            regresar.removeAttribute("style");
            regresar = document.getElementById("guardar");
            regresar.className = "nomostrar";
            regresar = document.getElementById("cancelar");
            regresar.className = "nomostrar";
            regresar.parentNode.style.width = "80px";
        } else {
            motrarDatos();
        }
        $("input,textarea").blur(function () {
            this.value = this.value.replace(new RegExp("\\s{2,}|\\t", "gi"), " ");
            var specialChars = "\"!•#^&*()[]\/{}|";
            for (var i = 0; i < specialChars.length; i++) {
                this.value = this.value.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }
        });
    });

    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}


function agregar(tabla, valor) {
    var elemnto = document.getElementById(tabla);
    var row = elemnto.rows.length + 1;
    var fila = document.createElement("tr");
    var celda = document.createElement("th");
    celda.setAttribute("style", "background:#e9e9e9;width:10%;text-align:center;");
    var texto = document.createTextNode(row);
    celda.appendChild(texto);
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.removeAttribute("style");
    celda.setAttribute("style", "text-align:left;padding:2px;white-space:nowrap;margin:0px;padding:10px;");
    texto = document.createElement("textarea");
    texto.setAttribute("style", "width:95%;border:none;height:80px;");
    //texto.type = "text";
    texto.id = tabla;
    texto.name = tabla;
    texto.value = valor || "";
    texto.setAttribute("placeholder", "Escriba aqui el texto")
    celda.appendChild(texto);
    fila.appendChild(celda);
    celda = document.createElement("td");
    celda.setAttribute("class", "borrar");
    texto = document.createElement("img");
    texto.src = "../../../Recursos/imagenes/eliminar.png";
    texto.setAttribute("onclick", "Eliminarfila('" + tabla + "',this.parentNode.parentNode.rowIndex);")
    celda.appendChild(texto);
    fila.appendChild(celda);
    elemnto.appendChild(fila);
    $(texto).focus();
}

function Eliminarfila(tabla, i) {
    var tabla = document.getElementById(tabla);
    tabla.deleteRow(i);
    var filas = tabla.rows;
    for (var x = 0; x < filas.length; x++) {
        filas[x].getElementsByTagName("th")[0].innerHTML = x + 1;
    }

}

function Guardar() {
    var frmNuevo = document.getElementById("frmNuevo");
    var param = armarParameto($(frmNuevo).serialize());
    if (param.length == 0) {
        alert("El formulario no se encuentra completamente lleno. favor de completarlo");
        return;
    }

    $.post(urlBase_WS + "NperfilPuesto.aspx", "seccion=elementos&op=guardar&cve_puesto=" + CVE_puesto + "&campos=" + param).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        //var div = document.getElementById("dinamicform");
        $(mensajeNotificacion).html(mensaje);
        if (estatus === "") {
            if (!confirm("¿Desea seguir editando?")) {
                notificacion.className = "nomostrar";
                var botones = document.getElementsByClassName("btn agregar");
                $(botones).each(function (index) {
                    //this.className = "nomostrar";
                    this.parentNode.removeChild(this);
                });
                botones = document.getElementsByClassName("borrar");
                $(botones).each(function (index) {
                    //this.className = "nomostrar";
                    this.parentNode.removeChild(this);
                });
                var textareas = document.getElementsByTagName("textarea");
                $(textareas).each(function (index) {
                    var texto = this.value;
                    texto = texto.replace(new RegExp('\r?\n', 'g'), '<br>');
                    this.parentNode.innerHTML = texto;
                });
                textareas = document.getElementsByTagName("input");
                $(textareas).each(function (index) {
                    if (this.type == "radio" || this.type == "checkbox") {
                        if (!this.checked) {
                            if (this.id.search("publico") != -1) {
                                this.parentNode.parentNode.removeChild(this.parentNode);
                            }
                            else {
                                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                            }
                        }
                        else {
                            //this.className = "nomostrar";
                            this.parentNode.removeChild(this);
                        }
                    }
                    else if (this.type !== "hidden") {
                        var texto = document.createTextNode(this.value);
                        this.parentNode.setAttribute("style", "width:95%;padding:15px;");
                        this.parentNode.appendChild(texto);
                        this.parentNode.removeChild(this);
                    }
                    var regresar = document.getElementById("regresar");
                    regresar.removeAttribute("style");
                    regresar = document.getElementById("imprmimir");
                    regresar.removeAttribute("style");
                    regresar = document.getElementById("guardar");
                    regresar.className = "nomostrar";
                    regresar = document.getElementById("cancelar");
                    regresar.className = "nomostrar";
                    regresar.parentNode.style.width = "80px";
                });
                $("table").each(function (index) {
                    var rowCount = $(this).find('tr').length;
                    if (rowCount === 0) {
                        $(this).remove();
                    }
                });
            }
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function armarParameto(str) {
    str = str.replace(new RegExp("%0D%0A", "g"), "\\n");
    var elementos = str.split("&");
    var result = "";
    var pite = "(";
    for (x = 0; x < elementos.length; x++) {
        var campos = elementos[x].split("=");
        if (campos[0].indexOf("fechaCreacion") < 0) {
            var objpublico = document.getElementById("publico:" + campos[0])
            var publico = Number(objpublico.checked);
            var valor = campos[1].replace(new RegExp("\\+", "g"), " ");
            var id = campos[0].replace(new RegExp("-", "g"), ",");
            //if (valor.trim().length == 0) {
                //valor = " ";
            //}
            if (valor.split("-").length == 4 && valor.search("-") > 0) {
                valor = valor.replace(new RegExp("-", "g"), ",");
                valor = "," + valor;
                valor = valor.replace(new RegExp("-", "g"), ",");
                valor += ",null";
            }
            else {
                valor = ",null,null,null,null,'" + valor + "'";
            }
            result += pite + CVE_puesto + "," + id + "," + x + "," + publico + valor + ", CONVERT(DATE,'" + document.getElementById("fechaCreacion").value + "',103)";
        }

        pite = "),(";
    }
    result += ")";
    return result;
}

function motrarDatos() {
    $.post(urlBase_WS + "NperfilPuesto.aspx", { seccion: "elementos", op: "mostrarparaeditar", cve_puesto: CVE_puesto }).done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        var tipo;
        var valor;
        var rFecha = GetValor(info, "fechaModificacion").split("/");
        var Fecha = rFecha.length >2 ? new Date(parseInt(rFecha[2]), parseInt(rFecha[1]) - 1, rFecha[0], 0, 0, 0, 0) : new Date();
        document.getElementById("fechaCreacion").value = $.datepicker.formatDate('d/m/yy', new Date());
        document.getElementById("Fecha").innerHTML = $.datepicker.formatDate('dd &#100;e MM  &#100;el yy', Fecha);

        for (var j = 0; j < info.length; j++) {
            var aux = GetValor(info[j], "JSON");
            var json = jQuery.parseJSON(aux);
            for (var x = 0; x < json.length; x++) {
                var obj = json[x];
                var elemento = document.getElementById(obj.key) || document.getElementsByName(obj.key);
                var publico = document.getElementById("publico:" + obj.key)
                var catalogo = obj.catalogo;
                publico.checked = obj.publico === "1" ? true : false;
                if (elemento.length > 0) {
                    for (var y = 0; y < elemento.length; y++) {
                        tipo = elemento[y].type || elemento[y].localName;
                        var valores = elemento[y].value.split("-");
                        var idcat = valores[0] + "-" + valores[1];
                        for (var op in catalogo) {
                            if (idcat == op) {
                                elemento[y].checked = true;
                                elemento[y].value = op + '-' + catalogo[op];
                                var textos = catalogo[op].replace(new RegExp("'", "g"), "").split("-");
                                if (elemento[y].valor1) { elemento[y].valor1.value = textos[0] !== 'null' ? textos[0] : ""; }
                                if (elemento[y].valor2) { elemento[y].valor2.value = textos[1] !== 'null' ? textos[1] : ""; }
                            }
                        }
                    }
                }
                else {
                    tipo = elemento.type || elemento.localName;
                    if (tipo === "table" && obj.valor !== "null") {
                        agregar(elemento.id, obj.valor);
                    }
                    else if (tipo === "textarea") {
                        elemento.value = obj.valor;
                    }
                }
            }
        }
    });
}

function cambiaValor(obj, posicion) {
    var Valor = obj.Elemento.value.split("-");
    var nuevoValor = "'" + obj.value + "'";
    Valor[posicion] = nuevoValor;
    obj.Elemento.value = Valor[0] + "-" + Valor[1] + "-" + Valor[2] + "-" + Valor[3];
    obj.Elemento.checked = true;
}

function imprimirPDF() {
    var html = $.base64.encode($("#dinamicform").html());
    var formElement = document.createElement("form");
    var input = document.createElement("textarea");
    input.name = "html";
    input.appendChild(document.createTextNode(html));
    formElement.appendChild(input);
    formElement.setAttribute("enctype", "application/json");
    formElement.setAttribute("action", urlBase_WS + "NperfilPuesto.aspx?cve_perfil=" + CVE_perfil);
    formElement.setAttribute("method", "POST");
    window.top.AgregarNuevoTab("#", "Imprimir Perfil", "pdf");
    formElement.setAttribute("target", "pdf");
    document.body.appendChild(formElement);
    formElement.submit();
    document.body.removeChild(formElement);
}