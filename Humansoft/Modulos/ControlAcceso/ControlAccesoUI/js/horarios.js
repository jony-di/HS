function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    $("#fechaInicio").datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true
    });
    CargarCatalogoHorarios(1);
    LlenarCatalogoTiposRotacion("cve_rotacion");
    LlenarCatalogoFrecuenciaRotacion("cve_frecuenciarota");
    LlenarCatalogoTurnos("turnos");
}

function BuscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    CargarCatalogoHorarios(1, criterio);
}


function MostrarNuevoHorario() {
    LimpiarCampos("frmNuevoHorario");
    var frmHorario = document.getElementById("frmNuevoHorario");
    frmHorario.reset();
    frmHorario.esEditar = false;
    $.post(urlBase_WS + "NHorarios.aspx", { op: "ObtenerSiguienteClave",seccion:"Horarios" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_horario", "cve_horario");
    });
    MostrarFormulario();
}

function LimpiarCampos(idContenedor) {
    var campos=document.getElementById(idContenedor).getElementsByTagName("input");
    for (var i = 0; i < campos.length; i++) {
        campos[i].value = "";
    }
}

var ordenador;
function CargarCatalogoHorarios(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NHorarios.aspx", { op: "ObtenerCatalogo",seccion:"Horarios", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "")}).done(function (xmlDoc) {
        QuitarEspera();
        var dbHorarios = xmlDoc.getElementsByTagName("Table");
        var listaHorario = document.getElementById("contenedorLista");
        $(listaHorario).html("");
        var totalregistros;
        for (var i = 0; i < dbHorarios.length; i++) {
            var CveHorario = GetValor(dbHorarios[i], "cve_horario");
            var Descripcion = GetValor(dbHorarios[i], "nombre");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(dbHorarios[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            itemLista.cve_Horario = CveHorario;
            itemLista.onclick = function () {
                MostrarEditarHorario(this.cve_Horario);
            }
            $(itemLista).html(
                 '<td>' + CveHorario + '</td>' +
                '<td>' + Descripcion + '</td>'
            );
            listaHorario.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoHorarios);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarHorario() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmHorario = document.getElementById("frmNuevoHorario");
        if (!frmHorario.esEditar) {
            GuardarEdicionHorario("Nuevo");
        } else {
            GuardarEdicionHorario("Editar");
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarHorario(cve) {
    LimpiarCampos("frmNuevoHorario");
    var frmHorario = document.getElementById("frmNuevoHorario");
    frmHorario.reset();
    frmHorario.esEditar = true;
    MostrarFormulario();
    CargarDatosHorario(cve);
}

function CargarDatosHorario(cve) {
    $.post(urlBase_WS + "NHorarios.aspx", { op: "ObtenerDetalleHorario", seccion: "Horarios", pagina: 1, longitudPagina: 50, criterio: "", cve_horario: cve }).done(function (xmlDoc) {
        var dbHorario = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbHorario, "cve_horario", "cve_horario");
        SetValor(dbHorario, "nombre", "nombre");
        var cve_tipoRotacion = SetValor(dbHorario, "cve_rotacion", "cve_rotacion");
        SetValor(dbHorario, "fechainicio", "fechaInicio");
        SetValor(dbHorario, "toleranciaEntrada", "toleranciaEntrada");
        SetValor(dbHorario, "toleranciaComida", "toleranciaComida");
        SetValor(dbHorario, "cve_frecuenciarota", "cve_frecuenciarota");

        var cve_turnos = GetValor(dbHorario, "cve_turno").split(",");
        var turnos = document.getElementById("turnos").getElementsByTagName("input");
        if (cve_tipoRotacion == "1") {
            CambiarTipoInputs(turnos, "radio", "tmp");
        } else {
            CambiarTipoInputs(turnos, "checkbox","");
        }
        var arrTurnos = [];
        for (var i = 0; i < cve_turnos.length; i++) {
            for (var k = 0; k < turnos.length; k++) {
                if ($.trim(cve_turnos[i]) == $.trim(turnos[k].getAttribute("cve"))){
                    turnos[k].checked = true;
                }
            }
        }
    });
}

function CambiarTipoInputsLocal(selectTiposRotacion) {
    var turnos = document.getElementById("turnos").getElementsByTagName("input");
    if ($.trim(selectTiposRotacion.options[selectTiposRotacion.selectedIndex].value) == '1') {
        CambiarTipoInputs(turnos, 'radio', 'tmp');
    }else{
        CambiarTipoInputs(turnos, 'checkbox', '');
    }
}

function CambiarTipoInputs(inputs, tipo, name) {
    for (var k = 0; k < inputs.length; k++) {
        inputs[k].setAttribute("type", tipo);
        if (name) {
            inputs[k].setAttribute("name", name);
        }
    }
}

function GuardarEdicionHorario(op){
    var frmNuevoHorario = document.getElementById("frmNuevoHorario");
    var turnos = document.getElementById("turnos").getElementsByTagName("input");
    var arrTurnos = [];
    for (var k = 0; k < turnos.length; k++) {
        if (turnos[k].checked) {
            arrTurnos.push(turnos[k].getAttribute("cve"));
        }
    }
    document.getElementById("cve_turno").value = arrTurnos.join(",");
    var parametros = $(frmNuevoHorario).serialize();
    $.post(urlBase_WS + "NHorarios.aspx", "op=" + op + "&seccion=Horarios&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            CargarCatalogoHorarios();
        });
    });
}

function DesactivarHorario(cve_departamento) {
    $.post(urlBase_WS + "NHorario.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoHorario();
    })
}

