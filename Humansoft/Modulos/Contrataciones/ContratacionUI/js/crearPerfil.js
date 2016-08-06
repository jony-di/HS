var CVE_pantilla;
var max_file_size = 2070000;
$(document).ready(function () {
    document.getElementById("perfilscan").addEventListener("change", handleFileSelect, false);
});

function iniciar(claveApartado) {
    CVE_pantilla = claveApartado || 99;
    cargarSeccionesPerfil();
    document.getElementById('logo').setAttribute("src", "/Archivos/Contrataciones/Perfiles/Logos/" + claveApartado + ".png")
    try {
        var callbackInicio = document.body.getAttribute("callbackInicio");
        if ($.trim(callbackInicio).length > 0) eval("window.parent." + callbackInicio + "();");
    } catch (e) { }
}

var ordenador;
function cargarSeccionesPerfil() {
    PonerEnEspera();
    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "perfiles", op: "obtenerPerfil", pantilla: CVE_pantilla }).done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        for (var j = 0; j < info.length; j++) {
            SetValor(info[j], "Nombre_Puesto", "lblPuesto");
            SetValor(info[j], "nombre", "lblEmpresa");
        }
    });

    $.post(urlBase_WS + "NPerfiles.aspx", { seccion: "perfiles", op: "obtenerSecciones", pantilla: CVE_pantilla }).done(function (xmlDoc) {
        var Apartado = xmlDoc.getElementsByTagName("Table");
        var listaApartado = document.getElementById("contenedorLista");
        try {
            alert(parsers.length);
            alert(widgets.length);
        } catch (e) { }
        $(listaApartado).html("");
        var columna;
        var sColumna;
        var valor;
        var hijos=$(Apartado[0]).children();
        for (var x = 1; x < hijos.length; x++) {
            var cadena = "<fieldset class='Seccion'>";
            columna = hijos[x].localName;
            sColumna = columna.replace(new RegExp("_x0020_", "gi"), " ");
            cadena += "<legend>" + sColumna + "</legend>";
            for (var y = 0; y < Apartado.length; y++) {
                valor = GetValor(Apartado[y], columna);
                if (valor !== "") {
                    var valores = valor.split("-");
                    cadena += "<img class ='quitarSubSeccion' src='../../../Recursos/imagenes/eliminar.png' onclick='quitarSubSecc("+ valores[0]+","+ valores[1]+")' /><label class='etiquetasSeccion'>" + valores[2] + "</label>";
                }
            }
            cadena += "</fieldset>";
            $(listaApartado).append(cadena);
        }
    });
    QuitarEspera();
}

function MostrarSeleccionSecciones() {
    NuevoSeleccionSecuencial("Seleccionar Los Apartados de la Seccion que necesites", [
         { alias: "", url: urlBase_WS + "NperfilSecc.aspx", parametros: { seccion: "PerfilSecciones", op: "obtenerActivas" }, campos: ['cve_seccion', 'descripcion', 'secuencia'], encabezado: { titulo: "Secciones", columnas: ["Clave", "Seccion", "Secuencia"] }, display: "descripcion", sigSolicitud: {cve_seccion: 'cve_seccion'}}
        ,{ esMultiSeleccion: true, url: urlBase_WS + 'NperfilApartados.aspx', parametros: { seccion: "apartados", op: "obtenerActivas", pantilla:CVE_pantilla }, campos: ["cve_subseccion", "secuencia", "descripcion"], encabezado: { titulo: "Apartados de la seccion", columnas: ["Clave", "secuencia", "Descripcion"]} }
    ], "base", function (divR) {
        var divTmp = document.createElement("div");
        divTmp.appendChild(divR);
        $.fancybox({ type: 'html', content: $(divTmp), preload: false, openEffect: 'elastic' });
    },
    function (seleccion) {
        if (seleccion[0]) {
            var seccion = seleccion[0]["cve_seccion"];
            var obj = seleccion[1];
            var subSecciones = "";
            var coma = "";
            for (var x = 0; x < obj.length; x++) {
                subSecciones += coma + obj[x]["cve_subseccion"];
                coma = ",";
            }

            $.post(urlBase_WS + "NPerfiles.aspx", "seccion=perfiles&op=agregarSecciones&pantilla=" + CVE_pantilla + "&cve_seccion=" + seccion + "&cve_subseccion=" + subSecciones).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                var notificacion = document.getElementById("notificacion");
                var mensajeNotificacion = document.getElementById("mensaje-alerta");
                $(mensajeNotificacion).html(mensaje);
                if (estatus === "") {
                    notificacion.className = "alert-box error ocultar";
                    cargarSeccionesPerfil();
                }
                else if (estatus < 0) {
                    notificacion.className = "alert-box error mostrar";
                }
            });
        }
        $.fancybox.close();
    });
}

function quitarSubSecc(secc,subsecc)
{
    $.post(urlBase_WS + "NPerfiles.aspx", "seccion=perfiles&op=eliminarApartado&pantilla=" + CVE_pantilla + "&cve_seccion=" + secc + "&cve_subseccion=" + subsecc).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        var notificacion = document.getElementById("notificacion");
        var mensajeNotificacion = document.getElementById("mensaje-alerta");
        $(mensajeNotificacion).html(mensaje);
        if (estatus === "") {
            notificacion.className = "alert-box error ocultar";
            cargarSeccionesPerfil();
        }
        else if (estatus < 0) {
            notificacion.className = "alert-box error mostrar";
        }
    });
}

function handleFileSelect(evt){
    var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        if (f.size < max_file_size) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    document.getElementById('logo').setAttribute("src", e.target.result)
                    gardarLogo();
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
        else {
            alert("El archivo sobrepasa de los 2MB")
            return false;
        }
    }
}

function gardarLogo() {
    var perfilscan = document.getElementById("perfilscan");
    var formData = new FormData();
    var file = perfilscan.files[0];

    document.getElementById("pathfile").value = perfilscan.value;
    formData.append("logo", file);
    formData.append("pantilla", CVE_pantilla);
    $.ajax({
        type: "POST",
        url: urlBase_WS + "NPerfiles.aspx?seccion=perfiles&op=gardarLogo",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (msg) {
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            var notificacion = document.getElementById("notificacion");
            document.getElementById("archivoescaneado").className = "";
            document.getElementById("mostrarEscaneo").className = "ocultar";
            $(mensajeNotificacion).html("Se guardo correctamente");
            notificacion.className = "alert-box success mostrar";
            document.getElementById("ligaEscaneo").setAttribute("onclick", "abrirImagen('/Expedientes/Puestos/Perfiles/" + CVE_PUESTO + "." + ext[ext.length - 1] + "')");
        },
        error: function (error) {
            var mensajeNotificacion = document.getElementById("mensaje-alerta");
            var notificacion = document.getElementById("notificacion");
            $(mensajeNotificacion).html("No se guardo correctamente");
            notificacion.className = "alert-box error mostrar";
        }
    });
}