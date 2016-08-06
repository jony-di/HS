<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="HumansoftServer"%>
<script runat="server">
    
    Modelo oModelo = new Modelo("/ContratacionModelo/dboExamenes.xml");
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        
        switch (Request["op"])
        {
            case "NuevaPregunta": GuardarPregunta("Nuevo"); break;
            case "EditarPregunta": GuardarPregunta("Editar"); break;
            case "NuevaRespuesta": GuardarRespuesta("Nuevo"); break;
            case "EditarRespuesta": GuardarRespuesta("Editar"); break;
            case "ObtenerExamen": ObtenerExamen(); break;
            case "PublicarExamen": PublicarExamen(); break;
            case "ObtenerRespuestasCandidato": ObtenerRespuestasCandidato(); break;
            case "ObtenerCatalogoVariables": ObtenerCatalogoVariables();break;
            default: oModelo.GenerarOperacionCX(Request["op"], Request["seccion"]??"Examen").WriteXml(Response.OutputStream); break;
        }
    }

    public void ObtenerCatalogoVariables() {
        DataSet ds = oModelo.GenerarOperacionCX("ObtenerCatalogo", "VariablesExaminar");
        ds.DataSetName = "Variables";
        try
        {
            ds.Tables[0].TableName = "UnaVariable";
            DataRelation CatVars = ds.Relations.Add("CatVars", ds.Tables[0].Columns["cve_variable"], ds.Tables[0].Columns["cve_variablepadre"]);
            CatVars.Nested = true;
        }
        catch (Exception e) {}
        ds.WriteXml(Response.OutputStream);
    }
    
    public void ObtenerRespuestasCandidato(){
        DataSet ds = new DataSet();
        try
        {
            HumansoftServer.WSHumansoftPublico.WSExamenes wsExamenes = new HumansoftServer.WSHumansoftPublico.WSExamenes();
            ds = wsExamenes.ObtenerRespuestasCandidato(Request["cve_candidato"].ToString(), int.Parse(Request["cve_examen"]), int.Parse(Request["cve_vacante"]));
            Modelo.InsertaRegistrosEnTablas(ds);
            ds = oModelo.GenerarOperacionCX("ObtenerRespuestasCandidato", "Examen", new object[,]{
                    { "Usuario", "cve_candidato", Request["cve_candidato"].ToString(), true, "string", 50 }
                ,{ "Clave de exámen", "cve_examen", int.Parse(Request["cve_examen"]), true, "int", 0}
                ,{ "Clave de vacante", "cve_vacante", int.Parse(Request["cve_vacante"]), true, "int", 0}
            });
            if (ds.Tables[0].Columns[0].ColumnName != "estatus")
            {
                ds.DataSetName = "ExamenCandidato";
                ds.Tables[0].TableName = "Pregunta";
                ds.Tables[1].TableName = "Respuesta";
                DataRelation rel = ds.Relations.Add("PregResp", new DataColumn[2] { ds.Tables[0].Columns["cve_examen"], ds.Tables[0].Columns["cve_pregunta"] }, new DataColumn[2] { ds.Tables[1].Columns["cve_examen"], ds.Tables[1].Columns["cve_pregunta"] });
                rel.Nested = true;
            }
        }catch(Exception e){
            ds = EstatusOperacion.agregarEstatusOperacion(-1, e.Message);
        }
        ds.WriteXml(Response.OutputStream);
    }
    
    public void PublicarExamen()
    {
        DataSet ds= oModelo.GenerarOperacionCX("ObtenerTablasExamenes", "Examen");
        if (ds.Tables[0].Columns[0].ColumnName=="estatus" && int.Parse(ds.Tables[0].Rows[0][0].ToString()) < 1){
            ds.WriteXml(Response.OutputStream);
        }else{
            HumansoftServer.WSHumansoftPublico.WSExamenes wsExamenes = new HumansoftServer.WSHumansoftPublico.WSExamenes();
            string[] resultado = wsExamenes.InsertaRegistrosEnTablas(ds);
            
            if (resultado != null){
                EstatusOperacion.agregarEstatusOperacion(Convert.ToInt16(resultado[0]), resultado[1].ToString()).WriteXml(Response.OutputStream);
            }else{
                EstatusOperacion.agregarEstatusOperacion(-1, "El servidor de publicación no respondió.").WriteXml(Response.OutputStream);
            }
        }
    }

    
    public void ObtenerExamen() {
        DataSet ds = new DataSet();
        DataTable dtPreguntas = oModelo.GenerarOperacionCX("ObtenerPreguntas", "Preguntas").Tables[0].Copy();
        DataTable dtAgrupaciones = oModelo.GenerarOperacionCX("ObtenerAgrupaciones", "Respuestas").Tables[0].Copy();
        DataTable dtRespuestas = oModelo.GenerarOperacionCX("ObtenerRespuestas", "Respuestas").Tables[0].Copy();
        DataTable dtColRespuestas = oModelo.GenerarOperacionCX("ObtenerColRespuestas", "Columnas").Tables[0].Copy();
        ds.DataSetName="Examen";
        dtPreguntas.TableName = "Pregunta";
        ds.Tables.Add(dtPreguntas);
        dtAgrupaciones.TableName = "Agrupacion";
        ds.Tables.Add(dtAgrupaciones);
        dtRespuestas.TableName = "Respuesta";
        ds.Tables.Add(dtRespuestas);
        dtColRespuestas.TableName = "ColRespuesta";
        ds.Tables.Add(dtColRespuestas);
        DataColumn[] dcsA = new DataColumn[2] { dtPreguntas.Columns["cve_examen"], dtPreguntas.Columns["cve_pregunta"] };
        DataColumn[] dcsB = new DataColumn[2] { dtAgrupaciones.Columns["cve_examen"], dtAgrupaciones.Columns["cve_pregunta"] };

        DataColumn[] dcsC = new DataColumn[3] { dtAgrupaciones.Columns["cve_examen"], dtAgrupaciones.Columns["cve_pregunta"], dtAgrupaciones.Columns["cve_grupo"]};
        DataColumn[] dcsD = new DataColumn[3] { dtRespuestas.Columns["cve_examen"], dtRespuestas.Columns["cve_pregunta"], dtRespuestas.Columns["cve_grupo"] };

        DataColumn[] dcsE = new DataColumn[2] { dtColRespuestas.Columns["cve_examen"], dtColRespuestas.Columns["cve_pregunta"] };
        
        if (dtPreguntas.Columns["cve_examen"] != null && dtPreguntas.Columns["cve_pregunta"] != null && dtRespuestas.Columns["cve_examen"] != null && dtRespuestas.Columns["cve_pregunta"] != null) {
            try
            {
                DataRelation PregAgrup = ds.Relations.Add("PregAgrup", dcsA, dcsB);
                PregAgrup.Nested = true;
                DataRelation AgrupResp = ds.Relations.Add("AgrupResp", dcsC, dcsD);
                AgrupResp.Nested = true;
                if (dtColRespuestas.Columns["cve_examen"] != null)
                {
                    DataRelation ColResp = ds.Relations.Add("ColResp", dcsA, dcsE);
                    ColResp.Nested = true;
                }
            }
            catch (Exception e) { }
        }
        ds.WriteXml(Response.OutputStream);
    }

    public void GuardarPregunta(string op) {
        DataSet ds = oModelo.GenerarOperacionCX(op, "Preguntas", new object[,] { { "Archivo adjunto", "adjunto", Request.Files["adjunto"], false, "file|.jpg,.png,.jpeg|foto_" + Request["cve_pregunta"] + "|" + Server.MapPath("~") + "\\Modulos\\Contrataciones\\ContratacionUI\\imagenes\\", 800 } });
        Response.ContentType = "text/html";
        string estatus = "-1"; string mensaje = "", cve_examen = "", cve_pregunta="";
        try
        {
            estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
            mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
        }catch (Exception ex){}
        
        try{
            cve_examen = ds.Tables[0].Rows[0]["cve_examen"].ToString();
            cve_pregunta = ds.Tables[0].Rows[0]["cve_pregunta"].ToString();
        }
        catch (Exception ex){}
        Response.Write(String.Concat("<script>",
            "var estatus=" + estatus + ";",
            "var mensaje=\"" + mensaje.Replace("\"", "'") + "\";",
            "var cve_examen=\"" + cve_examen.Replace("\"", "'") + "\";",
            "var cve_pregunta=\"" + cve_pregunta.Replace("\"", "'") + "\";",
            "window.parent.Preguntas.HandlerGuardarPregunta(estatus,mensaje,cve_examen,cve_pregunta);",
            "</" + "script>"
        ));
    }

    public void GuardarRespuesta(string op)
    {
        DataSet ds = oModelo.GenerarOperacionCX(op, "Respuestas", new object[,] { { "Archivo adjunto", "adjunto", Request.Files["adjunto"], false, "file|.jpg,.png,.jpeg|foto_" + Request["cve_pregunta"] + "|" + Server.MapPath("~") + "\\Modulos\\Contrataciones\\ContratacionUI\\imagenes\\", 800 } });
        Response.ContentType = "text/html";
        string estatus = "-1"; string mensaje = "", cve_examen = "", cve_pregunta = "";
        try
        {
            estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
            mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
        }catch (Exception ex) { }

        try{
            cve_examen = ds.Tables[0].Rows[0]["cve_examen"].ToString();
            cve_pregunta = ds.Tables[0].Rows[0]["cve_pregunta"].ToString();
        }catch (Exception ex) { }
        Response.Write(String.Concat("<script>",
            "var estatus=" + estatus + ";",
            "var mensaje=\"" + mensaje.Replace("\"", "'") + "\";",
            "var cve_examen=\"" + cve_examen.Replace("\"", "'") + "\";",
            "var cve_pregunta=\"" + cve_pregunta.Replace("\"", "'") + "\";",
            "window.parent.Preguntas.HandlerGuardarPregunta(estatus,mensaje,cve_examen,cve_pregunta);",
            "</" + "script>"
        ));
    }
    
    </script>

