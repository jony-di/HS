<%@ Control Language="C#" %>
    
    <style>
        fieldset.info{margin-bottom:20px;}
        fieldset.info table{margin-bottom:20px;width:100%;}
        fieldset.info table th:first-child{border-right:0px;}
        fieldset.info table th{background-color:#7892C2;color:#fff;padding:5px;border-left:1px solid #496089;}
        fieldset.info table td{text-align:center;border-bottom:1px dashed #e9e9e9;padding:5px;}
        fieldset.info label{float:left;clear:left;height:25px;}
        fieldset.info span{float:left;clear:right;display:block;border-bottom:1px solid;height:25px;clear:both;width:100%;font-weight:bolder;}
        fieldset .columnaI, fieldset .columnaD{float:left;width:370px;overflow:hidden;}
        fieldset .columnaD{float:right;}
        hr{clear:both;border:1px solid #e9e9e9;}
    </style>

    <div class="columnaI">
        <label>Nombre:</label> 
        <span id="nombre"></span>                                        
        <label>Departamento:</label> 
        <span id="departamento"></span>
        <label>Puesto:</label> 
        <span id="puesto"></span>                                    
    </div>
    <div id="num_solicitud_w" class="columnaD">                                         
        <label>Fecha de solicitud:</label> 
        <span id="fechaSolicitud"></span>
    </div>
    <div class="columnaD">                                   
        <label>Fecha de Ingreso:</label> 
        <span id="fechaIngreso"></span>
        <label>Lugar de trabajo:</label> 
        <span id="lugarTrabajo"></span>                                                                   
    </div> 
    <hr class="seperador-v" />
    <div class="columnaI" id="diasDerechoVac">
        <label class="l-unica" >Dias con derecho  a descanso: <b class="btnFormularios peque" class="resaltado" title="Ver detalle" onclick="MostrarDesglosePeriodos('<%=Request["num_empleado"]%>');">..</b></label> 
        <span class="dias-seleccionados bordeado" id="diasDerecho">--</span>                                
    </div> 
