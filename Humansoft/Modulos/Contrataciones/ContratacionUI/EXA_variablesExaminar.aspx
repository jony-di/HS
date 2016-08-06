<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%@ Register TagPrefix="item" TagName="comun" Src="~/pie_redireccion.ascx" %>

<% if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){ %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title></title>
        <link href="css/contrataciones.css" rel="stylesheet" />
        <link href="../../../Recursos/css/paginate.css" rel="stylesheet" type="text/css" />
        <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
        <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />

        <script src="../../../Recursos/js/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/jquery.paginate.js" type="text/javascript"></script>
        <script src="../../../Recursos/js/generico.js"></script>
        <script src="js/examenes.js?ver=1.3" type="text/javascript"></script>
        <script src="../../../Recursos/treeview/simpletreemenu.js"></script>
        <link href="../../../Recursos/treeview/simpletree.css" rel="stylesheet" />
        <style>
            .bodyform label{float:left;clear:left;margin-right:10px;width:100px;}
            .bodyform input{float:left;clear:right;width:250px;}
            .bodyform select{float:left;clear:right;width:240px;}
            .bodyform input[type=checkbox]{width:auto;}
            .bodyform textarea{}
            .seleccionado{background-color:#51a3de;color:#d7d7d7;}
        </style>
    </head>
    <body class="fondo" onload="VariablesExaminar.Iniciar()">
        <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="examen encabezadoformulario" >Evaluación de exámenes: Variables a examinar</h2>
                            <div class="busqueda"><input class="buscar" id="buscar" placeholder="Buscar en todos los exámenes" onkeyup="buscarCoincidencias(event,this);"/></div>
                            <button class="btn agregar" id="btnCategoria" onclick="VariablesExaminar.MostrarNuevo({esVariable:true});" style="width:140px;margin-right:20px;">Nueva variable</button>
                            <div class="scrollable" offset="210" id="cat-variables"><ul class="treeview" id="arbol-variables"><li class="raiz"></li></ul></div>
                        </div>
                    </div>
                    <div class="formulario " id="editarExamen">
                         <form id="frmVariables" onsubmit="return false;" class="bodyform">
                            <div class="alinear smart-green">
                                <h2 class="encabezadoformulario" >Evaluación de exámenes: Variables a examinar</h2>
                            	<div  id="notificacion" class="alert-box error ocultar"><span id="mensaje-alerta">.</span></div>
                                <div class="scrollable" offset="300">
                                    <span id="wrap-clave" class="agrupacion" style="margin-top:5px;margin-bottom:5px;width:600px;">
                                        <label >Clave:</label>
                                        <input style="width:60px;margin-right:200px;" id="cve_variable" name="cve_variable" readonly onkeypress="return false;" onkeyup="return false;"/>
                                        <label >Agrupación:</label>
                                        <input  id="cve_variablepadre" name="cve_variablepadre" style="width:60px;clear:none;" onblur="VariablesExaminar.MostrarNombreVariable('svariablepadre', this.value);" onkeyup="VariablesExaminar.MostrarNombreVariable('svariablepadre', this.value);"/>
                                        <label  id="svariablepadre" style="float:left;width:400px;color:#000;height:25px;clear:none;margin:6px;"/>
                                    </span>
                                    <label>Descripción:</label>
                                    <input  style="width:230px;" id="descripcion" name="descripcion"/>
                                    <label >Valor:</label>
                                    <input style="width:100px;" id="valor" name="valor"/>
                                </div>
                                <hr  class="cleaner"/>
                                <div class="barra-botones">
                                    <span style="width:300px;">
                                        <button class="guardar btnFormularios" onclick="VariablesExaminar.Guardar()">Guardar</button>
                                        <button class="cancelar btnFormularios" onclick="RecorrerElemento('principal',0)">Salir</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                </div>
           </div>
       </div>
    <% } else {%>
        <item:comun runat="server" />
    <%}%>
    </body>
</html>
