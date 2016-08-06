var CVE_puesto;

function abrirArchivo(url) {
    window.top.AgregarNuevoTab("../../../Utilidades/UtilidadesUI/visualizador/visualizador.aspx?urlImagen=" + url, "Perfil del puesto " + CVE_puesto);
}

function iniciar(numpuesto,puesto) {
    CVE_puesto = numpuesto || "";

    $.post("/Modulos/Estructuras/EstructurasNegocio/NPuestosGenericos.aspx", { seccion: "PuestoGenerico", op: "PerfilesEscaneados", cve_puesto: puesto
    }).done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Archivos");
        if (ItemCat.length > 0) {
            var Ext = GetValor(ItemCat[0], "Ext");
            document.getElementById("archivoescaneado").removeAttribute("class");
            document.getElementById("ligaEscaneo").setAttribute("onclick", "abrirArchivo('/Expedientes/Puestos/Perfiles/" + puesto + Ext + "')");
        }
    });

    $.post(urlBase_WS + "NperfilPosisicion.aspx", { seccion: "elementos", op: "obtenersecciones", numplantilla: CVE_puesto }).done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        if (info.length <= 0) {
            alert("No se encuentra la informacion del puesto");
            window.top.CerrarTabDesdeFrame(window.location.href);
            return false;
        }
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
                encabezado.setAttribute("style", "background:#e9e9e9;width:150px;text-align:left;padding:20px;border-bottom:1px solid #c9c9c9;");
                texto = document.createTextNode(obj[x].name);
                encabezado.appendChild(texto);
                var span = document.createElement("div");
                span.setAttribute("style", "font-size:12px;font-weight:normal;margin:0px;");
                var publico = document.createElement("input");
                publico.setAttribute("style", "margin:10px 0px 0px 0px;height:auto;");
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
                opciones.setAttribute("style", "padding:20px;border-bottom:1px solid #c9c9c9;width:70%;");
                var esMultimple = obj[x].multi;
                var tipo = obj[x].tipo;
                var keys = Object.keys(catalogo);
                if (keys.length > 0) {
                    var tblcatalogo = document.createElement("table");
                    tblcatalogo.setAttribute("style", "width:50%;margin:auto;");
                    tblcatalogo.setAttribute("cellspacing", "0");   
                    for (var op in catalogo) {
                        var fila1 = document.createElement("tr");
                        var desc = document.createElement("td");
                        desc.setAttribute("style", "text-align:right;padding:0px;margin:0px;width:10%;");
                        var valores = catalogo[op].split("|");
                        var check = document.createElement("input");
                        if (esMultimple === "1") {
                            check.type = "checkbox";
                        }
                        else {
                            check.type = "radio";
                        }
                        check.name = obj[x].key;
                        check.value = op + '-' + valores[1];
                        desc.appendChild(check);
                        fila1.appendChild(desc);
                        var valor = document.createElement("td");
                        valor.setAttribute("style", "text-align:left;padding:0px; white-space: nowrap;overflow:hidden;text-overflow:ellipsis; margin:0px;");
                        texto = document.createTextNode(valores[0]);
                        valor.appendChild(texto);
                        fila1.appendChild(valor);
                        tblcatalogo.appendChild(fila1);
                    }
                    var divcatalogo = document.createElement("div");
                    divcatalogo.setAttribute("style", "clear:both;overflow-y:auto;");
                    divcatalogo.appendChild(tblcatalogo);
                    opciones.appendChild(divcatalogo);
                }
                else if (esMultimple === "1") {

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
                    area.setAttribute("maxlength", "1500");
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
        motrarDatos();
    });

    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}

function agregar(tabla,valor) {
    var elemnto = document.getElementById(tabla);
    var row=elemnto.rows.length+1;
        var fila = document.createElement("tr");
        var celda = document.createElement("th");
        celda.setAttribute("style", "background:#e9e9e9;width:10%;text-align:center;");
        var texto = document.createTextNode(row);
        celda.appendChild(texto);
        fila.appendChild(celda);
        celda = document.createElement("td");
        celda.removeAttribute("style");
        celda.setAttribute("style", "text-align:left;padding:2px;white-space:nowrap;margin:0px;padding:10px;");
        valor = valor.replace(new RegExp('\r?\n', 'g'), '<br>');
        celda.innerHTML = valor;
        fila.appendChild(celda);
        elemnto.appendChild(fila);
        $(texto).focus();
}

function motrarDatos(){
    $.post(urlBase_WS + "NperfilPosisicion.aspx", { seccion: "elementos", op: "obtenerdatos", numplantilla: CVE_puesto }).done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        var div = document.getElementById("dinamicform");
        var tipo;
        var valor;
        for (var j = 0; j < info.length; j++) {
            var aux = GetValor(info[j], "JSON");
            var nompuesto = GetValor(info[j], "puest");
            var nomdepto = GetValor(info[j], "dep");
            var numnivel = GetValor(info[j], "nivel");
            var json = jQuery.parseJSON(aux);
            for (var x = 0; x < json.length; x++) {
                var obj = json[x];
                var elemento = document.getElementById(obj.key) || document.getElementsByName(obj.key);
                var catalogo = obj.catalogo;
                var publico = document.getElementById("publico:" + obj.key)
                if (publico) {
                    publico.checked = obj.publico === "1" ? true : false;
                    if (publico.checked) {
                        publico.parentNode.removeChild(publico);
                    } else {
                        publico.parentNode.parentNode.removeChild(publico.parentNode);
                    }
                }
                if (elemento.length) {
                    do{
                        var input = elemento[0];
                        var valores = input.value.split("-");
                        var idcat = valores[0] + "-" + valores[1];
                        for (var op in catalogo) {
                            if (idcat === op) {
                                input.checked = true;
                            }
                        }
                        if (input.checked) {
                            input.parentNode.removeChild(input);
                        }
                        else {
                            input.parentNode.parentNode.parentNode.removeChild(input.parentNode.parentNode);
                        }
                    }while (elemento.length > 0);
                }
                else {
                    tipo = elemento.type || elemento.localName;
                    if (tipo === "table") {
                        agregar(elemento.id, obj.valor);
                    }
                    else if (tipo === "textarea") {
                        var texto = obj.valor;
                        texto = texto.replace(new RegExp('\r?\n', 'g'), '<br>');
                        elemento.parentNode.innerHTML = texto;
                    }
                }
            }
            document.getElementById("nompuesto").innerHTML = nompuesto;
            document.getElementById("nomdepto").innerHTML = nomdepto;
            document.getElementById("numnivel").innerHTML = numnivel;
        }
    });
}

function imprimirPDF() {
    var html = $.base64.encode($("#dinamicform").html());
    var formElement = document.createElement("form");
    var input = document.createElement("textarea");
    var texto = document.createTextNode(html);
    formElement.setAttribute("enctype", "application/json");
    input.appendChild(texto);
    input.name = "html";
    formElement.appendChild(input);
    formElement.setAttribute("action", urlBase_WS + "NperfilPuesto.aspx");
    formElement.setAttribute("method", "POST");
    window.top.AgregarNuevoTab("#","Imprimir Perfil","pdf");
    formElement.setAttribute("target", "pdf");
    document.body.appendChild(formElement);
    formElement.submit();
    document.body.removeChild(formElement);
}