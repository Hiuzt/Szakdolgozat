namespace UHVAMM_server.Models
{
    public class Users
    {
        public int ID { get; set; } = 0;
        public string Name { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public string FullName { get; set; } = String.Empty;
        public string FirstName { get; set; } = String.Empty;
        public string SurName { get; set; } = String.Empty;
        public string PhoneNumber { get; set; } = String.Empty;
        public int Admin { get; set; } = 0;
        public string Email { get; set; } = String.Empty;
        public DateTime? BirthDay { get; set; }
        public string Token { get; set; } = String.Empty;
        public DateTime? LicenseFrom { get; set; }
        public DateTime? RegisterTime { get; set; }
        public string Image { get; set; } = String.Empty;
        public IFormFile ImageFile { get; set; }
        public int Active { get; set; } = 0;
        public string oldPassword { get; set; } = String.Empty;

    }
}
