<%@ Page Language="C#"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="Recursos/js/generico.js"></script>

        <style>
            h4{clear:both;padding-left:20px;margin-bottom:15px;}
        </style>

    </head>
    <body class="fondo">
        <div id="inicio">
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->                    
                    <div class="catalogo ventana">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Información de Sesión</h2>
                            <div class="scrollable" offset="150">
                                <label>clave de usuario:</label><h4><%=Session["cve_usuario"] %></h4>
                                <label>Nombre de usuario:</label><h4><%=Session["nombre"] %></h4>
                                <label>Número de empleado:</label><h4><%=Session["num_empleado"] %></h4>
                                <label>Nombre de perfil:</label><h4><%=Session["perfil"] %></h4>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
