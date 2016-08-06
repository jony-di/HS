function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    CargarCatalogoTurnos(1);
    CargarCatalogoDias();
}

function BuscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoTurno(1, criterio);
}

function CargarCatalogoDias() {
    $.post(urlBase_WS + "NControlAcceso.aspx", { op: "ObtenerDiasSemana", seccion: "Comunes" }).done(function (xmlDoc) {
        var contenedorDiasTurno = document.getElementById("diasTurno");
        $(contenedorDiasTurno).html("");
        var dbDias = xmlDoc.getElementsByTagName("Table");
        var tr_dia;
        for (var i = 0; i < dbDias.length; i++) {
            tr_dia = document.createElement("tr");
            tr_dia.cve_dia = GetValor(dbDias[i], "cve_diasemana");
            tr_dia.innerHTML = '<td><label class="tag-rubro">' + GetValor(dbDias[i], "descripcion") + '</label></td><td><input class="jor_h_ent"    onkeypress="return SoloFecha(event);"  value="" />-<input class="jor_h_sal"   onkeypress="return SoloFecha(event);"  value="" /></td> <td><input    onkeypress="return SoloFecha(event);"  class="com_h_ent" value="" />-<input    onkeypress="return SoloFecha(event);"  class="com_h_sal" value="" /></td>';
            contenedorDiasTurno.appendChild(tr_dia);
        }
    });
}

function MostrarNuevoTurno() {
    LimpiarCampos("frmNuevoTurno");
    var frmTurno = document.getElementById("frmNuevoTurno");
    frmTurno.esEditar = false;
    $.post(urlBase_WS + "NTurnos.aspx", { op: "ObtenerSiguienteClave",seccion:"Turnos" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_turno", "cve_turno");
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
function CargarCatalogoTurnos(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NTurnos.aspx", { op: "ObtenerCatalogo",seccion:"Turnos", pagina: pagina, longitudPagina: 50, criterio: (criterio ? criterio : "")}).done(function (xmlDoc) {
        QuitarEspera();
        var dbTurnos = xmlDoc.getElementsByTagName("Table");
        var listaTurno = document.getElementById("contenedorLista");
        $(listaTurno).html("");
        var totalregistros;
        for (var i = 0; i < dbTurnos.length; i++) {
            var CveTurno = GetValor(dbTurnos[i], "cve_turno");
            var Descripcion = GetValor(dbTurnos[i], "nombre");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(dbTurnos[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            itemLista.cve_turno = CveTurno;
            itemLista.onclick = function () {
                MostrarEditarTurno(this.cve_turno);
            }
            $(itemLista).html(
                 '<td>' + CveTurno + '</td>' +
                '<td>' + Descripcion + '</td>'
            );
            listaTurno.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, CargarCatalogoTurnos);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function GuardarTurno() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmTurno = document.getElementById("frmNuevoTurno");
        if (!frmTurno.esEditar) {
            GuardarEdicionTurno("Nuevo");
        } else {
            GuardarEdicionTurno("Editar");
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarTurno(cve) {
    LimpiarCampos("frmNuevoTurno");
    var frmTurno = document.getElementById("frmNuevoTurno");
    frmTurno.reset();
    frmTurno.esEditar = true;
    MostrarFormulario();
    CargarDatosTurno(cve);
}

function CargarDatosTurno(cve) {
    $.post(urlBase_WS + "NTurnos.aspx", { op: "ObtenerDetalleTurno", seccion: "Turnos", pagina: 1, longitudPagina: 50, criterio: "", cve_turno: cve }).done(function (xmlDoc) {
        var contenedorDiasTurno = document.getElementById("diasTurno");
        $(contenedorDiasTurno).html("");
        var dbTurno = xmlDoc.getElementsByTagName("Table");
        SetValor(dbTurno[0], "cve_turno", "cve_turno");
        SetValor(dbTurno[0], "sturno", "nombre");
        var tr_dia;
        for (var i = 0; i < dbTurno.length; i++) {
            tr_dia = document.createElement("tr");
            tr_dia.cve_dia = GetValor(dbTurno[i], "cve_diasemana");
            tr_dia.innerHTML = '<td><label class="tag-rubro">' + GetValor(dbTurno[i], "sdia") + '</label></td><td><input class="jor_h_ent"   onkeypress="return SoloFecha(event);" value="' + GetValor(dbTurno[i], "horaentrada") + '" />-<input class="jor_h_sal"    onkeypress="return SoloFecha(event);" value="' + GetValor(dbTurno[i], "horasalida") + '" /></td> <td><input  class="com_h_ent"    onkeypress="return SoloFecha(event);"  value="' + GetValor(dbTurno[i], "horasalcomi") + '" />-<input   onkeypress="return SoloFecha(event);"  class="com_h_sal" value="' + GetValor(dbTurno[i], "horaregcomi") + '" /></td>';
            contenedorDiasTurno.appendChild(tr_dia);
        }
    });
}

function GuardarEdicionTurno(op){
    var frmNuevoTurno = document.getElementById("frmNuevoTurno");
    var parametros = $(frmNuevoTurno).serialize();
    var inputsHoras = $("#diasTurno input");    
    var cve_dia, jor_h_ent = [], jor_h_sal = [], com_h_ent = [], com_h_sal=[];
    for (var i = 0; i < inputsHoras.length; i++) {
        cve_dia = inputsHoras[i].parentNode.parentNode.cve_dia;
        if (inputsHoras[i].className == "jor_h_ent") {
            jor_h_ent.push(cve_dia + "|" + inputsHoras[i].value);
        } else if (inputsHoras[i].className == "jor_h_sal") {
            jor_h_sal.push(cve_dia + "|" + inputsHoras[i].value);
        } else if (inputsHoras[i].className == "com_h_ent") {
            com_h_ent.push(cve_dia + "|" + inputsHoras[i].value);
        } else if (inputsHoras[i].className == "com_h_sal") {
            com_h_sal.push(cve_dia + "|" + inputsHoras[i].value);
        }
    }
    var parametros = { op: op, seccion: "Turnos", cve_turno: document.getElementById("cve_turno").value, nombre: document.getElementById("nombre").value, s_jor_horaentrada: jor_h_ent.join(","), s_jor_horasalida: jor_h_sal.join(","), s_com_horaentrada: com_h_ent.join(","), s_com_horasalida: com_h_sal.join(",") };
    $.post(urlBase_WS + "NTurnos.aspx", parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            CargarCatalogoTurnos();
        });
    });
}

function DesactivarTurno(cve_departamento) {
    $.post(urlBase_WS + "NTurno.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoTurno();
    })
}

