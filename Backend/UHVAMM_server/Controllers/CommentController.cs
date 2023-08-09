using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using UHVAMM_server.Models;

namespace UHVAMM_server.Controllers
{
    [Route("comments/")]
    public class CommentController : Controller
    {
        private readonly IConfiguration _configuration;

        public CommentController(IConfiguration configuration)
        {
            _configuration = configuration;

        }

        [HttpDelete]
        [Route("delete/{id:int}")]
        public ActionResult<Comments> PostComment(int id)
        {
            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand deleteCommand = new MySqlCommand("DELETE FROM comments WHERE id = @id", dbConnect);
                deleteCommand.Parameters.AddWithValue("@id", id);
                deleteCommand.ExecuteNonQuery();

                dbConnect.Close();
                return Ok("Sikeresen töröltél egy kommentet!");
            }
            catch
            {

                return BadRequest("Szerverhiba!");
            }
        }


        [HttpPost]
        [Route("post/")]
        public ActionResult<Comments> PostComment([FromBody] Comments comment)
        {
            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand insertCommand = new MySqlCommand("INSERT INTO comments(description, commentstars, ownerid, targetid) VALUES(@description, @commentstars, @ownerid, @targetid)", dbConnect);

                insertCommand.Parameters.AddWithValue("@description", comment.description);
                insertCommand.Parameters.AddWithValue("@commentstars", comment.commentValue);
                insertCommand.Parameters.AddWithValue("@ownerid", comment.ownerID);
                insertCommand.Parameters.AddWithValue("@targetid", comment.targetID);

                insertCommand.ExecuteNonQuery();
                dbConnect.Close();
                return Ok("Sikeresen létrehoztál egy kommentet!");
            } catch
            {
                return BadRequest("Nem sikerült létrehozni a kommentet!");
            }                                
        }

        [HttpGet]
        [Route("getCommentForUser/{id:int}")]
        public ActionResult<Comments> getComment(int id)
        {
            List<Comments> commentTable = new List<Comments>();

            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM comments WHERE targetID = @id", dbConnect);
                selectCommand.Parameters.AddWithValue("@id", id);

                MySqlDataReader MySqlDataReader = selectCommand.ExecuteReader();
                while (MySqlDataReader.Read())
                {
                    Comments commentElement = new Comments();

                    commentElement.id = MySqlDataReader.GetInt32(0);
                    commentElement.description = MySqlDataReader.GetString(1);
                    commentElement.commentValue = MySqlDataReader.GetInt32(2);
                    commentElement.commentDate = MySqlDataReader.GetDateTime(5);
                    commentElement.targetID = MySqlDataReader.GetInt32(4);
                    commentElement.ownerID = MySqlDataReader.GetInt32(3);

                    Users userSource = getUserSourceByID(MySqlDataReader.GetInt32(3));

                    commentElement.ownerName = userSource.FullName;
                    commentElement.commentImage = userSource.Image;

                    commentTable.Add(commentElement);
                }
                dbConnect.Close();
                return Ok(commentTable);
            } catch
            {
                return BadRequest("Szerverhiba!");
            }       
        }

        public Users getUserSourceByID(int userID)
        {
            Users userData = new Users();
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT firstname, image, surname FROM users WHERE id = @id", dbConnect);
            selectCommand.Parameters.AddWithValue("@id", userID);

            MySqlDataReader mySqlDataReader = selectCommand.ExecuteReader();
            if (mySqlDataReader.HasRows)
            {
                
                if (mySqlDataReader.Read())
                {
                    userData.FullName = mySqlDataReader.GetString(0) + " " + mySqlDataReader.GetString(2);
                    userData.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, mySqlDataReader.GetString(1));

                }
            }
            dbConnect.Close();
            return userData;
        }
    }
}