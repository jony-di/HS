function iniciar() {
    LlenarListaDepartamentos(undefined, function () { busquedaLocal("listaDepartamentos", "") });
    LlenarListaDepartamentos(undefined, function () { busquedaLocal("listaDepartamentos", "") });
}

function crearNuevoPuesto() {
    var frmNuevoPuesto = document.getElementById("frmNuevoPuesto");
    var parametros = $(frmNuevoPuesto).serialize();
    $.post(urlBase_WS + "NPuesto.aspx", "op=NuevoPuesto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc,"estatus");
        var mensaje= GetValor(xmlDoc,"mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion= document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPuesto(1);
            document.getElementById("frmNuevoPuesto").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

var listaDepartamentos;
function busquedaLocal(idLista, criterio) {
    var rg = new RegExp(criterio, "gi");
    var lista = document.getElementById(idLista);
    lista.innerHTML = "";
    var optionitem;
    for (var h = 0; h < listaDepartamentos.length; h++) {
        if (rg.test(listaDepartamentos[h].desc) || rg.test(listaDepartamentos[h].cve) || rg.test(listaDepartamentos[h].drGrl)) {
            optionitem = document.createElement("li");
            optionitem.innerHTML = listaDepartamentos[h].desc;
            optionitem.value = listaDepartamentos[h].cve;
            optionitem.onclick = function () {
                if (this.parentNode.activo) {
                    this.parentNode.activo.className = "";
                }
                this.parentNode.activo = this;
                this.className = "activo";
                LlenarListaPuestos(document.getElementById("listaPuestos"), undefined, this.value, this.innerHTML);
            }
            lista.appendChild(optionitem);
        }
    }
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoPuesto(1, criterio);
}

function MostrarNuevoPuesto() {
    var frmPuesto = document.getElementById("frmNuevoPuesto");
    frmPuesto.reset();
    frmPuesto.esEditar = false;
    $.post(urlBase_WS + "NPuesto.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "puesto");
        var selectDepartamento = document.getElementById("departamento");
        LlenarCatalogoDepartamento(selectDepartamento, function () {
            var selectestatus = document.getElementById("estatus");
            selectestatus.disabled = true;
            MostrarFormulario();
        });
    });
}


function LlenarListaDepartamentos(cve_dga, callback) {
    $.post(urlBase_WS + "NDepartamento.aspx", { op: "obtenerCatalogoDepartamento", pagina: 1, longitudPagina: 1000, criterio: "",
        cve_departamento: 0, dga_agru: (cve_dga ? cve_dga : 0)
    }).done(function (xmlDoc) {
        listaDepartamentos = [];
        var departamento = xmlDoc.getElementsByTagName("Table");
        for (var i = 0; i < departamento.length; i++){
            listaDepartamentos.push({ cve: GetValor(departamento[i], "cve_departamento"), desc: GetValor(departamento[i], "nombredep"), drGrl: GetValor(departamento[i], "dirGeneral") });
        }
        if(callback){
            callback();
        }
    });
}

function MostrarSeleccionPuestos(cve_departamento) {
    var departamentoActivo = cve_departamento;
    if (departamentoActivo) {
        NuevoSeleccionSecuencial("Seleccionar Puestos para el departamento: <b>" + document.getElementById("nombreDepartamento").innerHTML + "</b>", [
                {
                    alias: "Puestos Genéricos", url: '/Modulos/Estructuras/EstructurasNegocio/NPuestosGenericos.aspx', parametros: { seccion: "PuestoGenerico", op: "obtenerCatalogo", pagina: 1, longitudPagina: 1000, criterio: "", cve_puesto: 0, cve_departamento: departamentoActivo }, campos: ['nombre_puesto|alinearTxtIzq puesto','cve_puesto', "cve_departamento"], ocultos: [1,2], encabezado: { titulo: "Puestos genéricos", columnas: ["Nombre de Puesto","Clave", "Departamento"] }, display: "nombre_puesto", esMultiSeleccion: true, placeHolder: "Buscar en todos los puestos", colspan: 6
                    , onSeleccionar: function (valores) {
                        $.post(urlBase_WS + "NPuestosGenericos.aspx", { op: "AgregarPuestoDepartamento", seccion: "PuestosDepartamentos", cve_departamento: departamentoActivo, cve_puesto: valores.cve_puesto }).done(function (xmlDoc) {
                            mostrarNotificacion(xmlDoc, "notificacion", function () {
                                
                            });
                        });
                    }
                    , onDeseleccionar: function (valores) {
                        $.post(urlBase_WS + "NPuestosGenericos.aspx", { op: "EliminarPuestoDepartamento", seccion: "PuestosDepartamentos", cve_departamento: departamentoActivo, cve_puesto: valores.cve_puesto }).done(function (xmlDoc) {
                            mostrarNotificacion(xmlDoc, "notificacion", function () {
                                
                            });
                        });
                    }, callbackAfterRow: function (tr) {
                        if ($.trim(tr.valor.cve_departamento).length>0) {
                            tr.className = "seleccionado";
                        }
                    }
                }
        ], "base", function (divR) {
            var divTmp = document.getElementById("listaPuestos");
            divTmp.innerHTML = "";
            divTmp.appendChild(divR);
            var tablas = $(divTmp).find(".wrappTabla table");
            var ths = tablas[0].getElementsByTagName("thead")[0].getElementsByTagName("th");
            var tds = tablas[1].getElementsByTagName("tr")[0].getElementsByTagName("td");
            for (var b = 0; b < tds.length; b++) {
                try { ths[b].style.width = $(tds[b]).css("width"); } catch (e) { }
            }
            $("#listaPuestos .wraptable")[0].className = $("#listaPuestos .wraptable")[0].className + " scrollable";
            $("#listaPuestos .wraptable")[0].setAttribute("offset", "370");
            window.onresize();
        },function (seleccion) { }, undefined, { width: '310px',height:"auto" }, true);
    } else {
        alert("Debe seleciconar un departamento.");
    }
}

function LlenarListaPuestos(listaUI, callback, cve_departamento, departamento) {
    listaUI.innerHTML = "";
    var lblDepartamento = document.getElementById("lblDepSeleccionado");
    lblDepartamento.setAttribute("idDepartamento", cve_departamento);
    if (departamento) {
        lblDepartamento.innerHTML = "Puestos de  <b id='nombreDepartamento'>" + departamento + "</b>:";
    }
    var optionitem;
    MostrarSeleccionPuestos(cve_departamento);
}


var ordenador;
function cargarCatalogoPuesto(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NPuesto.aspx", { op: "obtenerCatalogoPuesto", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : ""), cve_puesto: "" }).done(function (xmlDoc) {
        QuitarEspera();
        var puesto = xmlDoc.getElementsByTagName("Table");
        var listaPuesto = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaPuesto).html("");
        var totalregistros;
        for (var i = 0; i < puesto.length; i++) {
            var CvePuesto = GetValor(puesto[i], "cve_puesto");
            var CveDepartamento = GetValor(puesto[i], "nombreDepartamento");
            var nombre = GetValor(puesto[i], "nombrepuesto");
            var estatus = GetValor(puesto[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(puesto[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarPuesto(' + CvePuesto + ')"></button></td>' +
                 '<td><label class="puesto">' + CvePuesto + '</label></td>' +
                '<td><label class="departamento">' + CveDepartamento + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaPuesto.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoPuesto);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
    
}


function GuardarPuesto() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPuesto = document.getElementById("frmNuevoPuesto");
        if (!frmPuesto.esEditar) {
            crearNuevoPuesto();
        } else {
            GuardarEdicionPuesto();
        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarPuesto(cve_puesto) {
    var frmPuesto = document.getElementById("frmNuevoPuesto");
    frmPuesto.reset();
    frmPuesto.esEditar = true;
    MostrarFormulario();
    CargarDatosPuesto(cve_puesto);
    var selectDepartamento = document.getElementById("departamento");
    LlenarCatalogoDepartamento(selectDepartamento, function () {}); 
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosPuesto(cve_puesto) {
    $.post(urlBase_WS + "NPuesto.aspx", { op: "obtenerCatalogoPuesto", pagina: 1, longitudPagina: 5, criterio: "",
        cve_puesto: cve_puesto
    }).done(function (xmlDoc) {
        var puesto = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(puesto, "cve_puesto", "puesto");
        SetValor(puesto, "cve_departamento", "departamento");
        SetValor(puesto, "nombrepuesto", "nombre");
        SetValor(puesto, "activo", "estatus", "bool");
    });
}

function GuardarEdicionPuesto() {
    var frmNuevoPuesto = document.getElementById("frmNuevoPuesto");
    var parametros = $(frmNuevoPuesto).serialize();
    $.post(urlBase_WS + "NPuesto.aspx", "op=EditarPuesto&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoPuesto();
            document.getElementById("frmNuevoPuesto").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarPuesto(cve_puesto) {
    $.post(urlBase_WS + "NPuesto.aspx", { op: "CambiarEstatusActivo", cve_puesto: cve_puesto, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPuesto();
    })
}

function CancelarPuesto(){
    MostrarCatalogo();
 }