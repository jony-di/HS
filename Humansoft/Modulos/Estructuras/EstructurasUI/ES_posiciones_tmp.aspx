<%@ Page Language="C#" %>
<%Session["cve_usuario"] = 1; Session["cve_perfil"] = 34;%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <link href="../jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <script src="../jqueryui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="js/estructuras.js" type="text/javascript"></script>
    <link href="../../../Recursos/css/arbolmenu.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <script src="js/posiciones.js" type="text/javascript"></script>
    <script src="js/arbolposiciones.js" type="text/javascript"></script>
    <link href="css/posiciones.css" rel="stylesheet" type="text/css" />
    <link href="css/arbolposiciones.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <div id="inicio">
        <div class="principal" id="principal">
            <div class="smart-green">
                <h2 class="encabezadoformulario">Administración de Posiciones</h2>
                <div  id="notificacion" class="alert-box success mostrar"><span id="mensaje-alerta"></span></div>
                <div class="arbol-posiciones" style="width:100%;">
                    <p>Busqueda de posiciones por número de posición, nombre de empleado, departamentos, puestos</p>
                    <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todas las posiciones" onkeyup="ObtenerArbolPosiciones('arbolPosiciones',this.value, false);"/> </div>
                    <div class="tree-posiciones" id="arbolPosiciones">Arbol</div>
                </div>
                <div class="wrap" style="display:none;">
                    <div class="detalle-posicion">
                        <h3>Datos de la posición</h3>
                        <div class="izq">
                            <label>Número de posición:</label>
                            <input />
                            <label>Número de posición jefe:</label>
                            <input />
                            <label>Centro de costos:</label>
                            <input />
                            <label>Estatus:</label>
                            <input />
                            <label>Vigencia:</label>
                            <input />
                            <label>Tipo:</label>
                            <input />
                            <label>Segmento:</label>
                            <input />
                            <label>Turno:</label>
                            <input />
                            <label>Familia puesto:</label>
                            <input />
                            <label>Teléfono:</label>
                            <input />
                            <label>Extensión:</label>
                            <input />
                            <label>Zona Cara:</label>
                            <input />
                            <label>Nivel tabular:</label>
                            <input />
                            <label>Tabulador:</label>
                            <input />
                            <label>Grupo de pago:</label>
                            <input />
                            <label>UBN:</label>
                            <input />
                            <label>Nivel:</label>
                            <input />
                            <label>Puntos:</label>
                            <input />
                            <label>Q:</label>
                            <input />
                        </div>
                        <div class="der">
                            <label>Empresa:</label>
                            <input />
                            <label>Dirección General:</label>
                            <input />
                            <label>Departamento:</label>
                            <input />
                            <label>Puesto:</label>
                            <input />
                            <label>Area:</label>
                            <input />
                            <label>División:</label>
                            <input />
                            <label>Plaza:</label>
                            <input />
                            <label>Actividad funcional:</label>
                            <input />
                            <label>Empleado:</label>
                            <input />
                            <label>No. de empleado:</label>
                            <input />
                            <label>Número:</label>
                            <input />
                            <label>Total de posiciones:</label>
                            <input />
                            <label>Posiciones ocupadas:</label>
                            <input />
                            <label>Posicion vacantes:</label>
                            <input />
                        </div>
                    </div>
                </div>
                <hr class="cleaner" />
                <div class="barra-botones"><span><button class="btnFormularios" onclick="IniciarAgregarPosicion();">Editar nueva posicion</button><button class="btnFormularios" onclick="GuardarModulosRoles();">Guardar</button></span></div>
            </div>
        </div>
    </div>
</body>
</html>
