﻿<%@ Page Language="C#" %>
<%@ Import Namespace="HumansoftServer" %>
<%
    //string a = new Encripta().Encriptar("123");
    //string b = new Encripta().DesEncripta("7i:ª>‹;n86");
    
    if (Validacion.ValidarPermisoMenu(Request.Url,Session["cve_usuario"])){    
        
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="../../../Recursos/jqueryui/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/arbolmenu.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/css/tema.css" rel="stylesheet" type="text/css" />
    <link href="../../../Recursos/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <link href="css/posiciones.css" rel="stylesheet" type="text/css" />
    <link href="css/arbolposiciones.css" rel="stylesheet" type="text/css" />
    <link href="css/estructura.css" rel="stylesheet" type="text/css" />

    <script src="../../../Recursos/js/jquery-2.1.3.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/jqueryui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="../../../Recursos/js/SeleccionSecuencial.js" type="text/javascript"></script>
    <script src="../../../Recursos/fancybox/jquery.fancybox.js" type="text/javascript"></script>
    <script src="js/estructuras.js" type="text/javascript"></script>
    <script src="js/posiciones.js" type="text/javascript"></script>
    <script src="js/arbolposiciones.js" type="text/javascript"></script>
    
</head>
<body oncontextmenu="return false;" onload="iniciar('<%=Request["callback"]%>'<%=((Request["nivelTabular"]==null)?"": "," + Request["nivelTabular"]) + ((Request["estatus"]==null)?"": ",'" + Request["estatus"] + "'")%>)">
    <div id="inicio" >
            <div class="mascara">
                <div class="principal" id="principal">
                    <div class="catalogo">
                        <div class="smart-green">
                            <h2 class="encabezadoformulario">                                                                                  
                                <%if (Request["esSeleccion"] != null)
                                  {%>                                
                                Seleccione la nueva posición que ocupara el empleado
                                <button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',<%=(Request["offset"]!=null)?Request["offset"] : "-900"%>);">Regresar</button>
                                <% }
                                  else
                                  { %>                                  
                                    Administración de Posiciones   
                                <%}%>
                            </h2>
                            <div id="busqueda">
                                <fieldset class="filtros-posiciones" id="filtrosPosiciones">
                                    <legend>Consulta de posiciones</legend>
                                    <button class="btnFormularios criterio" onclick="ToggleMenu('criteriosBusqueda')" id="criterioBusqueda"> Agregar Criterio ..</button> 
                                    <div class="wrap-menu-criterio" >                                 
                                            <div class="opciones-menu" style="display:none;" id="criteriosBusqueda">
                                                <ul>
                                                    <li onclick="AgregarCriterio('Posición','num_plantilla','criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Posición</li>
                                                    <li onclick="AgregarCriterio('Tipo de posición','tipoplantilla', 'criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NTipoPlantilla.aspx?op=obtenerCatalogoTipoPlantilla&pagina=1&longitudPagina=1000&cve_tipoplantilla=0&criterio=' ,'Tipo plantilla','descripcion','cve_tipoplantilla');ToggleMenu('criteriosBusqueda');">Tipo de Posición</li>
                                                    <li onclick="AgregarCriterio('Puesto','cve_puesto','criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NPuestosGenericos.aspx?op=ObtenerCatalogoPuestosGenericos&pagina=1&longitudPagina=1000&cve_puesto=0&criterio=' ,'Puesto','nombre_puesto','cve_puesto');ToggleMenu('criteriosBusqueda');">Puesto</li>
                                                    <li onclick="AgregarCriterio('departamento','cve_departamento', 'criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NDepartamento.aspx?op=obtenerCatalogoDepartamento&pagina=1&longitudPagina=1000&cve_departamento=0&criterio=' ,'Departamento','nombredep','cve_departamento');ToggleMenu('criteriosBusqueda');">Departamento</li>
                                                    <li onclick="AgregarCriterio('Empleado','id_empleado','criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Empleado</li>
                                                    <li onclick="AgregarCriterio('Tabulador','tabulador','criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Tabulador</li>
                                                    <%if (Request["nivelTabular"] == null){%>
                                                    <li onclick="AgregarCriterio('Estatus','estatus','criteriosPosiciones','select','/Modulos/Estructuras/EstructurasNegocio/NEstatusplan.aspx?op=ObtenerCatalogoEstatusPosicion&pagina=1&longitudPagina=1000&estatus=0&criterio=' ,'Estatus','descripcion','estatus');ToggleMenu('criteriosBusqueda');">Estatus</li>
                                                    <li onclick="AgregarCriterio('Nivel tabular','niveltabular','criteriosPosiciones');ToggleMenu('criteriosBusqueda');">Nivel tabular</li>
                                                    <%}%>
                                                </ul>     
                                            </div>
                                        </div>                                    
                                    <form id="criteriosPosiciones" class="frm-criterios-busqueda" onsubmit="return false;"></form>
                                </fieldset>
                                <span class="botones-posiciones">
                                <img class="btnUpdate" src="/Recursos/imagenes/reload.png" onclick="ActualizarPosiciones();"/>                                                                                  
                                <%if (Request["esSeleccion"] == null)
                                  {%>
                                    <button class="btn" id="btnagregar" onclick="MostrarNuevaPosicion()">Agregar</button>
                                    <button class="btn" id="btnexportar" onclick="MostrarExportar()">Exportar</button>
                                    <%}%>
                                </span>
                                <hr class="cleaner"/>
                                <div class="arbol-posiciones" style="width:100%;">
                                    <div class="tree-posiciones" id="arbolPosiciones"></div>
                                </div>                                
                            </div>                                                       
                        </div>
                    </div>

                    <div class="detalle-posicion formulario" id="exportarPlantilla" style="display:none;">   
                        <form id="frmExportar" onsubmit="return false;">                     
                        <div class="alinear smart-green">
                            <h2 class="nivelpuesto encabezadoformulario" >Exportar diagrama de posiciones (plantilla)</h2>
                            <div  id="notificacion-b" class="alert-box error ocultar"><span>.</span></div>
                            <div class="wrap-posiciones">
                            <div class="izq">
                                <input type="checkbox"/>
                                <label>Número de posición:</label>
                                <input type="checkbox"/>
                                <label>Número de posición jefe:</label>
                                <input type="checkbox"/>
                                <label>Nombre:</label>
                                <input type="checkbox"/>  
                                <label>Foto:</label>                             
                            </div>   
                            <div class="der">
                                <input type="checkbox"/>
                                <label>Número de posición:</label>
                                <input type="checkbox"/>
                                <label>Número de posición jefe:</label>
                                <input type="checkbox"/>
                                <label>Nombre:</label>
                                <input type="checkbox"/>  
                                <label>Foto:</label>                             
                            </div> 
                            </div>              
                             <div class="barra-botones">
                                <span>
                                    <button class="guardar btnFormularios" onclick="Guardar()">Guardar</button>
                                    <button class="cancelar btnFormularios" onclick="MostrarCatalogo()">Salir</button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div> 
                <div class="detalle-posicion formulario" id="wrapFormulario">                 
                    <div class="alinear smart-green">
                    <h2 class="posicion encabezadoformulario">                                                                                
                        <%if (Request["esSeleccion"] != null)
                          {%>                                
                           Descripción de la posición<button class="btnFormularios regresar" onclick="window.parent.DesplazarElemento('principal',-900);">Regresar</button>
                        <% }
                          else
                          {%>
                        Editar posición

                        <div class="OpcionesPosiciones">
                            <span class="btnFormularios menu-up" onclick="ToggleMenu('opcionesPosiciones');"><a class="nombre">Movimientos ..</a> </span>
                            <div class="opciones-menu" style="display:none" id="opcionesPosiciones">
                                <ul>                        
                                    <li onclick="try{AsignarEmpleadoPosicion(this);}catch(e){}ToggleMenu('opcionesPosiciones');" >Asignar empleado a la posición ..</li>
                                    <li onclick="try{RemoverEmpleadoVacante(this);}catch(e){}ToggleMenu('opcionesPosiciones');">Remover empleado de la posición ..</li>
                                    <li onclick="try{MoverEmpleadoPosicion(this,'ENROQUE_POSICION', 'ENROQUE DE POSICIÓN');}catch(e){}ToggleMenu('opcionesPosiciones');">Enroque de la posición ..</li>
                                    <li onclick="try{SuspenderPosicion(this);}catch(e){}ToggleMenu('opcionesPosiciones');">Suspender Posición</li>
                                    <li onclick="try{LiberarPosicion(this);}catch(e){}ToggleMenu('opcionesPosiciones');">Liberar posición</li>
                                    <li onclick="try{CancelarPosicion(this);}catch(e){}ToggleMenu('opcionesPosiciones');">Cancelar posición</li>
                                    <hr/><li class="titulo"><h3>Cambiar a una posición vacante</h3></li>
                                    <li onclick="try{MoverEmpleadoPosicion(this,'DEMOSION', 'DEMOSION');}catch(e){}ToggleMenu('opcionesPosiciones');">Demosión</li>
                                    <li onclick="try{MoverEmpleadoPosicion(this,'MOVIMIENTO_LATERAL','MOVIMIENTO LATERAL');}catch(e){}ToggleMenu('opcionesPosiciones');">Lateral</li>
                                    <li onclick="try{MoverEmpleadoPosicion(this,'PROMOCION', 'PROMOCIÓN');}catch(e){}ToggleMenu('opcionesPosiciones');">Promoción</li><hr/>
                                </ul>     
                            </div>
                        </div>                        
                        <%} %>
                    </h2>
                    <div  id="notificacion" class="alert-box error ocultarV"><span id="mensaje-alerta"></span></div> 
                    <form id="frmNuevaPosicion" onsubmit="return false">      
                        <div class="wrap-posiciones">
                                <div class="columnaI">
                                    <fieldset><legend>Posición:</legend>
                                        <div class="agrupacion">
                                            <label class="numplantilla" style="width:50px;">Número:</label> 
                                            <input id="numplantilla" name="num_plantilla" class="numplantilla" style="width:40px;" maxlength="79"  readonly onkeypress="return false;" onkeydown="return false;"/>
                                            <b id="sPuesto" class="lblextra" style="width:200px;"></b>
                                        </div>
                                        
                                        <div class="agrupacion" style="margin-top:15px;">
                                            <%if (Request["esSeleccion"] != null)
                                              {%>                                
                                               <label class="numplantilladep"> Posición Jefe:</label> 
                                            <% }
                                              else
                                              {%>
                                            <button class="btnFormularios" onclick="MostrarPosicionJefe();" style="width:30px;" title="Ver la posición Jefe"><img src="/Recursos/imagenes/go_up.png" /></button><label class="numplantilladep"  style="width:50px;" > Posición Jefe:</label> 
                                            <%} %>
                                            <input id="numplantilladep" style="width:40px;" name="num_plantilladep" class="numplantilladep" maxlength="79" placeholder="Num Plantilla" readonly onkeypress="return false;"  onkeydown="return false;"/>
                                            <b id="sPuestoJefe" class="lblextra"  style="width:170px;"></b>
                                        </div>

                                        <label class="costos">Centro de Costos:</label> 
                                        <input id="costos" name="c_costos" class="costos" maxlength="79" /> 
                                        <label class="estatus">Estatus:</label> 
                                        <input id="estatus" name="estatus" class="estatus" maxlength="79" style="display:none;" />
                                        <input id="s_estatus" name="s_estatus" class="estatus" maxlength="79" />
                                        <label class="vigencia">Vigencia:</label> 
                                        <input id="vigencia" name="Vigencia" class="vigencia" maxlength="79"  />
                                        <label class="tipoplantilla">Tipo</label> 
                                        <select id="tipoplantilla" name="tipoplantilla" class="tipoplantilla" readonly type="text"></select> 
                                        <label class="segmento">Segmento</label> 
                                        <select id="segmento" name="segmento" class="segmento" readonly type="text"></select>
                                        <label class="turno">Turno</label> 
                                        <select id="turno" name="turno" class="turno" readonly type="text"></select>
                                        <label class="fampuesto">Familia Puesto</label> 
                                        <select id="fampuesto" name="Fampuesto" class="fampuesto" readonly type="text"></select>
                                        <label class="telefono">Teléfono</label> 
                                        <input id="telefono" name="telefono" class="telefono"  maxlength="79" />
                                        <label class="ext">Ext.</label> 
                                        <input id="ext" name="ext" class="ext"  maxlength="79" />
                                        <div class="agrupacion">
                                            <label class="politicaVacaciones">Política de Vacaciones</label> 
                                            <input id="politicaVacaciones" name="cve_politica" type="hidden" />
                                            <input id="spoliticaVacaciones" class="politicaVacaciones conBoton"  maxlength="79"  readonly onkeypress="return false;"  onkeydown="return false;" />
                                            <button class="btnFormularios peque" onclick="MostrarSeleccionPoliticasVacaciones();">..</button>                                        
                                        </div>
                                        <label class="lugarTrabajo">Lugar de Trabajo</label> 
                                        <select id="lugarTrabajo" name="cve_lugar" class="lugarTrabajo"></select>
                                     </fieldset>  
                                     <fieldset class="fldsetMT"><legend></legend>
                                        <label class="zonacara">% Zona Cara</label> 
                                        <input id="zonacara" name="zonacara" class="zonacara"  maxlength="79" />
                                        <label class="grupopago">GrupoPago</label> 
                                        <select id="grupopago" name="cve_grupopago" class="grupopago" readonly type="text" onkeypress="return false;"  onkeydown="return false;"></select>
                                        <label class="ubn">UBN</label> 
                                        <input id="ubn" name="ubn" class="ubn" maxlength="79"/>
                                        <label class="nivel">Nivel</label> 
                                        <input id="nivel" name="nivel" class="nivel" readonly type="text" />
                                        <label class="puntos">Puntos</label> 
                                        <input id="puntos" name="puntoshay" class="puntos"  maxlength="79" />
                                        <label class="q">Q</label> 
                                        <input id="q" name="q" class="q"  maxlength="79" />
                                    </fieldset>
                                    <!--
                                        <label class="consecutiv">Consecutiv</label> 
                                        <input id="consecutiv" name="consecutiv" class="consecutiv"  maxlength="79" />
                                        <label class="sindicato">Sindicalizado</label> 
                                        <input id="sindicato" name="Sindicalizado" class="sindicato"  maxlength="79" />
                                        <label class="ejecutivo">Ejecutivo</label> 
                                        <input id="ejecutivo" name="Ejecutivo" class="ejecutivo"  maxlength="79" />                                       
                                        <label class="dgaagrup">DGA_Agru</label> 
                                        <select id="dgaagru" name="dga_agru" class="dgaagrup" maxlength="79"></select> 
                                    -->
                               </div>
                               <div class="columnaD"> 
                               
                                    <fieldset><legend>Empleado</legend>
                                        <label class="nombreEmpleado">Nombre:</label> 
                                        <input id="nombreEmpleado" class="nombreEmpleado" maxlength="79" readonly/>  
                                        <label class="idempleado">IdEmpleado</label> 
                                        <input id="idempleado" name="id_empleado"  class="idempleado" maxlength="79" readonly/>
                                        <label class="headcount">Total de subordinados</label> 
                                        <input id="headcount" name="headcount" class="headcount" maxlength="79"/>
                                        <label class="headcountocup">Posiciones ocupadas</label> 
                                        <input id="headcountocup" name="headcountocup" class="headcountocup"  maxlength="79"/>
                                    </fieldset>

                                    <fieldset class="fldsetMT"><legend>Actividad Laboral</legend>                          
                                        <label class="empresa">Empresa</label> 
                                        <select id="empresa" name="cve_empresa" class="empresa" readonly type="text"  onchange="LlenarCatalogoDga(document.getElementById('dgaagru'),undefined, this.options[this.selectedIndex].value);LimpiarTabulador();"></select>
                                        
                                        <label class="direcplantilla">Dirección General</label>                                    
                                        <select id="dgaagru" name="dga_agru" class="direcplantilla" onchange="LlenarCatalogoDepartamento(document.getElementById('departamento'),undefined, this.options[this.selectedIndex].value);LimpiarTabulador();"></select>
                                        <label class="departamento">Departamento</label> 
                                        <select id="departamento" name="cve_departamento" class="departamento" onchange="LlenarCatalogoPuestosDepartamento(document.getElementById('puesto'),undefined,this.options[this.selectedIndex].value);LimpiarTabulador();" ></select>
                                        <label class="puesto">Puesto</label> 
                                        <select id="puesto" name="cve_puesto" class="puesto" onchange="SeleccionarTabulador(this.options[this.selectedIndex]);"></select>

                                        <div class="agrupacion c-lectura">
                                            <label class="tabulador">Tabulador</label> 
                                            <input id="tabulador" name="tabulador" type="hidden"  />
                                            <input id="stabulador" class="tabulador" readonly onkeypress="return false;"  onkeydown="return false;" />
                                            <label class="ntabulador">Nivel Tabulador</label> 
                                            <input id="ntabulador" name="niveltabular" class="ntabulador" maxlength="79"  readonly onkeypress="return false;"  onkeydown="return false;" />
                                        </div>

                                        <label class="area">Aréa</label> 
                                        <input id="area" name="area" class="area" maxlength="79" placeholder="Area" />
                                        <label class="division">División</label> 
                                        <input id="division" name="division" class="division" maxlength="79" />
                                        <label class="plaza">Plaza</label> 
                                        <input id="plaza" name="plaza" class="plaza" maxlength="79"  />
                                        <label class="actfuncional">Actividad funcional</label> 
                                        <input id="actfuncional" name="actfuncional" class="actfuncional"  maxlength="79" />
                                    </fieldset>                                
                                </div>                          
                        </div>                       
                        <div class="barra-botones">
                             <%if(Request["esSeleccion"]!=null){%>
                            <span id="btnSeleccionar">
                                <button class="guardar btnFormularios" onclick="SeleccionarPosicion()">Seleccionar</button>
                                <button class="cancelar btnFormularios" onclick="Cancelar()">Volver a posiciones</button>
                            </span>
                            <%}else{%>
                            <span>
                                <button class="guardar btnFormularios" onclick="GuardarPosicion()">Guardar</button>
                                <button class="cancelar btnFormularios" onclick="MostrarCatalogo()">Salir</button>
                            </span>                            
                            <%} %>
                        </div>
                    </form>                       
                </div>
            </div>
            <iframe id="pantallaAuxiliar" name="pantallaAuxiliar" class="pantallaAuxiliar" frameborder="0" scrolling="no" ></iframe>  
            <iframe id="pantallaAuxiliar2" name="pantallaAuxiliar2" class="pantallaAuxiliar" frameborder="0" scrolling="no" ></iframe>
            <iframe id="pantallaAuxiliar3" name="pantallaAuxiliar3" class="pantallaAuxiliar" frameborder="0" scrolling="no" ></iframe>    
        </div>
    </div>
    <%}else {%>
    <script>window.top.location.href = "/Modulos/Seguridad/SeguridadUI/default.htm";</script>
<%}%>   
</body>
</html>
