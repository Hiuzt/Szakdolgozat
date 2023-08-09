using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using System.Diagnostics;
using UHVAMM_server.EmailService;
using UHVAMM_server.Models;

namespace UHVAMM_server.Controllers


{
    [Route("travels/")]
    
    public class TravelController : Controller
    {

        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public TravelController(IConfiguration configuration, IEmailService emailService)
        {
            _configuration = configuration;
            _emailService = emailService;

        }

        [HttpGet]
        [Route("getAllTravelsAdmin/")]
        public ActionResult<Travels> getAllTravelsAdmin()
        {
            List<Travels> travelCollection = new List<Travels>();

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand updateCommand = new MySqlCommand("UPDATE travels SET active = 0 WHERE startDate < NOW()", dbConnect);
            updateCommand.ExecuteNonQuery();

            MySqlCommand updateCommand2 = new MySqlCommand("UPDATE travels SET active = 1 WHERE startDate > NOW() AND active = 0", dbConnect);
            updateCommand2.ExecuteNonQuery();

            MySqlCommand selectCommand = new MySqlCommand("SELECT travels.id, travels.carid, travels.tfrom, travels.tto," +
                " travels.startDate, travels.tlat, travels.tlong, travels.slat, travels.slong, travels.driverid, travels.active," +
                " users.image, users.firstname, users.surname, users.id FROM travels" +
                " LEFT JOIN users ON users.id = driverid", dbConnect);



            MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
            while (MySqlDataReader.Read())
            {
                ////if (MySqlDataReader.GetInt32(2) <= 0)
                /// ELlenőrízni, hogymég az út nem járt le
                // {
                Travels travelSource = new Travels();

                travelSource.ID = MySqlDataReader.GetInt32(0);
                travelSource.CarID = MySqlDataReader.GetInt32(1);
                travelSource.FromName = MySqlDataReader.GetString(2);
                travelSource.ToName = MySqlDataReader.GetString(3);
                travelSource.StartDate = Convert.ToDateTime(MySqlDataReader.GetDateTime(4));
                travelSource.ToLat = MySqlDataReader.GetFloat(5);
                travelSource.ToLng = MySqlDataReader.GetFloat(6);
                travelSource.FromLat = MySqlDataReader.GetFloat(7);
                travelSource.FromLng = MySqlDataReader.GetFloat(8);
                travelSource.DriverID = MySqlDataReader.GetInt32(9);
                travelSource.DriverName = MySqlDataReader.GetString(12) + " " + MySqlDataReader.GetString(13);
                travelSource.DriverImage = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(11));
                travelSource.Active = MySqlDataReader.GetInt32(10);


                travelCollection.Add(travelSource);
                // }

            }
            dbConnect.Close();
            return Ok(travelCollection);
        }

        [HttpPatch]
        [Route("updateTravel/{id:int}")]
        public ActionResult<Travels> updateTravel([FromBody] Travels travelSource, int id)
        {
            try
            {


                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand mySqlCommand = new MySqlCommand("UPDATE travels SET slat = @slat, slong = @slong, tfrom = @tfrom, tto = @tto, tlat = @tlat, tlong = @tlong, startDate = @startDate WHERE id = @id", dbConnect);
                mySqlCommand.Parameters.AddWithValue("@slat", travelSource.FromLat);
                mySqlCommand.Parameters.AddWithValue("@slong", travelSource.FromLng);
                mySqlCommand.Parameters.AddWithValue("@tlat", travelSource.ToLat);
                mySqlCommand.Parameters.AddWithValue("@tlong", travelSource.ToLng);
                mySqlCommand.Parameters.AddWithValue("@tto", travelSource.ToName);
                mySqlCommand.Parameters.AddWithValue("@tfrom", travelSource.FromName);
                mySqlCommand.Parameters.AddWithValue("@startDate", travelSource.StartDate);

                mySqlCommand.Parameters.AddWithValue("@id", id);

                mySqlCommand.ExecuteNonQuery();

                dbConnect.Close();
                return Ok("Sikeresen frissítetted az utazást");
            } catch
            {
                return BadRequest("Szerverhiba!");
            }
        }


        [HttpGet]
        [Route("getAllTravels/")]
        public ActionResult<Travels> getAllTravels()
        {
            List<Travels> travelCollection = new List<Travels>();

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand updateCommand = new MySqlCommand("UPDATE travels SET active = 0 WHERE startDate < NOW()", dbConnect);
            updateCommand.ExecuteNonQuery();

            MySqlCommand updateCommand2 = new MySqlCommand("UPDATE travels SET active = 1 WHERE startDate > NOW() AND active = 0", dbConnect);
            updateCommand2.ExecuteNonQuery();

            MySqlCommand selectCommand = new MySqlCommand("SELECT travels.id, travels.carid, travels.tfrom, travels.tto," +
                " travels.startDate, travels.tlat, travels.tlong, travels.slat, travels.slong, travels.driverid, travels.active," +
                " users.image, users.firstname, users.surname, users.id FROM travels" +
                " LEFT JOIN users ON users.id = driverid WHERE active = 1", dbConnect);

           

            MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
            while (MySqlDataReader.Read())
            {
                ////if (MySqlDataReader.GetInt32(2) <= 0)
                /// ELlenőrízni, hogymég az út nem járt le
                // {
                Travels travelSource = new Travels();

                travelSource.ID = MySqlDataReader.GetInt32(0);
                travelSource.CarID = MySqlDataReader.GetInt32(1);
                travelSource.FromName = MySqlDataReader.GetString(2);
                travelSource.ToName = MySqlDataReader.GetString(3);
                travelSource.StartDate = Convert.ToDateTime(MySqlDataReader.GetDateTime(4));
                travelSource.ToLat = MySqlDataReader.GetFloat(5);
                travelSource.ToLng = MySqlDataReader.GetFloat(6);
                travelSource.FromLat = MySqlDataReader.GetFloat(7);
                travelSource.FromLng = MySqlDataReader.GetFloat(8);
                travelSource.DriverID = MySqlDataReader.GetInt32(9);
                travelSource.DriverName = MySqlDataReader.GetString(12) + " " + MySqlDataReader.GetString(13);
                travelSource.DriverImage = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(11));
                travelSource.Active = MySqlDataReader.GetInt32(10);


                travelCollection.Add(travelSource);
                // }

            }
            dbConnect.Close();
            return Ok(travelCollection);
        }

        [HttpGet]
        [Route("getTravellersByTravelID/{id:int}")]
        public ActionResult<TravellingUsers> getTravellersByTravelID(int id)
        {
            List<TravellingUsers>userList = new List<TravellingUsers>();
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            MySqlCommand selectCommand = new MySqlCommand("SELECT applications.travelid, applications.fromUser," +
                " applications.state, users.id, users.firstname, users.surname FROM applications" +
                " LEFT JOIN users ON users.id = applications.fromUser " +
                "WHERE state = 1 AND travelid = @travelid" +
                "", dbConnect);

            selectCommand.Parameters.AddWithValue("@travelid", id);

            dbConnect.Open();

            MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
            while (MySqlDataReader.Read())
            {
                TravellingUsers travelUserSource = new TravellingUsers();


                travelUserSource.id = MySqlDataReader.GetInt32(3);
                travelUserSource.name = MySqlDataReader.GetString(4) + " " + MySqlDataReader.GetString(5);

                userList.Add(travelUserSource);
            }
            dbConnect.Close();
            return Ok(userList);
        }

        [HttpGet]
        [Route("getTravelsByUserID/{id:int}")]
        public ActionResult<Task> getTravelsByUserID(int id)
        {
            List<Travels> travelList = new List<Travels>();
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            MySqlCommand selectCommand = new MySqlCommand("SELECT  travels.id, travels.driverid, travels.tto, travels.tfrom," +
                " travels.startDate, travels.active, applications.travelid," +
                " applications.state, applications.fromUser, users.id, users.firstname, users.surname, users.image, travels.driverid FROM applications" +
                " LEFT JOIN travels ON travels.id = applications.travelid " +
                " LEFT JOIN users ON users.id = travels.driverid" +
                " WHERE (state = 1 AND fromUser = @id) ", dbConnect);



            selectCommand.Parameters.AddWithValue("@id", id);
            
            dbConnect.Open();

            MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
            while (MySqlDataReader.Read())
            {
                Travels travelSource = new Travels();

                travelSource.ID = MySqlDataReader.GetInt32(0);
                travelSource.DriverID = MySqlDataReader.GetInt32(1);
                travelSource.DriverName = MySqlDataReader.GetString(10) + " " + MySqlDataReader.GetString(11);
                travelSource.DriverImage = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(12));

                travelSource.ToName = MySqlDataReader.GetString(2);
                travelSource.FromName = MySqlDataReader.GetString(3);
                travelSource.StartDate = MySqlDataReader.GetDateTime(4);
                travelSource.Active = MySqlDataReader.GetInt32(5);

                travelList.Add(travelSource);
            }

            dbConnect.Close();
            dbConnect.Open();
            selectCommand = new MySqlCommand("SELECT  travels.id, travels.driverid, travels.tto, travels.tfrom," +
                 " travels.startDate, travels.active, applications.travelid," +
                 " applications.state, applications.fromUser, users.id, users.firstname, users.surname, users.image, travels.driverid FROM travels" +
                 " LEFT JOIN applications ON travels.id = applications.travelid " +
                 " LEFT JOIN users ON users.id = travels.driverid" +
                 " WHERE (driverid = @id) ", dbConnect);
            selectCommand.Parameters.AddWithValue("@id", id);
            
            MySqlDataReader = selectCommand.ExecuteReader();
            while (MySqlDataReader.Read())
            {
                Travels travelSource = new Travels();

                travelSource.ID = MySqlDataReader.GetInt32(0);
                travelSource.DriverID = MySqlDataReader.GetInt32(1);
                travelSource.DriverName = MySqlDataReader.GetString(10) + " " + MySqlDataReader.GetString(11);
                travelSource.DriverImage = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(12));

                travelSource.ToName = MySqlDataReader.GetString(2);
                travelSource.FromName = MySqlDataReader.GetString(3);
                travelSource.StartDate = MySqlDataReader.GetDateTime(4);
                travelSource.Active = MySqlDataReader.GetInt32(5);

                travelList.Add(travelSource);
            }


            dbConnect.Close();
            return Ok(travelList);
        }

        [HttpPatch]
        [Route("archivetravel/{id:int}")]
        public ActionResult<Travels> archiveTravel(int id)
        {
            try
            {

           
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand updateCommand = new MySqlCommand("UPDATE travels SET active = 2 WHERE id = @id", dbConnect);
            updateCommand.Parameters.AddWithValue("@id", id);

            updateCommand.ExecuteNonQuery();

            return Ok("Sikeresen kitörölted az utat!");
            } catch
            {
                return BadRequest("Szerverhiba!");
            }
            
        }


        [HttpDelete]
        [Route("delete/{id:int}")]
        public ActionResult<Travels> deleteTravel(int id)
        {
            try
            {


                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand updateCommand = new MySqlCommand("DELETE FROM travels WHERE id = @id", dbConnect);
                updateCommand.Parameters.AddWithValue("@id", id);

                updateCommand.ExecuteNonQuery();

                return Ok("Sikeresen kitörölted az utat!");
            }
            catch
            {
                return BadRequest("Szerverhiba!");
            }

        }

        [HttpGet]
        [Route("getTravelsByCarID/{id:int}")]
        public ActionResult<Travels> getTravelsByCarID(int id)
        {



            List<Travels> travelCollection = new List<Travels>();

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT travels.id, travels.carid, travels.tfrom, travels.tto, travels.startDate, travels.tlat, travels.tlong, travels.slat," +
                " travels.slong, travels.driverid," +
                " travels.active, users.image, users.firstname, users.surname, users.id FROM travels" +
                " LEFT JOIN users ON users.id = travels.driverid WHERE carid = @carid and active = 1", dbConnect);

            selectCommand.Parameters.AddWithValue("@carid", id);

            MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
            while (MySqlDataReader.Read())
            {
                ////if (MySqlDataReader.GetInt32(2) <= 0)
                /// ELlenőrízni, hogymég az út nem járt le
               // {
                    Travels travelSource = new Travels();

                    travelSource.ID = MySqlDataReader.GetInt32(0);
                    travelSource.CarID = MySqlDataReader.GetInt32(1);
                    travelSource.FromName = MySqlDataReader.GetString(2);
                    travelSource.ToName = MySqlDataReader.GetString(3);
                    travelSource.StartDate = Convert.ToDateTime(MySqlDataReader.GetDateTime(4));
                    travelSource.ToLat = MySqlDataReader.GetFloat(5);
                    travelSource.ToLng = MySqlDataReader.GetFloat(6);
                    travelSource.FromLat = MySqlDataReader.GetFloat(7);
                    travelSource.FromLng = MySqlDataReader.GetFloat(8);
                    travelSource.DriverID = MySqlDataReader.GetInt32(9);
                    travelSource.DriverName = MySqlDataReader.GetString(12) + " " + MySqlDataReader.GetString(13);
                    travelSource.DriverImage = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(11));


                travelCollection.Add(travelSource);
               // }

            }
            dbConnect.Close();
            return Ok(travelCollection);
        }
    }
}
