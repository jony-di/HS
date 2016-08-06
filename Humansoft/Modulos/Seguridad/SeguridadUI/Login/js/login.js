
function mostrarRecuperarContrasena() {
    var inicioSesion = document.getElementById("frmLogin");
    var recuperarContrasena = document.getElementById("recuperarContrasena");
    inicioSesion.style.display = "none";
    recuperarContrasena.style.display = "block";
}

function regresarInicioSesion() {
    var inicioSesion = document.getElementById("frmLogin");
    var recuperarContrasena = document.getElementById("recuperarContrasena");
    var enviarMail = document.getElementById("notificacion");
    recuperarContrasena.style.display = "none";
    enviarMail.style.display = "none";
    inicioSesion.style.display = "block";
}

function EnviarEMail() {
    var enviarMail = document.getElementById("notificacion");
    var recuperarContrasena = document.getElementById("recuperarContrasena");
    var inicioSesion = document.getElementById("frmLogin");
    recuperarContrasena.style.display = "none";
    inicioSesion.style.display = "none";
    enviarMail.style.display = "block";
}


function EnviarMailRecuperarPassword() {
    var emailPassword = document.getElementById("emailPassword").value;
    if (emailPassword.length > 0) {
        if (ValidarEmail(emailPassword)) {
            $.post(urlBase_WS + "NSeguridad.aspx", { op: "EnviarPasswordEmail", email: emailPassword }).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                if (parseInt(estatus) > 0) {
                    EnviarEMail();
                } else {
                    alert(mensaje);
                }
            });
        } else {
            alert("El correo electrónico no tiene formato correcto.");
        }
    } else {
        alert("Ingrese e-mail.");
    }
}

