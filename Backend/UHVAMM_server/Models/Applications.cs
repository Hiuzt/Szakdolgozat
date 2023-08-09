namespace UHVAMM_server.Models
{
    public class Applications
    {
        public int Id { get; set; }

        public int FromUser { get; set; }
        public int TravelID { get; set; }
        public int ToUser { get; set; }
        public int Type { get; set; }
        public string? Reason { get; set; }
        public string? Fullname { get; set; }
        public string? FromTo { get; set; }
        public string? Email { get; set; }
        public DateTime? Created { get; set; }
        public DateTime Modified { get; set; }
        public string? UserImage { get; set; }
    }
}
