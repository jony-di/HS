
function iniciar() {
    var busqueda = document.getElementById("buscar");
    busqueda.value = "";
    cargarCatalogoImagenes(1);

}

function PreviewImage() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("path").files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById("uploadPreview").src = oFREvent.target.result;
    };
};

function buscarCoincidencias(ev, objeto) {
    var criterio= $.trim(objeto.value);
    cargarCatalogoImagenes(1, criterio);
}

function MostrarNuevoImagen() {
    MostrarFormulario();
    var frmImagen = document.getElementById("frmNuevoImagenes");
    frmImagen.esEditar = false;
    $.post(urlBase_WS + "NImagenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "clave", "cve_imagen");
    });
}

var ordenador;
function cargarCatalogoImagenes(pagina, criterio) {
    PonerEnEspera();
    var paginador = document.getElementById("paginador");
    if (pagina == undefined) {
        pagina = paginador.paginaActual == undefined ? 1 : paginador.paginaActual;
    }
    $.post(urlBase_WS + "NImagenes.aspx", { op: "obtenerCatalogoImagenes", pagina: pagina, longitudPagina: 20, criterio: (criterio ? criterio : ""), cve_imagen: 0 }).done(function (xmlDoc) {
        QuitarEspera();
        var imagenes = xmlDoc.getElementsByTagName("Table");
        var listaImagenes = document.getElementById("contenedorLista");
        $(listaImagenes).html("");
        var totalregistros;
        for (var i = 0; i < imagenes.length; i++) {
            var cveImagenes = GetValor(imagenes[i], "cve_imagen");
            var path = GetValor(imagenes[i], "path");
            var itemLista = document.createElement("li");
            totalregistros = GetValor(imagenes[i], "totalRegistros");
            var boton = document.createElement("button");
            boton.className = "editar";
            boton.cve_imagen = cveImagenes;
            boton.onclick = function () {
                MostrarEditarImagen(this);
            }
            var imagen = document.createElement("img");
            imagen.src = "/Recursos/iconos-imagenes" + path + "?" + Math.random().toString();
            itemLista.appendChild(boton);
            itemLista.appendChild(imagen);
            boton.imagen = imagen;
            listaImagenes.appendChild(itemLista);
        }
        paginarTabla(pagina, totalregistros, cargarCatalogoImagenes);
    });
}

function GuardarImagen() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmNuevoImagenes = document.getElementById("frmNuevoImagenes");
        frmNuevoImagenes.enctype = "multipart/form-data";
        frmNuevoImagenes.method = "post";
        frmNuevoImagenes.target = "frame-aux";
        if (!frmNuevoImagenes.esEditar) {
            frmNuevoImagenes.action = urlBase_WS + "NImagenes.aspx?op=NuevaImagen";
        } else {
            frmNuevoImagenes.action = urlBase_WS + "NImagenes.aspx?op=EditarImagen";
        }
        frmNuevoImagenes.submit();
    } else {
    MostrarCatalogo();
    }
}

function HandlerNuevaImagen(estatus, mensaje) {
    mostrarNotificacion(null, 'notificacion', function () { cargarCatalogoImagenes(); CancelarImagen(); }, estatus, mensaje);
}

function HandlerEditarImagen(estatus, mensaje) {
    mostrarNotificacion(null, 'notificacion', function () {cargarCatalogoImagenes(); CancelarImagen(); }, estatus, mensaje);
}

function MostrarEditarImagen(btnEditar) {
    var frmImagen = document.getElementById("frmNuevoImagenes");
    frmImagen.esEditar = true;
    MostrarFormulario();
    CargarDatosImagen(btnEditar);  
}

function CargarDatosImagen(btnEditar) {
    $.post(urlBase_WS + "NImagenes.aspx", { op: "obtenerCatalogoImagenes", pagina: 1, longitudPagina: 5, criterio: "",
        cve_imagen: btnEditar.cve_imagen
    }).done(function (xmlDoc) {
        var imagenes = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(imagenes, "cve_imagen", "cve_imagen");
        SetValor(imagenes, "palabrasclave", "palabrasclave");
        document.getElementById("uploadPreview").src = btnEditar.imagen.src;
    });
}


function CancelarImagen(){
    MostrarCatalogo();
 }

