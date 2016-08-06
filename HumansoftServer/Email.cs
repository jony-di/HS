using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Net;

namespace HumansoftServer
{
    public class Email
    {
        private string Usuario;
        private string Contraseña;
        private string hostEmail;
        public Email()
        {
            this.Usuario = System.Configuration.ConfigurationManager.AppSettings["UsuarioEmail"].ToString();
                this.Contraseña = System.Configuration.ConfigurationManager.AppSettings["PasswordEmail"].ToString();
                this.hostEmail = System.Configuration.ConfigurationManager.AppSettings["HostEmail"].ToString();
        }    
        
        public void Enviar(string remitente, string asunto, string[] destinatarios, string[] ccs, string[] bccs, string mensaje, Object[][] adjuntos)
        {
            MailMessage _Correo = new MailMessage();
            _Correo.From = new MailAddress(remitente);
            foreach (string destinatario in destinatarios)
            {
                _Correo.To.Add(new MailAddress(destinatario));
            }
            foreach (string cc in ccs)
            {
                _Correo.To.Add(new MailAddress(cc));
            }
            foreach (string bcc in bccs)
            {
                _Correo.To.Add(new MailAddress(bcc));
            }
            _Correo.Subject = asunto;
            _Correo.Body = mensaje;
            _Correo.IsBodyHtml = true;
            _Correo.Priority = MailPriority.High;

            for (int i = 0; i > adjuntos.Length; i++)
            {
                _Correo.Attachments.Add(new Attachment((System.IO.Stream)adjuntos[i][0], (string)adjuntos[i][1]));
            }

            SmtpClient smtp = new SmtpClient();
            smtp.Credentials = new NetworkCredential(this.Usuario, this.Contraseña);
            smtp.Host = this.hostEmail;
            smtp.Port = 587;
            smtp.EnableSsl = false;

            try
            {
                smtp.Send(_Correo);
            }
            catch (Exception Ex)
            {
                throw new InvalidOperationException(Ex.Message);

            }
            _Correo.Dispose();
        }

        
    }
}