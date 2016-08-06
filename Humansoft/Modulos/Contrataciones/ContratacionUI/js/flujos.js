function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    //$("#fechaInicio").datepicker({
    //    dateFormat: 'dd/mm/yy',
    //    changeMonth: true,
    //    changeYear: true
    //});
    CargarCatalogoFlujos(1);
    ObtenerCatalogoEtapas();
    ObtenerAccionesModulo();
    ObtenerRolesModulo();
}

function BuscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    CargarCatalogoFlujos(1, criterio);
}

function MostrarCatalogoPorAsignar(contenedorAsignados, listaRoles) {
    //TablaCatalogo.iniciarTablaCatalogo("buscarEmpleados", "/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", { op: "ObtenerEmpleados" }, [{ parametro: "id_empleado", etiqueta: "Num. emp.", ancho: "20%" }, { parametro: "nombrecom", etiqueta: "Nombre de empleado", ancho: "80%" }], "id_empleado", function () { alert(this.clave); }, function () {
    //    $.fancybox({ type:'html', content: $("#buscarEmpleados"), preload: false, openEffect: 'elastic' });
    //});
    var cve_role = listaRoles.cve_role || 2;
    NuevoSeleccionSecuencial("Seleccionar Empleados", [
            { alias: "Política", url: '/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx', parametros: { seccion: "Visibilidad", op: "ObtenerEmpleados", pagina: 1, longitudPagina: 1000, criterio: "", cve_politica: 0 }, campos: ['id_empleado', 'nombrecom'], indicesCamposOcultos: [0], encabezado: { titulo: "Seleccione empleado", columnas: ["Num. empleado", "Nombre"] }, display: "nombre", esMultiSeleccion: true }
    ], "base", function (divR){
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion){
        if (seleccion[0].length > 0) {
            var empleadosSeleccionados = [];
            contenedorAsignados.innerHTML = "";
            var item;
            for (var g = 0; g < seleccion[0].length; g++) {
                empleadosSeleccionados.push(seleccion[0][g].id_empleado);
                var liItem = NuevoEmpleadoAsignado(cve_role, seleccion[0][g].id_empleado, seleccion[0][g].nombrecom);
                contenedorAsignados.appendChild(liItem);
            }
            $.fancybox.close();
            //if (confirm("Confirme que desea agregar los empleados.")) {
            //    $.fancybox.close();
            //    PonerEnEspera();
            //    $.post(urlBase_WS + "NPuestosGenericos.aspx", {
            //        op: "GuardarPuestosDepartamento", seccion: "PuestosDepartamentos", cve_departamento: departamentoActivo, cves_puestos: puestosSeleccionados.join(",")
            //    }).done(function (xmlDoc) {
            //        QuitarEspera();
            //        mostrarNotificacion(xmlDoc, "notificacion");
            //        LlenarListaPuestos(document.getElementById("listaPuestos"), undefined, departamentoActivo);
            //    }).always(function () {
            //        try { QuitarEspera(); } catch (e) { }
            //    });
            //} else {
            //    $.fancybox.close();
            //}
        }
    });
}

function ObtenerCatalogoEtapas() {
    $.post(urlBase_WS + "NFlujosEtapas.aspx", { op: "obtenerCatalogo", seccion: "EtapasFlujo",pagina:1, longitudPagina:100 }).done(function (xmlDoc) {
        var dbEstatus = xmlDoc.getElementsByTagName("Table");
        var lista = $(".listaEstatus")[0];
        var item;
        for (var i = 0; i < dbEstatus.length; i++) {
            item = document.createElement("option");
            item.value = GetValor(dbEstatus[i], "cve_etapa");
            item.innerHTML = GetValor(dbEstatus[i], "descripcion");
            lista.appendChild(item);
        }
    });
}

function ObtenerAccionesModulo() {
    $.post("/Modulos/Sistema/NSistema.aspx", { op: "ObtenerAccionesModulo", seccion: "Comunes", cve_modulo: 5 }).done(function (xmlDoc) {
        var dbEstatus = xmlDoc.getElementsByTagName("Table");
        var lista = $(".acciones")[0];
        var item;
        for (var i = 0; i < dbEstatus.length; i++) {
            item = document.createElement("li");
            item.innerHTML = "<input type='checkbox' name='cve_accion' value='" + GetValor(dbEstatus[i], "cve_accion") + "' /><label clave='" + GetValor(dbEstatus[i], "cve_accion") + "'>" + GetValor(dbEstatus[i], "descripcion") + "</label>";
            lista.appendChild(item);
        }
    });
}

function ObtenerRolesModulo() {
    $.post("/Modulos/Sistema/NSistema.aspx", { op: "ObtenerRoles", seccion: "Comunes", cve_modulo: 3 }).done(function (xmlDoc) {
        var dbEstatus = xmlDoc.getElementsByTagName("Table");
        var lista = $(".roles")[0];
        var item;
        for (var i = 0; i < dbEstatus.length; i++) {
            item = document.createElement("li");
            item.setAttribute("cve_role", GetValor(dbEstatus[i], "cve_role"));
            item.tieneEmpleados = GetValor(dbEstatus[i], "tieneEmpleados");
            item.setAttribute("onclick", "MostrarAsignados(this);");
            if (GetValor(dbEstatus[i], "tieneEmpleados").toLowerCase()=="true") {
                item.setAttribute("tieneEmpleados", GetValor(dbEstatus[i], "tieneEmpleados"));
            }
            item.innerHTML = "<input type='hidden' name='cve_role' value='" + GetValor(dbEstatus[i], "cve_role") + "' /><label clave='" + GetValor(dbEstatus[i], "cve_role") + "'>" + GetValor(dbEstatus[i], "descripcion") + "</label>";
            lista.appendChild(item);
        }
    });
}


function MostrarAsignados(objeto) {
    var frmPaso = ObtenerParentNode(objeto, 'div', 'name', 'formulario');
    if (objeto.parentNode.seleccionado) {
        objeto.parentNode.seleccionado.className = "";
    }
    objeto.parentNode.seleccionado = objeto;
    $(frmPaso).find(".guardarParaRol")[0].innerHTML = "Guardar para: " + objeto.getElementsByTagName("label")[0].innerHTML;
    $(frmPaso).find(".asignados")[0].innerHTML = "";
    objeto.className = "seleccionado";
    MostrarEmpleadosAsignadosAcciones(frmPaso, objeto.getAttribute("cve_role"));
    if (objeto.getAttribute("tieneEmpleados") == "true") {
        $(frmPaso).find('.divAsignados')[0].style.display = 'block';
    } else {
        $(frmPaso).find('.divAsignados')[0].style.display = 'none';
    }    
}

function NuevoEmpleadoAsignado(cve_role, num_empleado, nombre){
    var item = document.createElement("li");
    item.id_empleado = num_empleado;
    item.innerHTML = "<input type='hidden' name='num_empleado' value='" + num_empleado + "' /><label>" + nombre + "</label><button class='btnFormularios' style='padding:2px;' onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>x</button>";    
    return item;
}

function MostrarEmpleadosAsignadosAcciones(frmPaso, _cve_role) {
    var cve_flujo = document.getElementById("cve_flujo").value;
    var cve_estatus = (frmPaso.esEditar ? $(frmPaso).find(".estatusAnterior")[0].value : $(frmPaso).find(".listaEstatus")[0].options[$(frmPaso).find(".listaEstatus")[0].selectedIndex].value);
    var cve_role = _cve_role;
    $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerEmpleadosAccionesRole", seccion: "Pasos", cve_flujo: cve_flujo, cve_estatus: cve_estatus, cve_role: _cve_role }).done(function (xmlDoc) {
        var dbEmpleados = xmlDoc.getElementsByTagName("Table");
        var listaAsignados = $(frmPaso).find(".asignados")[0];
        $(listaAsignados).html("");
        for (var i = 0; i < dbEmpleados.length; i++) {
            listaAsignados.appendChild(NuevoEmpleadoAsignado(cve_role, GetValor(dbEmpleados[i], "num_empleado"), GetValor(dbEmpleados[i], "nombrecompleto")));
        }

        var cve_accion;
        var dbAcciones = xmlDoc.getElementsByTagName("Table1");
        var inAcciones = $(frmPaso).find(".acciones")[0];
        inAcciones.innerHTML="";
        var item, esDeRole;

        for (var i = 0; i < dbAcciones.length; i++) {
            item = document.createElement("li");
            item.innerHTML = "<input type='checkbox' name='cve_accion' value='" + GetValor(dbAcciones[i], "cve_accion") + "' /><label clave='" + GetValor(dbAcciones[i], "cve_accion") + "'>" + GetValor(dbAcciones[i], "descripcion") + "</label>";            
            item.getElementsByTagName("input")[0].checked = GetValor(dbAcciones[i], "esDeRol") == "true";
            inAcciones.appendChild(item);
        }

    });
}

function MostrarNuevoFlujo() {
    document.getElementById("esquemaFlujo").innerHTML = "";
    document.getElementById("btnIniciarFlujo").style.display = "block";
    IntercambioVisual("frmFlujo", "pantallaAuxiliar");
    LimpiarCampos("frmNuevoFlujo");
    var frmFlujo = document.getElementById("frmNuevoFlujo");
    frmFlujo.reset();
    frmFlujo.esEditar = false;
    $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerSiguienteClave", seccion: "Flujos" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_flujo", "cve_flujo");
    });
    MostrarFormulario();
}

function LimpiarCampos(idContenedor) {
    //var campos=document.getElementById(idContenedor).getElementsByTagName("input");
    //for (var i = 0; i < campos.length; i++) {
    //    campos[i].value = undefined;
    //}
}

var ordenador;
function CargarCatalogoFlujos(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerCatalogo", seccion: "Flujos", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "") }).done(function (xmlDoc) {
        QuitarEspera();
        var dbFlujos = xmlDoc.getElementsByTagName("Table");
        var listaFlujo = document.getElementById("contenedorLista");
        $(listaFlujo).html("");
        var totalregistros;
        for (var i = 0; i < dbFlujos.length; i++) {
            var CveFlujo = GetValor(dbFlujos[i], "cve_flujo");
            var Descripcion = GetValor(dbFlujos[i], "descripcion");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(dbFlujos[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            itemLista.cve_Flujo = CveFlujo;
            itemLista.onclick = function (e) {
                var e = window.event || e;
                if (e.target.tagName.toLowerCase() == "td") {
                    MostrarEditarFlujo(this.cve_Flujo);
                }
            }
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarFlujo(' + CveFlujo + ')"></button></td>' +
                 '<td>' + CveFlujo + '</td>' +
                '<td>' + Descripcion + '</td>'
            );
            listaFlujo.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoFlujos);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarFlujo(callback) {
    PonerEnEspera();
    //    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
    var frmFlujo = document.getElementById("frmNuevoFlujo");
    if (!frmFlujo.esEditar) {
        GuardarEdicionFlujo("Nuevo", function () { if(callback) callback(); QuitarEspera();});
    } else {
        GuardarEdicionFlujo("Editar", function () { if (callback) callback(); QuitarEspera(); });
    }
}

function GuardarEmpleadosAccionesRole(contPaso) {
    var frmPaso = $(contPaso).find("form")[0];
    var ulAsignados= $(contPaso).find(".asignados")[0];
    var ulRoles=$(contPaso).find(".roles")[0];
    var ulAcciones = $(contPaso).find(".acciones")[0];

    var cve_flujo = document.getElementById("cve_flujo").value;
    var inEstatus = $(contPaso).find(".estatusAnterior")[0];
    var cve_role = ulRoles.seleccionado.getElementsByTagName("input")[0].value;
    var num_empleados = [];
    var cve_acciones = [];
    var inAsignados = ulAsignados.getElementsByTagName("input");
    for(var i=0;i<inAsignados.length;i++){
        num_empleados.push(inAsignados[i].value);
    }
    var inAcciones = ulAcciones.getElementsByTagName("input");
    for (i = 0; i < inAcciones.length; i++) {
        if (inAcciones[i].checked) {
            cve_acciones.push(inAcciones[i].value);
        }
    }

    var cve_estatus;
    var op;
    if (frmPaso.esEditar) {
        op = "Editar";
        cve_estatus = $(frmPaso).find(".estatusAnterior")[0].value;
    } else {
        op = "Nuevo";
        cve_estatus = $(frmPaso).find(".listaEstatus")[0].options[$(frmPaso).find(".listaEstatus")[0].selectedIndex].value;
    }

    Pasos.GuardarEdicionPaso(op, frmPaso, function () {
        $.post(urlBase_WS + "NFlujos.aspx", { op: "GuardarEmpleadosAccionesRole", seccion: "Pasos", cve_flujo: cve_flujo, cve_estatus: cve_estatus, cve_role: cve_role, num_empleados: num_empleados.join(","), cve_acciones: cve_acciones.join(",") }).done(function (xmlDoc) {
            Pasos.MostrarEsquemaFlujo(document.getElementById("esquemaFlujo"), document.getElementById("cve_flujo").value, true);
            alert(GetValor(xmlDoc, "mensaje"));
        });
    });
}

var Pasos = function () { }

Pasos.MostrarIniciarFlujo = function () {
    Pasos.LimpiarFlujo();
    DesplazarElemento('principal',-1800);
}

Pasos.MostrarSiguientePaso = function (ventanaClonable) {
    if ($(ventanaClonable).find("form")[0].esEditar) {
        PonerEnEspera();
        var pasoAnterior = ventanaClonable.getElementsByTagName("form")[0].orden;
        var divPrincipal = document.getElementById("principal");
        var divPasos = $("#principal div.ventanaPaso");

        var sigPaso;
        if (ventanaClonable == divPasos[divPasos.length - 1]) {
            sigPaso = ventanaClonable.cloneNode(true);
            sigPaso.removeAttribute("id");
            divPrincipal.style.width = (parseInt(divPrincipal.style.width) + 910) + "px";
            document.getElementById("principal").appendChild(sigPaso);
        } else {
            for (var j = 0; j < divPasos.length; j++) {
                if (divPasos[j] == ventanaClonable) {
                    sigPaso = divPasos[j + 1];
                    break;
                }
            }
        }
        var frmPaso = sigPaso.getElementsByTagName("form")[0];

        Pasos.LimpiarPaso(frmPaso);

        var cve_flujo = document.getElementById("cve_flujo").value;
        $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerDetallePaso", seccion: "Pasos", cve_flujo: cve_flujo, pasoAnterior: pasoAnterior }).done(function (xmlDoc) {
            var dbSigPaso = xmlDoc.getElementsByTagName("Table");
            if (GetValor(xmlDoc, "cve_estatus").length > 0) {
                frmPaso.orden = GetValor(xmlDoc, "orden");
                sigPaso.getElementsByTagName("h2")[0].innerHTML = "Editar Flujo: Paso " + frmPaso.orden;
                frmPaso.esEditar = true;
                SetValorDx($(frmPaso).find(".listaEstatus")[0], GetValor(xmlDoc, "cve_estatus"));
                SetValorDx($(frmPaso).find(".estatusAnterior")[0], GetValor(xmlDoc, "cve_estatus"));
                Pasos.CargarDatosPaso(frmPaso, xmlDoc);
                ExisteSiguientePaso(cve_flujo, frmPaso.orden, function (haySigPaso) {
                    if (haySigPaso) {
                        $(frmPaso).find(".btnSig")[0].style.display = "block";
                        $(frmPaso).find(".btnNuevo")[0].style.display = "none";
                    } else {
                        $(frmPaso).find(".btnNuevo")[0].style.display = "block";
                        $(frmPaso).find(".btnSig")[0].style.display = "none";
                    }
                });
            } else {
                frmPaso.esEditar = false;
                frmPaso.orden = parseInt(pasoAnterior, 10) + 1;
                sigPaso.getElementsByTagName("h2")[0].innerHTML = "Editar Flujo: Paso " + frmPaso.orden;
            }
            QuitarEspera();
            DesplazarElemento('principal', parseInt(document.getElementById('principal').style.left) - 900);
        });
    } else {
        alert("Guarde cambios para poder continuar.");
    }
}

Pasos.GuardarPaso = function (frmPaso, callback) {
    if (!frmPaso.esEditar) {
        Pasos.GuardarEdicionPaso("Nuevo", frmPaso, callback);
    } else {
        Pasos.GuardarEdicionPaso("Editar", frmPaso, callback);
    }
}

Pasos.GuardarEdicionPaso = function (op, frmPaso, callback) {
    var parametros = $(frmPaso).serialize();
    $.post(urlBase_WS + "NFlujos.aspx", "op=" + op + "&seccion=Pasos&cve_flujo=" + document.getElementById("cve_flujo").value + "&" + parametros).done(function (xmlDoc) {
        var divNotificacion = frmPaso.getElementsByTagName("div")[0];
        if (GetValor(xmlDoc, "estatus") == "1") {
            frmPaso.esEditar = true;
            SetValorDx($(frmPaso).find(".estatusAnterior")[0], GetValor(xmlDoc, "cve_estatus"));
            frmPaso.orden= GetValor(xmlDoc,"orden");
            if (callback) {
                callback();
            }
        } else {
            if (GetValor(xmlDoc, "estatus") == "-2627") {
                alert("Ya existe un paso que define el estatus seleccionado.");
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        }
    });
}

Pasos.MostrarEsquemaFlujo = function (contenedor, cve_flujo, esEditar) {
    contenedor.innerHTML = "";
    $(contenedor).html('<img src="/Recursos/imagenes/iniproc.png" />');
    $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerPasosFlujo", seccion: "Pasos", cve_flujo: cve_flujo }).done(function (xmlDoc) {
        var dbPasos = xmlDoc.getElementsByTagName("Table");
        var divPaso, eventoClick;
        if (dbPasos.length == 0){
            document.getElementById("btnIniciarFlujo").style.display = "block";
        } else {
            document.getElementById("btnIniciarFlujo").style.display = "none";
            for (var i = 0; i < dbPasos.length; i++) {
                divPaso = document.createElement("div");
                divPaso.paso = { cve_flujo: cve_flujo, cve_estatus: GetValor(dbPasos[i], "cve_estapa"), orden: GetValor(dbPasos[i], "orden") };
                divPaso.className = "paso";
                divPaso.innerHTML = '<span>' +
                                '<b class="num-paso">' + GetValor(dbPasos[i], "orden") + '</b>' +
                                '<b><i style="display:block;text-align:center;font-size:16px;">' + GetValor(dbPasos[i], "setapa") + '</i></b>' +
                                /*'<b>Acciones:<i>' + GetValor(dbPasos[i], "acciones") + '</i></b>' +*/
                                /*'<b>Roles:<i>' + GetValor(dbPasos[i], "roles") + '</i></b>' +*/
                                /*(GetValor(dbPasos[i], "empleados").length > 0 ? '<b>Empleados:<i>' + GetValor(dbPasos[i], "empleados") + '</i></b>' : "") +*/
                            '</span>';
                contenedor.appendChild(divPaso);
                if (esEditar){
                    var alturaSpan = $($(divPaso).find("span")[0]).css("height");
                    var divEditar = document.createElement("div");
                    divEditar.className = "editarPaso";
                    divEditar.style.height = (parseInt(alturaSpan) + 22) + "px";
                    divEditar.innerHTML = "<!--<div class='orden'><button class='arriba'></button><button class='abajo'></button></div>--><button class='editarpaso btn agregar' onclick='MostrarEditarPaso(this.parentNode.parentNode.paso);'>Editar</button><button onclick='EliminarPaso(this.parentNode.parentNode.paso);' class='eliminar btn agregar'>Eliminar</button></div>";
                    divPaso.appendChild(divEditar);
                }
            }
        }
        divPaso = document.createElement("div");
        divPaso.className = "fin";
        divPaso.innerHTML = '<img src="/Recursos/imagenes/finproc.png" />';
        contenedor.appendChild(divPaso);
    });
}

EliminarPaso = function (paso) {
    if (confirm("¿Esta seguro que desea eliminar el paso" + paso.orden + "?")) {
        $.post(urlBase_WS + "NFlujos.aspx", "op=EliminarPaso&seccion=Pasos&orden=" + paso.orden + "&cve_flujo=" + paso.cve_flujo + "&cve_estatus=" + paso.cve_estatus).done(function (xmlDoc) {
            if (parseInt(GetValor(xmlDoc, "estatus")) > 0) {
                Pasos.MostrarEsquemaFlujo(document.getElementById("esquemaFlujo"), paso.cve_flujo, true);
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        });
    }
}

Pasos.LimpiarFlujo = function () {
    var frmFlujo = document.getElementById("frmFlujo");
    IntercambioVisual("ventanaClonable", "pantallaAuxiliar");
    var ventanaClonable = document.getElementById("ventanaClonable");
    var frmPaso = $(ventanaClonable).find("form")[0];
    $(frmPaso).find(".btnNuevo")[0].style.display = "block";
    $(frmPaso).find(".btnSig")[0].style.display = "none";
    var divPasos = $("#principal div.ventanaPaso");
    for (var n = 1; n < divPasos.length; n++) {
        divPasos[n].parentNode.removeChild(divPasos[n]);
    }
    Pasos.LimpiarPaso(frmPaso);
}

Pasos.LimpiarPaso = function (frmPaso) {
    frmPaso.reset();
    $(frmPaso).find('.divAsignados')[0].style.display = 'none';
    $(frmPaso).find(".asignados")[0].innerHTML = "";
    $(frmPaso).find(".guardarParaRol")[0].innerHTML = "Guardar";
    var liRoles = $(frmPaso).find(".roles")[0].getElementsByTagName("li");
    for (var k = 0; k < liRoles.length; k++) {
        liRoles[k].className = "";
    }
    ventanaClonable.getElementsByTagName("h2")[0].innerHTML = "Editar flujo:  Paso 1";
    $(frmPaso).find(".guardarParaRol")[0].innerHTML = "Guardar";
}

function MostrarEditarPaso(paso) {
    Pasos.LimpiarFlujo();
    IntercambioVisual("ventanaClonable", "pantallaAuxiliar");
    var frmPaso = document.getElementById("ventanaClonable").getElementsByTagName("form")[0];
    frmPaso.esEditar = true;
    var ventanaClonable= document.getElementById("ventanaClonable");
    var esquemaPasos = $("#esquemaFlujo .paso");
    //alert(esquemaPasos.length + ":" + paso.orden);
    if (esquemaPasos.length == paso.orden) {
        $(frmPaso).find(".btnNuevo")[0].style.display = "block";
        $(frmPaso).find(".btnSig")[0].style.display = "none";
    } else {
        $(frmPaso).find(".btnNuevo")[0].style.display = "none";
        $(frmPaso).find(".btnSig")[0].style.display = "block";
    }
    ventanaClonable.getElementsByTagName("h2")[0].innerHTML = "Editar flujo: Paso " + paso.orden;
    frmPaso.orden = paso.orden;
    var selectEstatus = $(frmPaso).find(".listaEstatus")[0];
    var inCveEstatusAnterior = $(frmPaso).find(".estatusAnterior")[0];
    frmPaso.reset();
    SetValorDx(selectEstatus, paso.cve_estatus);
    SetValorDx(inCveEstatusAnterior, paso.cve_estatus);

    $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerDetallePaso", seccion: "Pasos", cve_flujo: paso.cve_flujo, cve_estatus: paso.cve_estatus }).done(function (xmlDoc) {        
        Pasos.CargarDatosPaso(frmPaso, xmlDoc);
        DesplazarElemento("principal",-1800);
    });
}

function ExisteSiguientePaso(cve_flujo, pasoAnterior, callback) {
    $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerDetallePaso", seccion: "Pasos", cve_flujo: cve_flujo, pasoAnterior: pasoAnterior }).done(function (xmlDoc) {
        var dbSigPaso = xmlDoc.getElementsByTagName("Table");
        callback(GetValor(xmlDoc, "cve_estatus").length > 0);
    });
}

Pasos.CargarDatosPaso = function (frmPaso, xmlDoc) {
    var dbRoles = xmlDoc.getElementsByTagName("Table");
    var cve_role;
    var inRoles = $(frmPaso).find(".roles")[0].getElementsByTagName("input");   

    for (var i = 0; i < dbRoles.length; i++) {
        cve_role = GetValor(dbRoles[i], "cve_role");
        for (j = 0; j < inRoles.length; j++) {
            if (inRoles[j].value == cve_role) {
                inRoles[j].checked = true;
                break;
            }
        }
    }
}

function MostrarEditarFlujo(cve) {
    document.getElementById("btnIniciarFlujo").style.display = "none";
    IntercambioVisual("frmFlujo", "pantallaAuxiliar");
    LimpiarCampos("frmNuevoFlujo");
    var frmFlujo = document.getElementById("frmNuevoFlujo");
    frmFlujo.reset();
    frmFlujo.esEditar = true;
    MostrarFormulario();
    CargarDatosFlujo(cve);
}

function CargarDatosFlujo(cve) {
    $.post(urlBase_WS + "NFlujos.aspx", { op: "ObtenerDetalleFlujo", seccion: "Flujos", cve_flujo: cve }).done(function (xmlDoc) {
        var dbFlujo = xmlDoc.getElementsByTagName("Table")[0];
        var cveFlujo = SetValor(dbFlujo, "cve_flujo", "cve_flujo");
        SetValor(dbFlujo, "descripcion", "descripcion");
        SetValor(dbFlujo, "objetivo", "objetivo");
        Pasos.MostrarEsquemaFlujo(document.getElementById("esquemaFlujo"), cveFlujo, true);
    });
}

function GuardarEdicionFlujo(op, callback) {
    var frmNuevoFlujo = document.getElementById("frmNuevoFlujo");
    var parametros = $(frmNuevoFlujo).serialize();
    $.post(urlBase_WS + "NFlujos.aspx", "op=" + op + "&seccion=Flujos&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            try { QuitarEspera(); } catch (e) { }
            if(parseInt(GetValor(xmlDoc,"estatus"))>0){
                CargarCatalogoFlujos();
                frmNuevoFlujo.esEditar = true;
                if (callback) callback();
            }
        });
    });
}

function DesactivarFlujo(cve_departamento) {
    $.post(urlBase_WS + "NFlujo.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoFlujo();
    })
}

