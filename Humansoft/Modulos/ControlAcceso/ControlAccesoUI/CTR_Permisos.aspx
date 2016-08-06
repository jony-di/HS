<%@ Page Language="C#"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
     <title></title>
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js?ver=1.4"></script>
        <script src="js/controlacceso.js?ver=1.1"></script>
        <script src="js/permisos.js?ver=1.14" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css?ver=1.0" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

        <style>
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
        </style>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->
                    
                    <div class="ventana">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Historial de incidencias</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los motivos" onkeyup="BuscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoPermiso();">Agregar</button>
                            <div class="wrapper-tabla scrollable" offset="305">
                                <table class="listaN" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th width="100" ><label> Clave</label> </th>
                                            <th width="70" ><label class="ordenar">No. Emp.</label></th>
                                            <th width="300" ><label class="ordenar">Nombre</label></th>
                                            <th width="200" ><label class="ordenar">Motivo</label></th>
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista" class="filas-seleccionables"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='50'  ></div>
                        </div>
                    </div>
                    
                    <div class="formulario ventana">
                         <form id="frmNuevoPermiso" class="smart-green" onsubmit="return false;" enctype="multipart/form-data" method="post" target="consola">
                            <h2 class="encabezadoformulario" >Solicitar Permiso, Incapacidad o Retardo</h2>
                            <div  id="notificacion" class="alert-box error"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="310">
                                    <div class="columnaI">
                                        <span class="campo-par"><label>Clave</label><input id="cve_solicitudjusti" name="cve_solicitudjusti" onclick="return false;"  readonly onkeypress="return false;"  onkeydown="return false;"/></span>
                                        <span class="campo-par"><label>Número de empleado</label><input id="txtNumEmp" name="num_empleado" /></span>
                                        <span class="campo-par"><label>Nombre de empleado</label><b id="lblNombreEmpleado"></b></span>
                                        <span class="campo-par"><label>Departamento</label><b id="lblDepartamento"></b></span>
                                        <span class="campo-par"><label>Puesto</label><b id="lblPuesto"></b></span>
                                        <span class="campo-par"><label>Fecha Inicio</label><input  style="width:150px;" id="fechainicio" name="fechainicio"/></span>
                                        <span class="campo-par"><label>Fecha Fin</label><input style="width:150px;" id="fechafin" name="fechafin" /></span>
                                        
                                    </div>
                                    <div class="columnaD">
                                        <fieldset ><legend>Justificantes</legend>
                                            <span class="campo-par"><label style="width:50px;">Justifica</label>
                                                <select id="cve_tipojustificacion" name="cve_tipojustificacion" style="width:260px;margin-left:10px;margin-top:10px;" onchange="ObtenerMotivosAusentarse('cve_motivo', this.options[this.selectedIndex].value);"></select>
                                            </span>
                                            <span class="campo-par"><label style="width:50px;">Motivo</label>
                                                <select id="cve_motivo" name="cve_motivo" style="width:260px;margin-left:10px;margin-top:10px;"></select>
                                            </span>
                                            <span class="campo-par"><label>Comentario:</label><textarea style="clear:both;display:block;height:80px;width:96%;margin:auto;margin-bottom:20px;" name="comentario" id="comentario"></textarea></span>                                        
                                            <div id="uploadJustificantes" style="clear:both;border:1px dashed #a9a9a9;min-height:40px;margin-bottom:10px;"></div>
                                            <button class="btnFormularios" style="float:right;" onclick="AgregarInputFile('uploadJustificantes','justificante');">Agregar documento</button>
                                        </fieldset>
                                    </div>
                                </div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones">
                                <span style="width:300px;">
                                    <button class="guardar btnFormularios" onclick="GuardarPermiso()">Guardar</button>
                                    <button class="cancelar btnFormularios" onclick="DesplazarElemento('principal',0)">Salir</button>
                                </span>
                            </div>
                         </form>
                        <iframe name="consola" id="consola" style="display:none;"></iframe>
                    </div>

                </div>
            </div>
        </div>
    </body>
</html>
