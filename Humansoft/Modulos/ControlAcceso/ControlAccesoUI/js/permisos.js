/// <reference path="../CTR_IncidenciaEstatus.aspx" />
/// <reference path="../CTR_IncidenciaEstatus.aspx" />
var SolicitarIncidencia = function () { }
SolicitarIncidencia.Iniciar = function (num_empleado) {
    $("#fechainicio").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true
    });
    $("#fechafin").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true
    });
    ObtenerCatTipoJustificacion("cve_tipojustificacion");
    MostrarNuevoPermiso();
    CargarDatosEmpleado(num_empleado);
}

var Estatus = function () { }
Estatus.Iniciar = function (cve_incidencia) {
    ObtenerCatTipoJustificacion("cve_tipojustificacion", function () {
         CargarDatosPermiso(cve_incidencia, function () { ObtenerAcciones(cve_incidencia); });
    });
}

var Historial = function () {}
Historial.Iniciar = function (num_empleado) {
    Historial.CargarHistorialIncidencias();
}

Historial.CargarHistorialIncidencias = function () {
    var numEmpleado = document.getElementById("num_empleado").innerHTML;
    CargarCatalogoPermisos(1, '', numEmpleado, 'contenedorLista',true);
}

var BusquedaIncidencias = function () {}
BusquedaIncidencias.Iniciar = function (){
    CargarCatalogoPermisos(1);
    AgregarCriterioBusqueda('Folio de incidencia', 'num_solicitud', 'frmCriteriosBusqueda', 'input', urlBase_WS + "NPermisos.aspx", undefined, undefined, undefined, function () { CargarCatalogoPermisos(1, '', undefined, undefined, undefined, 'frmCriteriosBusqueda'); }, function () { CargarCatalogoPermisos(1, '', undefined, undefined, undefined, 'frmCriteriosBusqueda'); });
    AgregarCriterioBusqueda('No. de empleado', 'num_empleado', 'frmCriteriosBusqueda', 'input', urlBase_WS + "NPermisos.aspx", undefined, undefined, undefined, function () { CargarCatalogoPermisos(1, '', undefined, undefined, undefined, 'frmCriteriosBusqueda'); }, function () { CargarCatalogoPermisos(1, '', undefined, undefined, undefined, 'frmCriteriosBusqueda'); });
    AgregarCriterioBusqueda('Nombre de empleado', 'nombre_empleado', 'frmCriteriosBusqueda', 'input', urlBase_WS + "NPermisos.aspx", undefined, undefined, undefined, function () { CargarCatalogoPermisos(1, '', undefined, undefined, undefined, 'frmCriteriosBusqueda'); }, function () { CargarCatalogoPermisos(1, '', undefined, undefined, undefined, 'frmCriteriosBusqueda'); });
}

function BuscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    CargarCatalogoPermisos(1, criterio);
}

SolicitarIncidencia.EnviarAprobacion = function () {
    var cve_solicitudjusti = document.getElementById("cve_solicitudjusti").value;
    var selectMotivo = document.getElementById("cve_motivo");
    if (!document.getElementById("frmNuevoPermiso").esEditar) {
        alert("Debe guardar primero la solicitud.");
    } else if (selectMotivo.options[selectMotivo.selectedIndex].nodoXML) {
        var cve_flujo = GetValor(selectMotivo.options[selectMotivo.selectedIndex].nodoXML, "cve_flujo");
        AccionHacer(7, 1, cve_flujo, cve_solicitudjusti,"enviar");
    } else {
        alert("Debe seleccionar un motivo.");
    }
}

function HabilitarBotonEscanear(select) {
    PonerBotonEscanear(select.options[select.selectedIndex].escaneo && select.options[select.selectedIndex].escaneo.toLowerCase() == "true");
}

function MostrarNuevoPermiso() {
    var frmPermiso = document.getElementById("frmNuevoPermiso");
    frmPermiso.reset();
    frmPermiso.esEditar = false;
    var contenedor = document.getElementById("uploadJustificantes");
    contenedor.innerHTML = "";
    document.getElementById("lblNombreEmpleado").innerHTML = "";
    document.getElementById("lblDepartamento").innerHTML = "";
    document.getElementById("lblPuesto").innerHTML = "";
    var txtNumEmp = document.getElementById("txtNumEmp");
    txtNumEmp.onkeydown = function () {CargarDatosEmpleado(this.value); };
    txtNumEmp.onkeyup = function () { CargarDatosEmpleado(this.value); }
    $.post(urlBase_WS + "NPermisos.aspx", { op: "ObtenerSiguienteClave",seccion:"Permisos" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_solicitudjusti", "cve_solicitudjusti");
    });
}

var ordenador;
function CargarCatalogoPermisos(pagina, criterio, num_empleado, idContenedor, esHistorial, idFormulario) {
    try { PonerEnEspera(); } catch (e) { }
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    var metodo = { op: "ObtenerCatalogo", seccion: "Permisos", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "") };
    if (num_empleado) {
        metodo.num_empleado = num_empleado;
    }
    $.post(urlBase_WS + "NPermisos.aspx" + (idFormulario ? "?" + $("#" + idFormulario).serialize() : ""), metodo).done(function (xmlDoc) {
        try { QuitarEspera(); } catch (e) { }
        var listaPermiso = document.getElementById("contenedorLista");
        if (idContenedor) {
            listaPermiso = document.getElementById(idContenedor);
        }
        var dbPermisos = xmlDoc.getElementsByTagName("Table");
        $(listaPermiso).html("");
        var totalregistros;
        for (var i = 0; i < dbPermisos.length; i++) {
            var CvePermiso = GetValor(dbPermisos[i], "cve_solicitudjusti");
            var num_empleado = GetValor(dbPermisos[i], "num_empleado");
            var nombre = GetValor(dbPermisos[i], "nombrecompleto");
            var Descripcion = GetValor(dbPermisos[i], "descripcion");
            var sestatus = GetValor(dbPermisos[i], "sestatus");
            var itemLista = document.createElement("tr");
            var fechacreo = GetValor(dbPermisos[i], "fechacreo");
            totalregistros = GetValor(dbPermisos[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            itemLista.cve_Permiso = CvePermiso;
            itemLista.onclick = function () {
                if (esHistorial) {
                    NuevoSeleccionSecuencial("Historial de Incidencia", [
                            { esConsulta: true, alias: "Incidencia", url: urlBase_WS + "NPermisos.aspx", parametros: { op: "HistorialUnaIncidencia", seccion: "Permisos", cve_solicitudjusti: this.cve_Permiso }, campos: ['cve_solicitudjusti', 'fecha', 'descripcion', 'nombrecompleto'], indicesCamposOcultos: [0], encabezado: { titulo: "Políticas", columnas: ['Clave', 'Fecha', 'Estatus', 'Modificó'] }, display: "nombrecompleto" }
                    ], "base", function (divR) {
                                        var divTmp = document.createElement("div");
                                        divTmp.appendChild(divR);
                                        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
                                    },
                    function (seleccion) {
                        $.fancybox.close();
                    });
                } else {
                    MostrarEstatusPermiso(this.cve_Permiso);
                }
            }
            $(itemLista).html(
                 '<td>' + CvePermiso + '</td>' +
                 '<td>' + fechacreo + '</td>' +
                '<td>' + num_empleado + '</td>' +
                '<td>' + nombre + '</td>' +
                '<td>' + Descripcion + '</td>' + 
                '<td>' +sestatus + '</td>'
            );
            listaPermiso.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoPermisos);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarPermiso(op) {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmPermiso = document.getElementById("frmNuevoPermiso");
        if (frmPermiso.esEditar || op=="Editar") {
            GuardarEdicionPermiso("Editar");
        } else {
            GuardarEdicionPermiso("Nuevo");
        }
    } else {
        MostrarCatalogo();
    }
}

function ObtenerAcciones(cve_solicitud) {
    var cve_solicitud = document.getElementById("cve_solicitudjusti").value;
    $.post(urlBase_WS + "NPermisos.aspx", { op: "ObtenerAcciones", seccion: "Permisos", cve_solicitudjusti: cve_solicitud }).done(function (xmlDoc) {
        var dbAcciones = xmlDoc.getElementsByTagName("Table");
        var barraBotones = document.getElementById("barra-botones").getElementsByTagName("span")[0];
        barraBotones.innerHTML = '<button class="cancelar btnFormularios" onclick="if(window.parent.document.getElementById(\'principal\')){window.parent.DesplazarElemento(\'principal\',0);}else window.top.CerrarTabDesdeFrame(window.location.href);" style="float:right;">Salir</button>';
        var btnAccion;

        document.getElementById("fechainicio").setAttribute("readonly", "true");
        document.getElementById("fechafin").setAttribute("readonly", "true");
        document.getElementById("wrap-justificantes").disabled = true;

        for (var i = 0; i < dbAcciones.length; i++) {
            btnAccion = document.createElement("button");
            btnAccion.cve_estatus = GetValor(dbAcciones[i], "cve_estatus");
            btnAccion.cve_accion = GetValor(dbAcciones[i], "cve_accion");
            btnAccion.onclick = function () { EjecutarAccion(this); };
            btnAccion.className = "guardar btnFormularios";
            btnAccion.innerHTML = Capitalize(GetValor(dbAcciones[i], "saccion"));
            var selectMotivo = document.getElementById("cve_motivo");
            var esEscanearMotivo = false;
            var agregarBoton = true;
            try { esEscanearMotivo = selectMotivo.options[selectMotivo.selectedIndex].escaneo.toLowerCase() == "escaneo"; } catch (e) { }
            if (new RegExp(GetValor(dbAcciones[i], "saccion").toLowerCase(), "gi").test("escanear") || esEscanearMotivo) {
                PonerBotonEscanear(true);
                agregarBoton = false;
            }
           if (new RegExp(GetValor(dbAcciones[i], "saccion").toLowerCase(), "gi").test("guardar")){
                btnAccion.onclick = function () {
                    GuardarEdicionPermiso("Editar");
                    EjecutarAccion(this);
                }
                document.getElementById("fechainicio").removeAttribute("readonly");
                document.getElementById("fechafin").removeAttribute("readonly");
                var controles = document.getElementById("wrap-justificantes").disabled = false;
                barraBotones.appendChild(btnAccion);
           }
           if (agregarBoton) {
                barraBotones.appendChild(btnAccion);
           }           
        }
    });
}

function EjecutarAccion(objeto){
    var cve_estatusSolicitud= document.getElementById("cve_estatus").value;
    var cve_flujo= document.getElementById("cve_flujo").value;
    var cve_solicitud = document.getElementById("cve_solicitudjusti").value;
    //alert(objeto.cve_accion + ":" + cve_estatusSolicitud + ":" + cve_flujo + ":" + cve_solicitud);
    AccionHacer(objeto.cve_accion, cve_estatusSolicitud, cve_flujo, cve_solicitud,objeto.innerHTML);
}

function AccionHacer(cve_accion, estatusActual, flujo, cve_solicitud, saccion) {
    $.post(urlBase_WS + "NPermisos.aspx", { op: "ObtenerAccionesHT", seccion: "Permisos", cve_accion: cve_accion }).done(function (xmlDoc) {
        var dbAcciones = xmlDoc.getElementsByTagName("Table");
        var cve_estatus = GetValor(xmlDoc, "cve_estatus");
        var accion = GetValor(xmlDoc, "accion");
        if (accion == "1") {
            $.post(urlBase_WS + "NPermisos.aspx", { op: "ObtenerSiguienteEstatus", seccion: "Permisos", cve_estatusActual: estatusActual, flujo:flujo }).done(function (xmlDoc) {
                cve_estatus= GetValor(xmlDoc,"cve_estatus");
                $.post(urlBase_WS + "NPermisos.aspx", { op: "ActualizarEstatus", seccion: "Permisos", cve_solicitudjusti: cve_solicitud, cve_estatus: cve_estatus }).done(function (xmlDoc) {
                    if (parseInt(GetValor(xmlDoc, "estatus")) > 0) {
                        if (parent.document.getElementById("contenedorLista")) {
                            parent.CargarCatalogoPermisos(1, '');
                            if (new RegExp("enviar", "gi").test(saccion.toLowerCase())) {
                                var num_empleado = document.getElementById("txtNumEmp").innerHTML;
                                $.post(urlBase_WS + "NPermisos.aspx", { op: "ObtenerUsuarioJefeInmediato", seccion: "Permisos", num_empleado: num_empleado }).done(function (xmlDoc) {
                                    var cve_usuarioJefeInmediato = GetValor(xmlDoc, "cve_usuario");
                                    var nombre = document.getElementById("lblNombreEmpleado").innerHTML;
                                    var nombreJefe = GetValor(xmlDoc, "nombre");
                                    $.post(urlBase_WS + "NPermisos.aspx", { op: "NotificarJefeInmediato", seccion: "Permisos", cve_solicitudjusti: cve_solicitud, cve_usuario: cve_usuarioJefeInmediato, nota: 'El empleado ' + nombre + ' ha solicitado incidencia.', pagina: '/Modulos/ControlAcceso/ControlAccesoUI/CTR_IncidenciaEstatus.aspx?cve_solicitudjusti=' + cve_solicitud, referencia: 'INC_AUT_JEFE_' + cve_solicitud, requiereConfirmacion: true }).done(function (xmlDoc) {
                                        alert("Se ha notificado a su jefe inmediato " + nombreJefe + ".");
                                        window.location.reload();
                                    });
                                });
                            } else {
                                window.location.reload();
                            }
                        }
                    } else {
                        alert(GetValor(xmlDoc, "mensaje"));
                    }
                });
            });
        }else if(accion=="2"){
            $.post(urlBase_WS + "NPermisos.aspx", { op: "ActualizarEstatus", seccion: "Permisos", cve_solicitudjusti: cve_solicitud, cve_estatus: cve_estatus }).done(function (xmlDoc) {
                if (parseInt(GetValor(xmlDoc, "estatus")) > 0) {
                    if (parent.document.getElementById("contenedorLista")) {
                        parent.CargarCatalogoPermisos(1, '');
                    }
                    window.location.reload();
                    
                } else {
                    alert(GetValor(xmlDoc, "mensaje"));
                }
            });
        }
    });
}

function PonerBotonEscanear(esPoner, objeto) {
    if (esPoner) {
        if (!document.getElementById("btnAdjuntar")) {
            var btnAdjuntar = document.createElement("button");
            btnAdjuntar.className = "btnFormularios";
            btnAdjuntar.id = "btnAdjuntar";
            btnAdjuntar.style.float = "right";
            btnAdjuntar.onclick = function () { AgregarInputFile('uploadJustificantes', 'justificante'); if (objeto) { EjecutarAccion(objeto); } };
            btnAdjuntar.innerHTML = "Agregar documento";
            document.getElementById("wrap-justificantes").appendChild(btnAdjuntar);
        }
    } else if (document.getElementById("btnAdjuntar")) {
        document.getElementById("wrap-justificantes").removeChild(document.getElementById("btnAdjuntar"));
    }
}

function MostrarEstatusPermiso(cve) {
    MostrarSigFrame("CTR_IncidenciaEstatus.aspx?cve_solicitudjusti=" + cve, -900, "pantallaAuxiliar", undefined);
}

function CargarDatosPermiso(cve, callback) {
    $.post(urlBase_WS + "NPermisos.aspx", { op: "ObtenerDetallePermiso", seccion: "Permisos", cve_solicitudjusti: cve }).done(function (xmlDoc) {
        var dbPermiso = xmlDoc.getElementsByTagName("Table")[0]; 
        SetValor(dbPermiso, "cve_solicitudjusti", "cve_solicitudjusti");
        SetValor(dbPermiso, "cve_estatus", "cve_estatus");
        SetValor(dbPermiso, "sestatus", "sestatus");
        SetValor(dbPermiso, "cve_solicitudjusti", "lblcve_solicitudjusti");
        SetValor(dbPermiso, "cve_flujo", "cve_flujo");
        SetValor(dbPermiso, "cve_tipojustificacion", "cve_tipojustificacion");
        var selectTipoJust = document.getElementById("cve_tipojustificacion");
        ObtenerMotivosAusentarse('cve_motivo', selectTipoJust.options[selectTipoJust.selectedIndex].value, function () {
            SetValor(dbPermiso, "cve_motivo", "cve_motivo");
        }, ['escaneo']);
        SetValor(dbPermiso, "num_empleado", "txtNumEmp");
        SetValor(dbPermiso, "nombrecompleto", "lblNombreEmpleado");
        SetValor(dbPermiso, "departamento", "lblDepartamento");
        SetValor(dbPermiso, "puesto", "lblPuesto");

        SetValor(dbPermiso, "fechainicio", "fechainicio","date");
        SetValor(dbPermiso, "fechafin", "fechafin", "date");
        SetValor(dbPermiso, "horainicio", "horainicio");
        SetValor(dbPermiso, "horafin", "horafin");

        SetValor(dbPermiso, "comentario", "comentario");
        ObtenerJustificantes(true);
        if (callback) callback();
    });
}

function CargarDatosEmpleado(num_empleado) {
    $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", "op=ObtenerEncabezadoEmpleado&seccion=Comunes&num_empleado=" + (num_empleado? num_empleado:"")).done(function (xmlDoc) {
        var dbEmpleado = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbEmpleado, "num_empleado", "txtNumEmp");
        SetValor(dbEmpleado, "nombre", "lblNombreEmpleado");
        SetValor(dbEmpleado, "departamento", "lblDepartamento");
        SetValor(dbEmpleado, "puesto", "lblPuesto");
    });
}

function GuardarEdicionPermiso(op){
    var frmNuevoPermiso = document.getElementById("frmNuevoPermiso");
    frmNuevoPermiso.action = urlBase_WS + "NPermisos.aspx?op=Guardar&sub_op=" + op + "&seccion=Permisos&proceso=HandlerGuardarJustificacion";
    document.getElementById("hfechainicio").value = document.getElementById("fechainicio").value + " " + document.getElementById("horainicio").value;
    document.getElementById("hfechafin").value = document.getElementById("fechafin").value + " " + document.getElementById("horafin").value;
    frmNuevoPermiso.submit();
}

function ObtenerJustificantes(limpiar) {
    var num_empleado = document.getElementById("txtNumEmp");
    $.post(urlBase_WS + "NPermisos.aspx", { op: "ObtenerJustificantes", cve_solicitudjusti: document.getElementById("cve_solicitudjusti").value, num_empleado:(num_empleado.value || num_empleado.innerHTML) }).done(function (xmlDoc) {
        var archivos = xmlDoc.getElementsByTagName("Table1");
        var contenedor = document.getElementById("uploadJustificantes");
        var olConts = contenedor.getElementsByTagName("ol");
        if (olConts.length > 0) {
            olCont = olConts[0];
        } else {
            olCont = document.createElement("ol");
            contenedor.appendChild(olCont);
        }
        if (limpiar) {
            olCont.innerHTML = "";
        }
        var liItem;
        var num_emp = document.getElementById("txtNumEmp");
        for (var i = 0; i < archivos.length; i++) {
            liItem = document.createElement("li");
            liItem.innerHTML = "<a class='link-hs' target='_blank' href='/Expedientes/Empleados/" + (num_emp.value || num_emp.innerHTML) + "/" + GetValor(archivos[i], "Nombre") + GetValor(archivos[i], "Ext") + "'> » " + GetValor(archivos[i], "Nombre") + GetValor(archivos[i], "Ext") + "</a>";
            olCont.appendChild(liItem);
        }
    });
}

function HandlerGuardarJustificacion(estatus, mensaje, sqlmensaje) {
    mostrarNotificacion(undefined, "notificacion", function () {
        if (estatus > 0) {
            document.getElementById("frmNuevoPermiso").esEditar = true;
            if (document.getElementById("contenedorLista")) {
                CargarCatalogoPermisos(1, '');
                DesplazarElemento('Principal', 0);
            } else {
                window.top.AgregarNuevoTab("/Modulos/ControlAcceso/ControlAccesoUI/CTR_IncidenciaEstatus.aspx?cve_solicitudjusti=" + estatus, "Solicitud de incidencia");
                window.top.CerrarTabDesdeFrame(window.location.href);
            }           
        }
    }, estatus, mensaje);
}

