using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace HumansoftServer.PluginsPulish
{
    [ComVisible(true)]
    public interface IPlugin
    {
        void fuenteXML(string path);
        void publish(int idVacante, string destino, string usuario, string pass);
        List<Candidato> getCandidates(int idVacante, string destino, string opciones, string usuario, string pass);
        void unPublish(int idVacante, string destino, string usuario, string pass);
    }
}