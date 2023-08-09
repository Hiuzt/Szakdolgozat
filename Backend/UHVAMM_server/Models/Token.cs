namespace UHVAMM_server.Models
{
    public class Token
    {
        public int id { get; set; }
        public Guid tokenId { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime expireAt { get; set; }
    }
}
