<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/ControlAccesoModelo/dboFlujos.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        if (seccion != null)
        {
            switch (Request["op"])
            {
                default : oModelo.GenerarOperacionCX(Request["op"], Request["seccion"]).WriteXml(Response.OutputStream); break;
            }
        }else{}
    }
    
    </script>

