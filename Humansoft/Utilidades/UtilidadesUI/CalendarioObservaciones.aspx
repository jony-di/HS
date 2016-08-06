<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/utilidades.js" type="text/javascript"></script>
        <script src="../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
        <link href="../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
        <script src="../../Recursos/js/generico.js"></script>
        
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <link href="css/utilidades.css" rel="stylesheet" type="text/css" />

    </head>
    <body class="fondo" onload="CalendarioObservaciones.iniciar('<%=Request["callback"]%>');">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo ventana">
                        <div class="smart-green calendario-observaciones" style="height:auto;">
                            <h2>Fecha efectiva del evento <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-1800"%>);">Regresar</button></h2>
                            <div class="auxiliar">
                                <div class="scrollable" offset="250">
                                    <fieldset class="left"><legend>Seleccione la fecha de aplicación</legend>
                                        <div id="calendario" class="calendario"></div>
                                        <label class="preview-fecha" id="fechaSeleccionada"><%=(DateTime.Now.ToString("dd/MM/yyyy")) %></label>
                                    </fieldset>
                                    <fieldset class="right"><legend>Indique sus observaciones</legend>
                                        <textarea id="observaciones" class="observaciones"></textarea>
                                    </fieldset>
                                </div>
                            </div>                            
                            <hr  class="cleaner"/>
                            <div class="barra-botones" style="margin-top:0px;">
                                <span>
                                    <button class="guardar btnFormularios" onclick="CalendarioObservaciones.ContinuarProceso()">Continuar</button>
                                    <button class="cancelar btnFormularios" onclick="CancelarDireccionEmpl()">Salir</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</body>
</html>
