<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/ControlAccesoModelo/dboControlAcceso.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        
        switch (Request["op"])
        {
            case "ProcesarEmpleadosPeriodo": ProcesarEmpleadosPeriodo(); break;
            case "ObtenerDesgloseEventosPeriodo": ObtenerDesgloseEventosPeriodo(); break;
            case "ConsultarResumenPeriodo": ObtenerResumenEventosPeriodo(); break;
            case "ConsultarProcesosDescuento": ConsultarProcesosDescuento(); break;
            case "ExportarCSVDesglose": ExportarCSVDesglose(); break;
            default : oModelo.GenerarOperacionCX(Request["op"], Request["seccion"]).WriteXml(Response.OutputStream); break;
        }
        
    }

    public void ProcesarEmpleadosPeriodo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                  { "Clave usuario", "cve_usuario",Session["cve_usuario"] ,true,"int", 0}
                 ,{ "Fecha inicio", "fechaInicial", Request["fechaInicial"],true,"string", 20}
                , { "Fecha inicio", "fechaFinal", Request["fechaFinal"],true,"string", 20}
            }
            , "[PA_CTR_TProcesarEmpleadosPeriodo]"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void ObtenerDesgloseEventosPeriodo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] {                 
                  { "Clave usuario", "cve_usuario",Session["cve_usuario"] ,true,"int", 0}
                 ,{ "Número de empleado", "num_empleado", Request["num_empleado"],true,"string",20}
                , { "Fecha inicio", "fechaInicial", Request["fechaInicial"],true,"string", 20}
                , { "Fecha fin", "fechaFinal", Request["fechaFinal"],true,"string", 20}
            }
            , "PA_CTR_CDesgloseEventosPeriodo"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void ExportarCSVDesglose()
    {
        if (Session["cve_usuario"] == null){

            Response.Clear();
            Response.ContentType = "text/html";
            Response.Write("<" + "script>window.top.location.href='/';<" + "/script>");
        }
        else
        {
            DataSet ds = oModelo.GenerarOperacionCX("ObtenerDesglosePeriodo", "Comunes",
                new object[,] {
                  { "Clave usuario", "cve_usuario",Session["cve_usuario"] ,true,"int", 0}
                 ,{ "Número de proceso", "num_proceso", Request["num_proceso"],false,"string",20}
            }
            );

            Response.Clear();
            Response.Buffer = true;

            Response.AddHeader("content-disposition", "attachment;filename=DesglosePeriodo.csv");
            Response.Charset = "";
            Response.ContentType = "application/text";
            Response.Output.Write(Util.DataTableToCsv(ds.Tables[0]));
            Response.Flush();
            Response.End();
        }        
    }

    public void ObtenerResumenEventosPeriodo()
    {
        DataSet ds = new Modelo().GenerarOperacion(
            new object[,] { 
                    { "Clave usuario", "cve_usuario",Session["cve_usuario"] ,true,"int", 0}
                   ,{ "Número de empleado", "num_empleado", Request["num_empleado"],false,"string",20}
                   ,{ "Número de proceso", "num_proceso", Request["num_proceso"],false,"string",20}
            }
            , "PA_CTR_CResumenEventosPeriodo"
        );
        ds.WriteXml(Response.OutputStream);
    }

    public void ConsultarProcesosDescuento()
    {
        DataSet ds = oModelo.GenerarOperacionCX("ConsultarProcesosDescuento", "Comunes",
            new object[,] {
                  { "Clave usuario", "cve_usuario",Session["cve_usuario"] ,true,"int", 0}
            }
        );
        ds.WriteXml(Response.OutputStream);
    }
    
    </script>

