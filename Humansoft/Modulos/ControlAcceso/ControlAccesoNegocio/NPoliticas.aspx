<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/ControlAccesoModelo/dboPoliticas.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        switch (Request["op"])
        {
            default : oModelo.GenerarOperacionCX(Request["op"], Request["seccion"]).WriteXml(Response.OutputStream); break;
        }
    }
</script>
