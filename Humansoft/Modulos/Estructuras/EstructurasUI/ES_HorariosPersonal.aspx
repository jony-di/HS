<%@ Page Language="C#"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
     <title></title>
        <link href="css/estructura.css" rel="stylesheet" type="text/css" />
        <link href="css/horarios.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/horarios.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>

        <style>
            .campo-par{display:block;float:left;width:400px;clear:both;}
            .campo-par label{float:left;width:100px;padding:5px;}
            .campo-par input{width:110px;padding:0px;float:left;}
            table#captura-horarios input{width:25px;border-width:0px;border-bottom-width:1px;background:transparent;}
            table#captura-horarios{margin:30px auto;clear:both;}
            table#captura-horarios th{padding:5px;}
            table#captura-horarios td{border-right:1px dashed #a9a9a9;}
            table#captura-horarios td label.tag-rubro{width:150px;}            
        </style>

    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal"><!-- Carrete-->
                    
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario" >Catálogo de Horarios</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos horarios" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoHorario()">Agregar</button>
                            <table class="lista" id="tableCatalogo">
                                <thead>
                                    <tr class="columnas"> 
                                        <th width="100" ><label> Editar</label> </th>
                                        <th width="500" ><label class="ordenar">Descripción</label></th> 
                                        <th width="100" ><label class="ordenar">Estatus</label></th> 
                                    </tr>
                                </thead>
                                <tbody id="contenedorLista"></tbody>
                            </table>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    
                    <div class="formulario smart-green" style="height:550px;min-height:400px;">
                         <form id="frmNuevoHorario" onsubmit="return false;">
                            <h2 class="encabezadoformulario" >Crear Nuevo Horario </h2>
                            <div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>

                            <span class="campo-par"><label>Clave</label><input /></span>
                            <span class="campo-par"><label>Descripcion</label><input style="width:250px;"/></span>
                            <button class="btn agregar" onclick="SeleccionarNuevoRubro()" style="width:120px;"> + Agregar rubro</button>
                            <hr class="cleaner"/>
                            <div style="height:255px;overflow-y:auto;">
                                <table id="captura-horarios">
                                    <thead>
                                        <tr> <th>Rubro</th> <th>Lunes</th> <th>Martes</th> <th>Miercoles</th> <th>Jueves</th>  <th>Viernes</th> <th>Sabado</th> <th>Domingo</th> </tr>
                                    </thead>
                                    <tbody>
                                        <tr> <td><label class="tag-rubro">Jornada Laboral</label></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> </tr>                                    
                                        <tr> <td><label class="tag-rubro">Hora de Comida</label></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> </tr>                                    
                                        <tr> <td><label class="tag-rubro">Hora de descanso</label></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> <td><input />-<input /></td> </tr>                                                                            
                                    </tbody>
                                </table>
                            </div>
                            <hr  class="cleaner"/>
                            <div class="barra-botones">
                                <span style="width:300px;">
                                    <button class="guardar btnFormularios" onclick="GuardarHorario()">Guardar</button>
                                    <button class="cancelar btnFormularios" onclick="MostrarCatalogo()">Salir</button>
                                </span>
                            </div>
                         </form>
                    </div>

                </div>
            </div>
        </div>
    </body>
</html>
