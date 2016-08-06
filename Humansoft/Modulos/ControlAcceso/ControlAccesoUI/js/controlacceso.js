var urlBase_WS = "/Modulos/ControlAcceso/ControlAccesoNegocio/";

var IntegracionEventosCTR = function () { }
IntegracionEventosCTR.IniciarPeriodo = function (num_proceso) {
    AgregarCriterioBusqueda('Departamento', 'departamento', 'frmCriteriosBusqueda', 'select', "/Modulos/Estructuras/EstructurasNegocio/NDepartamento.aspx?op=obtenerCatalogoDepartamento&cve_departamento=&cve_dga=&pagina=1&longitudPagina=1000&criterio=&", "Departamentos", "nombredep", "cve_departamento", function () { }, function () { });
    AgregarCriterioBusqueda('No. de empleado', 'num_empleado', 'frmCriteriosBusqueda', 'input', urlBase_WS + "NControlAcceso.aspx", undefined, undefined, undefined, function () { }, function () { });
    AgregarCriterioBusqueda('Nombre de empleado', 'nombreCompleto', 'frmCriteriosBusqueda', 'input', urlBase_WS + "NControlAcceso.aspx", undefined, undefined, undefined, function () { }, function () { });
    IntegracionEventosCTR.ConsultarResumenPeriodo(num_proceso, 'contenedorLista', document.getElementById("frmCriteriosBusqueda"));
}

IntegracionEventosCTR.IniciarProcesosDescuento = function () {
    AgregarCriterioBusqueda('Departamento', 'departamento', 'frmCriteriosBusqueda', 'select', "/Modulos/Estructuras/EstructurasNegocio/NDepartamento.aspx?op=obtenerCatalogoDepartamento&cve_departamento=&cve_dga=&pagina=1&longitudPagina=1000&criterio=&", "Departamentos", "nombredep", "cve_departamento", function () { }, function () { },true);
    AgregarCriterioBusqueda('Fecha inicial', 'fechainicial', 'frmCriteriosBusqueda', 'date', urlBase_WS + "NControlAcceso.aspx", undefined, undefined, undefined, function () { }, function () { },true);
    AgregarCriterioBusqueda('Fecha final', 'fechafinal', 'frmCriteriosBusqueda', 'date', urlBase_WS + "NControlAcceso.aspx", undefined, undefined, undefined, function () { }, function () { },true);
    IntegracionEventosCTR.ConsultarProcesosDescuento("contenedorLista", "frmCriteriosBusqueda", 2);

}

IntegracionEventosCTR.IniciarProcesar = function () {
    //CrearControlPeriodos("periodos",2015);
    $.post(urlBase_WS + "NControlAcceso.aspx", { op: "ObtenerNumeroSiguienteProceso", seccion: "Comunes" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "num_proceso", "num_proceso"); 
        SetValor(xmlDoc, "fecha", "fecha");
        SetValor(xmlDoc, "fechaInicio", "fechaInicio");
        SetValor(xmlDoc, "fechaFin", "fechaFin");
    });
}

var ProcesarPeriodo = function () {
    document.getElementById("procesando").style.display = "inline";
    document.getElementById("lblProcesando").innerHTML = "Procesando..";
    window.setTimeout(function () {
        var fechaInicial = document.getElementById("fechaInicio").value;
        var fechaFinal = document.getElementById("fechaFin").value;
        $.post(urlBase_WS + "NControlAcceso.aspx", { op: "ProcesarEmpleadosPeriodo", fechaInicial: fechaInicial, fechaFinal: fechaFinal }).done(function (xmlDoc) {
            if ($.trim(GetValor(xmlDoc, "estatus")) == "-1") {
                document.getElementById("procesando").style.display = "none";
                document.getElementById("lblProcesando").innerHTML = "<b>" + GetValor(xmlDoc, "mensaje") + "</b>";
            } else {
                document.getElementById("procesando").style.display = "none";
                document.getElementById("lblProcesando").innerHTML = "<b>Proceso terminado, se generaron " + GetValor(xmlDoc, "procesados") + " registros.</b>";
            }
        });
    }, 500);
}

function DescargarExcel() {
    window.location.href = urlBase_WS + "NControlAcceso.aspx?op=ExportarCSVDesglose&num_proceso=" + document.body.getAttribute("num_proceso");

}

var CrearControlPeriodos = function (id,anio) {
    //$.post(urlBase_WS + "NControlAcceso.aspx", { op: "ObtenerNumeroSiguienteProceso", seccion: "Comunes" }).done(function (xmlDoc) {
    var span_periodo,divwrapPeriodos,divPeriodos,divRiel;
    divwrapPeriodos = document.createElement("div");
    document.getElementById(id).appendChild(divwrapPeriodos);
    divwrapPeriodos.style.width = "100%";
    divwrapPeriodos.className = "divWrapPeriodos";
    divPeriodos = document.createElement("div");
    divPeriodos.style.width = (parseInt($(divwrapPeriodos).css("width"), 10) - 120) + "px";
    divPeriodos.className = "divPeriodos";
    divRiel = document.createElement("div");
    divRiel.className = "divriel";
    divRiel.style.marginLeft = "0px";
    divPeriodos.appendChild(divRiel);
    var btnLeft = document.createElement("button");
    btnLeft.divRiel = divRiel;
    btnLeft.offsetPeriodo=((parseInt($(divwrapPeriodos).css("width"), 10) - 130) / 4);
    btnLeft.onclick = function () {
        var riel = this.divRiel;
        riel.style.marginLeft = (parseInt(riel.style.marginLeft, 10) + this.offsetPeriodo) + "px";
    }
    btnLeft.innerHTML = "&lt;&lt;";
    btnLeft.className = "btnLeftPer";
    var btnRight = document.createElement("button");
    btnRight.divRiel = divRiel;
    btnRight.onclick = function () {
        var riel = this.divRiel;
        alert(riel);
        riel.style.marginLeft = (parseInt(riel.style.marginLeft, 10) - this.offsetPeriodo) + "px";
    }
    btnRight.innerHTML = "&gt;&gt;";
    btnRight.className = "btnRightPer";
    divwrapPeriodos.appendChild(btnLeft);
    divwrapPeriodos.appendChild(divPeriodos);
    divwrapPeriodos.appendChild(btnRight);

        span_periodo = document.createElement("span");
        span_periodo.className = "lblPeriodo";
        span_periodo.innerHTML = "1ra. Quincena de Septiembre 2015";
        divRiel.appendChild(span_periodo);
        span_periodo.style.width = ((parseInt($(divwrapPeriodos).css("width"), 10) - 130) / 4) + "px";

        span_periodo = document.createElement("span");
        span_periodo.className = "lblPeriodo";
        span_periodo.innerHTML = "2da. Quincena de Septiembre 2015";
        divRiel.appendChild(span_periodo);
        span_periodo.style.width = ((parseInt($(divwrapPeriodos).css("width"), 10) - 130) / 4) + "px";

        span_periodo = document.createElement("span");
        span_periodo.className = "lblPeriodo";
        span_periodo.innerHTML = "1ra. Quincena de Octubre 2015";
        divRiel.appendChild(span_periodo);
        span_periodo.style.width = ((parseInt($(divwrapPeriodos).css("width"), 10) - 130) / 4) + "px";

        span_periodo = document.createElement("span");
        span_periodo.className = "lblPeriodo";
        span_periodo.innerHTML = "2da. Quincena de Octubre 2015";
        divRiel.appendChild(span_periodo);
        span_periodo.style.width = ((parseInt($(divwrapPeriodos).css("width"), 10) - 130) / 4) + "px";

    //});
}

IntegracionEventosCTR.IniciarDetalle = function () {
    AgregarCriterioBusqueda('No. de empleado', 'num_empleado', 'frmCriteriosBusqueda', 'input', urlBase_WS + "NControlAcceso.aspx", undefined, undefined, undefined, function () { }, function () { });
    AgregarCriterioBusqueda('Fecha inicial', 'fechaInicial', 'frmCriteriosBusqueda', 'date', urlBase_WS + "NControlAcceso.aspx", undefined, undefined, undefined, function () { }, function () { });
    AgregarCriterioBusqueda('Fecha final', 'fechaFinal', 'frmCriteriosBusqueda', 'date', urlBase_WS + "NControlAcceso.aspx", undefined, undefined, undefined, function () { }, function () { });
}


IntegracionEventosCTR.ConsultarProcesosDescuento = function (id, frmBusqueda, cuantos) {
    var lista = document.getElementById(id);
    $(lista).html("");
    $.post(urlBase_WS + "NControlAcceso.aspx?op=ConsultarProcesosDescuento&seccion=Comunes&cuantos=" + (cuantos==undefined?"":cuantos) + "&" + $(frmBusqueda).serialize()).done(function (xmlDoc) {
        var dbResultados = xmlDoc.getElementsByTagName("Table");
        var dbResultados, trLista;
        for (var i = 0; i < dbResultados.length; i++){
            trLista = document.createElement("tr");
            trLista.num_proceso = GetValor(dbResultados[i], "num_proceso");
            trLista.fechaInicio = GetValor(dbResultados[i], "fechaInicio");
            trLista.fechaFin = GetValor(dbResultados[i], "fechaFin");
            trLista.onclick = function (){
                try { lista.seleccionado.className = "" } catch (e) {}
                lista.seleccionado = this;
                this.className = "seleccionado";
                MostrarSigFrame("CTR_PeriodoProcesado.aspx?num_proceso=" + this.num_proceso + "&fechaInicio=" + this.fechaInicio.replace(new RegExp("/", "gi"), "-") + "&fechaFin=" + this.fechaFin.replace(new RegExp("/", "gi"), "-"), -900, "pantallaAuxiliar");
            }
            trLista.innerHTML =
                "<td>" + GetValor(dbResultados[i], "num_proceso") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "fechaProceso") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "fechaInicio") + "-" + GetValor(dbResultados[i], "fechaFin") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "empleadosProcesados") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "diasDescontar") + "</td>";
            lista.appendChild(trLista);
        }
    });
}


IntegracionEventosCTR.ConsultarResumenPeriodo = function (num_proceso, id, frmBusqueda) {
    var lista = document.getElementById(id);
    $(lista).html("");
    $.post(urlBase_WS + "NControlAcceso.aspx?op=ConsultarResumenPeriodo&num_proceso=" + num_proceso + "&" + $(frmBusqueda).serialize()).done(function (xmlDoc) {
        var dbResultados = xmlDoc.getElementsByTagName("Table");
        var dbResultados,trLista;
        for (var i = 0; i < dbResultados.length; i++) {
            trLista = document.createElement("tr");
            trLista.num_empleado = GetValor(dbResultados[i], "num_empleado");
            trLista.fechaInicio = GetValor(dbResultados[i], "fechaInicio");
            trLista.fechaFin = GetValor(dbResultados[i], "fechaFin");
            trLista.nombre = GetValor(dbResultados[i], "nombrecompleto");
            trLista.onclick = function () {
                try{lista.seleccionado.className=""}catch(e){}
                lista.seleccionado = this;
                this.className = "seleccionado";
                MostrarSeleccionPoliticasVacaciones(this.num_empleado, this.fechaInicio, this.fechaFin, this.nombre);
            }
            trLista.innerHTML =

                "<td>" + GetValor(dbResultados[i], "num_proceso") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "num_empleado") + "</td>" +
                "<td style='text-align:left;'>" + GetValor(dbResultados[i],"nombrecompleto") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "nombreMes") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "diasDescontar") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "faltasInasistencia") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "retardos") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "faltasPorRetardo") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "diasVacaciones") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "incidencias") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "permisos") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "incapacidades") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "diasReponer") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "diasRepuestos") + "</td>";
            lista.appendChild(trLista);
        }
    });
}


function MostrarSeleccionPoliticasVacaciones(num_empleado,fechaInicio,fechaFin, nombre) {
    NuevoSeleccionSecuencial(
            "<h3 style='text-align:center;padding:2px;margin:0px;color:#9fb4f2;'>Desglose de eventos</h3>" +
            "<h5 style='padding:2px;margin:0px;'>Nombre: " + nombre + "</h5>" +
            "<h5 style='padding:2px;margin:0px;'>No. Emp.: " + num_empleado + "</h5>"
            , [
            {
                esConsulta: true, alias: "Política", url: urlBase_WS + 'NControlAcceso.aspx?op=ObtenerDesgloseEventosPeriodo&num_empleado=' + num_empleado + '&fechaInicial=' + fechaInicio + '&fechaFinal=' + fechaFin, parametros: {}, campos: ['sfecha', 'dia|alinearTxtIzq', 'Horario', 'horaEntrada', 'horaSalida', 'MinutosRetardo', 'Evento|alinearTxtIzq'], ocultos: [], encabezado: { titulo: "Políticas", columnas: ['Fecha', 'Día', 'Horario', 'Entrada', 'Salida', 'Retardo', 'Evento|evento'] }, sigSolicitud: {},
                callbackAfterRow: function (tr) {
                    if (new RegExp("falta", "gi").test(tr.valor.Evento) || new RegExp("sin goce", "gi").test(tr.valor.Evento)) {
                        tr.className = "marca-descuento";
                    }else if (new RegExp("feriado", "gi").test(tr.valor.Evento)) {
                        tr.className = "marca-feriado";
                    } else if (new RegExp("descanso", "gi").test(tr.valor.Evento)) {
                        tr.className = "marca-descanso";
                    }
                }
            }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({
            type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic', afterShow: function () {
                var tablas = $(divTmp).find(".wrappTabla table");
                var ths = tablas[0].getElementsByTagName("tr")[0].getElementsByTagName("th");
                var tds= tablas[1].getElementsByTagName("tr")[0].getElementsByTagName("td");
                for (var b = 0; b < tds.length; b++) {
                    ths[b].style.width = $(tds[b]).css("width");
                }
            }
        });

    },
    function (seleccion) {        
        $.fancybox.close();
    },undefined,{width:'800px'},true);
}


IntegracionEventosCTR.ConsultarDetallePeriodoEmpleado = function (id, frmBusqueda,num_empleado) {
    var lista = document.getElementById(id);
    $(lista).html("");
    $.post(urlBase_WS + "NControlAcceso.aspx?op=ConsultarResumenPeriodo&seccion=Comunes&" + $(frmBusqueda).serialize()).done(function (xmlDoc) {
        var dbResultados = xmlDoc.getElementsByTagName("Table");
        var dbResultados, trLista;
        for (var i = 0; i < dbResultados.length; i++) {
            trLista = document.createElement("tr");
            trLista.onclick = function () {
                try { lista.seleccionado.className = "" } catch (e) { }
                lista.seleccionado = this;
                this.className = "seleccionado";
            }
            trLista.innerHTML =
                "<td>" + GetValor(dbResultados[i], "fecha") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "num_empleado") + "</td>" +
                "<td style='text-align:left;'>" + GetValor(dbResultados[i], "nombrecompleto") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "horarioEntrada") + '-' + GetValor(dbResultados[i], "horarioSalida") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "horaEntrada") + '-' + GetValor(dbResultados[i], "horaSalida") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "MinutosRetardo") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "Evento") + "</td>" +
                "<td>" + GetValor(dbResultados[i], "Nota") + "</td>";
            lista.appendChild(trLista);
        }
    });
}


$(document).ready(function () {
    var x = window.top;
    if (x.location.href.indexOf("inicio.aspx") < 0) { window.location.href = "/default.htm"; }
});


function LlenarCatalogoTiposRotacion(id) {
    LlenarSelect(urlBase_WS + "NControlAcceso.aspx?op=ObtenerCatTipoRotacion&seccion=Comunes", id, "Tipo de Horario", "cve_rotacion", "descripcion");
}

function LlenarCatalogoFrecuenciaRotacion(id) {
    LlenarSelect(urlBase_WS + "NControlAcceso.aspx?op=ObtenerCatFrecuenciaRotacion&seccion=Comunes", id, "Frecuencia de rotación", "cve_frecuenciarota", "descripcion");
}

function LlenarCatalogoTurnos(id) {
    var lista = document.getElementById(id);
    $(lista).html("");
    $.post(urlBase_WS + "NTurnos.aspx", { op: "ObtenerCatalogo", seccion: "Turnos", pagina: 1, longitudPagina: 50, criterio: "" }).done(function (xmlDoc) {
        var dbTurnos = xmlDoc.getElementsByTagName("Table");
        var span_turno;
        for (var i = 0; i < dbTurnos.length; i++) {
            span_turno = document.createElement("span");
            span_turno.className = "campo-par";
            span_turno.innerHTML = "<input type='checkbox' cve='" + GetValor(dbTurnos[i], "cve_turno") + "'/><label>" + GetValor(dbTurnos[i], "nombre") + "</label>";
            lista.appendChild(span_turno);
        }
    });
}

function ObtenerCatTipoJustificacion(id, callback){
    LlenarSelect(urlBase_WS + "NControlAcceso.aspx?op=ObtenerCatTipoJustificacion&seccion=Comunes", id, "Tipo de justificación", "cve_tipojustificacion", "descripcion",callback);
}
ObtenerCatPoliticas
function ObtenerCatUnidadesTiempo(id) {
    LlenarSelect(urlBase_WS + "NControlAcceso.aspx?op=ObtenerCatUnidadesTiempo&seccion=Comunes", id, "Unidad", "cve_dado", "descripcion");
}

function ObtenerCatPoliticas(id) {
    LlenarSelect(urlBase_WS + "NPoliticas.aspx?op=ObtenerCatPoliticas&seccion=Politicas", id, "Selecione", "cve_politica", "descripcion");
}

function ObtenerMotivosAusentarse(id, cve_tipojustificacion, callback,parametros) {
    LlenarSelect(urlBase_WS + "NMotivos.aspx?op=ObtenerMotivosTipoJustificacion&seccion=Motivos&cve_tipojustificacion=" + cve_tipojustificacion, id, "Motivos justificación", "cve_motivo", "descripcion",callback, parametros);
}

function ObtenerFlujosIncidencias(id, callback) {
    LlenarSelect(urlBase_WS + "NFlujos.aspx?op=ObtenerCatalogo&seccion=Flujos&pagina=1&longitudPagina=100&criterio=", id, "Seleccione el flujo", "cve_flujo", "descripcion",callback);
}
