namespace UHVAMM_server.Models
{
    public class Comments
    {
        public int id { get; set; }
        public string? description { get; set; }
        public int commentValue { get; set; } = 0;
        public int ownerID { get; set; } = 0;
        public int targetID { get; set; } = 0;
        public string? ownerName { get; set; } = String.Empty;
        public DateTime? commentDate { get; set; }
        public string commentImage { get; set; } = String.Empty;
    }
}
