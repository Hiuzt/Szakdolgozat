namespace UHVAMM_server.Models
{
    public class Travels
    {
        public int ID { get; set; }
        public int CarID { get; set; }
        public string? FromName { get; set; }
        public string? ToName { get; set; }
        public DateTime StartDate { get; set; }
        public float ToLat { get; set; }
        public float ToLng { get; set; }
        public float FromLat { get; set; }
        public float FromLng { get; set; }
        public int DriverID { get; set; }
        public string? DriverName { get; set; }
        public string? DriverImage { get; set; }
        public int Active { get; set; }
    }
}
