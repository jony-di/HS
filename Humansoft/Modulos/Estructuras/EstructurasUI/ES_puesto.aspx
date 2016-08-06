<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/puesto.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/puesto.js?ver=1.1" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js?ver=1.0" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js?ver=1.0" type="text/javascript"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css"/>
        <style>
            td.puesto{width:50%;}
            td.obtenido{width:25%;}
            td.tabulador{width:25%;}
            div.base{height:auto;}
            div.base table{border:0px;}
            body div.base div.wraptable{border:0px;}
            div.base input{width:95% !important;display:block;margin:auto;}
            div.base h3{display:none;}
            div.base table tr.seleccionado td:first-child{background-position: left center;background-image: url("/Recursos/imagenes/ok.png");background-repeat:no-repeat;padding-left:30px; font-weight:bold;}
            div.base table tr td{padding:5px; }
            div.base table tr.seleccionado:hover,div.base table tr:hover{color:#000;background-color:transparent;}
            div.base table tr.seleccionado{background-color:transparent;}
            .alinearTxtIzq{text-align:left !important;}
            div.wraptable{max-height:310px !important;margin-bottom:0px;padding-bottom:0px;}
            div.wrappTabla table thead{display:none !important;}
        </style>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio"  >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo"  style="height: 710px;overflow:hidden;">
                        <div class="smart-green">
                            <h2 class="puesto encabezadoformulario">Puestos de Departamento</h2>
                            <div  id="notificacion" class="alert-box error ocultarV"><span></span></div>
                            <div class="columnaI" style="clear:none;border-right:0px;">
                                <h3>Departamentos</h3>
                                <div class="busqueda" style="width:280px;overflow:hidden;"><input class="buscar" id="buscar" placeholder="Buscar" onkeyup="busquedaLocal('listaDepartamentos',this.value);"/> </div>
                                <ul id="listaDepartamentos" class="listaDepartamentos listasTablas scrollable" offset="390" ></ul>
                            </div>
                            <div class="columnaD" style="clear:none;margin-top:0px;">
                                <h3 id="lblDepSeleccionado" class="leyendaSeleccionado"></h3>
                                <div id="listaPuestos" class="listaPuestos listasTablas"></div>
                            </div>
                            <hr  class="cleaner" style="padding:0px;"/>
                            <div class="barra-botones" style="visibility:hidden;"></div>
                        </div>
                    </div>                                 
                </div>  
           </div>  
       </div> 
  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>        
    </body>
</html>
