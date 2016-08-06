<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/SeguridadModelo/dboRegion.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        switch (Request["op"])
        {
            default: oModelo.GenerarOperacionCX(Request["op"], "Region").WriteXml(Response.OutputStream); break;   
        }     
    }
    
    </script>

