namespace UHVAMM_server.EmailService
{
    public interface IEmailService
    {
        string SendEmail(string toEmail, string emailSubject, string plainTextContent, string htmlContent);
    }
}
