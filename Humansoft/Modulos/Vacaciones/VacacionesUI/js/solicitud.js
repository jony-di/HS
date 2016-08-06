
var diasSeleccionados = [];
var diasVacaciones = [];
var diasFeriados = [];
 var ID_EMPLEADO;

 function iniciar(idempleado) {
     ID_EMPLEADO = idempleado;
     
     ObtenerEncabezadoEmpledo(idempleado ? idempleado : 0);

     ObtenerDiasFeriados(function (_diasFeriados) {
         diasFeriados = _diasFeriados;
         ObtenerDiasVacacionesEmpleado(function (_diasVacaciones) {
             diasVacaciones = _diasVacaciones;
             $("#seleccionarDias").datepicker({
                 numberOfMonths: 3,
                 dateFormat: "dd-mm-yy",
                 beforeShowDay: function (date) {
                     var dmy = (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) + "-" + (((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1))) + "-" + date.getFullYear();
                     var sFechaIni = fechaInicial.split("-");
                     var sFechaFin = fechaFinal.split("-");
                     if ($.inArray(dmy, diasSeleccionados) > -1) {
                         return [true, "diaSel"];
                     } else if (date < new Date(sFechaIni[2], sFechaIni[1] - 1, sFechaIni[0]) || date > new Date(sFechaFin[2], sFechaFin[1] - 1, sFechaFin[0])) {
                         return [false, "ui-state-hover", "Rango deshabilitado"];
                     } else if ($.inArray(dmy, diasFeriados) > -1) {
                         return [false, "feriado", "Dia feriado"];
                     } else if ($.inArray(dmy, diasVacaciones) > -1) {
                         
                         return [false, "vacaciones-util", "Dia de vacaciones utilizado"];
                     } else {
                         return [true, ""];
                     }
                 },
                 onSelect: function (fecha, instancia) {
                     removerCadena(diasSeleccionados, fecha);
                     var diasRestantes;
                     if (new RegExp("diaSel", "gi").test(instancia.tdActual.className)) {
                         $(instancia.tdActual).removeClass("diaSel");
                         document.getElementById("diasDerecho").innerHTML = (parseInt(document.getElementById("diasDerecho").innerHTML, 10) + 1);
                     } else {
                         var diasDerecho = parseInt(document.getElementById("diasDerecho").innerHTML, 10);
                         if (diasDerecho > 0) {
                             diasSeleccionados.push(fecha);
                             $(instancia.tdActual).addClass("diaSel");
                             document.getElementById("diasDerecho").innerHTML = parseInt(document.getElementById("diasDerecho").innerHTML, 10) - 1;
                         }
                     }
                     document.getElementById("diasSeleccionadas").innerHTML = diasSeleccionados.length;
                 }
             });
         });
     });
 }


 function removerCadena(arreglo, objeto) {
     for (var i = 0; i < arreglo.length; i++) {
         if (arreglo[i] == objeto) {
             arreglo.splice(i, 1);
         }
     }
 }

 function unavailable(date) {
     var dmy = (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) + "-" + ((date.getMonth() > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1))) + "-" + date.getFullYear();
     var sFechaIni = fechaInicial.split("-");
     var sFechaFin = fechaFinal.split("-");
     if ($.inArray(dmy, diasSeleccionados) > -1) {
        return [true, "diaSel"];
    } else if (($.inArray(dmy, unavailableDates) > -1) || date < new Date(sFechaIni[2], sFechaIni[1] - 1, sFechaIni[0]) || date > new Date(sFechaFin[2], sFechaFin[1] - 1, sFechaFin[0])) {
        return [false, "ui-state-hover", "Rango deshabilitado"];
    } else if (($.inArray(dmy, unavailableDates) > -1) || date < new Date(sFechaIni[2], sFechaIni[1] - 1, sFechaIni[0]) || date > new Date(sFechaFin[2], sFechaFin[1] - 1, sFechaFin[0])) {
        return [false, "ui-state-hover", "Dia feriado"];
    } else if (($.inArray(dmy, unavailableDates) > -1) || date < new Date(sFechaIni[2], sFechaIni[1] - 1, sFechaIni[0]) || date > new Date(sFechaFin[2], sFechaFin[1] - 1, sFechaFin[0])) {
        return [false, "ui-state-hover", "Dia de vacaciones utilizado"];
    } else {
        return [true, ""];
    }
}

function SolicitarVacaciones() {
    $.post(urlBase_WS + "NVacaciones.aspx", { seccion: "ProcesoVacaciones", op: "RegistrarSolicitud", num_empleado: ID_EMPLEADO, diasSolicitados: diasSeleccionados.join(",") }).done(function (xmlDoc) {
        $(window.top.document.getElementById("spliterRight")).animate({ scrollTop: 0 }, '500');
        var estatus;
        var mensaje;
        estatus = GetValor(xmlDoc, "estatus");
        mensaje = GetValor(xmlDoc, "mensaje");

        var notificacion = document.getElementById('notificacion');
        var mensajeNotificacion = notificacion.getElementsByTagName("span")[0];
        if (estatus == 1) {
            notificacion.className = "alert-box success";
            notificacion.style.visibility = "visible";
            var linkArchivo=document.getElementById("link-pdf-solicitud-vacaciones");
            SetValor(xmlDoc, "num_empleado","num_empleado-esc");
            SetValor(xmlDoc, "num_solicitud","num_solicitud-esc");
            var urlArchivo= GetValor(xmlDoc, "urlSolicitud");
            linkArchivo.setAttribute("href", "../VacacionesNegocio/NVacaciones.aspx?op=RegistrarImpresionSolicitud&Seccion=ProcesoVacaciones&num_empleado=" + ID_EMPLEADO + "&num_solicitud=" + GetValor(xmlDoc, "num_solicitud") + "&urlSolicitud=" + urlArchivo);
            linkArchivo.innerHTML= urlArchivo.substring(urlArchivo.lastIndexOf('/')+1);
            DesplazarElemento("principal", -900);
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error";
            notificacion.style.visibility = "visible";
            if (estatus == -11) {
                var sfechas = "";
                var fechas = xmlDoc.getElementsByTagName("Table");
                var coma = "";
                for (var i = 0; i < fechas.length; i++) {
                    sfechas += coma + GetValor(fechas[i], "diaRepetido");
                    coma = ",";
                }
                mensaje += " Fechas que ya existen: " + sfechas;
            }
        }
        $(mensajeNotificacion).html(mensaje);
    });
}

function CargarEscaneo() {
    var formEscanear = document.getElementById("formularioImprimirEscanear");
    formEscanear.enctype = "multipart/form-data";
    formEscanear.method = "post";
    formEscanear.target = "consola";
    formEscanear.action = "../VacacionesNegocio/NVacaciones.aspx?op=CargarEscaneo&Seccion=ProcesoVacaciones";
    formEscanear.submit();
}

function HandlerCargarEscaneo(estatus, mensaje) {
    if (estatus < 1) {
        mostrarNotificacion(null, 'notificacion-escaneo', function () { }, estatus, mensaje);
    } else {
        DesplazarElemento("principal", -2700);
    }
}

/************************************************************************************************

    Listado de solicitudes

*************************************************************************************************/
var ListadoSolicitudes= function(){}

ListadoSolicitudes.iniciar = function () {
    ListadoSolicitudes.AgregarCriterio('No. de Solicitud', 'num_solicitud', 'frmCriteriosBusqueda');
    ListadoSolicitudes.AgregarCriterio('No. de empleado', 'num_empleado', 'frmCriteriosBusqueda'); ToggleMenu('criteriosBusqueda');
    ListadoSolicitudes.AgregarCriterio('Nombre de empleado', 'nombre_empleado', 'frmCriteriosBusqueda'); ToggleMenu('criteriosBusqueda');
    ListadoSolicitudes.cargarMisSolicitudes(1);
    ListadoSolicitudes.cargarLista(1);
    $("#tabsListado").tabs();
}

ListadoSolicitudes.ActualizarTablas= function(){
    ListadoSolicitudes.cargarMisSolicitudes(1);
    ListadoSolicitudes.cargarLista(1);
}

ListadoSolicitudes.AgregarCriterio= function(placeholder, criterio, idPadre, tipo, url, leyenda, descripcion, clave){
    var numeroFiltros = document.getElementById(idPadre).children.length;
    if (numeroFiltros < 6) {
        if (!tipo || tipo == "input") {
            NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "<input name='" + criterio + "' placeholder='" + placeholder + "' onkeyup=\"ListadoSolicitudes.cargarLista(1,'');\"/><b class='btnFormularios' onclick='EliminarCriterio(this,ListadoSolicitudes.cargarLista)'>x</b>", "");
        } else if (tipo == "select") {
            LlenarSelect(url, undefined, leyenda, clave, descripcion, function (selectRelleno) {
                if (selectRelleno.options[0].value == '0'){
                    selectRelleno.options[0].value = "";
                }
                selectRelleno.setAttribute("name", criterio);
                selectRelleno.onchange = ConsultarEmpleados;
                var spanCriterio = NuevoElemento(document.getElementById(idPadre), "span", "criterio-busqueda", "", "");
                spanCriterio.appendChild(selectRelleno);
                var btnCerrar = document.createElement("b");
                btnCerrar.className = 'btnFormularios';
                btnCerrar.onclick = function () { EliminarCriterio(this, ConsultarEmpleados); };
                btnCerrar.innerHTML = "x";
                spanCriterio.appendChild(btnCerrar);
            });
        }
    }
}

var ordenador2;
ListadoSolicitudes.cargarMisSolicitudes = function (pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NVacaciones.aspx", "seccion=Comunes&op=ObtenerMisSolicitudes").done(function (xmlDoc) {
        QuitarEspera();
        var items = xmlDoc.getElementsByTagName("Table");
        var lista = document.getElementById("contenedorMisSolicitudes");
        $(lista).html("");
        var totalregistros, itemLista;
        for (var i = 0; i < items.length; i++) {
            var num_empleado = GetValor(items[i], "num_empleado");
            var num_solicitud = GetValor(items[i], "num_solicitud");
            itemLista = document.createElement("tr");
            itemLista.className = "columnas columnas1";
            itemLista.num_empleado = num_empleado;
            itemLista.num_solicitud = num_solicitud;
            totalregistros = GetValor(items[i], "totalRegistros");
            itemLista.onclick = function (event) { if (event.target.tagName.toLowerCase() == "td" || event.target==this) { ListadoSolicitudes.mostrarInfoSolicitud(this); } };
            $(itemLista).html(
                '<td><span onclick="VerHistorialSolicitud(event,' + GetValor(items[i], "num_solicitud") + ');" style="display:block;width:100%;"><img src="/Recursos/imagenes/verhistorial.png"/></span></td>' +                
                '<td>' + GetValor(items[i], "num_solicitud") + '</td>' +
                '<td>' + GetValor(items[i], "fechaprog") + '</td>' +
                '<td>' + GetValor(items[i], "diasprog") + '</td>' +
                '<td>' + GetValor(items[i], "estatus") + '</td>'+
                '<td>' + GetValor(items[i], "num_empleado") + '</td>' +
                '<td>' + GetValor(items[i], "nombre_empleado") + '</td>' +
                '<td>' + GetValor(items[i], "departamento") + '</td>' +
                '<td>' + GetValor(items[i], "puesto") + '</td>' 
            );
            lista.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, ListadoSolicitudes.cargarLista);
        var tableCatalogo = document.getElementById("listaMisVacaciones");
        ordenador2 = $(tableCatalogo).tablesorter();
    });
}

function VerHistorialSolicitud(ev, num_solicitud) {
    NuevoSeleccionSecuencial("Historial de la solicitud.", [
            { esConsulta: true, idTabla: "t-desglose", url: '/Modulos/Vacaciones/VacacionesNegocio/NVacaciones.aspx', parametros: {op:"ObtenerHistorialUnaSolicitud", seccion:"Comunes", num_solicitud:num_solicitud}, campos: ['num_solicitud', 'fecha', 'estatus', 'nombre'], encabezado: { titulo: "", columnas: ['No.', 'Fecha', 'Estatus', 'Usuario modificó'] }}
    ], "base", function (divR) {
        try { QuitarEspera(); } catch (e) { }
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({
            type: 'html'
            , content: $(divTmp)
            , preload: false
            , openEffect: 'elastic'
        });
    },
        function (seleccion) {
            $.fancybox.close();
        }
        , true
    );
}

function VerDetalleSolicitud(ev, num_solicitud) {
    NuevoSeleccionSecuencial("Días correspondientes a la solicitud número: " + num_solicitud + ".", [
            { esConsulta: true, idTabla: "t-desglose", url: '/Modulos/Vacaciones/VacacionesNegocio/NVacaciones.aspx', parametros: { op: "ObtenerDiasSolicitud", seccion: "Comunes", num_solicitud: num_solicitud }, campos: ['num_solicitud', 'fechadia'], encabezado: { titulo: "", columnas: ['No.', 'Fecha'] } }
    ], "base", function (divR) {
        try { QuitarEspera(); } catch (e) { }
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({
            type: 'html'
            , content: $(divTmp)
            , preload: false
            , openEffect: 'elastic'
        });
    },
        function (seleccion) {
            $.fancybox.close();
        }
        , true
    );
}

var ordenador;
ListadoSolicitudes.cargarLista = function (pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    var frmBusqueda = document.getElementById("frmCriteriosBusqueda");
    $.post(urlBase_WS + "NVacaciones.aspx", "seccion=Comunes&op=ObtenerListadoSolicitudes&pagina=" + pagina + "&longitudPagina=50&criterio=" + (criterio ? criterio : "") + "&" + $(frmBusqueda).serialize()).done(function (xmlDoc) {
        QuitarEspera();
        var items = xmlDoc.getElementsByTagName("Table");
        var lista = document.getElementById("contenedorLista");
        $(lista).html("");
        var totalregistros, itemLista;
        for (var i = 0; i < items.length; i++) {
            var num_empleado = GetValor(items[i], "num_empleado");
            var num_solicitud = GetValor(items[i], "num_solicitud");
            itemLista = document.createElement("tr");
            itemLista.className = "columnas columnas1";
            itemLista.num_empleado = num_empleado;
            itemLista.num_solicitud = num_solicitud;
            totalregistros = GetValor(items[i], "totalRegistros");
            itemLista.onclick = function (event) { if (event.target.tagName.toLowerCase() == "td" || event.target == this) { ListadoSolicitudes.mostrarInfoSolicitud(this); } };
            $(itemLista).html(
                '<td><span onclick="VerHistorialSolicitud(event,' + GetValor(items[i], "num_solicitud") + ');" style="display:block;width:100%;"><img src="/Recursos/imagenes/verhistorial.png"/></span></td>' +                
                '<td>' + GetValor(items[i], "num_solicitud") + '</td>' +
                '<td>' + GetValor(items[i], "fechaprog") + '</td>' +
                '<td>' + GetValor(items[i], "diasprog") + '</td>' +
                '<td>' + GetValor(items[i], "estatus") + '</td>'+
                '<td>' + GetValor(items[i], "num_empleado") + '</td>' +
                '<td>' + GetValor(items[i], "nombre_empleado") + '</td>' +
                '<td>' + GetValor(items[i], "departamento") + '</td>' +
                '<td>' + GetValor(items[i], "puesto") + '</td>' 
            );
            lista.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, ListadoSolicitudes.cargarLista);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

ListadoSolicitudes.mostrarInfoSolicitud = function (row) {
    MostrarSigFrame("VAC_Solicitudestatus.aspx?num_empleado=" + row.num_empleado +"&num_solicitud=" + row.num_solicitud, -900, "p_frame1");
} 

ListadoSolicitudes.Desactivar= function(cve) {
    $.post(urlBase_WS + "NRoles.aspx", { op: "CambiarEstatusActivo", cve_role: cve, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        ListadoSolicitudes.cargarCatalogo();
    })

}

ListadoSolicitudes.Cancelar= function() {
    MostrarCatalogo();
}


/**********************************************************************************************************************************************

Estatus vacaciones

***********************************************************************************************************************************************/
var EstatusSolicitud = function () { }

EstatusSolicitud.iniciar = function () {
    var numeroEmpleado = document.getElementById("numeroEmpleado") ? document.getElementById("numeroEmpleado").value : 0;
    var no_solicitud = document.getElementById("no_solicitud") ? document.getElementById("no_solicitud").value : 0;
    document.getElementById("lblNoSolicitud").innerHTML = no_solicitud;
    ObtenerEncabezadoEmpledo(numeroEmpleado);
    ObtenerDetalleSolicitud("contenedorLista", numeroEmpleado, no_solicitud, "diasSolicitados", "estatusSolicitud");
    EstatusSolicitud.MostrarOpcionesRol();
}

EstatusSolicitud.MostrarOpcionesRol= function(){
    $.post(urlBase_WS + "NVacaciones.aspx", "seccion=Comunes&op=ObtenerRolParaSolicitudVacaciones&num_solicitud=" + document.getElementById("no_solicitud").value).done(function (xmlDoc) {
        var rol = GetValor(xmlDoc, "rol");
        if (rol == "Jefe") {
            document.getElementById("Jefe").style.display = "block";
        } else if (rol == "Usuario"){
            document.getElementById("Usuario").style.display = "block";
        } else if (rol == "VoBoRH") {
            document.getElementById("VoBoRH").style.display = "block";
        }else{
            document.getElementById("ventana-solicitud").setAttribute("offset", "240");
            document.getElementById("ventana-solicitud").style.marginBottom="20px";
            window.onresize();
        }
    });
}

EstatusSolicitud.AutorizarJefe = function () {
    $.post(urlBase_WS + "NVacaciones.aspx", "seccion=Comunes&op=JefeAutorizaVacaciones&num_solicitud=" + document.getElementById("no_solicitud").value).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, 'notificacion-estatus', function () {
            var btn = document.getElementById("btnRegresar");
            if (btn && window.parent.DesplazarElemento) {
                window.parent.ListadoSolicitudes.ActualizarTablas();
                btn.onclick();
            } else {
                window.top.CambiarRutaFrame(window.location.href, "/Modulos/Vacaciones/VacacionesUI/VAC_ListadoSolicitudes.aspx")
            }
            try { window.top.ObtenerNotificacionesUsuario(); } catch (e) { }
        });
    });
}

EstatusSolicitud.VoBoRH = function () {
    $.post(urlBase_WS + "NVacaciones.aspx", "seccion=Comunes&op=VoBoRH&num_solicitud=" + document.getElementById("no_solicitud").value).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, 'notificacion-estatus', function(){
            var btn = document.getElementById("btnRegresar");
            if (btn && window.parent.DesplazarElemento){
                window.parent.ListadoSolicitudes.ActualizarTablas();
                btn.onclick();
            } else {
                window.top.CambiarRutaFrame(window.location.href, "/Modulos/Vacaciones/VacacionesUI/VAC_ListadoSolicitudes.aspx");
            }
            try { window.top.ObtenerNotificacionesUsuario(); } catch (e) { }
        });        
    });
}

EstatusSolicitud.Cancelar = function () {
    $.post(urlBase_WS + "NVacaciones.aspx", "seccion=Comunes&op=CancelarSolicitud&num_solicitud=" + document.getElementById("no_solicitud").value).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, 'notificacion-estatus', function () {
            var btn = document.getElementById("btnRegresar");
            if (btn && window.parent.DesplazarElemento) {
                window.parent.ListadoSolicitudes.ActualizarTablas();
                btn.onclick();
            } else {
                window.top.CambiarRutaFrame(window.location.href, "/Modulos/Vacaciones/VacacionesUI/VAC_ListadoSolicitudes.aspx")
            }
            try { window.top.ObtenerNotificacionesUsuario(); } catch (e) {}
        });
    });
}

EstatusSolicitud.CargarPostEscaneo = function () {
    var numSolicitud = document.getElementById("lblNoSolicitud").innerHTML;
    if (numSolicitud != null && numSolicitud.length > 0) {
        var formEscanear = document.getElementById("frmEscaneo");
        formEscanear.enctype = "multipart/form-data";
        formEscanear.method = "post";
        formEscanear.target = "consola";
        formEscanear.action = "../VacacionesNegocio/NVacaciones.aspx?op=CargarEscaneo&Seccion=ProcesoVacaciones&proceso=HandlerCargarPostEscaneo&num_solicitud=" + numSolicitud;
        formEscanear.submit();
    } else {
        mostrarNotificacion(null, 'notificacion-estatus', function () { }, estatus, mensaje);
    }
}

function HandlerCargarPostEscaneo(estatus, mensaje, link) {
    mostrarNotificacion(null, 'notificacion-estatus', function () { }, estatus, mensaje);
    if (estatus > 0) {
        var frmEscaneo = document.getElementById("frmEscaneo");
        frmEscaneo.style.display = "none";
        var linkEscaneo=  document.getElementById("linkEscaneo");
        linkEscaneo.setAttribute("href", link);
        linkEscaneo.parentNode.style.display = "block";
    }
}

/*******************************************************************************************************************************************************************

SolicitudesUsuario

*********************************************************************************************************************************************************************/
var SolicitudesUsuario= function(){}

SolicitudesUsuario.iniciar = function () {
    SolicitudesUsuario.num_empleado = document.getElementById("numeroEmpleado").value;
    ObtenerEncabezadoEmpledo(SolicitudesUsuario.num_empleado ? SolicitudesUsuario.num_empleado : 0);
    SolicitudesUsuario.cargarLista(1);
}

var ordenador3;
SolicitudesUsuario.cargarLista = function (pagina, criterio) {
    try{PonerEnEspera();}catch(e){}
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    var frmBusqueda = document.getElementById("frmCriteriosBusqueda");
    $.post(urlBase_WS + "NVacaciones.aspx", "seccion=Comunes&op=ObtenerListadoSolicitudes&pagina=" + pagina + "&longitudPagina=50&num_empleado=" + SolicitudesUsuario.num_empleado).done(function (xmlDoc) {
        try{QuitarEspera();}catch(e){}
        var items = xmlDoc.getElementsByTagName("Table");
        var lista = document.getElementById("contenedorSolicitudesUsuario");
        $(lista).html("");
        var totalregistros, itemLista;
        for (var i = 0; i < items.length; i++) {
            var num_empleado = GetValor(items[i], "num_empleado");
            var num_solicitud = GetValor(items[i], "num_solicitud");
            itemLista = document.createElement("tr");
            itemLista.className = "columnas columnas1";
            itemLista.num_empleado = num_empleado;
            itemLista.num_solicitud = num_solicitud;
            totalregistros = GetValor(items[i], "totalRegistros");
            itemLista.onclick = function (event){ VerDetalleSolicitud(event ||window.event,this.num_solicitud); };
            $(itemLista).html(                
                '<td>' + GetValor(items[i], "num_solicitud") + '</td>' +
                '<td>' + GetValor(items[i], "periodo") + '</td>' +
                '<td>' + GetValor(items[i], "fechaprog") + '</td>' +
                '<td>' + GetValor(items[i], "diasprog") + '</td>' +
                '<td>' + GetValor(items[i], "estatus") + '</td>'
            );
            lista.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, SolicitudesUsuario.cargarLista);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador3=$(tableCatalogo).tablesorter();
    });
}