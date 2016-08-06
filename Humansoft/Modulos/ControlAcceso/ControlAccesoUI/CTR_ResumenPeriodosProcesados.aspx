<%@ Page Language="C#"%>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register Src="~/pie_redireccion.ascx" TagPrefix="uc1" TagName="pie_redireccion" %>
<%
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
     <title></title>
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js?ver=1.7"></script>
        <script src="js/controlacceso.js?ver=1.2"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" />
        <script src="../../../Recursos/jqueryui/jquery-ui.min.js"></script>
        <script src="../../../Recursos/js/SeleccionSecuencial.js?ver=1.1"></script>
        <script src="../../../Recursos/fancybox/jquery.fancybox.js"></script>
        <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" />
        <style>
            body{font-size:11px;}
            input[type=radio],input[type=checkbox]{width:auto !important;height:auto !important;margin-top:17px;}
            .campo-par{display:block;clear:both;}
            .campo-par label{float:left;width:130px;padding:5px;}
            .campo-par b{float:left;width:230px;padding:5px;border:1px solid #E5E5E5;padding:4px;margin-top:10px;min-height:19px;}
            .campo-par input{width:110px;padding:0px;float:left;}
            .campo-par select{width:110px;padding:0px;float:left;}
            table#captura-horarios input{width:50px;border-width:0px;border-bottom-width:1px;background:transparent;}
            table#captura-horarios{margin:30px auto;clear:both;}
            table#captura-horarios th{padding:5px;}
            table#captura-horarios td{border-right:1px dashed #a9a9a9;padding-left:20px;padding-right:20px;}
            table#captura-horarios td label.tag-rubro{width:150px;}
            #uploadJustificantes ol li input{width:245px;clear:left;margin-right:5px;font-size:11px;}
            #uploadJustificantes ol li a{padding:5px;display:block;font-size:12px;}
            #barra-botones button{float:left !important;margin-left:30px;}
            #contenedorLista{font-size:12px;}
            #contenedorLista td{padding:1px;border-bottom:1px dashed #E5E5E5;color:#030303;}
            #tableCatalogo{font-size:12px;}
            .base table tr .evento{width:180px;}
            .base table tr .alinearTxtIzq{text-align:left;}
            .marca-descuento{color:#ff015e;}
            .marca-descanso{color:#713434;background:#E5E5E5;}
            .marca-feriado{color:#ff6a00;}
            #btnagregar{float:right;padding:5px 20px 5px 20px;}
            .botones-operaciones{clear:both;display:block;}
            .botones-operaciones img{float:right;margin-right:20px;}
        </style>
    </head>
    <body class="fondo" onload="IntegracionEventosCTR.IniciarProcesosDescuento();">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->
                    
                    <div class="ventana">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Procesos de descuentos a empleados</h2>
                            <div id="busqueda">
                                <fieldset class="filtros-posiciones" id="filtrosPosiciones" style="margin-bottom:7px;">
                                    <legend>Filtrar consulta</legend>                                    
                                    <div class="wrap-menu-criterio">                                 
                                        <div class="opciones-menu" style="display:none;" id="criteriosBusqueda">
                                            <ul/>
                                        </div>
                                    </div>
                                    <form id="frmCriteriosBusqueda" class="frm-criterios-busqueda" onsubmit="return false;" style="position:relative;left:-40px;width:87%;">
                                        <span class="btnFormularios" style="padding:4px;position:absolute;right:12px;top:12px;" onclick="var frmBusqueda=this.parentNode;IntegracionEventosCTR.ConsultarProcesosDescuento('contenedorLista',frmBusqueda);">Ir</span>
                                    </form>
                                </fieldset>
                            </div>
                            <div class="wrapper-tabla scrollable" offset="335">
                                <table class="listaN" id="tableCatalogo" style="width:800px;padding-top:5px;">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th width="" ><label class="ordenar">No. de proceso</label></th>
                                            <th width="" ><label class="ordenar">Fecha de proceso</label></th>
                                            <th width="" ><label class="ordenar">Período</label></th>
                                            <th width="" ><label class="ordenar">Ctd. Empleados</label></th>
                                            <th width="" ><label class="ordenar">Días descontar</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>

                    <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar ventana" frameborder="0" scrolling="no" src="" ></iframe>

                </div>
            </div>
        </div>
          <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>
    </body>
</html>
