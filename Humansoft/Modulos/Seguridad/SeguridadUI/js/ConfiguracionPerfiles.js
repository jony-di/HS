

//    TablaCatalogo.iniciarTablaCatalogo(
//        "catalogoperfiles"
//        , urlBase_WS + "NPerfiles.aspx"
//        , { op: "obtenerCatalogoPerfiles", pagina: 1, longitudPagina: 12, criterio: "", cve_perfil: 0 }
//        , [{ etiqueta: "Clave", parametro: "cve_perfil", ancho: "20%" }, { etiqueta: "Nombre", parametro: "nombre", ancho: "80%"}]
//        , "cve_perfil"
//        , function(){
//            verConfiguracionPerfil(this.cve_perfil);
//        }
//    );


function busquedaPerfiles(objeto) {
    TablaCatalogo.cambiarPagina("catalogoperfiles", objeto.value.toString());
}

function verConfiguracionPerfil(cve_perfil) {
    $.post(urlBase_WS + "NPerfiles.aspx", { op: "obtenerCatalogoPerfiles", pagina: 1, longitudPagina: 5, criterio: "",
        cve_perfil: cve_perfil
    }).done(function (xmlDoc) {
        var perfiles = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(perfiles, "cve_perfil", "cp_clave");
        SetValor(perfiles, "nombre", "cp_nombre");
        SetValor(perfiles, "puedevertodo", "cp_puedevertodo", "bool", "Si:No");
        SetValor(perfiles, "activo", "cp_activo", "bool", "Activo:Inactivo");

        ObtenerMenusPerfil("arbolMenus", cve_perfil, true);

        MostrarModulosRolePerfil(cve_perfil);
        MostrarEmpresasPerfil(cve_perfil);
    });
}

function asignarFuncionGuardar(operacion) {
    var btnGuardarConfiguracion = document.getElementById("btnGuardarconfiguracion");
    switch (operacion) {
        case "MenusPerfil": { btnGuardarConfiguracion.title = "Op: Guardar Menus de Perfil"; btnGuardarConfiguracion.onclick = GuardarMenusPerfil; } break;
        case "ModulosRoles": { btnGuardarConfiguracion.title = "Op: Guardar Modulos de Roles"; btnGuardarConfiguracion.onclick = GuardarModulosRoles; } break;
    }
}

function GuardarMenusPerfil() {
    var nombrePerfil = document.getElementById("cp_nombre").innerHTML;
    if (nombrePerfil && confirm("¿Esta seguro que desea guardar la asignación de menus al perfil : " + nombrePerfil + "?")) {
        var arbol = document.getElementById("arbolMenus");
        var cve_perfil = $.trim(document.getElementById("cp_clave").innerHTML);
        var listaCves_Menus = "", aux = "";
        var checksOpcion = arbol.getElementsByTagName("Input");
        for (var i = 0; i < checksOpcion.length; i++) {
            if (checksOpcion[i].type.toString().toLowerCase() == "checkbox" && checksOpcion[i].checked) {
                listaCves_Menus = listaCves_Menus + aux + checksOpcion[i].value;
                aux = ",";
            }
        }
        $.post(urlBase_WS + "NConfiguracionPerfiles.aspx", { op: "GuardarMenusPerfil", cve_perfil: cve_perfil, menusperfil: listaCves_Menus }).done(function (xmlDoc) {
            var operacion = xmlDoc.getElementsByTagName("Table")[0];
            mostrarNotificacion(xmlDoc, "notificacion-conf", function () {

            });
        });
    } else {
        alert("Debe seleccionar un perfil.");
    }
}

function GuardarModulosRoles() {
    var nombrePerfil = document.getElementById("cp_nombre").innerHTML;
    if (nombrePerfil && confirm("¿Esta seguro que desea guardar la asignación de modulos y rol al perfil : " + nombrePerfil + "?")) {
        var items = document.getElementById("listaModulos");
        var cve_perfil = $.trim(document.getElementById("cp_clave").innerHTML);
        var listaCves = "", aux = "";
        var checksOpcion = items.getElementsByTagName("input");
        for (var i = 0; i < checksOpcion.length; i++) {
            if (checksOpcion[i].type.toString().toLowerCase() == "checkbox" && checksOpcion[i].checked) {
                listaCves = listaCves + aux + checksOpcion[i].value + ":" + checksOpcion[i].cve_role;
                aux = ",";
            }
        }
        $.post(urlBase_WS + "NConfiguracionPerfiles.aspx", { op: "GuardarPerfilModulosRole", cve_perfil: cve_perfil, modulosperfilRole: listaCves }).done(function (xmlDoc) {
            var operacion = xmlDoc.getElementsByTagName("Table")[0];
            mostrarNotificacion(xmlDoc, "notificacion-conf", function () {

            });
        });
    } else {
        alert("Debe seleccionar un perfil.");
    }
}

function GuardarDepartamentosEmpresaPerfil() {
    cambiosEnListaDepartamentos = false;
    var nombrePerfil = document.getElementById("cp_nombre").innerHTML;
    if (nombrePerfil && confirm("¿Esta seguro que desea guardar la asignación de Departamentos al perfil : " + nombrePerfil + "?")) {
        var cve_empresa = document.getElementById("listaEmpresas").cve_empresa;
        var items = document.getElementById("listaDepartamentos");
        var cve_perfil = $.trim(document.getElementById("cp_clave").innerHTML);
        var listaCves = "", aux = "";
        var checksOpcion = items.getElementsByTagName("input");
        for (var i = 0; i < checksOpcion.length; i++) {
            if (checksOpcion[i].type.toString().toLowerCase() == "checkbox" && checksOpcion[i].checked) {
                listaCves = listaCves + aux + checksOpcion[i].value;
                aux = ",";
            }
        }
        $.post(urlBase_WS + "NConfiguracionPerfiles.aspx", { op: "GuardarPerfilEmpresasDepartamentos", cve_perfil: cve_perfil, cve_empresa: cve_empresa, departamentosperfil: listaCves }).done(function (xmlDoc) {
            var operacion = xmlDoc.getElementsByTagName("Table")[0];
            mostrarNotificacion(xmlDoc, "notificacion-conf", function () {

            });
        });
    } else {
        alert("Debe seleccionar un perfil.");
    }
}

function MostrarModulosRolePerfil(cve_perfil) {
    IntercambioVisual("listaModulos", "contenedorlistaRoles");
    var listaModulos = document.getElementById("listaModulos");
    $.post(urlBase_WS + "NConfiguracionPerfiles.aspx", { op: "ObtenerPerfilModulosRole", cve_perfil: cve_perfil }).done(function (xmlDoc) {
        $(listaModulos).html("");
        var items = xmlDoc.getElementsByTagName("Table");
        var item, cve_role;
        for (var i = 0; i < items.length; i++) {
            item = document.createElement("li");
            var checkOpcion = document.createElement("input");
            checkOpcion.setAttribute("type", "checkbox");
            checkOpcion.setAttribute("value", GetValor(items[i], "cve_modulo"));
            checkOpcion.nombreModulo = GetValor(items[i], "nombreModulo");
            cve_role = GetValor(items[i], "cve_role");
            var span = document.createElement("span");
            span.nombreModulo = GetValor(items[i], "nombreModulo");
            if ($.trim(cve_role).length > 0) {
                checkOpcion.cve_role = GetValor(items[i], "cve_role");
                checkOpcion.nombreRole = GetValor(items[i], "nombrerole"); ;
                span.innerHTML = span.nombreModulo + " <b>Role:</b><i>" + checkOpcion.nombreRole + "</i>";
                checkOpcion.checked = true;
            } else {
                span.innerHTML = span.nombreModulo;

            }
            checkOpcion.selSpan = span;
            checkOpcion.onclick = function () {
                MostrarRoles(this);
            }
            item.appendChild(checkOpcion);
            item.appendChild(span);
            listaModulos.appendChild(item);
        }
    });
}

function MostrarRoles(opcionModulo) {
    if (opcionModulo.checked) {
        opcionModulo.checked = false;
        IntercambioVisual("contenedorlistaRoles", "contenedorListaModulos");
        var listaRoles = document.getElementById("listaRoles");
        listaRoles.opcionModulo = opcionModulo;
        var criterio;
        $.post(urlBase_WS + "NRoles.aspx", { op: "obtenerCatalogo", seccion: "Roles", pagina: 1, longitudPagina: 1000, criterio: (criterio ? criterio : ""), cve_role: 0, cve_modulo: opcionModulo.getAttribute("value") }).done(function (xmlDoc) {
            $(listaRoles).html("");
            var items = xmlDoc.getElementsByTagName("Table");
            var item; var opcion; var nombreRole, spanNombreRole;
            if (items.length == 0) {
                $(listaRoles).html("No hay roles para el módulo: " + opcionModulo.nombreModulo);
            } else {
                for (var i = 0; i < items.length; i++) {
                    item = document.createElement("li");
                    opcion = document.createElement("input");
                    opcion.setAttribute("type", "radio");
                    opcion.cve_role = GetValor(items[i], "cve_role");
                    opcion.nombreRole = GetValor(items[i], "nombrerole");
                    spanNombreRole = document.createElement("span");
                    spanNombreRole.innerHTML = opcion.nombreRole;
                    opcion.onclick = function () {
                        MarcarModulo(this);
                    }
                    item.appendChild(opcion);
                    item.appendChild(spanNombreRole);
                    listaRoles.appendChild(item);
                }
            }
        });
    } else {
        opcionModulo.selSpan.innerHTML = opcionModulo.nombreModulo;
        opcionModulo.cve_role= undefined;
    }
}

function MarcarModulo(opcionRole) {
    if (opcionRole.checked) {
        IntercambioVisual("contenedorListaModulos", "contenedorlistaRoles");
        var listaRoles = document.getElementById("listaRoles");
        listaRoles.opcionModulo.cve_role = opcionRole.cve_role;
        listaRoles.opcionModulo.selSpan.innerHTML = listaRoles.opcionModulo.nombreModulo + " <b>Role:</b><i>" + opcionRole.nombreRole + "</i>";
        listaRoles.opcionModulo.checked = true;
    } else { 
        
    }
}

function MostrarEmpresasPerfil(cvePerfil) {
    var lista = document.getElementById("listaEmpresas");
    var listaDepartamentos = document.getElementById("listaDepartamentos");
    document.getElementById("nombreEmpresaSel").innerHTML = "Guardar Departamentos";
    var cve_perfil; var opcion; var etiqueta, boton;
    $.post(urlBase_WS + "NConfiguracionPerfiles.aspx", { op: "ObtenerPerfilesEmpresas", cve_perfil: cvePerfil }).done(function (xmlDoc) {
        $(listaDepartamentos).html("");
        $(lista).html("");
        var items = xmlDoc.getElementsByTagName("Table");
        var item;
        if (items.length == 0) {
            $(lista).html("No hay empresas en el catálogo.");
        } else {
            for (var i = 0; i < items.length; i++) {
                item = document.createElement("li");
                opcion = document.createElement("input");
                opcion.style.display = "none";
                opcion.setAttribute("type", "checkbox");
                opcion.setAttribute("value", GetValor(items[i], "cve_empresa"));
                cve_perfil = GetValor(items[i], "cve_perfil").toString();
                opcion.checked = ($.trim(cve_perfil).length > 0);
                etiqueta = document.createElement("span");
                etiqueta.innerHTML = GetValor(items[i], "empresa");
                boton = document.createElement("button");
                item.setAttribute("cve_empresa", opcion.value);
                item.nombreEmpresa = etiqueta.innerHTML;
                item.onclick = function () {
                    MostrarDepartamentosPerfil(cvePerfil, this.getAttribute("cve_empresa"), this.nombreEmpresa);
                }
                item.appendChild(opcion);
                item.appendChild(etiqueta);
                item.appendChild(boton);
                lista.appendChild(item);
            }
        }
    });

}

var cambiosEnListaDepartamentos = false;
function MostrarDepartamentosPerfil(cvePerfil, cveEmpresa, nombreEmpresa) {
    if (cambiosEnListaDepartamentos && confirm("¿Desea guardar cambios antes de cambiar de empresa? ")) {
        cambiosEnListaDepartamentos = false;
        GuardarDepartamentosEmpresaPerfil();
    } else {
        cambiosEnListaDepartamentos = false;
        document.getElementById("listaEmpresas").cve_empresa = cveEmpresa;
        document.getElementById("nombreEmpresaSel").innerHTML = "Guardar para: <i>" + nombreEmpresa + "</i>";
        var lista = document.getElementById("listaDepartamentos");
        $(lista).html("");
        var cve_perfil; var opcion; var etiqueta, boton;
        $.post(urlBase_WS + "NConfiguracionPerfiles.aspx", { op: "ObtenerPerfilesEmpresasDepartamentos", cve_perfil: cvePerfil, cve_empresa: cveEmpresa }).done(function (xmlDoc) {
            $(lista).html("");           
            var items = xmlDoc.getElementsByTagName("Table");
            var item;
            if (items.length == 0) {
                $(lista).html("La empresa " + nombreEmpresa + ", no tiene departamentos asignados.");
            } else {
                for (var i = 0; i < items.length; i++) {
                    item = document.createElement("li");
                    opcion = document.createElement("input");
                    opcion.setAttribute("type", "checkbox");
                    opcion.setAttribute("value", GetValor(items[i], "cve_departamento"));
                    cve_perfil = GetValor(items[i], "cve_perfil").toString();
                    opcion.checked = ($.trim(cve_perfil).length > 0);
                    opcion.onclick = function () {
                        cambiosEnListaDepartamentos = true;
                    }
                    etiqueta = document.createElement("span");
                    etiqueta.innerHTML = GetValor(items[i], "nombredep");
                    item.appendChild(opcion);
                    item.appendChild(etiqueta);
                    lista.appendChild(item);
                }
            }
        });
    }
}


