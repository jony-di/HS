/******
    Empleados.js
**********/
var PROCESO;
function Empleados() { }

Empleados.iniciar = function (_proceso) {
    PROCESO = _proceso;
    var calendario = document.getElementById("fechaingreso");
    $(calendario).datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: "-40:+0"
    });
    var fechanac = document.getElementById("fechanaci");
    $(fechanac).datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: "-70:-1"
    });
    var fechacontrato = document.getElementById("diascontrato");
    $(fechacontrato).datepicker({ 
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        yearRange: "-0:+20",
    changeYear: true });
    try {
        //Iniciar Buscador
        AgregarCriterioEmpleado('NoEmpleado', 'id_empleado', 'criteriosPosiciones');
        AgregarCriterioEmpleado('NombreCompleto', 'nombrecompleto', 'criteriosPosiciones'); 
        AgregarCriterioEmpleado('Posición', 'num_posicion', 'criteriosPosiciones');
        var tipoLista = document.getElementById("contenedorLista").getAttribute("tipo");
        if (tipoLista == "seleccionar") {
            $("#criteriosPosiciones input[name=num_posicion]")[0].value = "0";
        }
        cargarCatalogoEmpleado(1);
    } catch (e) { alert(e.message);}
}

Empleados.iniciarAdmin= function(){
    try {
        //Iniciar Buscador
        AgregarCriterioEmpleadoAdmin('NoEmpleado', 'id_empleado', 'criteriosPosiciones');
        AgregarCriterioEmpleadoAdmin('NombreCompleto', 'nombrecompleto', 'criteriosPosiciones');
        AgregarCriterioEmpleadoAdmin('Posición', 'num_posicion', 'criteriosPosiciones');
        cargarCatalogoEmpleadoAdmin(1);
    } catch (e) { }
}

function SeleccionarEmpleado(_idEmpleado, _num_posicion,objeto) {
    var idEmpleado;
    if (!_idEmpleado) {
        idEmpleado = document.getElementById("empleado").getAttribute("value");
    } else {
        idEmpleado = _idEmpleado;
    }
    document.body.setAttribute("idEmpleado", idEmpleado);
    var nombreEmpleado = objeto.getAttribute("nombre");
    eval("window.parent." + PROCESO + "(idEmpleado,_num_posicion, nombreEmpleado);");
}


function GuardarEmpleado() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frm = document.getElementById("frmNuevoEmpleado");
        frm.enctype = "multipart/form-data";
        frm.method = "post";
        frm.target = "consola";
        if (!frm.esEditar) {
            frm.action = urlBase_WS + "NEmpleados.aspx?op=Nuevo";
        } else {
            frm.action = urlBase_WS + "NEmpleados.aspx?op=Editar";
        }
        frm.submit();
    } else {
        MostrarCatalogo();
    }
}

function HandlerGuardarEmpleado(estatus, mensaje) {
    mostrarNotificacion(null, 'notificacion', function () {
        if (parseInt(estatus) > 0) {
            cargarCatalogoEmpleado();
            CancelarEmpleado();
        }
    }, estatus, mensaje);
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoEmpleado(1, criterio);
}

function MostrarNuevoEmpleado() {
    var frmEmpleado = document.getElementById("frmNuevoEmpleado");
    document.getElementById("wrapFormulario").style.display = "block";
    frmEmpleado.style.display = "block";
    frmEmpleado.reset();
    frmEmpleado.esEditar = false;
    $.post(urlBase_WS + "NEmpleados.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        document.getElementById("empleado").setAttribute("value", SetValor(xmlDoc, "clave", "empleado"));
        var selectEstatusEmpleado = document.getElementById("estatust");
        LlenarCatalogoEstatusEmpleado(selectEstatusEmpleado, function () {
            var selectEstadoCivil = document.getElementById("estadocivil");
             LlenarCatalogoEstadoCivil(selectEstadoCivil, function () {
                 var selectBanco = document.getElementById("banco");
                 LlenarCatalogoBanco(selectBanco, function () {
                      var selectPaisN = document.getElementById("pais");
                      LlenarCatalogoPaises(selectPaisN, function () {
                          var selectPaisT = document.getElementById("paist");
                          LlenarCatalogoPaises(selectPaisT, function () {
                              var selectGrado = document.getElementById("grado");
                              LlenarCatalogoGrado(selectGrado, function () {
                                  var selectTipoEmpleado = document.getElementById("tipoempl");
                                  LlenarCatalogoTipoEmpleado(selectTipoEmpleado, function () {
                                      var selectSexo = document.getElementById("sexo");
                                      LlenarCatalogoSexo(selectSexo, function () {
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
           });
        //document.getElementById("empleado").focus();
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = true;
    MostrarFormulario("frmNuevoEmpleado");
  });
}

var ordenador;
function cargarCatalogoEmpleado(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    var frmbusqueda = document.getElementById("criteriosPosiciones");
    var parametros = $(frmbusqueda).serialize();
    $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", "op=ObtenerEmpleados&" + parametros).done(function (xmlDoc) {
        QuitarEspera();
        var empleados = xmlDoc.getElementsByTagName("Table");
        var listaEmpleado = document.getElementById("contenedorLista");
        var tipoLista = listaEmpleado.getAttribute("tipo");
        $(listaEmpleado).html("");
        var totalregistros;
        for (var i = 0; i < empleados.length; i++) {
            var cveEmpleado = GetValor(empleados[i], "id_empleado");
            var nombrecompleto = GetValor(empleados[i], "nombrecom");
            var num_posicion = GetValor(empleados[i], "num_posicion");
            var estatus = GetValor(empleados[i], "activo", "bool", "Activo:Baja");
            var itemLista = document.createElement("tr");
            itemLista.cveEmpleado = cveEmpleado;            
            if (tipoLista == "editar") {
                itemLista.onclick = function () { MostrarEditarEmpleado(this.cveEmpleado); }
            } else {
                itemLista.onclick = function () {SeleccionarEmpleado("'" + cveEmpleado + "'", num_posicion, this); }
            }
            totalregistros = GetValor(empleados[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            if (tipoLista == "editar") {
                $(itemLista).html(
                    '<td>' + cveEmpleado + '</td>' +
                    '<td>' + nombrecompleto + '</td>' +
                    '<td>' + estatus + '</td>'
                );
            } else {
                $(itemLista).html(
                    '<td>' + cveEmpleado + '</td>' +
                    '<td>' + nombrecompleto + '</td>' +
                    '<td>' + estatus + '</label> </td>'
                );   
            }
            listaEmpleado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoEmpleado, paginador);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function MostrarSolicitudVacaciones() {
    var listaEmpleado = document.getElementById("contenedorLista");
    if (listaEmpleado.activo) {
        MostrarSigFrame('/Modulos/Vacaciones/VacacionesUI/VAC_Vacaciones.aspx?callbacksalir=SalirSolicitud&offset=0&mov=1&esSeleccion=1&num_empleado=' + listaEmpleado.activo.cveEmpleado, -900, 'pantallaAuxiliar', 'wrapFormulario');
    } else {
        alert("Debe seleccionar un empleado.");
    }
    ToggleMenu('opcionesEmpleado');
}

function MostrarSolicitudesVacaciones() {
    var listaEmpleado = document.getElementById("contenedorLista");
    if (listaEmpleado.activo) {
        MostrarSigFrame('/Modulos/Vacaciones/VacacionesUI/VAC_SolicitudesUsuario.aspx?num_empleado=' + listaEmpleado.activo.cveEmpleado, -900, 'pantallaAuxiliar', 'wrapFormulario');
    } else {
        alert("Debe seleccionar un empleado.");
    }
    ToggleMenu('opcionesEmpleado');
}

function MostrarSolicitudIncidencia() {
    var listaEmpleado = document.getElementById("contenedorLista");
    if (listaEmpleado.activo) {
        MostrarSigFrame('/Modulos/ControlAcceso/ControlAccesoUI/CTR_IncidenciaSolicitar.aspx?callbacksalir=SalirSolicitud&offset=0&mov=1&esSeleccion=1&num_empleado=' + listaEmpleado.activo.cveEmpleado, -900, 'pantallaAuxiliar', 'wrapFormulario');
    } else {
        alert("Debe seleccionar un empleado.");
    }
    ToggleMenu('opcionesEmpleado');
}

function MostrarSolicitudesIncidencias() {
    var listaEmpleado = document.getElementById("contenedorLista"); 
    if (listaEmpleado.activo) {
        MostrarSigFrame('/Modulos/ControlAcceso/ControlAccesoUI/CTR_IncidenciasHistorial.aspx?num_empleado=' + listaEmpleado.activo.cveEmpleado, -900, 'pantallaAuxiliar', 'wrapFormulario');
    } else {
        alert("Debe seleccionar un empleado.");
    }
    ToggleMenu('opcionesEmpleado');
}

cargarCatalogoEmpleadoAdmin = function (pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    var frmbusqueda = document.getElementById("criteriosPosiciones");
    var parametros = $(frmbusqueda).serialize();
    $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", "op=ObtenerEmpleados&Seccion=Visibilidad&" + parametros).done(function (xmlDoc) {
        QuitarEspera();
        var empleados = xmlDoc.getElementsByTagName("Table");
        var listaEmpleado = document.getElementById("contenedorLista");
        $(listaEmpleado).html("");
        var totalregistros;
        for (var i = 0; i < empleados.length; i++) {
            itemLista = document.createElement("tr");

            itemLista.cveEmpleado = GetValor(empleados[i], "id_empleado");
            itemLista.nombrecompleto = GetValor(empleados[i], "nombrecom");
            itemLista.num_posicion = GetValor(empleados[i], "num_plantilla");
            itemLista.estatus = GetValor(empleados[i], "activo", "bool", "Activo:Baja");

            totalregistros = GetValor(empleados[i], "totalRegistros");
            itemLista.className = "columnas columnas1";

            itemLista.onclick = function () {
                var listaEmpleado = this.parentNode;
                if (listaEmpleado.activo) {
                    listaEmpleado.activo.className = "columnas columnas1";
                    listaEmpleado.activo = this;
                    this.className = "row-activo";
                } else {
                    listaEmpleado.activo = this;
                    listaEmpleado.activo.className = "row-activo";
                }
            }
            $(itemLista).html(
                '<td style="text-align:center;">' + itemLista.cveEmpleado + '</td>' +
                '<td>' + itemLista.nombrecompleto + '</td>' +
                '<td style="text-align:center;">' + itemLista.estatus + '</td>'
            );
            listaEmpleado.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoEmpleadoAdmin, paginador);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function MostrarEditarEmpleado(id_empleado) {
    var frmEmpleado = document.getElementById("frmNuevoEmpleado");
    document.getElementById("wrapFormulario").style.display = "block";
    frmEmpleado.reset();
    frmEmpleado.esEditar = true;
    MostrarFormulario("frmNuevoEmpleado");
        var selectEstatusEmpleado = document.getElementById("estatust");
        LlenarCatalogoEstatusEmpleado(selectEstatusEmpleado, function () {
            var selectEstadoCivil = document.getElementById("estadocivil");
            LlenarCatalogoEstadoCivil(selectEstadoCivil, function () {
                var selectBanco = document.getElementById("banco");
                LlenarCatalogoBanco(selectBanco, function () {
                    var selectPaisN = document.getElementById("pais");
                    LlenarCatalogoPaises(selectPaisN, function () {
                        var selectPaisT = document.getElementById("paist");
                        LlenarCatalogoPaises(selectPaisT, function () {
                            var selectGrado = document.getElementById("grado");
                            LlenarCatalogoGrado(selectGrado, function () {
                                var selectTipoEmpleado = document.getElementById("tipoempl");
                                LlenarCatalogoTipoEmpleado(selectTipoEmpleado, function () {
                                    var selectSexo = document.getElementById("sexo");
                                    LlenarCatalogoSexo(selectSexo, function () {
                                        CargarDatosEmpleado(id_empleado);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        var selectestatus = document.getElementById("estatus");
        selectestatus.disabled = false;
}

function CargarDatosEmpleado(id_empleado) {
    $.post(urlBase_WS + "NEmpleados.aspx", { op: "obtenerCatalogoEmpleado", pagina: 1, longitudPagina: 5, criterio: "",
        id_empleado: id_empleado
    }).done(function (xmlDoc) {
        var empleados = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(empleados, "id_empleado", "empleado");
        document.getElementById("fotoImg").src = "/Expedientes/Empleados/" + GetValor(empleados, "nombreFoto")+"?rand=" + Math.random();
        SetValor(empleados, "nombrecom", "nombrecom");
        SetValor(empleados, "nombre", "nombre");
        SetValor(empleados, "apellidop", "apellidop");
        SetValor(empleados, "apellidom", "apellidom");
        SetValor(empleados, "sueldo", "sueldo");
        SetValor(empleados, "fechaing", "fechaingreso");
        SetValor(empleados, "cve_sexo", "sexo");
        SetValor(empleados, "cve_estatus", "estatust");
        SetValor(empleados, "cve_estadocivil", "estadocivil");
        SetValor(empleados, "cve_banco", "banco");
        SetValor(empleados, "numerocuenta", "numerocuenta");
        SetValor(empleados, "Venci_contrato", "diascontrato");
        SetValor(empleados, "email", "email");
        SetValor(empleados, "estudios", "estudios");
        SetValor(empleados, "escuela", "escuela");
        SetValor(empleados, "imss", "imss");
        SetValor(empleados, "curp", "curp");
        SetValor(empleados, "rfc", "rfc");
        SetValor(empleados, "fechanac", "fechanaci");
        SetValor(empleados, "cve_paisnaci", "pais");
        SetValor(empleados, "lugarnacimiento", "lugar");
        SetValor(empleados, "nacionalidad", "nacionalidad");
        SetValor(empleados, "cve_paistrabaja", "paist");
        SetValor(empleados, "cve_grado", "grado");
        SetValor(empleados, "cve_tipoemp", "tipoempl");
        SetValor(empleados, "num_posicion", "numerop");
        SetValor(empleados, "activo", "estatus", "bool");
        try{document.getElementById("linkDirecciones").setAttribute("id_empleado", GetValor(empleados, "id_empleado"));} catch (e) { }        
        try {document.getElementById("linkDirecciones").setAttribute("nombre", GetValor(empleados, "nombrecom")); } catch (e) { }
        try {document.getElementById("linkTelefonos").setAttribute("id_empleado", GetValor(empleados, "id_empleado"));} catch (e) { }        
        try {document.getElementById("linkTelefonos").setAttribute("nombre", GetValor(empleados, "nombrecom")); } catch (e) { }
    });
}

function GuardarEdicioNEmpleados() {
    var frmNuevoEmpleado= document.getElementById("frmNuevoEmpleado");
    var parametros = $(frmNuevoEmpleado).serialize();
    $.post(urlBase_WS + "NEmpleados.aspx", "op=EditarEmpleado&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus == 1) {
            notificacion.className = "alert-box success mostrar";
            cargarCatalogoEmpleado();
            document.getElementById("frmNuevoEmpleado").reset();
            MostrarCatalogo();
        }
        else if (estatus < 0) {
            var notificacion = document.getElementById("notificacion");
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function DesactivarEmpleado(id_empleado) {
    $.post(urlBase_WS + "NEmpleados.aspx", { op: "CambiarEstatusActivo", id_empleado: id_empleado, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoEmpleado();
    });
}

function CancelarEmpleado(){
    MostrarCatalogo();
 }

 function LlenarNombreCompleto(objeto) {
     var nombrecompleto = document.getElementById("nombrecom");
     var nombre = document.getElementById("nombre").value;
     var apellidop = document.getElementById("apellidop").value;
     var apellidom = document.getElementById("apellidom").value;
     nombrecompleto.value = nombre + ' ' + apellidop + ' ' + apellidom;
 }