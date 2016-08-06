<%@ Page Language="C#"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Confirmación de movimiento</title>
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <link href="css/confirmaciones.css" rel="stylesheet" type="text/css" />
    <script>
        function iniciar() {
            eval("window.parent.<%=Request["callbackInicio"]%>();");
        }
    </script>
</head>
<body class="" onload="iniciar();">
    <h2>HumanSoft</h2>
    <button class="btnFormularios"  style="float:right;"  onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>
    <button class="btnFormularios" style="float:right;margin-right:40px;" onclick="window.print();">Imprimir</button>
    <span style="display:block;float:left;width:70%;">
        <b class="dato">Fecha: </b><label class="valor" id="fecha"><%=(DateTime.Now.ToString("dd/MM/yyyy")) %></label>
        <b class="dato">Usuario: </b><label class="valor" id="usuario"><%=Session["nombre"]!=null ? Session["nombre"] : "Nombre no iniciado" %></label>
        <b class="dato">Perfil: </b><label class="valor" id="perfil"><%=Session["perfil"]!=null ? Session["perfil"] : "Sesión no iniciada" %></label>
    </span>
    <hr class="cleaner"/>
    <div class="scrollable" offset="400">
        <fieldset><legend>Desripción del movimiento</legend>
            <span><b class="dato">Tipo de movimiento: </b><label class="valor" id="tipoMovimiento"></label></span>
            <span><b class="dato">Fecha de Aplicación: </b><label class="valor" id="fechaAplicacion"></label></span>
            <span><b class="dato">Número de empleado: </b><label class="valor" id="idempl"></label></span>
            <span><b class="dato">Nombre de empleado: </b><label class="valor" id="nombreempl"></label></span>
            <span><b class="dato">Posición actual: </b><label class="valor" id="posicion"></label></span>
            <span><b class="dato">Posición aprobada: </b><label class="valor" id="posicionaprobada"></label></span>
            <span><b class="dato">Observaciones: </b><label class="valor observaciones" id="observaciones"></label></span>
        </fieldset>
    </div>
    <button class="aceptarmov btnFormularios" onclick="window.parent.<%=Request["callback"]%>();">Aceptar movimiento</button>
</body>
</html>
