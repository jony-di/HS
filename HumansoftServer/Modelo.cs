using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Xml;

namespace HumansoftServer
{
    public class Modelo
    {
        string  RutaVistaModelo=null;
        bool esRutaAbsoluta = false;
        public Modelo(){}
        public Modelo(string rutaXMLVistaModelo, bool esRutaAbsoluta=false){
            this.esRutaAbsoluta = esRutaAbsoluta;
            this.RutaVistaModelo = rutaXMLVistaModelo;
        }

        public System.Data.DataSet GenerarOperacion(object[,] p, string procedimiento, bool esPublica = false)
        {
            if (!esPublica && HttpContext.Current.Session["cve_usuario"] == null)
            {
                return null;
            }

            DataSet ds = new DataSet();
            List<Object[,]> adjuntos= new List<Object[,]>();
            EstatusOperacion resultadoValidacion= Validacion.ValidarCamposFormato(p);
            if (resultadoValidacion.estatus==1)
            {
                try
                {
                    SqlCommand cmd = new SqlCommand(procedimiento, new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["CadenaConexion_HSW"].ConnectionString));
                    cmd.CommandType = CommandType.StoredProcedure;

                    string nombreParametro; string tipo;
                    string cadenaTexto; int valorEntero; bool valorBool; double valorDecimal;
                    int i = 0;
                    for (i = 0; i < p.GetLength(0); i++)
                    {
                        nombreParametro = p[i, 1].ToString();
                        tipo = p[i, 4].ToString().Split('|')[0];
                        try
                        {
                            if (Validacion.esRecibidoParametro(p[i, 2], tipo.Split('|')[0]) || (nombreParametro == "criterio")){//PARCHE para el parametro criterio.sin esto el parametro criterio seria null, y los procedimientos almacenados, muchos estan hechos con el parametro='%'
                                if (nombreParametro == "criterio") {
                                    cadenaTexto = "%";
                                }
                                switch (tipo)
                                {
                                    case "int":
                                        valorEntero = Convert.ToInt32(p[i, 2]);
                                        cmd.Parameters.Add(new SqlParameter("@" + nombreParametro, valorEntero));
                                        break;
                                    case "float":
                                        valorDecimal = Convert.ToDouble(p[i, 2]);
                                        cmd.Parameters.Add(new SqlParameter("@" + nombreParametro, valorDecimal));
                                        break;
                                    case "bool":
                                        valorBool = Convert.ToBoolean(p[i, 2]);
                                        cmd.Parameters.Add(new SqlParameter("@" + nombreParametro, valorBool));
                                        break;
                                    case "string":
                                        cadenaTexto = p[i, 2].ToString();
                                        cmd.Parameters.Add(new SqlParameter("@" + nombreParametro, cadenaTexto));
                                        break;
                                    case "text":
                                        cadenaTexto = p[i, 2].ToString();
                                        SqlParameter sprm = new SqlParameter("@" + nombreParametro, SqlDbType.Text);
                                        sprm.Value = cadenaTexto;
                                        cmd.Parameters.Add(sprm);
                                        break;
                                    case "file": adjuntos.Add(new Object[,] { { p[i, 2], p[i, 4].ToString() } });break;
                                }
                            }
                        }
                        catch (Exception ex) { throw new Exception(String.Format("nombre:{0}; tipo:{1}; valor:{2}", nombreParametro, tipo, p[i, 2])); }
                    }
                    SqlDataAdapter queryAdapter = new SqlDataAdapter(cmd);
                    queryAdapter.Fill(ds);
                    AlmacenarArchivos(adjuntos);
                }
                catch (Exception ex)
                {
                    ds = EstatusOperacion.agregarEstatusOperacion(-100, "Error: " + ex.Message);
                }
            }else{
                ds=EstatusOperacion.agregarEstatusOperacion(-1000, resultadoValidacion.mensaje);
            }
            return ds;
        } 

        public string AlmacenarArchivos(List<Object[,]> adjuntos){
            string ruta,nombreArchivo;
            HttpPostedFile fileAdjunto;
            string[] datosFile;
            string resultadoAlmacenamiento = "";
            string extension = "";

            foreach (Object[,] adjunto in adjuntos)
            {      
                fileAdjunto=(HttpPostedFile)adjunto[0,0];
                datosFile = adjunto[0, 1].ToString().Split('|');
            
                extension = fileAdjunto.FileName.Substring(fileAdjunto.FileName.LastIndexOf('.'));
                ruta = datosFile[3];
                nombreArchivo = datosFile[2];
                string key = "";
                try { key = datosFile[4]; }
                catch (Exception e) { }
                try
                {
                    if (!System.IO.Directory.Exists(ruta))
                    {
                        System.IO.Directory.CreateDirectory(ruta);
                    }
                    int i = 0;
                    if(key.Length > 0){
                        HttpFileCollection  ArchivosAdjuntos=HttpContext.Current.Request.Files;
                        for(i=0;i<ArchivosAdjuntos.Count;i++){
                            if(ArchivosAdjuntos.GetKey(i)==key){
                                uint indice = Util.ObtenerIndiceSiguienteArchivoDia(ruta.Replace(HttpContext.Current.Server.MapPath("~").ToString(), ""));
                                extension = ArchivosAdjuntos[i].FileName.Substring(ArchivosAdjuntos[i].FileName.LastIndexOf('.'));
                                ArchivosAdjuntos[i].SaveAs(String.Format("{0}\\{1}_{2}{3}", ruta, nombreArchivo, indice, extension));
                            }
                        }
                    }else{
                        fileAdjunto.SaveAs(String.Format("{0}\\{1}{2}", ruta, nombreArchivo, extension));
                        
                    }
                    resultadoAlmacenamiento += String.Format(";archivo:{0}{1} , guardado: SI;", nombreArchivo, extension);
                }
                catch (Exception ex)
                {
                    resultadoAlmacenamiento += String.Format(";archivo:{0}{1} , guardado: NO;{2}", nombreArchivo, extension, ex.Message);
                    using (System.IO.StreamWriter w = System.IO.File.AppendText(String.Format("{0}: {1}", DateTime.Now, ConfigurationManager.AppSettings["RutaLog"]))) { w.WriteLine("Error:" + ex.Message); }
                }
            }
            return resultadoAlmacenamiento;
        }


        public DataSet GenerarOperacionCX(string operacion, string sNodoDescripcion, object[,] otrosParametros = null, bool esPublica = false)
        {
            if (!esPublica && HttpContext.Current.Session["cve_usuario"] == null)
            {
                return null;
            }
            DataSet ds = new DataSet();
            List<Object[,]> adjuntos = new List<Object[,]>();
            if (this.RutaVistaModelo != null)
            {
                HttpRequest oRequest = HttpContext.Current.Request;
                XmlDocument nodoDescripcion = new XmlDocument();
                if (this.esRutaAbsoluta){
                    nodoDescripcion.Load(this.RutaVistaModelo);
                }else {
                    nodoDescripcion.Load(HttpContext.Current.Server.MapPath("../" + this.RutaVistaModelo));
                }
                XmlNodeList campos = nodoDescripcion.SelectNodes(String.Format("/Secciones/{0}/{1}/campo", sNodoDescripcion, operacion));
                if (otrosParametros == null) {
                    otrosParametros = new object[,] { };
                }
                int limite= campos.Count + otrosParametros.GetLength(0);
                object[,] p = new object[limite, 7];
                string sParametros = ""; XmlElement campo; string coma = "";
                int k = 0; string db_nombreParametro = "";
                for (k = 0; k < otrosParametros.GetLength(0); k++)
                {
                    
                    p[k, 0] = otrosParametros[k, 0];
                    p[k, 1] = otrosParametros[k, 1];
                    p[k, 2] = otrosParametros[k, 2];
                    p[k, 3] = otrosParametros[k, 3];
                    p[k, 4] = otrosParametros[k, 4];
                    p[k, 5] = otrosParametros[k, 5];

                    if (p[k, 4].ToString().Split('|')[0].Trim() != "file")
                    {
                        sParametros += String.Format("{0} @{1} {2}", coma, p[k, 1], ((p[k, 4].ToString().Trim() == "string") ? "varchar(" + p[k, 5] + ")" : ((p[k, 4].ToString().Trim() == "bool") ? " bit" : p[k, 4])));
                        coma = ",";
                    }
                }
                
                for (int j=0; j < campos.Count; j++)
                {
                    campo = (XmlElement)campos[j];
                    db_nombreParametro = campo.GetAttribute("db_nombre");
                    if (!esRepetido(db_nombreParametro, otrosParametros))
                    {
                        p[k, 0] = campo.GetAttribute("leyenda");
                        p[k, 1] = campo.GetAttribute("db_nombre");
                        //p[k, 2] = (oRequest[campo.GetAttribute("form_nombre")] == null || oRequest[campo.GetAttribute("form_nombre")].Trim().Length==0) ? campo.GetAttribute("default") : oRequest[campo.GetAttribute("form_nombre")];
                        p[k, 2] = (oRequest[campo.GetAttribute("form_nombre")] == null || oRequest[campo.GetAttribute("form_nombre")].Trim().Length == 0) ? campo.GetAttribute("default") : campo.GetAttribute("cifrado").Trim().Equals("true") ? Encripta.cifradoMD5(oRequest[campo.GetAttribute("form_nombre")]) : oRequest[campo.GetAttribute("form_nombre")];
                        p[k, 3] = (campo.GetAttribute("requerido").Trim() == "true");
                        p[k, 4] = campo.GetAttribute("tipo");
                        p[k, 5] = Convert.ToInt32(campo.GetAttribute("charsize"));
                        sParametros += String.Format("{0} @{1} {2}{3}", coma, p[k, 1], ((p[k, 4].ToString().Trim() == "string") ? "varchar(" + p[k, 5] + ")" : ((p[k, 4].ToString().Trim() == "bool") ? " bit" : p[k, 4])), (campo.GetAttribute("requerido").Trim() != "true" ? ("=" + (campo.HasAttribute("default") ? ("'" + campo.GetAttribute("default") + "'") : "null")) : ""));
                        coma = ",";
                        k++;
                    }
                    else {
                        limite--;
                    };
                }
                object[,] parametros= new object[limite,6];
                for (k = 0; k < parametros.GetLength(0); k++)
                {
                    parametros[k, 0] = p[k, 0];
                    parametros[k, 1] = p[k, 1];
                    parametros[k, 2] = p[k, 2];
                    parametros[k, 3] = p[k, 3];
                    parametros[k, 4] = p[k, 4];
                    parametros[k, 5] = p[k, 5];
                }

                EstatusOperacion resultadoValidacion = Validacion.ValidarCamposFormato(parametros);
                if (resultadoValidacion.estatus == 1)
                {
                    try
                    {
                        SqlCommand cmd = new SqlCommand("sp_executesql", new SqlConnection(ConfigurationManager.ConnectionStrings["CadenaConexion_HSW"].ConnectionString));
                        
                            
                        cmd.CommandType = CommandType.StoredProcedure;
                        XmlNode sqlNode = nodoDescripcion.SelectNodes(String.Format("/Secciones/{0}/{1}/sql", sNodoDescripcion, operacion))[0];
                        //Compatibilidad con CDATA
                        string sqlString;
                        XmlNode childNode = sqlNode.ChildNodes[0];
                        if (childNode is XmlCDataSection){
                            sqlString= sqlNode.ChildNodes[0].Value;
                        }else{
                            sqlString= sqlNode.InnerText;
                        }
                        //---
                        cmd.Parameters.Add("@stmt", sqlString);
                        cmd.Parameters.Add("@params", sParametros);
                        string nombreParametro; string tipo;
                        string cadenaTexto; int valorEntero; bool valorBool; double valorDecimal;
                        int i = 0;
                        for (i = 0; i < parametros.GetLength(0); i++)
                        {
                            nombreParametro = parametros[i, 1].ToString();
                            tipo = parametros[i, 4].ToString().Split('|')[0];
                            try
                            {
                                if (Validacion.esRecibidoParametro(parametros[i, 2], tipo.Split('|')[0]) || (nombreParametro == "criterio"))
                                {//PARCHE para el parametro criterio.sin esto el parametro criterio seria null, y los procedimientos almacenados, muchos estan hechos con el parametro='%'
                                    if (nombreParametro == "criterio")
                                    {
                                        cadenaTexto = "%";
                                    }
                                    switch (tipo)
                                    {
                                        case "int":
                                            valorEntero = Convert.ToInt32(parametros[i, 2]);
                                            cmd.Parameters.Add(new SqlParameter("@" + nombreParametro, valorEntero));
                                            break;
                                        case "float":
                                            valorDecimal = Convert.ToDouble(parametros[i, 2]);
                                            cmd.Parameters.Add(new SqlParameter("@" + nombreParametro, valorDecimal));
                                            break;
                                        case "bool":
                                            valorBool = Convert.ToBoolean(parametros[i, 2]);
                                            cmd.Parameters.Add(new SqlParameter("@" + nombreParametro, valorBool));
                                            break;
                                        case "string":
                                            cadenaTexto = parametros[i, 2].ToString();
                                            SqlParameter sprm1 = new SqlParameter("@" + nombreParametro, SqlDbType.VarChar);
                                            sprm1.Value = cadenaTexto;
                                            cmd.Parameters.Add(sprm1);
                                            break;
                                        case "text":
                                            cadenaTexto = parametros[i, 2].ToString();
                                            SqlParameter sprm = new SqlParameter("@" + nombreParametro, SqlDbType.Text);
                                            sprm.Value = cadenaTexto;
                                            cmd.Parameters.Add(sprm);
                                            break;
                                        case "file": adjuntos.Add(new Object[,] { { parametros[i, 2], parametros[i, 4].ToString() } });break;                            
                                    }
                                }
                            }
                            catch (Exception ex) { throw new Exception(String.Format("nombre:{0}; tipo:{1}; valor:{2}", nombreParametro, tipo, parametros[i, 2])); }
                        }
                        SqlDataAdapter queryAdapter = new SqlDataAdapter(cmd);
                        queryAdapter.Fill(ds);
                        AlmacenarArchivos(adjuntos);
                    }
                    catch (Exception ex)
                    {
                        ds = EstatusOperacion.agregarEstatusOperacion(-100, "Error: " + ex.Message);
                    }
                }
                else
                {
                    ds = EstatusOperacion.agregarEstatusOperacion(-1000, resultadoValidacion.mensaje);
                }
            }
            else {
                ds = EstatusOperacion.agregarEstatusOperacion(-100, "Error, no se inicio archivo de configuración vista modelo.");
            }
            return ds;
        }
        
        public bool esRepetido(string db_nombreParametro, object[,] otrosParametros){
            for (int i = 0; i < otrosParametros.GetLength(0); i++) {
                if (otrosParametros[i, 1].ToString().Trim() == db_nombreParametro) {
                    return true;
                }
            }
                return false;
        }

        public void publicar(string vacante)
        {
            int idVacante;
            DataSet ds = this.GenerarOperacionCX("obtenerOrigen", "publicaciones", new object[,] { { "vacante", "vacante", vacante, true, "int", 0 } });
            string origen = ds.Tables[0].Rows[0]["origen"].ToString();
            string destino = ds.Tables[0].Rows[0]["destino"].ToString();
            string usuario = ds.Tables[0].Rows[0]["usuario"].ToString();
            string pass = ds.Tables[0].Rows[0]["password"].ToString();
            string fuenteXML = ds.Tables[0].Rows[0]["fuenteXML"].ToString();
            using (PlugingManager plugin = new PlugingManager(origen))
            {
                plugin.asignarModelo(fuenteXML);
                int.TryParse(vacante, out idVacante);
                plugin.publish(idVacante, destino, usuario, pass);
            }
        }

        public static string[] InsertaRegistrosEnTablas(DataSet dsTablas)
        {
            string[] resultados = new string[2];
            try
            {
                DataTable nombresTablas = dsTablas.Tables[0];
                using (SqlConnection connection = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["CadenaConexion_HSW"].ConnectionString))
                {
                    connection.Open();
                    string[] datos; string[] keys; string nombreTabla;
                    string condicion = "";
                    string valores = "";
                    string tmp, tmp2, tmp3 = "";
                    for (int i = 1; i <= nombresTablas.Rows.Count; i++)
                    {
                        datos = dsTablas.Tables[0].Rows[i - 1][0].ToString().Split('|');
                        nombreTabla = datos[0];
                        if (datos.Length > 1 && dsTablas.Tables[i].Rows.Count > 0)
                        {
                            keys = datos[1].Split(',');
                            condicion = "";
                            tmp3 = "";
                            foreach (string key in keys)
                            {
                                condicion += String.Format("{0} A.{1}= B.{1}", tmp3, key.Trim());
                                tmp3 = " AND ";
                            }
                            valores = "";
                            tmp = "";
                            for (int n = 0; n < dsTablas.Tables[i].Rows.Count; n++)
                            {
                                tmp2 = "";
                                valores += tmp + "(";
                                foreach (string key in keys)
                                {
                                    valores += String.Format("{0}'{1}'", tmp2, dsTablas.Tables[i].Rows[n][key]);
                                    tmp2 = ",";
                                }
                                valores += ")";
                                tmp = ",";
                            }
                            string qry = String.Format("DELETE A FROM dbo.{0} A INNER JOIN (SELECT * FROM (VALUES {1} )Q({2}))B ON {3}", nombreTabla, valores, string.Join(",", keys), condicion);
                            SqlCommand sqlComm = new SqlCommand(qry, connection);
                            sqlComm.ExecuteNonQuery();
                        }
                        else if (datos.Length == 1)
                        {
                            string qry = "DELETE FROM dbo." + nombreTabla;
                            SqlCommand sqlComm = new SqlCommand(qry, connection);
                            sqlComm.ExecuteNonQuery();
                        }
                        using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
                        {
                            bulkCopy.DestinationTableName = "dbo." + nombreTabla;
                            bulkCopy.WriteToServer(dsTablas.Tables[i]);
                        }
                    }
                }
                resultados[0] = "1";
                resultados[1] = "Almacenamiento correcto";
            }
            catch (Exception e)
            {
                resultados[0] = "-1";
                resultados[1] = e.Message;
            }
            return resultados;
        }
    }
}