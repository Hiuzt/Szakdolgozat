using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Net.Mail;
using System.Threading.Tasks;


namespace UHVAMM_server.EmailService
{
    public class EmailService:IEmailService
    {
        public string SendEmail(string toEmail, string emailSubject, string plainTextContent, string htmlContent)
        {
            var apiKey = "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";
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("kerner.daniel1@gmail.com", "UHVAMM");
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, emailSubject, plainTextContent, htmlContent);
            var response = client.SendEmailAsync(msg);

            return "Ok";
        }

    }
}
