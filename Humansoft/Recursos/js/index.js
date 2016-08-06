function mostrarLogin() {
    var vistaLogin = document.getElementById("frameLogin");
    vistaLogin.style.display = "block";
    var contenedorSesion = document.getElementById("contenedorSesion");
    contenedorSesion.className = "contenedor-sesion desenfocado";
    return false;
}