//Movimientos...*****************
var PROCESO;
var ESTATUS;
var NIVELTABULAR;
var Num_plantilla = 0;
var USUARIO=0
function iniciar(usuario,_proceso, nivelTabular, estatus) {
    PROCESO = _proceso;
    USUARIO = usuario
    NIVELTABULAR = nivelTabular;
    ESTATUS = estatus;
    var calendario = document.getElementById("vigencia");
    $(calendario).datepicker({ dateFormat: 'dd/mm/yy' });

    try {
        //Iniciar Buscador
        AgregarCriterio('Empleado', 'id_empleado', 'criteriosPosiciones');
        AgregarCriterio('departamento', 'cve_departamento', 'criteriosPosiciones', 'select', '/Modulos/Estructuras/EstructurasNegocio/NDepartamento.aspx?op=obtenerCatalogoDepartamento&pagina=1&longitudPagina=1000&cve_departamento=0&criterio=', 'Departamento', 'nombredep', 'cve_departamento');
        if (!NIVELTABULAR) {
            AgregarCriterio('Estatus', 'estatus', 'criteriosPosiciones', 'select', '/Modulos/Estructuras/EstructurasNegocio/NEstatusplan.aspx?op=ObtenerCatalogoEstatusPosicion&pagina=1&longitudPagina=1000&estatus=0&criterio=', 'Estatus', 'descripcion', 'estatus');
        } else{
            AgregarCriterio('Posición', 'num_plantilla', 'criteriosPosiciones');
        }
    } catch (e) {}
    ObtenerArbolPosiciones('criteriosPosiciones', "arbolPosiciones", "", false, NIVELTABULAR, ESTATUS);
    var selectFamiliaPuesto = document.getElementById("fampuesto");
    LlenarCatalogoFamiliaPuesto(selectFamiliaPuesto, function () {});
    var selectTipoPlantilla = document.getElementById("tipoplantilla");
    LlenarCatalogoTipoPlantilla(selectTipoPlantilla, function () {});
    var selectEmpresa = document.getElementById("empresa");
    LlenarCatalogoEmpresa(selectEmpresa, function () {});
    var selectSegmento = document.getElementById("segmento");
    LlenarCatalogoSegmento(selectSegmento, function () {});
    var selectGrupoPago = document.getElementById("grupopago");
    LlenarCatalogoGrupoPago(selectGrupoPago, function () {});
    var selectCatalogoLugaresTrabajo = document.getElementById("lugarTrabajo");
    LlenarCatalogoLugarTrabajo(selectCatalogoLugaresTrabajo, function () {});
    var selectDGA = document.getElementById("dgaagru");
    LlenarCatalogoDga(selectDGA, function () {});
}

function MostrarVerPerfilPuesto() {
    var numplantilla = document.getElementById("numplantilla").value;
    var puesto = document.getElementById("puesto").value;
    window.top.AgregarNuevoTab("/Modulos/Contrataciones/ContratacionUI/CN_mostrarPerfil.aspx?callbackInicio=callbackVerDescripcionPuesto&offset=0&numplantilla=" + numplantilla + "&puesto=" + puesto, "Perfil de puesto");
}

function MostrarSeleccionPoliticasVacaciones(){
    NuevoSeleccionSecuencial("Seleccionar Política de Vacaciones", [
            { alias: "Política", url: '/Modulos/Vacaciones/VacacionesNegocio/NPoliticaVacacionesMaes.aspx', parametros: { seccion: "PoliticaVacaciones", op: "obtenerCatalogo", pagina: 1, longitudPagina: 1000, criterio: "", cve_politica: 0 }, campos: ['cve_politica', 'nombre', 'diaspermitidos', 'porcentajedeanios'], indicesCamposOcultos: [0],encabezado: { titulo: "Políticas", columnas: ["Clave", "Grupo Política", "Dias permitidos", "% Años"] }, display: "nombre", sigSolicitud: { cve_grupopolitica: 'cve_politica'} }
        , {esConsulta:true, url: '/Modulos/Vacaciones/VacacionesNegocio/NPoliticaVacaciones.aspx', parametros: { seccion: "PoliticaVacacionesDetalle", op: "obtenerCatalogo", pagina: 1, longitudPagina: 1000, criterio: "", cve_politica: 0 }, campos: [ "anios", "diastomar","primavacacional"], encabezado: { titulo: "Detalle de Políticas", columnas: [ "Años", "Dias derecho","Prima vacacional"] }}
    ], "base",function(divR){
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            document.getElementById("politicaVacaciones").value = (seleccion[0]["cve_politica"] ? seleccion[0]["cve_politica"] : 0);
            document.getElementById("spoliticaVacaciones").value = (seleccion[0]["nombre"] ? seleccion[0]["nombre"] : "");
        }
        $.fancybox.close();
    });
}

function MostrarSeleccionHorario() {
    NuevoSeleccionSecuencial("Seleccionar Horario", [
            { alias: "Horario", url: '/Modulos/ControlAcceso/ControlAccesoNegocio/NTurnos.aspx', parametros: { seccion: "Turnos", op: "ObtenerHorarios" }, campos: ['cve_horario', 'cve_turno', 'nombre'], ocultos: [0, 1], encabezado: { titulo: "Horario", columnas: ["Horarios"] }, display: "nombre", sigSolicitud: { cve_horario: 'cve_horario' } }
            , { alias: "Turnos", url: '/Modulos/ControlAcceso/ControlAccesoNegocio/NTurnos.aspx', parametros: { seccion: "Turnos", op: "ObtenerTurnosHorario" }, campos: ['cve_turno', 'nombre'], ocultos: [], encabezado: { titulo: "Turnos de Horario", columnas: ["Clave de turno", "Turno"] }, display: "nombre", sigSolicitud: { cve_turno: 'cve_turno' } }
            , { esConsulta: true, url: '/Modulos/ControlAcceso/ControlAccesoNegocio/NTurnos.aspx', parametros: { seccion: "Turnos", op: "ObtenerHorarioTurno" }, campos: ["dia", "jornada", "comida"], encabezado: { titulo: "Detalle", columnas: ["Día", "Jornada laboral", "Hora de comida"] } }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            document.getElementById("cve_horario").value = (seleccion[0]["cve_horario"] ? seleccion[0]["cve_horario"] : 0);
            document.getElementById("scve_horario").value = (seleccion[0]["nombre"] ? seleccion[0]["nombre"] : "");
        }
        $.fancybox.close();
    });
}

function SeleccionarTabulador(opcion) {
    document.getElementById("tabulador").value = opcion.getAttribute("tabulador");
    document.getElementById("stabulador").value = opcion.getAttribute("stabulador");
    document.getElementById("ntabulador").value = opcion.getAttribute("nivel");
}

function LimpiarTabulador() { 
    document.getElementById("tabulador").value = "";
    document.getElementById("stabulador").value = "";
    document.getElementById("ntabulador").value = "";
}
    

function ActualizarPosiciones() {
    ObtenerArbolPosiciones('criteriosPosiciones', "arbolPosiciones", "", false, NIVELTABULAR, ESTATUS);    
}

var objSuspenderPosicion;
function SuspenderPosicion(objeto) {
    if ($.trim(document.getElementById("s_estatus").value) == "VACANTE") {
        if (confirm("Confirme que desea suspender la posición:")) {
            MostrarSigFrame("/Utilidades/UtilidadesUI/CalendarioObservaciones.aspx?callback=handlerFechaEfectivaSuspenderPosicion&offset=-900", -1800, "pantallaAuxiliar");
        }
    }else{
        mostrarNotificacion(undefined, "notificacion", function () { DesplazarElemento('principal', -900); }, -1, "No se puede continuar, la posición debe estar VACANTE para poderla SUSPENDER.");
    }
}

function handlerFechaEfectivaSuspenderPosicion(fecha, observaciones){
    $.post(urlBase_WS + "NPosiciones.aspx", { op: "SuspenderPosicion", num_posicion: document.getElementById("numplantilla").value, fechaAplicacion: fecha, observaciones: observaciones }).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () { DesplazarElemento('principal', -900); });
    });
}

function LiberarPosicion(objeto){
    if ($.trim(document.getElementById("s_estatus").value) == "SUSPENDIDA") {
        if (confirm("Confirme que desea liberar la posición:")){
            MostrarSigFrame("/Utilidades/UtilidadesUI/CalendarioObservaciones.aspx?callback=handlerFechaEfectivaLiberarPosicion&offset=-900", -1800, "pantallaAuxiliar");
        }
    } else{
        mostrarNotificacion(undefined, "notificacion", function () { DesplazarElemento('principal', -900); }, -1, "No se puede continuar, la posición debe estar SUSPENDIDA para poderla LIBERAR.");
    }
}

function handlerFechaEfectivaLiberarPosicion(fecha, observaciones) {
    $.post(urlBase_WS + "NPosiciones.aspx", { op: "LiberarPosicion", num_posicion: document.getElementById("numplantilla").value, fechaAplicacion: fecha, observaciones: observaciones }).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () { DesplazarElemento('principal', -900); });
    });
}

function CancelarPosicion(objeto){
    if (confirm("Confirme que desea cancelar la posición:")) {
        MostrarSigFrame("/Utilidades/UtilidadesUI/CalendarioObservaciones.aspx?callback=handlerFechaEfectivaCancelarPosicion&offset=-900", -1800, "pantallaAuxiliar");
    }
}

function handlerFechaEfectivaCancelarPosicion(fecha, observaciones) {
    $.post(urlBase_WS + "NPosiciones.aspx", { op: "CancelarPosicion", num_posicion: document.getElementById("numplantilla").value, fechaAplicacion: fecha, observaciones: observaciones }).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () { DesplazarElemento('principal', -900); });
    });
}

var PosicionDestino, g_fechaAplicacion, g_observaciones, g_movimientoEmpleadoPosicion;
function MoverEmpleadoPosicion(objeto, movimiento,alias){
    g_movimientoEmpleadoPosicion = { OP: movimiento, LABEL: alias };
    var idEmpleado = 0; try { idEmpleado = document.getElementById("idempleado").value; } catch (e) { }
    var numPosicion = 0; try { numPosicion = parseInt(document.getElementById("numplantilla").value, 10); } catch (e) { }
    var nivelTabular = -1; try { nivelTabular = parseInt(document.getElementById("ntabulador").value, 10); } catch (e) { }
    if(nivelTabular > 0){
        if (idEmpleado > 0){
            if (confirm("¿Esta seguro que desea aplicar el movimiento " + g_movimientoEmpleadoPosicion.LABEL + " al empleado:" + idEmpleado + ".")) {
                var estatus = "VACANTE";
                if (g_movimientoEmpleadoPosicion.OP == "ENROQUE_POSICION") {
                    estatus = "OCUPADA";
                }
                MostrarSigFrame("/Modulos/Estructuras/EstructurasUI/ES_posiciones.aspx?esSeleccion=true&callback=handlerMoverEmpleadoPosicion&offset=-900&nivelTabular=" + nivelTabular + "&estatus=" + estatus, -1800);
            }
        }else{
            mostrarNotificacion(undefined, "notificacion", function(){ DesplazarElemento('principal', -900); }, -1, "No existe empleado para aplicar movimiento.");
        }
     }else{
          mostrarNotificacion(undefined, "notificacion", function(){ DesplazarElemento('principal', -900); }, -1, "No se tiene registro de su NIVEL TABULAR, asignele uno e intentelo nuevamente.");
     }    
}

function handlerMoverEmpleadoPosicion(num_posicion, idEmpleado) {
    try { idEmpleado = idEmpleado!=undefined ? idEmpleado : "0"; } catch (e) { }
    if ((idEmpleado == "0") || g_movimientoEmpleadoPosicion.OP == "ENROQUE_POSICION"){
        if (g_movimientoEmpleadoPosicion.OP == "ENROQUE_POSICION" && idEmpleado == "0") {
            window.frames["pantallaAuxiliar"].mostrarNotificacion(undefined, "notificacion", function () { }, -1, "No se puede continuar, el movimiento " + g_movimientoEmpleadoPosicion.LABEL + " requiere que la posición este ocupada por un empleado.");
        }else{
            PosicionDestino = num_posicion;
            MostrarSigFrame("/Utilidades/UtilidadesUI/CalendarioObservaciones.aspx?callback=handlerMovimientoPosicionEmpleado", -2700, "pantallaAuxiliar2");
        }
    }else{
        window.frames["pantallaAuxiliar"].mostrarNotificacion(undefined, "notificacion", function () { }, -1, "No se puede continuar, la posición ya esta ocupada por el empleado: " + idEmpleado + ".");
    }
}

function handlerMovimientoPosicionEmpleado(fecha, observaciones) {
    g_fechaAplicacion = fecha;
    g_observaciones = observaciones;
    MostrarSigFrame("/Modulos/Estructuras/EstructurasUI/ES_R_MovimientosEmpleado.aspx?callbackInicio=handlerConfirmarMovimiento&callback=handlerConfirmarMovimientoEmpleadoPosicion&offset=-2700", -3600, "pantallaAuxiliar3");
}

function handlerConfirmarMovimiento(){
    EscribirOcultarValor("posicion", document.getElementById("numplantilla").value, false);
    EscribirOcultarValor("posicionaprobada", PosicionDestino, true);
    EscribirOcultarValor("idempl", document.getElementById("idempleado").value, true);
    EscribirOcultarValor("nombreempl", document.getElementById("nombreEmpleado").value, true);
    EscribirOcultarValor("fechaAplicacion", g_fechaAplicacion, true);
    EscribirOcultarValor("observaciones", g_observaciones, true);
    EscribirOcultarValor("tipoMovimiento", g_movimientoEmpleadoPosicion.LABEL, true);
}

function handlerConfirmarMovimientoEmpleadoPosicion(){
    if (g_movimientoEmpleadoPosicion.OP){
        $.post(urlBase_WS + "NPosiciones.aspx", {
            op: g_movimientoEmpleadoPosicion.OP,
            num_posicion_origen: document.getElementById("numplantilla").value,
            num_posicion_destino: PosicionDestino,
            idEmpleado_A: document.getElementById("idempleado").value,
            fechaAplicacion: g_fechaAplicacion,
            observaciones: g_observaciones
        }).done(function (xmlDoc) {
            cargarCatalogoPosicion(1);
            mostrarNotificacion(xmlDoc, "notificacion", function () { DesplazarElemento('principal', 0); });
        });
    } else {alert("No ha seleccionado un movimiento.");}
}

function MostrarExportar(){
    IntercambioVisual("exportarPlantilla", "wrapFormulario");
    var frmNuevaPosicion = document.getElementById("frmExportar");
    frmNuevaPosicion.esEditar = false;
    //    $.post(urlBase_WS + "NEstadoCivil.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
    //        SetValor(xmlDoc, "clave", "clave");
    //    });
    //document.getElementById("nombre").focus();
    //var selectestatus = document.getElementById("estatus");
    //selectestatus.disabled = true;
    MostrarFormulario("frmExportar");
}


var objAsignarVacante = {idEmpleado:"",num_posicion:"",fechaAplicacion:"",observaciones:""};
function AsignarEmpleadoPosicion(objeto) {
    g_movimientoEmpleadoPosicion= {OP:"ASIGNACION",LABEL:"ASIGNACIÓN"};
    var idEmpleado = 0; try { idEmpleado = parseInt(document.getElementById("idempleado").value, 10); } catch (e) { }
    if (idEmpleado < 1) {
        if (confirm("¿Esta seguro que desea asignar empleado a la posición:" + document.getElementById("numplantilla").value + " ?")) {
            objAsignarVacante.num_posicion = document.getElementById("numplantilla").value;
            MostrarSigFrame("/Modulos/Estructuras/EstructurasUI/ES_empleados.aspx?esSeleccion=true&callback=handlerEmpleadoAsignarEmpPosicion", -1800);       
        }
    } else{
        mostrarNotificacion(undefined, "notificacion", function () { DesplazarElemento('principal', -900); }, -1, "Debe remover el empleado de la posición,  antes de asignarle otro.");
    }    
}

function handlerEmpleadoAsignarEmpPosicion(idEmpleado, num_posicion,nombreEmpleado){
    objAsignarVacante.idEmpleado = idEmpleado;
    objAsignarVacante.nombreEmpleado = nombreEmpleado;
    try { num_posicion = num_posicion?parseInt(num_posicion, 10):0; } catch (e) { }
    if (num_posicion < 1) {
        MostrarSigFrame("/Utilidades/UtilidadesUI/CalendarioObservaciones.aspx?callback=handlerFechaEfectivaAsignarEmpPosicion", -2700, "pantallaAuxiliar2"); 
    }else{
        mostrarNotificacion(undefined, "notificacion", function () { DesplazarElemento('principal', -900); }, -1, "No se puede continuar, el empleado ya tiene asignada la posición: " + num_posicion + ".");
    }
}

function handlerFechaEfectivaAsignarEmpPosicion(fecha, observaciones){
    g_fechaAplicacion = fecha;
    g_observaciones = observaciones;
    MostrarSigFrame("/Modulos/Estructuras/EstructurasUI/ES_R_MovimientosEmpleado.aspx?callbackInicio=handlerInicioConfirmarAsignacion&callback=handlerConfirmarAsignarEmpleadoPosicion&offset=-2700", -3600, "pantallaAuxiliar3");
}

function handlerInicioConfirmarAsignacion() {
    EscribirOcultarValor("posicion", "", false);
    EscribirOcultarValor("posicionaprobada", objAsignarVacante.num_posicion, true);
    EscribirOcultarValor("idempl", objAsignarVacante.idEmpleado, true);
    EscribirOcultarValor("nombreempl", objAsignarVacante.nombreEmpleado, true);
    EscribirOcultarValor("fechaAplicacion", g_fechaAplicacion, true);
    EscribirOcultarValor("observaciones", g_observaciones, true);
    EscribirOcultarValor("tipoMovimiento", g_movimientoEmpleadoPosicion.LABEL, true);
}

function handlerConfirmarAsignarEmpleadoPosicion() {
    ExecAsignarEmpleadoPosicion(function () {
        DesplazarElemento('principal', 0);
        cargarCatalogoPosicion(1);
    });
}

function EscribirOcultarValor(idElemento, valor, visible) {
    var frameConfirmarMovimiento = window.frames["pantallaAuxiliar3"];
    frameConfirmarMovimiento.document.getElementById(idElemento).parentNode.style.display = visible ? "":"none";
    frameConfirmarMovimiento.document.getElementById(idElemento).innerHTML = valor;    
}

function ExecAsignarEmpleadoPosicion(callback){
    //AsignarEmpleado();
    if (confirm("Confirme que desea asignar este empleado para la posición:")) {
        $.post(urlBase_WS + "NPosiciones.aspx", { op: "ASIGNACION", idEmpleado_A: objAsignarVacante.idEmpleado, num_posicion_destino: objAsignarVacante.num_posicion, fechaAplicacion: g_fechaAplicacion, observaciones: g_observaciones }).done(function (xmlDoc) {
            var estatus = GetValor(xmlDoc, "estatus");
            var mensaje = GetValor(xmlDoc, "mensaje");
            var notificacion = document.getElementById("notificacion");
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            $(mensajeNotificacion).html(mensaje);
            if (estatus == 1) {
                notificacion.className = "alert-box success mostrar";
                document.getElementById("idempleado").value = GetValor(xmlDoc, "idEmpleado");
                document.getElementById("nombreEmpleado").value = GetValor(xmlDoc, "nombrecompleto");
            }
            else if (estatus < 0) {
                notificacion.className = "alert-box error mostrar";
            }
            if (callback) {
                callback();
            }
        });
    }
}

var g_remover_numPosicion;
var g_remover_idEmpleado;
function RemoverEmpleadoVacante() {
    g_movimientoEmpleadoPosicion = { OP: "REMOCION", LABEL: "REMOCIÓN" };
    g_remover_idEmpleado = document.getElementById("idempleado").value;
    g_remover_numPosicion = document.getElementById("numplantilla").value;
    if (g_remover_idEmpleado != NaN && g_remover_idEmpleado > 0) {
        if (confirm("Confirme que desea remover al empleado de la posición:")) {
            MostrarSigFrame("/Utilidades/UtilidadesUI/CalendarioObservaciones.aspx?callback=handlerFechaEfectivaRemoverEmpPosicion&offset=-900", -2700, "pantallaAuxiliar2");
            if (document.getElementById("contratacionInmediata").checked) {
                encolarVacate();
            }
        }
    } else {
        mostrarNotificacion(undefined, "notificacion", function () { DesplazarElemento('principal', -900); }, -1, "Id de empleado no válido.");
    }
}

function handlerFechaEfectivaRemoverEmpPosicion(fecha,observaciones) {
    g_fechaAplicacion = fecha;
    g_observaciones = observaciones;
    MostrarSigFrame("/Modulos/Estructuras/EstructurasUI/ES_R_MovimientosEmpleado.aspx?callbackInicio=handlerInicioConfirmarRemocion&callback=handlerConfirmarRemoverEmpleadoPosicion&offset=-900", -3600, "pantallaAuxiliar3");
}

function handlerInicioConfirmarRemocion() {
    EscribirOcultarValor("posicion", g_remover_numPosicion, true);
    EscribirOcultarValor("posicionaprobada", objAsignarVacante.num_posicion, false);
    EscribirOcultarValor("idempl", g_remover_idEmpleado, true);
    EscribirOcultarValor("nombreempl", document.getElementById("nombreEmpleado").value, true);
    EscribirOcultarValor("fechaAplicacion", g_fechaAplicacion, true);
    EscribirOcultarValor("observaciones", g_observaciones, true);
    EscribirOcultarValor("tipoMovimiento", g_movimientoEmpleadoPosicion.LABEL, true);    
}

function handlerConfirmarRemoverEmpleadoPosicion() {
    $.post(urlBase_WS + "NPosiciones.aspx", { op: g_movimientoEmpleadoPosicion.OP, idEmpleado_A: g_remover_idEmpleado, num_posicion_origen: g_remover_numPosicion, fechaAplicacion: g_fechaAplicacion, observaciones: g_observaciones }).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            document.getElementById("idempleado").value = "0";
            document.getElementById("nombreEmpleado").value = "";
            DesplazarElemento('principal', 0);
            cargarCatalogoPosicion(1);
        });
    });
}

function crearNuevaPosicion() {
    var puesto = document.getElementById("puesto");
    var cvePuesto = puesto.options[puesto.selectedIndex].value;
    if (cvePuesto > 0) {
        var frmNuevaPosicion = document.getElementById("frmNuevaPosicion");
        var parametros = $(frmNuevaPosicion).serialize();
        $.post(urlBase_WS + "NPosiciones.aspx", "op=NuevaPosicion&" + parametros).done(function (xmlDoc) {
            var estatus = GetValor(xmlDoc, "estatus");
            var mensaje = GetValor(xmlDoc, "mensaje");
            var notificacion = document.getElementById("notificacion");
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            $(mensajeNotificacion).html(mensaje);
            if (estatus == 1) {
                notificacion.className = "alert-box success mostrarV";
                cargarCatalogoPosicion(1);
                document.getElementById("frmNuevaPosicion").reset();
                MostrarCatalogo("frmNuevaPosicion");
            }else if(estatus < 0){
                var notificacion = document.getElementById("notificacion");
                notificacion.className = "alert-box error mostrarV";
            }
        });
    } else {
        mostrarNotificacion(undefined, "notificacion", function(){}, -1,"Debe seleccionar puesto.");
    }
}

var posicionJefeInmediatoSeleccionada;
function MostrarNuevaPosicion(){
    var numeroPosicionPadre;
    document.getElementById("mensaje-alerta").innerHTML = "";
    if (POSICION_SELECCIONADA && POSICION_SELECCIONADA.numPosicion || NUMERO_POSICIONES == 0) {
        if (NUMERO_POSICIONES == 0) {
            numeroPosicionPadre = 0;
        } else {
            numeroPosicionPadre = POSICION_SELECCIONADA.numPosicion;
        }
        IntercambioVisual("wrapFormulario", "exportarPlantilla");
        var frmNuevaPosicion = document.getElementById("frmNuevaPosicion");
        frmNuevaPosicion.esEditar = false;
        $.post(urlBase_WS + "NPosiciones.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
            document.getElementById("numplantilla").setAttribute("value", SetValor(xmlDoc, "clave", "numplantilla"));
            document.getElementById("numplantilladep").setAttribute("value", numeroPosicionPadre);
            //document.getElementById("empleado").focus();
            var selectestatus = document.getElementById("estatus");
            selectestatus.disabled = true;
            MostrarFormulario("frmNuevaPosicion");
        });
    }else{
        alert("Para continuar, seleccione la posición Jefe Inmediato.");
    }
}


function GuardarPosicion() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmNuevaPosicion = document.getElementById("frmNuevaPosicion");
        if (!frmNuevaPosicion.esEditar) {
            crearNuevaPosicion();
        } else {
            GuardarEdicionPosicion();
        }
    } else{
        MostrarCatalogo();
    }
}

function MostrarEditarEmpleado(num_plantilla) {
    var frmNuevaPosicion = document.getElementById("frmNuevaPosicion");
    frmNuevaPosicion.esEditar = true;
    Num_plantilla = num_plantilla;
    MostrarFormulario("frmNuevaPosicion");
    CargarDatosPosicion(num_plantilla);
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}


function CargarDatosPosicion(num_plantilla) {
    $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", "op=ObtenerEstructura&tipoConsulta=ESTRUCTURA&esDetalle=true&num_plantilla=" + num_plantilla).done(function (xmlDoc) {
        var numplantilla = xmlDoc.getElementsByTagName("Table")[0];
        document.getElementById("mensaje-alerta").innerHTML = "";
        SetValor(numplantilla, "num_plantilla", "numplantilla");
        SetValor(numplantilla, "num_plantilladep", "numplantilladep");
        SetValor(numplantilla, "estatus", "estatus");
        SetValor(numplantilla, "s_estatus", "s_estatus");
        SetValor(numplantilla, "id_empleado", "idempleado");
        SetValor(numplantilla, "contratacionInmediata", "contratacionInmediata","bool");
        SetValor(numplantilla, "nombrecompleto", "nombreEmpleado");
        SetValor(numplantilla, "cve_lugartrabajo", "lugarTrabajo");
        SetValor(numplantilla, "area", "area");
        SetValor(numplantilla, "division", "division");
        SetValor(numplantilla, "plaza", "plaza");
        SetValor(numplantilla, "cve_puesto", "puesto");
        SetValor(numplantilla, "puesto", "sPuesto");
        SetValor(numplantilla, "spuestojefe", "sPuestoJefe");
        SetValor(numplantilla, "Fampuesto", "fampuesto");
        SetValor(numplantilla, "c_costos", "costos");
        SetValor(numplantilla, "cve_politica", "politicaVacaciones");
        SetValor(numplantilla, "spoliticavacaciones", "spoliticaVacaciones");
        SetValor(numplantilla, "cve_horario", "cve_horario");
        SetValor(numplantilla, "scve_horario", "scve_horario");
        SetValor(numplantilla, "Vigencia", "vigencia");
        SetValor(numplantilla, "tipoplantilla", "tipoplantilla");

        var cve_empresa= SetValor(numplantilla, "cve_empresa", "empresa");
        var selectDga = document.getElementById("dgaagru");
        LlenarCatalogoDga(selectDga, function () {
            var dga_agru = SetValor(numplantilla, "dga_agru", "dgaagru");
            var selectDepartamento = document.getElementById("departamento");
            LlenarCatalogoDepartamento(selectDepartamento, function () {
                var cve_departamento = SetValor(numplantilla, "cve_departamento", "departamento");
                var selectPuesto = document.getElementById("puesto");
                LlenarCatalogoPuestosDepartamento(selectPuesto, function () {
                    SetValor(numplantilla, "cve_puesto", "puesto");
                }, cve_departamento)
            }, dga_agru);
        },cve_empresa);
        SetValor(numplantilla, "ubn", "ubn");
        SetValor(numplantilla, "nivelOrden", "nivel");
        SetValor(numplantilla, "tabulador", "tabulador");
        SetValor(numplantilla, "niveltabular", "ntabulador");
        SetValor(numplantilla, "stabulador", "stabulador");
        SetValor(numplantilla, "puntoshay", "puntos");
        SetValor(numplantilla, "segmento", "segmento");
        SetValor(numplantilla, "headcount", "headcount"); 
        SetValor(numplantilla, "headcountocup", "headcountocup");
        var vacantes=SetValor(numplantilla, "headcountVacantes", "headcountVacantes");
        SetValor(numplantilla, "zonacara", "zonacara");
        SetValor(numplantilla, "telefono", "telefono");
        SetValor(numplantilla, "ext", "ext");
        SetValor(numplantilla, "q", "q");
        SetValor(numplantilla, "cve_grupopago", "grupopago");
        //SetValor(numplantilla, "Sindicalizado", "sindicato");
        //SetValor(numplantilla, "Ejecutivo", "ejecutivo");
        //SetValor(numplantilla, "direcplantilla", "direcplantilla");
    });
}

function GuardarEdicionPosicion() {
    var frmNuevoEmpleado = document.getElementById("frmNuevaPosicion");
    var parametros = $(frmNuevoEmpleado).serialize();
    $.post(urlBase_WS + "NPosiciones.aspx", "op=EditarPosicion&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            ObtenerArbolPosiciones('criteriosPosiciones', "arbolPosiciones", "", false, NIVELTABULAR,ESTATUS);
            document.getElementById("frmNuevaPosicion").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarEmpleado(num_plantilla) {
    $.post(urlBase_WS + "NPosiciones.aspx", { op: "CambiarEstatusActivo", num_plantilla: num_plantilla, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoPosicion();
    });
}

function cargarCatalogoPosicion() {
    ObtenerArbolPosiciones('criteriosPosiciones', "arbolPosiciones", "", false, NIVELTABULAR, ESTATUS);    
}

function Cancelar() {
    MostrarCatalogo();
}

function SeleccionarPosicion(_num_posicion, _idEmpleado) {
    var num_posicion,idEmpleado;
    if (!_num_posicion) {
        num_posicion = document.getElementById("numplantilla").value;
        idEmpleado = document.getElementById("idempleado").value;
    } else {
        num_posicion = _num_posicion;
        idEmpleado = _idEmpleado;
    }
    document.body.setAttribute("num_posicion", num_posicion);
    document.body.setAttribute("idEmpledo", idEmpleado);
    eval("window.parent." + PROCESO + "(num_posicion, idEmpleado);");
}

function MostrarPosicionJefe() {
    var posiciondep = document.getElementById('numplantilladep').value;
    if (posiciondep > 0) {
        MostrarEditarEmpleado(posiciondep);
    }
}

function encolarVacate() {
    $.post("/Modulos/Contrataciones/ContratacionNegocio/NCatalogoVacantes.aspx", { seccion: "catalogoVacante", op: "Nuevo", num_plantilla: Num_plantilla, num_usuario:USUARIO, asignado: USUARIO }).done(function (xmlDoc) {
        
    });
  }