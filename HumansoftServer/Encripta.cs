using System;
using System.Security.Cryptography;
using System.Text;
using System.Data;
// DESCRIPTION:
// Nombre: clsEncritaDatos
// 
// Archivo: clsEncritaDatos.cls
// 
// Fecha de creaci�n: Agosto 2005
// 
// REMARKS:
// La clase define las propiedades y m�todos del objeto clsEncritaDatos,
// utilizado para encriptar los datos

namespace HumansoftServer
{
    public class Encripta
    {        
        public string Encriptar(string dato) {
            int c;
            int l;
            int posicion;
            int Sumador;
            string Nombre1;
            string Caracter;
            // TODO: On Error GoTo Warning!!!: The statement is not translatable 
            l = dato.Length;
            posicion = GetNumero(1, 10);
            Sumador = GetNumero(1, 10);
            Nombre1 = posicion.ToString();
            // si la posicion es impar el caracter sombra se pone
            // antes del caracter correcto
            for (c = 1; (c <= l); c++) {
                Caracter = dato.Substring((c - 1), 1);
                Caracter = GetCaracter(Caracter, Sumador, true);
                if (((posicion == 1) 
                            || ((posicion == 3) 
                            || ((posicion == 5) 
                            || ((posicion == 7) 
                            || (posicion == 9)))))) {
                    Nombre1 = (Nombre1 
                                + (GetCarSombra() + Caracter));
                }
                else {
                    Nombre1 = (Nombre1 
                                + (Caracter + GetCarSombra()));
                }
            }
            return (Nombre1 + Sumador);        
        }
    
        public string DesEncripta(string dato) {
            int c;
            int l;
            int p;
            int posicion;
            int Sumador;
            string Nombre1;
            string Nombre2;
            string Caracter;
            // TODO: On Error GoTo Warning!!!: The statement is not translatable 
            l = dato.Length;
            int a;
            if (int.TryParse(dato.Substring(0, 1),out a)) {
                posicion = int.Parse(dato.Substring(0, 1));
            }
            else{
                posicion = 1;
            }
            if (int.TryParse(dato.Substring((l - 1), 1), out a)){
                Sumador = int.Parse(dato.Substring((l - 1), 1));
            }
            else {
                Sumador = 1;
            }
            Nombre1 = "";
            for (c = 2; (c 
                        <= (l - 1)); c++) {
                Nombre1 = (Nombre1 + dato.Substring((c - 1), 1));
            }
            l = Nombre1.Length;
            if (((posicion == 1) 
                        || ((posicion == 3) 
                        || ((posicion == 5) 
                        || ((posicion == 7) 
                        || (posicion == 9)))))) {
                p = 2;
            }
            else {
                p = 1;
            }
            Nombre2 = "";
            for (c = p; (c <= l); c = (c + 2)) {
                Nombre2 = (Nombre2 + Nombre1.Substring((c - 1), 1));
            }
            l = Nombre2.Length;
            Nombre1 = "";
            for (c = 1; (c <= l); c++) {
                Caracter = Nombre2.Substring((c - 1), 1);
                Nombre1 = (Nombre1 + GetCaracter(Caracter, Sumador, false));
            }
            return Nombre1;
        }
    
        private int GetNumero(int Inicia, int finaliza) {
            Random rnd = new Random();
            return rnd.Next(1, 13);        
        }
    
        private string GetCarSombra() {
            return Convert.ToChar(GetNumero(48, 165)).ToString();
        }
    
        private string GetCaracter(string Pcaracter, int PNumero, bool Psuma) {
            int numeroc;
            // TODO: On Error GoTo Warning!!!: The statement is not translatable 
            if ((Psuma == true)) {
                numeroc = (Convert.ToChar(Pcaracter) + PNumero);
            }
            else {
                numeroc = (Convert.ToChar(Pcaracter) - PNumero);
            }
            return Convert.ToChar(numeroc).ToString();
        }

        /*
         * Jonatan Díaz
         * Se agegan funciones de enciptacion MD5 y Base64
        */

        public const string clave = "*.HSofT2kx"; // Clave de cifrado. NOTA: Puede ser cualquier combinación de carácteres.

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64EncodeFile(byte[] filebytes)
        {
            return System.Convert.ToBase64String(filebytes, 0, filebytes.Length);
        }

        public static byte[] Base64DecodeFile(string base64EncodedData)
        {
            return Convert.FromBase64String(base64EncodedData);
        }

        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        // Función para cifrar una cadena.
        public static string cifradoMD5(string cadena)
        {

            byte[] llave; //Arreglo donde guardaremos la llave para el cifrado 3DES.

            byte[] arreglo = UTF8Encoding.UTF8.GetBytes(cadena); //Arreglo donde guardaremos la cadena descifrada.

            // Ciframos utilizando el Algoritmo MD5.
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            llave = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(clave));
            md5.Clear();

            //Ciframos utilizando el Algoritmo 3DES.
            TripleDESCryptoServiceProvider tripledes = new TripleDESCryptoServiceProvider();
            tripledes.Key = llave;
            tripledes.Mode = CipherMode.ECB;
            tripledes.Padding = PaddingMode.PKCS7;
            ICryptoTransform convertir = tripledes.CreateEncryptor(); // Iniciamos la conversión de la cadena
            byte[] resultado = convertir.TransformFinalBlock(arreglo, 0, arreglo.Length); //Arreglo de bytes donde guardaremos la cadena cifrada.
            tripledes.Clear();

            return Convert.ToBase64String(resultado, 0, resultado.Length); // Convertimos la cadena y la regresamos.
        }

        // Función para descifrar una cadena.
        public static string descifradoMD5(string cadena)
        {

            byte[] llave;

            byte[] arreglo = Convert.FromBase64String(cadena); // Arreglo donde guardaremos la cadena descovertida.

            // Ciframos utilizando el Algoritmo MD5.
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            llave = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(clave));
            md5.Clear();

            //Ciframos utilizando el Algoritmo 3DES.
            TripleDESCryptoServiceProvider tripledes = new TripleDESCryptoServiceProvider();
            tripledes.Key = llave;
            tripledes.Mode = CipherMode.ECB;
            tripledes.Padding = PaddingMode.PKCS7;
            ICryptoTransform convertir = tripledes.CreateDecryptor();
            byte[] resultado = convertir.TransformFinalBlock(arreglo, 0, arreglo.Length);
            tripledes.Clear();

            string cadena_descifrada = UTF8Encoding.UTF8.GetString(resultado); // Obtenemos la cadena
            return cadena_descifrada; // Devolvemos la cadena
        }

        public static string GetJSONString(DataTable Dt)
        {
            string[] StrDc = new string[Dt.Columns.Count];
            string HeadStr = string.Empty;

            for (int i = 0; i < Dt.Columns.Count; i++)
            {
                StrDc[i] = Dt.Columns[i].Caption;
                HeadStr += String.Format("\"{0}\" : \"{0}{1}¾\",", StrDc[i], i);
            }

            HeadStr = HeadStr.Substring(0, HeadStr.Length - 1);

            StringBuilder Sb = new StringBuilder();
            Sb.Append(String.Format("{{\"{0}\" : [", Dt.TableName));

            for (int i = 0; i < Dt.Rows.Count; i++)
            {
                string TempStr = HeadStr;
                Sb.Append("{");

                for (int j = 0; j < Dt.Columns.Count; j++)
                {
                    TempStr = TempStr.Replace(String.Format("{0}{1}¾", Dt.Columns[j], j), Dt.Rows[i][j].ToString());
                }
                Sb.Append(TempStr + "},");
            }

            Sb = new StringBuilder(Sb.ToString().Substring(0, Sb.ToString().Length - 1));
            Sb.Append("]}");

            return Sb.ToString();
        }


    }
}


 