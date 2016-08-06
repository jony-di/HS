<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/SeguridadModelo/dboUsuarios.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        if (seccion != null)
        {
            switch (Request["op"])
            {
                case "Nuevo": oModelo.GenerarOperacionCX("Nuevo", seccion).WriteXml(Response.OutputStream); break;
                case "CambiarEstatusActivo": oModelo.GenerarOperacionCX("CambiarEstatusActivo", seccion).WriteXml(Response.OutputStream); break;
                case "obtenerCatalogo": oModelo.GenerarOperacionCX("obtenerCatalogo", seccion).WriteXml(Response.OutputStream); break;
                case "obtenerSiguienteClave": oModelo.GenerarOperacionCX("obtenerSiguienteClave", seccion).WriteXml(Response.OutputStream); break;
                case "Editar": oModelo.GenerarOperacionCX("Editar", seccion).WriteXml(Response.OutputStream); break;
                case "GuardarPuestosDepartamento": oModelo.GenerarOperacionCX("GuardarControles", seccion).WriteXml(Response.OutputStream); break;                
            }                      
        }else{}
    }
    
    </script>

