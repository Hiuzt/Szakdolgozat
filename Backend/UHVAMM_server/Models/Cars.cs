namespace UHVAMM_server.Models
{
    public class Cars
    {
        public int ID { get; set; } = 0;
        public string Image { get; set; } = String.Empty;
        public IFormFile? ImageFile { get; set; }

        public int DistanceTravelled { get; set; } = 0;
        public int SeatNumber { get; set; } = 4;
        public int DriverID { get; set; } = 0;
    }
}
