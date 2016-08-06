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
            switch (op)
            {
                case "nuevo":
                    DataSet ds=oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Clave de usuario", "usuario", Session["cve_usuario"], true, "int", 0 } });
                    string estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                    if (estatus.Equals("1") )
                    {
                        if (Request["agencia"] == "1")
                        {
                            //string destino;
                            DataSet dsVacantes = oModelo.GenerarOperacionCX("publicar", "publicaciones");
                            DataSet dsPerfil = oModelo.GenerarOperacionCX("obtenerPerfil", "publicaciones");
                            string html = crearHTML(dsPerfil.Tables[0]);
                            dsVacantes.Tables[1].Rows[0]["HTML"] = html;
                            HumansoftServer.WSBolsa.ServiciosDeBolsa bolsa = new HumansoftServer.WSBolsa.ServiciosDeBolsa() { Url = "http://10.0.0.24:85//ServiciosDeBolsa.asmx" };
                            string[] resultado = bolsa.PublicarVacante(dsVacantes);
                            ds.Tables[0].Rows[0]["estatus"] = resultado[0];
                            ds.Tables[0].Rows[0]["mensaje"] = resultado[1];
                        }
                    }
                    ds.WriteXml(Response.OutputStream);
                break;
                default:
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Clave de usuario", "usuario", Session["cve_usuario"], true, "int", 0 } }).WriteXml(Response.OutputStream);
                break;
            }
        }else{}
    }

    internal string crearHTML(DataTable tb)
    {
        System.IO.StringWriter stringWriter = new System.IO.StringWriter();
        tb.DefaultView.Sort = "Secc";
        tb = tb.DefaultView.ToTable(true);
        using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
        {
            int cont = 0;
            writer.RenderBeginTag(HtmlTextWriterTag.Html);
            writer.RenderBeginTag(HtmlTextWriterTag.Head);
            writer.AddAttribute(HtmlTextWriterAttribute.Href, "/css/Perfiles.css");
            writer.AddAttribute(HtmlTextWriterAttribute.Rel, "stylesheet");
            writer.AddAttribute(HtmlTextWriterAttribute.Type, "text/css");
            writer.RenderBeginTag(HtmlTextWriterTag.Link);
            writer.RenderEndTag();
            writer.AddAttribute("charset", "UTF-8");
            writer.RenderBeginTag(HtmlTextWriterTag.Meta);
            writer.RenderEndTag();
            writer.RenderEndTag();
            writer.RenderBeginTag(HtmlTextWriterTag.Body);
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            foreach (DataRow row in tb.Rows)
            {
                string texto = row["Val"].ToString();
                texto = Regex.Replace(texto, @"\\n", "<br/>");
                if (cont == 0)
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.H3);
                    writer.Write(row["Secc"].ToString().ToUpper());
                    writer.RenderEndTag();
                    writer.RenderBeginTag(HtmlTextWriterTag.H4);
                    writer.Write(row["SubSecc"].ToString());
                    writer.RenderEndTag();
                    writer.RenderBeginTag(HtmlTextWriterTag.Div);
                    writer.Write(texto);
                    writer.RenderEndTag();
                }
                else
                {
                    if (row["SubSecc"].ToString().Equals(tb.Rows[cont - 1]["SubSecc"].ToString()))
                    {
                        writer.RenderBeginTag(HtmlTextWriterTag.Div);
                        writer.Write(texto);
                        writer.RenderEndTag();
                    }
                    else if (row["Secc"].ToString().Equals(tb.Rows[cont - 1]["Secc"].ToString()))
                    {
                        writer.RenderBeginTag(HtmlTextWriterTag.H4);
                        writer.Write(row["SubSecc"].ToString());
                        writer.RenderEndTag();
                        writer.RenderBeginTag(HtmlTextWriterTag.Div);
                        writer.Write(texto);
                        writer.RenderEndTag();
                    }
                    else
                    {
                        writer.RenderEndTag();
                        writer.RenderBeginTag(HtmlTextWriterTag.Div);
                        writer.RenderBeginTag(HtmlTextWriterTag.H3);
                        writer.Write(row["Secc"].ToString().ToUpper());
                        writer.RenderEndTag();
                        writer.RenderBeginTag(HtmlTextWriterTag.H4);
                        writer.Write(row["SubSecc"].ToString());
                        writer.RenderEndTag();
                        writer.RenderBeginTag(HtmlTextWriterTag.Div);
                        writer.Write(texto);
                        writer.RenderEndTag();
                    }
                }
                cont++;
            }
            writer.RenderEndTag();
            writer.RenderEndTag();
            writer.RenderEndTag();
        }
        return stringWriter.ToString();
    }
</script>
