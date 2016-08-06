var ordenador;

function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoItemCat(1);
}

function buscarCoincidencias(ev, objeto) {
    var criterio = $.trim(objeto.value);
    cargarCatalogoItemCat(1, criterio);
}

function cargarCatalogoItemCat(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    pagina = pagina || paginador.paginaActual || 1;
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "perfiles", op: "obtenerPerfiles", pagina: pagina, longitudPagina: 5, criterio: (criterio ? criterio : "")}).done(function (xmlDoc) {
        QuitarEspera();
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaItemCat).html("");
        var totalregistros;
        for (var i = 0; i < ItemCat.length; i++) {
            var plantilla = GetValor(ItemCat[i], "num_plantilla");
            var Puesto = GetValor(ItemCat[i], "Nombre_Puesto");
            var Departamento = GetValor(ItemCat[i], "Nombre_Departamento");
            
            var Empresa = GetValor(ItemCat[i], "Nombre_Empresa");
            var itemLista = document.createElement("tr");
            totalregistros = GetValor(ItemCat[i], "totalRegistros");
            itemLista.className = "columnas columnas1";
            $(itemLista).html(
                '<td><button class="editar" onclick="editarPlantilla(' + plantilla + ')"></button></td>' +
                 '<td><label class="Puesto">' + Puesto + '</label></td>' +
                 '<td><label class="Departamento">' + Departamento + '</label></td>' +
                '<td><label class="Empresa">' + Empresa + '</label></td>' +
                '<td><label class="seleccionar"><img class="seleccionar" onclick="editarPlantilla(' + plantilla + ',this)" src="/Recursos/imagenes/select.png"/></label></td>'
            );
            listaItemCat.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoItemCat);
        var tableCatalogo = document.getElementById("tableCatalogo");
        ordenador = $(tableCatalogo).tablesorter();
    });
}

function editarPlantilla(Pantilla) {
    PonerEnEspera();
    IntercambioVisual("pantallaAuxiliar", "formulario");
    window.frames["pantallaAuxiliar"].location.href = "../ContratacionUI/CN_crearPerfil.aspx?callbackInicio=callbackInicioEditarPlantilla&offset=0&Plantilla=" + Pantilla;
} /// /Modulos/Contrataciones/ContratacionUI/CN_catalogoGenerico.aspx


function callbackInicioEditarPlantilla() {
    QuitarEspera();
    DesplazarElemento('principal', -900);
    QuitarEspera();
}
