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
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
        <link href="css/seguridad.css" rel="stylesheet" type="text/css" />
        <link href="css/idiomas.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <script src="js/idiomas.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
        <script src="js/seguridad.js" type="text/javascript"></script>
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
                            <h2 class="idiomas encabezadoformulario" >Cat�logo de Idiomas</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los Idiomas" onkeyup="buscarCoincidencias(event,this);"/> </div>
                            <button class="btn agregar" id="btnagregar" onclick="MostrarNuevoIdioma()">Agregar</button>
                            <div class="scrollable" offset="270">
                                <table class="lista" id="tableCatalogo">
                                    <thead>
                                        <tr class="columnas"> 
                                            <th><label class="editar"> Editar</label> </th>
                                            <th><label class="clave ordenar">Clave</label> </th>
                                            <th><label class="idioma ordenar">Idioma</label> </th>
                                            <th><label class="pais ordenar">Pa�s</label></th> 
                                            <th><label class="moneda ordenar">Moneda</label></th> 
                                            <th><label class="signo ordenar">Signo</label></th> 
                                        </tr>
                                    </thead>
                                    <tbody id="contenedorLista"></tbody>
                                </table>
                            </div>
                            <div class='paginador' id='paginador'  total='0' criterio='%' tamPagina='5'  ></div>
                        </div>
                    </div>
                    <div class="formulario">
                         <form id="frmNuevoIdiomas" onsubmit="return false;">
                            <div class="alinear smart-green">
                                <h2 class="idiomas encabezadoformulario" >Crear Nuevo Idioma</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="330">
                                    <label class="clave">Clave</label>  
                                    <input id="cve_idioma" name="cve_idioma" class="clave"  readonly/>
                                    <label class="idioma">Idioma</label> 
                                    <input id="idioma" name="idioma" class="idioma" />
                                    <label class="clavepais">ClavePa�s</label>  
                                    <input id="cve_pais" name="cve_pais" class="clavepais" readonly />
                                    <label class="pais">Pa�s</label> 
                                    <input id="pais" name="pais" class="pais"  />
                                    <label class="nombremoneda">Moneda</label> 
                                    <input id="nombremoneda" name="nombremoneda" class="moneda" maxlength="79" placeholder="NombreMoneda" />
                                    <label class="signomoneda">Signo</label> 
                                    <input id="signomoneda" name="signomoneda" class="signo" maxlength="79" placeholder="SignoMoneda" /> 
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span>
                                        <button class="guardar btnFormularios" onclick="GuardarIdioma()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="CancelarIdioma()">Salir</button>
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
