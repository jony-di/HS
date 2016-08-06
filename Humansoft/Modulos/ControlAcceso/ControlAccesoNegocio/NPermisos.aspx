<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/ControlAccesoModelo/dboPermisos.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        switch (Request["op"])
        {
            case "Guardar": ResolverGuardar(); break;
            case "ObtenerJustificantes": Util.GetArchivos(Server.MapPath("~") + "/Expedientes/Empleados/" + Request["num_empleado"], "justificante_*_" + Request["cve_solicitudjusti"] + "_*.*").WriteXml(Response.OutputStream); break;
            case "ObtenerAcciones": oModelo.GenerarOperacionCX("ObtenerAcciones", "Permisos", new object[,] { { "Número de empleado", "num_empleadoPideInformacion", Session["num_empleado"], true, "string", 20 } }).WriteXml(Response.OutputStream); break;
            case "ObtenerCatalogo": oModelo.GenerarOperacionCX("ObtenerCatalogo", "Permisos", new object[,] { { "Clave de usuario", "cve_usuario", Session["cve_usuario"], true, "int", 0 } }).WriteXml(Response.OutputStream); break;
            case "ActualizarEstatus": oModelo.GenerarOperacionCX("ActualizarEstatus", "Permisos", new object[,] { { "Número de empleado", "num_empleado", Session["num_empleado"], true, "string", 20 } }).WriteXml(Response.OutputStream); break;
            default : oModelo.GenerarOperacionCX(Request["op"], Request["seccion"]).WriteXml(Response.OutputStream); break;
        }
    }

    private void ResolverGuardar() {
        DataSet dsRestricciones = oModelo.GenerarOperacionCX("ObtenerRestriccionesSolicitud", "Permisos");
        bool requiereEscaneo = true;//Default
        try { requiereEscaneo = bool.Parse(dsRestricciones.Tables[0].Rows[0]["requiereEscaneo"].ToString()); }catch(Exception exc){}
        DataSet ds = oModelo.GenerarOperacionCX(Request["sub_op"], "Permisos", new object[,]{
            { "Archivo adjunto", "justificante",Request.Files["justificante"],((Request["sub_op"]=="Nuevo") && requiereEscaneo),"file|.jpg,.png,.jpeg,.gif,.ico|justificante_" + DateTime.Now.ToString("ddMMyy") + "_" + Request["cve_solicitudjusti"] + "|" + Server.MapPath("~") + "\\Expedientes\\Empleados\\" + Request["num_empleado"] + "\\|justificante", 700}//700 kb como maximo tamaño para archivo
            ,{ "Clave de usuario", "num_emplcreo", Session["cve_usuario"] ?? 0, true, "int", 0 }
        });
        
        Response.ContentType = "text/html";
        string estatus = "-1"; string mensaje = "";
        try
        {
            estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
            mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
        }
        catch (Exception ex)
        {
            mensaje = "Error: " + ex.Message;
        }
        Response.Write(String.Concat("<script>",
            "var estatus=" + estatus + ";",
            "var mensaje=\"" + mensaje.Replace("\"", "'") + "\";",
            "window.parent." + Request["proceso"] + "(estatus,mensaje);",
            "</" + "script>"
        ));
    }
    
    </script>

