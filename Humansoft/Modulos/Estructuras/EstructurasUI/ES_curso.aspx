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
        <link href="css/curso.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/curso.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/estructuras.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
    </head>
    <body class="fondo" onload="iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="curso encabezadoformulario" >Catálogo de Curso</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Curso" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoCurso()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th><label class="nombre ordenar">Nombre</label> </th>
                                            <th ><label class="descripcion ordenar">Descripción</label></th>
                                            <th ><label class="dias ordenar">Dias</label></th>
                                            <th ><label class="horas ordenar">Horas</label></th>  
                                            <th><label class="estatus ordenar">Estatus</label></th> 
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario ">
                         <form id="frmNuevoCurso" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="curso encabezadoformulario" >Crear Nuevo Curso</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="columnaI scrollable" offset="310">
                                    <label class="clave">Clave</label>  
                                    <input id="clave" name="clave_curso" class="clave" readonly  />
                                    <label class="cursoemp">Empleado</label>  
                                    <input id="cursoemp" name="cvecurso_emp" class="cursoemp" />
                                    <label class="nombre">Nombre</label>  
                                    <input id="nombre" name="nombre_curso" class="nombre"  />
                                    <label class="descripcion">Descripción</label>  
                                    <input id="descripcion" name="descripcion" class="descripcion"  />
                                    <label class="dias">Dias</label>  
                                    <input id="dias" name="dias" class="dias"  />
                                </div>
                                <div class="columnaD scrollable" offset="310">
                                    <label class="todospuesto">TodosPuesto</label> 
                                    <input id="todospuesto" type="checkbox" name="todospuesto" value="true" class="todospuesto" maxlength="79" placeholder="Nombre Todo Puesto" />
                                    <label class="horas">Horas</label>  
                                    <input id="horas" name="horas" class="horas"  />
                                    <label class="tipocurso">TipoCurso</label>  
                                    <input id="tipocurso" name="tipo_curso" class="tipocurso"  />
                                    <label class="frecuencia">Frecuencia</label>  
                                    <input id="frecuencia" name="frecuencia" class="frecuencia"  />
                                    <label class="estatus">Estatus</label> 
                                    <select class="estatus" name="activo" id="estatus"  >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarCurso()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarCurso()">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>                
                </div>  
           </div>  
       </div> 
  <%}else {%>
     <uc1:pie_redireccion runat="server" ID="pie_redireccion" />
<%}%>  
    </body>
</html>
