<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/VacacionesModelo/dboDiasFeriados.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        switch (Request["op"]){
            case "SolicitudVacaciones": { Util.ResponderPDF(Util.generarDocumentoPdf("solicitudvacaciones", Server.MapPath("~") + "/Modulos/Vacaciones/PlantillasXML/solicitud_vacaciones_1.0.xml", new object[,] { })); }; break;                
        }      
    }

</script>