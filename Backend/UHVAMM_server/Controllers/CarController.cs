using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using MySqlConnector;
using System.Diagnostics;
using System.Xml;
using UHVAMM_server.Models;

namespace UHVAMM_server.Controllers
{
    [Route("cars/")]
    public class CarController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHostEnvironment _hostEnvironment; 

        public CarController(IConfiguration configuration, IHostEnvironment hostEnviroment)
        {
            _configuration = configuration;
            _hostEnvironment = hostEnviroment;

        }

        [HttpPost]
        [Route("create/")]
        public async Task<ActionResult<Cars>> CreateCar([FromForm] Cars car)
        {
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();
            IFormFile file = car.ImageFile;
            car.Image = await SaveImage(file);

            MySqlCommand insertCommand = new MySqlCommand("INSERT INTO cars(image, km, seatnumber) VALUES(@image, @km, @seatnumber)", dbConnect);

            insertCommand.Parameters.AddWithValue("@image", car.Image);
    
            insertCommand.Parameters.AddWithValue("@km", car.DistanceTravelled);
            insertCommand.Parameters.AddWithValue("@seatnumber", car.SeatNumber);


            int insertID = insertCommand.ExecuteNonQuery();
            if (insertID > -1)
            {
                dbConnect.Close();
                return Ok("Sikeresen létrehoztad a járművet ezzel az azonosítóval: " + insertID);

            }
            dbConnect.Close();
            return BadRequest("Nem sikerült létrehozni a járművet!");
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageSource)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageSource.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssff") + Path.GetExtension(imageSource.FileName);

            // Image path létrehozása
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Carimages", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageSource.CopyToAsync(fileStream);


            }
            return imageName;
        }

        [HttpGet]
        [Route("getAllCar/")]
        public ActionResult<Cars> getAllCars()
        {
            List<Cars> carCollection = new List<Cars>();
            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM cars", dbConnect);

                MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
                while (MySqlDataReader.Read())
                {
                    Cars carClient = new Cars();

                    carClient.ID = MySqlDataReader.GetInt32(0);
                    carClient.Image = String.Format("{0}://{1}{2}/carimages/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(1));
                    carClient.DistanceTravelled = MySqlDataReader.GetInt32(2);
                    carClient.SeatNumber = MySqlDataReader.GetInt32(3);

                    carCollection.Add(carClient);
                }
                dbConnect.Close();
                return Ok(carCollection);
            } catch
            {
                return BadRequest("Szerverhiba!");
            }
        }

        [HttpGet]
        [Route("getCar/{id:int}")]
        public ActionResult<Cars> getCarByID(int id)
        {
            List<Cars> carCollection = new List<Cars>();

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM cars WHERE travelid = @travelid", dbConnect);

            selectCommand.Parameters.AddWithValue("@travelid", id);

            MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
            while (MySqlDataReader.Read())
            {
                if (MySqlDataReader.GetInt32(2) <= 0)
                {
                    Cars carClient = new Cars();

                    carClient.ID = MySqlDataReader.GetInt32(0);
                    carClient.Image = String.Format("{0}://{1}{2}/carimages/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(1));
                    carClient.DistanceTravelled = MySqlDataReader.GetInt32(2);
                    carClient.SeatNumber = MySqlDataReader.GetInt32(3);

                    carCollection.Add(carClient);
                }

            }
            dbConnect.Close();
            return Ok(carCollection);
        }

        [HttpDelete]
        [Route("deleteCar/{id:int}")]
        public ActionResult<Cars> deleteCarByID(int id)
        {
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand deleteCommand = new MySqlCommand("DELETE FROM cars WHERE id = @id", dbConnect);
            deleteCommand.Parameters.AddWithValue("@id", id);

            int deleteID = deleteCommand.ExecuteNonQuery();
            if (deleteID > 0)
            {
                dbConnect.Close();
                return Ok("Sikeresen törölted!");
            }
            return BadRequest("Nem sikerült");
        }


        [HttpPatch]
        [Route("updateCar/{id:int}")]
        public async Task<ActionResult<Cars>> updateCarByID([FromForm] Cars car, int id)
        {

            List<Cars> carCollection = new List<Cars>();

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            MySqlCommand updateCommand = null;
            dbConnect.Open();
            if (car.Image == null)
            {

                updateCommand = new MySqlCommand("UPDATE cars SET km = @km, seatnumber = @seatnumber WHERE id = @id", dbConnect);


                updateCommand.Parameters.AddWithValue("@id", id);
                updateCommand.Parameters.AddWithValue("@km", car.DistanceTravelled);
                updateCommand.Parameters.AddWithValue("@seatnumber", car.SeatNumber);
            } else
            {
                IFormFile file = car.ImageFile;
                car.Image = await SaveImage(file);

                updateCommand = new MySqlCommand("UPDATE cars SET image = @image, km = @km, seatnumber = @seatnumber WHERE id = @id", dbConnect);


                updateCommand.Parameters.AddWithValue("@id", id);
                updateCommand.Parameters.AddWithValue("@image", car.Image);
                updateCommand.Parameters.AddWithValue("@km", car.DistanceTravelled);
                updateCommand.Parameters.AddWithValue("@seatnumber", car.SeatNumber);
            }



            int updateID = updateCommand.ExecuteNonQuery();
            if (updateID > 0)
            {
                dbConnect.Close();
                return Ok(updateID);
            }
            return BadRequest("Nem sikerült");
        }

        [HttpPost]
        [Route("bookCarForTravel/")]

        public ActionResult<Travels> bookCarForTravel([FromBody] Travels TravelSource)
        {

           // try
          //  {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT carid FROM travels WHERE CAST(startDate AS date) = @startTime and carid = @carid and active = 1", dbConnect);
                selectCommand.Parameters.AddWithValue("@startTime", DateOnly.FromDateTime(TravelSource.StartDate));
                selectCommand.Parameters.AddWithValue("@carid", TravelSource.CarID);


                MySqlDataReader MysqlReader = selectCommand.ExecuteReader();
                if (MysqlReader.HasRows)
                {
                    dbConnect.Close();
                    return BadRequest("Erre az időpontra már le van foglalva a jármű!");
                }

                dbConnect.Close();
            dbConnect.Open();
            // Utazás beszúrása
            MySqlCommand insertCommand = new MySqlCommand(" INSERT INTO travels(carid, tfrom, tto, tlat, tlong, slat, slong, startDate, driverid) VALUES(@carid, @from, @to, @tlat, @tlong, @slat, @slong, @startTime, @driverid)", dbConnect);
                insertCommand.Parameters.AddWithValue("@carid", TravelSource.CarID);
                insertCommand.Parameters.AddWithValue("@from", TravelSource.FromName);
                insertCommand.Parameters.AddWithValue("@to", TravelSource.ToName);
                insertCommand.Parameters.AddWithValue("@tlat", TravelSource.ToLat);
                insertCommand.Parameters.AddWithValue("@tlong", TravelSource.ToLng);
                insertCommand.Parameters.AddWithValue("@slat", TravelSource.FromLat);
                insertCommand.Parameters.AddWithValue("@slong", TravelSource.FromLng);
                insertCommand.Parameters.AddWithValue("@startTime", TravelSource.StartDate);
                insertCommand.Parameters.AddWithValue("@driverid", TravelSource.DriverID);

                insertCommand.ExecuteNonQuery();
                long insertID = insertCommand.LastInsertedId; // InsertID, ezt állítjuk be az aktuális utazáshoz

                // Jármű frissítése

                dbConnect.Close();
                return Ok("Sikeresen lefoglaltad a járművet az utazásra!");
            /*}
            catch
            {
                return BadRequest("Nem sikerült lefoglalni a járművet! Szerver hiba");
            }*/
        }

    }
}
