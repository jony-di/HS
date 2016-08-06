
function iniciar() {
    cargarCatalogoMenu(1);

}

function crearNuevoMenu() {
    var frmNuevoMenu = document.getElementById("frmNuevoMenu");
    var parametros = $(frmNuevoMenu).serialize();
    $.post(urlBase_WS + "NMenus.aspx", "op=NuevoMenu&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoMenu(1);
            document.getElementById("frmNuevoMenu").reset();
            MostrarCatalogo();
        });
    });
}

function VerCatalogoImagenes() {
    LlenarCatalogoImagenes(1, "", "catalogoImagenes", SeleccionarImagen);
    IntercambioVisual('menuImagenes', 'imagenSeleccionada');
}

function SeleccionarImagen() {
    document.getElementById("cve_imagen").value = this.cveImagen;
    document.getElementById("imagenMenu").setAttribute("src", this.src);
    IntercambioVisual('imagenSeleccionada', 'menuImagenes');
}

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoMenu(1, criterio);
}

function MostrarNuevoMenu() {
    var frmMenu = document.getElementById("frmNuevoMenu");
    frmMenu.esEditar = false;
    $.post(urlBase_WS + "NMenus.aspx", { op: "ObtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "clave");
        var selectIdioma = document.getElementById("idioma");
        LlenarCatalogoIdiomas(selectIdioma);
        var selectSubPadre = document.getElementById("cve_padremenu");
        LlenarCatalogoMenus(selectSubPadre);
    });
    //document.getElementById("clave").focus();
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = true;
    MostrarFormulario();
}


var ordenador;
function cargarCatalogoMenu(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NMenus.aspx", { op: "ObtenerCatalogoMenus", pagina: pagina, longitudPagina:4, criterio: (criterio ? criterio : ""), cve_menu: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var menus = xmlDoc.getElementsByTagName("Table");
        var listaMenu = document.getElementById("contenedorLista");
        $(listaMenu).html("");
        var totalregistros;
        for (var i = 0; i < menus.length; i++) {
            var cveMenu = GetValor(menus[i], "cve_menu");
            var nombre = GetValor(menus[i], "nombre");
            var url = GetValor(menus[i], "pagina");
            var imagen = GetValor(menus[i], "imagen");
            var estatus = GetValor(menus[i], "activo", "bool", "Activo:Inactivo");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(menus[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="MostrarEditarMenu(' + cveMenu + ')"></button></td>' +
                '<td><label class="clave">' + cveMenu + '</label></td>' +
                '<td><label class="nombre">' + nombre + '</label></td>' +
                '<td><label class="pagina" title="' + url + '">' + url + '</label></td>' +
                '<td><label class="imagen"><img class="imagen" src="/Recursos/iconos-imagenes' + imagen + '"/></label></td>' +
                '<td><label class="estatus">' + estatus + '</label> </td>' 
            );
            listaMenu.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoMenu, paginador);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });    
}


function GuardarMenu() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmMenu = document.getElementById("frmNuevoMenu");
        if (!frmMenu.esEditar) {
            crearNuevoMenu();
        } else {
            GuardarEdicioNMenus();

        }
    } else {
    MostrarCatalogo();
    }
}

function MostrarEditarMenu(cve_menu) {
    var frmMenu = document.getElementById("frmNuevoMenu");
    frmMenu.esEditar = true;
    MostrarFormulario();
    var selectIdioma = document.getElementById("idioma");
    LlenarCatalogoIdiomas(selectIdioma, function () {
        var selectMenu = document.getElementById("cve_padremenu");
        LlenarCatalogoMenus(selectMenu, function () {
            CargarDatosMenu(cve_menu);
        });
    });   
    var selectestatus = document.getElementById("estatus");
    selectestatus.disabled = false;
}

function CargarDatosMenu(cve_menu) {
    $.post(urlBase_WS + "NMenus.aspx", { op: "ObtenerCatalogoMenus", pagina: 1, longitudPagina: 5, criterio: "",
        cve_menu: cve_menu
    }).done(function (xmlDoc) {
        var Menu = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(Menu, "cve_menu", "clave");
        SetValor(Menu, "nombre", "nombre");
        SetValor(Menu, "pagina", "url");
        SetValor(Menu, "tooltip", "tooltip");
        SetValor(Menu, "cve_imagen", "cve_imagen");
        SetValor(Menu, "cve_idioma", "idioma");
        SetValor(Menu, "cve_padremenu", "cve_padremenu");
        SetValor(Menu, "activo", "estatus", "bool");
        document.getElementById("imagenMenu").src = "/Recursos/iconos-imagenes" + GetValor(Menu, "imagen");
    });
}

function GuardarEdicioNMenus() {
    var frmNuevoMenu = document.getElementById("frmNuevoMenu");
    var parametros = $(frmNuevoMenu).serialize();
    $.post(urlBase_WS + "NMenus.aspx","op=EditarMenu&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            cargarCatalogoMenu();
            document.getElementById("frmNuevoMenu").reset();
            MostrarCatalogo();
        });
    });
}



function DesactivarMenu(cve_menu) {
    $.post(urlBase_WS + "NMenus.aspx", { op: "CambiarEstatusActivo", cve_menu: cve_menu, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoMenu();
    });
}

function CancelarMenu(){
    MostrarCatalogo();
 }

