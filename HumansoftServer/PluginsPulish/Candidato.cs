using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HumansoftServer.PluginsPulish
{

    public class Candidato
    {
        string _RFC;

        public string RFC
        {
            get { return _RFC; }
            set { _RFC = value; }
        }
        string _Nombres;

        public string Nombres
        {
            get { return _Nombres; }
            set { _Nombres = value; }
        }
        string _Apellido_Paterno;

        public string Apellido_Paterno
        {
            get { return _Apellido_Paterno; }
            set { _Apellido_Paterno = value; }
        }
        string _Apellido_Materno;

        public string Apellido_Materno
        {
            get { return _Apellido_Materno; }
            set { _Apellido_Materno = value; }
        }
        DateTime _FechaNacimiento;

        public DateTime FechaNacimiento
        {
            get { return _FechaNacimiento; }
            set { _FechaNacimiento = value; }
        }
        int _cve_Estdo;

        public int Cve_Estdo
        {
            get { return _cve_Estdo; }
            set { _cve_Estdo = value; }
        }
        int _cve_Municipio;

        public int Cve_Municipio
        {
            get { return _cve_Municipio; }
            set { _cve_Municipio = value; }
        }
        int _AniosExperiencia;

        public int AniosExperiencia
        {
            get { return _AniosExperiencia; }
            set { _AniosExperiencia = value; }
        }
        string _AreaDeExperiencia;

        public string AreaDeExperiencia
        {
            get { return _AreaDeExperiencia; }
            set { _AreaDeExperiencia = value; }
        }
        char _sexo;

        public char Sexo
        {
            get { return _sexo; }
            set { _sexo = value; }
        }
        string _EstadoCivil;

        public string EstadoCivil
        {
            get { return _EstadoCivil; }
            set { _EstadoCivil = value; }
        }
          string _GradoEstudios;

          public string GradoEstudios
          {
              get { return _GradoEstudios; }
              set { _GradoEstudios = value; }
          }
          string _EstadoGradoEstudios;

          public string EstadoGradoEstudios
          {
              get { return _EstadoGradoEstudios; }
              set { _EstadoGradoEstudios = value; }
          }
          string _FotoBase64;

          public string FotoBase64
          {
              get { return _FotoBase64; }
              set { _FotoBase64 = value; }
          }
          string _CVWordBase64;

          public string CVWordBase64
          {
              get { return _CVWordBase64; }
              set { _CVWordBase64 = value; }
          }
    }
}
