<%@ Control Language="C#" %>
    
    <style>
        fieldset.info{margin-bottom:20px;}
        fieldset.info table{margin-bottom:20px;width:100%;}
        fieldset.info table th:first-child{border-right:0px;}
        fieldset.info table th{background-color:#7892C2;color:#fff;padding:5px;border-left:1px solid #496089;}
        fieldset.info table td{text-align:center;border-bottom:1px dashed #e9e9e9;padding:5px;}
        fieldset.info label{float:left;clear:left;height:25px;}
        fieldset.info span{float:left;clear:right;display:block;border-bottom:1px solid;height:25px;clear:both;width:100%;font-weight:bolder;}
        fieldset .columnaI, fieldset .columnaD{float:left;width:45%;overflow:hidden;padding-right: 20px;}
        fieldset .columnaD{float:right;}
        hr{clear:both;border:1px solid #e9e9e9;}
    </style>
    
    <script>
        $(function () {
            try{
                var num_empleado = document.getElementById("num_empleado").innerHTML;
                ObtenerEncabezadoGrlEmpledo(num_empleado);
            }catch(e){}
        });

        function ObtenerEncabezadoGrlEmpledo(idEmpleado) {
            try { PonerEnEspera(); } catch (e) { }
            var metodo = { op: "ObtenerEncabezadoEmpleado", seccion: 'Comunes', num_empleado: idEmpleado };
            $.post("/Modulos/Seguridad/SeguridadNegocio/NSeguridad.aspx", metodo).done(function (xmlDoc) {
                try { QuitarEspera(); } catch (e) { }
                var nombre = SetValor(xmlDoc, "nombre", "nombre");
                var departamento = SetValor(xmlDoc, "departamento", "departamento");
                var puesto = SetValor(xmlDoc, "puesto", "puesto");
                var fechaIngreso = SetValor(xmlDoc, "fechaIngreso", "fechaIngreso");
                var lugarTrabajo = SetValor(xmlDoc, "lugarTrabajo", "lugarTrabajo");
            }).always(function () {
                try { QuitarEspera(); } catch (e) {}
            });
        }
    </script>

    <div class="columnaI">
        <label>Num. empleado:</label> 
        <span id="num_empleado"><%=Request["num_empleado"]??Session["num_empleado"]%></span>
        <label>Nombre:</label> 
        <span id="nombre"></span>                                        
        <label>Departamento:</label> 
        <span id="departamento"></span>                                   
    </div>
    <div class="columnaD">                                   
        <label>Fecha de Ingreso:</label> 
        <span id="fechaIngreso"></span>
        <label>Lugar de trabajo:</label> 
        <span id="lugarTrabajo"></span>
        <label>Puesto:</label> 
        <span id="puesto"></span>                                                                    
    </div> 
    
