using System;
using System.IO;
using System.Reflection;
using HumansoftServer.PluginsPulish;
namespace HumansoftServer
{
    public class PlugingManager : IDisposable
    {
        readonly IPlugin _plugin;
        public PlugingManager(string controlador)
        {
            string path = string.Empty;
            string filename = string.Empty;
            string directory = string.Empty;
            if (!string.IsNullOrEmpty(controlador))
            {
                try
                {
                    if (_plugin == null)
                    {
                        path = controlador;
                        filename = Path.GetFileName(path);
                        directory = string.IsNullOrEmpty(Path.GetDirectoryName(path)) ? Environment.CurrentDirectory : Path.GetDirectoryName(path);
                        path = String.Format(@"{0}\{1}", directory, filename);
                        if (File.Exists(path))
                        {
                            Assembly types = Assembly.LoadFile(path);
                            foreach (Type type in types.GetTypes())
                            {
                                if (type.GetInterface("IPlugin") == typeof(IPlugin))
                                {
                                    _plugin = (IPlugin)Activator.CreateInstance(type);
                                }
                            }
                        }
                    }
                }
                catch (Exception)
                {
                    System.Diagnostics.Debug.WriteLine(@"Loding fail: {0}", path);
                    throw;
                }
            }
        }

        public void publish(int idVacante, string destino, string usuario, string pass)
        {
            if (_plugin != null)
            {
                try
                {
                    _plugin.publish(idVacante, destino, usuario, pass);
                }
                catch (Exception ex) { }
            }
        }

        public void unPublish(int idVacante, string destino, string usuario, string pass)
        {
            if (_plugin != null)
            {
                try
                {
                    _plugin.unPublish(idVacante, destino, usuario, pass);
                }
                catch (Exception ex) { }
            }
        }

        public void asignarModelo(string modeloPath)
        {
            if (_plugin != null)
            {
                try
                {
                    _plugin.fuenteXML(modeloPath);
                }
                catch (Exception ex) { }
            }
        }

        #region IDisposable
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
            }
        }
        ~PlugingManager()
        {
            Dispose(false);
        }
        #endregion
    }
}
