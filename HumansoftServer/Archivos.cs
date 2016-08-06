using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text;
using System.Configuration;

namespace HumansoftServer
{
    public static class Archivos
    { 
        static string  _Ruta;

        static Archivos() { 
            if (_Ruta==null)
            {
                _Ruta= ConfigurationManager.AppSettings["RutaDeArchivos"]; 
            }
        }
    }
}
