using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace IdentityService.Infrastructure.Services;

public class EmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;

    public EmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var host = _configuration["Email:Host"];
        var port = int.Parse(_configuration["Email:Port"] ?? "587");
        var user = _configuration["Email:SenderEmail"];
        var password = _configuration["Email:Password"];
        var from = _configuration["Email:From"] ?? user;
        var fromName = _configuration["Email:SenderName"];

        using var client = new SmtpClient(host, port)
        {
            Credentials = new NetworkCredential(user, password),
            EnableSsl = true
        };

        var mail = new MailMessage
        {
            From = fromName == null ? new MailAddress(from!) : new MailAddress(from!, fromName),
            Subject = subject,
            Body = body
        };
        mail.To.Add(toEmail);
        await client.SendMailAsync(mail);
    }
}
