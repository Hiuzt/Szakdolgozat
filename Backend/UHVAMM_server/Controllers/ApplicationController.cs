using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using MySqlConnector;
using System.Data.SqlClient;
using System.Linq.Expressions;
using UHVAMM_server.EmailService;
using UHVAMM_server.Models;

namespace UHVAMM_server.Controllers
{
    [Route("applications/")]
    public class ApplicationController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public ApplicationController(IConfiguration configuration, IEmailService emailService)
        {
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost]
        [Route("applytravel/")]
        public ActionResult<Applications> userApplyForTravel([FromBody] Applications applicationSource)
        {
            if (applicationSource.FromUser > 0 && applicationSource.ToUser > 0 && applicationSource.TravelID > 0)
            {
             
                    if (hasUserThisTravel(applicationSource.FromUser, applicationSource.ToUser, applicationSource.TravelID))
                    {
                        return BadRequest("Erre az útra már jelentkeztél egyszer!");
                    }
                    if (applicationSource.ToUser  == applicationSource.FromUser)
                    {
                        return BadRequest("Ezen utazáson te vagy a sofőr!");
                    } 

                    MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                    dbConnect.Open();

                    // State - 0 - Pending, 1 - Accept, 2 - Decline
                    MySqlCommand selectCommand = new MySqlCommand("INSERT INTO applications(travelid, fromUser, toUser, state) VALUES(@travelid, @fromUser, @toUser, 0)", dbConnect);

                    selectCommand.Parameters.AddWithValue("@travelid", applicationSource.TravelID);
                    selectCommand.Parameters.AddWithValue("@fromUser", applicationSource.FromUser);
                    selectCommand.Parameters.AddWithValue("@toUser", applicationSource.ToUser);

                    selectCommand.ExecuteNonQuery();
                    dbConnect.Close();
                    return Ok("Sikeresen jelentkeztél az útra!");
                    // Email a sofőrnek


            }
            return BadRequest("Nem sikerült jelentkezni erre az útra!");
        }

        [HttpGet]
        [Route("getApplications/{id:int}")]
        public ActionResult<Applications> getApplications(int id)
        {
            List<Applications> applicationList = new List<Applications>();
            if (id > 0)
            {
                try
                {
                    MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                    dbConnect.Open();

                    MySqlCommand selectCommand = new MySqlCommand("SELECT applications.id, applications.travelid, applications.fromUser, applications.toUser, applications.state, applications.reason, applications.applicationTime, applications.modifiedTime, users.image, users.id FROM applications LEFT JOIN users ON users.id = applications.fromUser WHERE toUser = @toUser AND state = 0", dbConnect);

                    selectCommand.Parameters.AddWithValue("@toUser", id);

                    MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();

                    while (MySqlDataReader.Read())
                    {
                        Applications applicationElement = new Applications();

                        applicationElement.Id = MySqlDataReader.GetInt32(0);
                        applicationElement.Fullname = getUserNameByID(MySqlDataReader.GetInt32(2));
                        applicationElement.Email = getUserEmailByID(MySqlDataReader.GetInt32(2));
                        applicationElement.TravelID = MySqlDataReader.GetInt32(1);
                        applicationElement.UserImage = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(8));

                        applicationElement.FromUser = MySqlDataReader.GetInt32(2);
                        applicationElement.ToUser = MySqlDataReader.GetInt32(3);
                        applicationElement.Type = MySqlDataReader.GetInt32(4);
                        applicationElement.Reason = MySqlDataReader.GetString(5);
                        applicationElement.FromTo = getTravelName(MySqlDataReader.GetInt32(1));
                        applicationElement.Created = MySqlDataReader.GetDateTime(6);
                        applicationElement.Modified = MySqlDataReader.GetDateTime(7);

                        applicationList.Add(applicationElement);
                    }
                    dbConnect.Close();
                    return Ok(applicationList);
                }
                catch
                {
                    return BadRequest("Nem sikerült lekérni az adatokat, szerverhiba miatt!");
                }
            }
            return BadRequest("Nem sikerült lekérni az adatokat!");
        }
        [HttpGet]
        [Route("getMyApplications/{id:int}")]
        public ActionResult<Applications> getMyApplications(int id)
        {
            List<Applications> applicationList = new List<Applications>();
            if (id > 0)
            {
                try
                {
                    MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                    dbConnect.Open();

                    MySqlCommand selectCommand = new MySqlCommand("SELECT applications.id, applications.travelid, applications.fromUser, applications.toUser, applications.state, applications.reason, applications.applicationTime, applications.modifiedTime, users.image, users.id FROM applications LEFT JOIN users ON users.id = applications.fromUser WHERE fromUser = @fromUser", dbConnect);
                    selectCommand.Parameters.AddWithValue("@fromUser", id);

                    MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();

                    while (MySqlDataReader.Read())
                    {
                        Applications applicationElement = new Applications();

                        applicationElement.Id = MySqlDataReader.GetInt32(0);
                        applicationElement.Fullname = getUserNameByID(MySqlDataReader.GetInt32(2));
                        applicationElement.Email = getUserEmailByID(MySqlDataReader.GetInt32(2));
                        applicationElement.TravelID = MySqlDataReader.GetInt32(1);

                        applicationElement.FromUser = MySqlDataReader.GetInt32(2);
                        applicationElement.UserImage = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, MySqlDataReader.GetString(8));
                        applicationElement.ToUser = MySqlDataReader.GetInt32(3);
                        applicationElement.Type = MySqlDataReader.GetInt32(4);
                        applicationElement.Reason = MySqlDataReader.GetString(5);

                        applicationElement.FromTo = getTravelName(MySqlDataReader.GetInt32(1));
                        applicationElement.Created = MySqlDataReader.GetDateTime(6);
                        applicationElement.Modified = MySqlDataReader.GetDateTime(7);
                        
                        applicationList.Add(applicationElement);
                    }
                    dbConnect.Close();
                    return Ok(applicationList);
                }
                catch
                {
                    return BadRequest("Nem sikerült lekérni az adatokat, szerverhiba miatt!");
                }
            }
            return BadRequest("Nem sikerült lekérni az adatokat!");
        }

        [HttpPatch]
        [Route("changeApplicationState/{id:int}")]
        public ActionResult<Applications> changeApplicationState(int id, [FromBody] Applications applicationSource)
        {
            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                Console.WriteLine(applicationSource.Email);
                
                // Ellenőrzi, hogy van e hely, ha nincs status egyből elutasítva és reason: Nincs elég hely az utazásra
                if (!isSlotAvailable(applicationSource.TravelID))
                {
                    applicationSource.Type = 2;
                    applicationSource.Reason = "Nincs elég hely erre az útra, rendszer automatikusan elutasította!";
                }

                MySqlCommand updateCommand = new MySqlCommand("UPDATE applications SET state = @state, reason = @reason, modifiedTime = NOW() WHERE id = @id", dbConnect);
                updateCommand.Parameters.AddWithValue("@id", id);
                updateCommand.Parameters.AddWithValue("@state", applicationSource.Type);
                updateCommand.Parameters.AddWithValue("@reason", applicationSource.Reason);

                updateCommand.ExecuteNonQuery();
                if (applicationSource.Type == 1)
                {
                    _emailService.SendEmail(applicationSource.Email, "Elfogadták a jelentkezésed!", "Egy utazásra elfogadták a jelentkezésed!", "Egy utazásra elfogadták a jelentkezésed!");
                    dbConnect.Close();
                    return Ok("Sikeresen elfogadtad a jelentkezését!");
                    // Email a felhasználónak a státusz változásról
                }

                _emailService.SendEmail(applicationSource.Email, "Elutasították a jelentkezésed!", "A jelentkezésed egy utazsára el lett utasítva Indok: " + applicationSource.Reason, "A jelentkezésed egy utazsára el lett utasítva Indok: " + applicationSource.Reason);
                dbConnect.Close();
                return BadRequest("Elutasítottad az utazást mert: " + applicationSource.Reason);
                // Email a felhasználónak a státusz változásról
                
            }
            catch
            {
                return BadRequest("Szerverhiba");
            }
        }

        [HttpPatch]
        [Route("disableApplication/{id:int}")]
        public ActionResult<Applications> disableApplication(int id)
        {
            // Ellenőrízni, hogy 1 nappal az utazás előtt van
            // Elfogadott jelentkezés
            // Frontend ellenőrzi ezeket

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("UPDATE applications SET state = @state WHERE id = @id", dbConnect);
            dbConnect.Close();
            return Ok();
        }

        public string getTravelName(int travelID)
        {
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT tfrom, tto FROM travels WHERE id = @id", dbConnect);
            selectCommand.Parameters.AddWithValue("@id", travelID);

            MySqlDataReader mySqlDataReader = selectCommand.ExecuteReader();
            string travelName = "" + travelID;

            if (mySqlDataReader.HasRows)
            {
                if (mySqlDataReader.Read())
                {
                    travelName = string.Format("{0} - {1}", mySqlDataReader.GetString(0).Split(',')[0],  mySqlDataReader.GetString(1).Split(',')[0]);
                }
            }

            dbConnect.Close();

            return travelName;
        }

        public string getUserNameByID(int userID)
        {

                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT firstname, surname FROM users WHERE id = @id", dbConnect);
                selectCommand.Parameters.AddWithValue("@id", userID);

                MySqlDataReader mySqlDataReader = selectCommand.ExecuteReader();
                if (mySqlDataReader.HasRows)
                {
                    if (mySqlDataReader.Read())
                    {

                        string userName = mySqlDataReader.GetString(0) + " " + mySqlDataReader.GetString(1);
                        dbConnect.Close();
                        return userName;
                    }
                }
                dbConnect.Close();
                return "Nem található név!";

        }

        public string getUserEmailByID(int userID)
        {
            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT email FROM users WHERE id = @id", dbConnect);
                selectCommand.Parameters.AddWithValue("@id", userID);

                MySqlDataReader mySqlDataReader = selectCommand.ExecuteReader();
                if (mySqlDataReader.HasRows)
                {
                    if (mySqlDataReader.Read())
                    {

                        string emailValue = mySqlDataReader.GetString(0);
                        dbConnect.Close();
                        dbConnect.Close();
                        return emailValue;
                    }
                }
                dbConnect.Close();
                return "Nem található E-Mail cím!";
            } catch
            {
                return "Nem található E-Mail cím!";
            }
            
        }

        public bool hasUserThisTravel(int userID, int driverID, int travelID)
        {
            try
            {

            
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM applications WHERE fromUser = @fromUser AND toUser = @toUser AND travelid = @travelID", dbConnect);

                selectCommand.Parameters.AddWithValue("@fromUser", userID);
                selectCommand.Parameters.AddWithValue("@toUser", userID);
                selectCommand.Parameters.AddWithValue("@travelID", travelID);

                MySqlDataReader sqlReader = selectCommand.ExecuteReader();
                if (sqlReader.HasRows)
                {
                    dbConnect.Close();
                    return true;
                }
                dbConnect.Close();
                return false;
            } catch
            {
                return false;
            }
            
        }

        public bool isSlotAvailable(int travelID)
        {
            List<TravellingUsers> usersList = new List<TravellingUsers>();
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            int seatNumber = 0;
            List<int> passengerList = new List<int>();

            MySqlCommand selectCommand = new MySqlCommand("SELECT cars.seatnumber, cars.id, travels.carid FROM travels LEFT JOIN cars ON cars.id = travels.carid WHERE travels.id = @travelid", dbConnect);
            selectCommand.Parameters.AddWithValue("@travelid", travelID);
            Console.WriteLine(travelID);

            MySqlDataReader mysqlDataReader = selectCommand.ExecuteReader();
            if (mysqlDataReader.Read())
            {
                // Férőhely max
                seatNumber = mysqlDataReader.GetInt32(0);
            }

            List<TravellingUsers> travellingUsers = getUsersFromTravel(travelID);
            int travellingUsersCount = travellingUsers.Count;
            Console.WriteLine(seatNumber);
            if (travellingUsersCount + 1 <= seatNumber)
            {
                dbConnect.Close();
                return true;
            }
            dbConnect.Close();
            return false;
        }

        [HttpGet]
        [Route("getUsersFromTravel/{id:int}")]
        public ActionResult<TravellingUsers> getUsersFromTravelAPI(int id)
        {
            List<TravellingUsers> usersList = getUsersFromTravel(id);
            if (usersList.Count > 0)
            {
                return Ok(usersList);
            }
            return BadRequest("Ezen az utazáson még senki nem vesz részt!");
        }

        public List<TravellingUsers> getUsersFromTravel(int travelID)
        {
            List<TravellingUsers> usersList = new List<TravellingUsers>();
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();
            List<int> passengerList = new List<int>();

            MySqlCommand applicationSelectCommand = new MySqlCommand("SELECT * FROM applications WHERE travelid = @travelid AND state = 1", dbConnect); // Elfogadott jelentkezések az utazásra
            applicationSelectCommand.Parameters.AddWithValue("@travelid", travelID);

            MySqlDataReader applicationMysqlDataReader = applicationSelectCommand.ExecuteReader();

            while (applicationMysqlDataReader.Read())
            {
                TravellingUsers userElement = new TravellingUsers();
                userElement.id = applicationMysqlDataReader.GetInt32(2);
                userElement.name = getUserNameByID(applicationMysqlDataReader.GetInt32(2));

                usersList.Add(userElement);
            }
            dbConnect.Close();
            return usersList;


        }
    }
}
