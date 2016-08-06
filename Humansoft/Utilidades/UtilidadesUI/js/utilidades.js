//UTILIDADES JS

//Calendario y observaciones

var PROCESO;

function CalendarioObservaciones() { }

CalendarioObservaciones.iniciar = function (_proceso) {
    PROCESO = _proceso;
    $("#calendario").datepicker({
        dateFormat:"dd/mm/yy",
        onSelect: function (fecha) {
            document.getElementById("fechaSeleccionada").innerHTML = fecha;
        }
    });
}

CalendarioObservaciones.ContinuarProceso = function(){
    var fecha = document.getElementById("fechaSeleccionada").innerHTML;
    var observaciones = document.getElementById("observaciones").value;
    eval("window.parent." + PROCESO + "(fecha,observaciones);");
}

/*************************************************************/