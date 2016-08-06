<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/ContratacionModelo/dboCatalogoVacantes.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        string seccion = Request["seccion"];
        string op=Request["op"];
        if (!string.IsNullOrEmpty(seccion) &&  !string.IsNullOrEmpty(op))
        {
            oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Clave de usuario", "usuario", Session["cve_usuario"], true, "int", 0 } }).WriteXml(Response.OutputStream); 
            
        }else{}
    }
    
    
</script>
