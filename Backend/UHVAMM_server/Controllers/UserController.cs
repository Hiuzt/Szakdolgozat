using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySqlConnector;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UHVAMM_server.EmailService;
using UHVAMM_server.Models;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace UHVAMM_server.Controllers
{
    [Route("users/")]

    public class UserController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IEmailService _emailService;

        public UserController(IConfiguration configuration, IWebHostEnvironment hostEnvironment, IEmailService emailService)
        {
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
            _emailService = emailService;

        }

        // salt $2a$10$bNoJfO8cZUHIY54mN/ZJ5e

        [HttpPost]
        [Route("login/")]
        public ActionResult<Users> LoginUser([FromBody] Users user)
        {
            //  try
            //  {
            

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM users WHERE username = @username", dbConnect);
            selectCommand.Parameters.AddWithValue("@username", user.Name);
            MySqlDataReader sqlReader = selectCommand.ExecuteReader();

            if (sqlReader.HasRows)
            {
                
                var readLine = sqlReader.Read();
                if (readLine)
                {
                    
                    if (BCrypt.Net.BCrypt.Verify(user.Password, (string)sqlReader["password"]))
                    {
                        if (sqlReader.GetInt32(12) == 0)
                        {

                            return BadRequest("Ez a felhasználó még nincs megerősítve!");
                        }
                        user.ID = sqlReader.GetInt32(0);
                        user.Email = sqlReader.GetString(5);
                        user.BirthDay = sqlReader.GetDateTime(6);
                        user.FullName = sqlReader.GetString(10) + " " + sqlReader.GetString(11);
                        user.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, sqlReader.GetString(9));
                        // Token generálás
                        string generatedToken = CreateToken(user);
                        user.Token = generatedToken;


                        var cookieOptions = new CookieOptions()
                        {
                            HttpOnly = false,
                            IsEssential = true,
                            Secure = true,
                            SameSite = SameSiteMode.None,
                            Domain = HttpContext.Request.Host.ToString(),
                            Expires = DateTime.UtcNow.AddDays(1)
                        };

                        Response.Cookies.Append("token", generatedToken, cookieOptions);

                        

                        // HttpContext.Response.Cookies
                        return Ok(user);
                    }
                    return BadRequest("Ehhez a felhasználónévhez nem ez a jelszó tartozik!");
                }
            }
            return BadRequest("Nem létezik ilyen felhasználó!");
           /* } catch
            {
                return BadRequest("Szerverhiba");
            }*/
        }

        [HttpDelete]
        [Route("delete/{id:int}")]
        public ActionResult<Users> deleteUser(int id)
        {
            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand deleteCommand = new MySqlCommand("DELETE FROM users WHERE id = @id", dbConnect);
                deleteCommand.Parameters.AddWithValue("@id", id);
                deleteCommand.ExecuteNonQuery();

                dbConnect.Close();
                return Ok("Sikeresen kitöröltél egy felhasználót!");
            } catch
            {
                
                return BadRequest("Szerverhiba!");
            }
            
        }

        [HttpGet]
        [Route("getAllUsers/")]
        public ActionResult<Users> getAllUsers(int id)
        {
            try
            {
                List<Users> usersList = new List<Users>();
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM users", dbConnect);
                selectCommand.Parameters.AddWithValue("@id", id);

                MySqlDataReader mysqlReader = selectCommand.ExecuteReader();
                while (mysqlReader.Read())
                {
                    Users userSource = new Users();
                    userSource.ID = mysqlReader.GetInt32(0);
                    userSource.Name = mysqlReader.GetString(1);
                    userSource.PhoneNumber = mysqlReader.GetString(2);
                    userSource.Admin = mysqlReader.GetInt32(4);
                    userSource.Email = mysqlReader.GetString(5);
                    userSource.BirthDay = mysqlReader.GetDateTime(6);
                    userSource.LicenseFrom = mysqlReader.GetDateTime(7);
                    userSource.RegisterTime = mysqlReader.GetDateTime(8);
                    userSource.FirstName = mysqlReader.GetString(10);
                    userSource.SurName = mysqlReader.GetString(11);
                    userSource.Active = mysqlReader.GetInt32(12);

                    userSource.FullName = mysqlReader.GetString(10) + " " + mysqlReader.GetString(11);

                    userSource.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, mysqlReader.GetString(9));

                    usersList.Add(userSource);
                }
                dbConnect.Close();
                return Ok(usersList);
            }
            catch
            {
                return BadRequest("Szerverhiba!");
            }
        }

        [HttpGet]
        [Route("getProfile/{id:int}")]
        public ActionResult<Users> getProfile(int id)
        {
            try
            {
                Users userSource = new Users();
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM users WHERE id = @id", dbConnect);
                selectCommand.Parameters.AddWithValue("@id", id);

                MySqlDataReader mysqlReader = selectCommand.ExecuteReader();
                while (mysqlReader.Read())
                {
                    userSource.ID = mysqlReader.GetInt32(0);
                    userSource.Name = mysqlReader.GetString(1);
                    userSource.PhoneNumber = mysqlReader.GetString(2);
                    userSource.Admin = mysqlReader.GetInt32(4);
                    userSource.Email = mysqlReader.GetString(5);
                    userSource.BirthDay = mysqlReader.GetDateTime(6);
                    userSource.LicenseFrom = mysqlReader.GetDateTime(7);
                    userSource.RegisterTime = mysqlReader.GetDateTime(8);                
                    userSource.FirstName = mysqlReader.GetString(10);
                    userSource.SurName = mysqlReader.GetString(11);
                    
                    userSource.FullName = mysqlReader.GetString(10) + " " + mysqlReader.GetString(11);

                    userSource.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, mysqlReader.GetString(9));

                }
            dbConnect.Close();
            return Ok(userSource);
            } catch
            {
                return BadRequest("Szerverhiba!");
            }
        }

        [HttpPost]
        [Route("forgot/")]
        public ActionResult<Users> forgotPassword([FromBody] Users userSource)
        {
            try
            {
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM users WHERE username = @username AND email = @email", dbConnect);
                selectCommand.Parameters.AddWithValue("@username", userSource.Name);
                selectCommand.Parameters.AddWithValue("@email", userSource.Email);

                Guid confirmCode = Guid.NewGuid();
                string registerLink = String.Format("http://uhvamm.szakdolgozat.site:3000/resetpassword/{0}", confirmCode);

                MySqlDataReader mysqlReader = selectCommand.ExecuteReader();
                if (mysqlReader.HasRows)
                {
                    while (mysqlReader.Read())
                    {
                        userSource.ID = mysqlReader.GetInt32(0);
                        _emailService.SendEmail(userSource.Email, "Jelszó visszaállítás", "", "A jelszó visszaállítást a linkre kattintva éred el: <a>" + registerLink + "</a>");
                        
                    }
                } else
                {
                    return BadRequest("Nincs ilyen felhasználó névvel és E-mailel létrehozott felhasználó!");
                }
                dbConnect.Close();

                dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                if (userSource.ID > 0)
                {
                    MySqlCommand insertToken = new MySqlCommand("INSERT INTO tokens(token, userID, createdAt, expiresAt, tokenType) VALUES(@token, @userID, NOW(), NOW() + INTERVAL 1 DAY, 2)", dbConnect);

                    insertToken.Parameters.AddWithValue("@token", confirmCode);
                    insertToken.Parameters.AddWithValue("@userID", userSource.ID );
                    insertToken.ExecuteNonQuery();


                    dbConnect.Close();
                    return Ok("Az E-Mailt elküldtük!");
                }
                return BadRequest("Nincs ilyen felhasználó névvel és E-mailel létrehozott felhasználó!");

            } catch
            {
                return BadRequest("Szerverhiba!");
            }
            
        }

        [HttpPatch]
        [Route("resetpassword/{resetToken:Guid}")]
        public ActionResult<Users> resetPassword(string resetToken, [FromBody] Users userSource)
        {
           
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userSource.Password);

                MySqlCommand updateCommand = new MySqlCommand("UPDATE users LEFT JOIN tokens ON tokens.userID = users.id SET users.password = @password WHERE tokens.token = @token AND tokens.tokenType = 2", dbConnect);
                 updateCommand.Parameters.AddWithValue("@token", resetToken);
                updateCommand.Parameters.AddWithValue("@password", hashedPassword);

                int result = updateCommand.ExecuteNonQuery();
                if (result < 1)
                {
                    return BadRequest("Nem sikerült megváltoztatni, nincs ilyen token!");
                }
                dbConnect.Close();
                dbConnect.Open();
                MySqlCommand deleteCommand = new MySqlCommand("DELETE FROM tokens WHERE token = @token", dbConnect);
                deleteCommand.Parameters.AddWithValue("@token", resetToken);
                deleteCommand.ExecuteNonQuery();

                dbConnect.Close();
                return Ok("Sikeresen megváltoztattad a jelszavad!");
       
            
        }

        [HttpPatch]
        [Route("confirm/{confirmCode:Guid}")]
        public ActionResult<Users> confirmUser(string confirmCode)
        {
            /*try
            {*/
                MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                dbConnect.Open();

                MySqlCommand updateCommand = new MySqlCommand("UPDATE users LEFT JOIN tokens ON tokens.userID = users.id SET users.activated = 1" +
                    " WHERE tokens.token = @token AND users.activated = 0 AND tokens.expiresAt > NOW()", dbConnect);
                updateCommand.Parameters.AddWithValue("@token", confirmCode);

                int result = updateCommand.ExecuteNonQuery();
                if (result < 0)
                {
                    dbConnect.Close();
                    return BadRequest("Nincs ilyen kód!");
                }
                dbConnect.Close();
                dbConnect.Open();
                MySqlCommand deleteCommand = new MySqlCommand("DELETE FROM tokens WHERE token = @token", dbConnect);
                deleteCommand.Parameters.AddWithValue("@token", confirmCode);
                deleteCommand.ExecuteNonQuery();

                dbConnect.Close();
                return Ok("Sikeresen megerősítetted a felhasználót!");
           /* } catch
            {
                return BadRequest("Nem sikerült megerősíteni a felhasználót!");
            }*/
        }

        [HttpPost]
        [Route("registerByAdmin/")]
        public async Task<ActionResult<Users>> RegisterByAdmin([FromForm] Users user)
        {
            if (isUsernameExists(user.Name))
            {
                return BadRequest("Ez a felhasználónév már létezik!");
            }

            if (isEmailExists(user.Email))
            {
                return BadRequest("Ez az E-mail cím már foglalt!");
            }
            MySqlConnection dbConnect;
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            Guid verifyCode = Guid.NewGuid();
            string registerLink = String.Format("http://uhvamm.szakdolgozat.site:3000/confirm/{0}", verifyCode);

            if (user.Active == 0)
            {
                _emailService.SendEmail(user.Email, "Regisztráció megerősítés", "", "Kérlek erősíts meg a regisztrációt erre a linkre kattintva: " + registerLink);

            }
            IFormFile file = null;
            if (user.Image  != null)
            {
                file = user.ImageFile;
                user.Image = await SaveImage(file);
            } else
            {
                user.Image = "default.png";
            }
            dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand insertCommand = new MySqlCommand("INSERT INTO users(username, password, email, age, license_from, firstname, surname, activated, image, admin, phonenumber) VALUES(@username, @password, @email, @age, @licensefrom, @firstname, @surname, @active, @image, @admin, @phonenumber)", dbConnect);


            insertCommand.Parameters.AddWithValue("@username", user.Name);

            insertCommand.Parameters.AddWithValue("@password", hashedPassword);
            insertCommand.Parameters.AddWithValue("@email", user.Email);
            insertCommand.Parameters.AddWithValue("@age", user.BirthDay);
           
            insertCommand.Parameters.AddWithValue("@licensefrom", user.LicenseFrom);
            insertCommand.Parameters.AddWithValue("@firstname", user.FirstName);
            insertCommand.Parameters.AddWithValue("@surname", user.SurName);
            insertCommand.Parameters.AddWithValue("@active", user.Active);
            insertCommand.Parameters.AddWithValue("@image", user.Image);
            insertCommand.Parameters.AddWithValue("@admin", user.Admin);
            insertCommand.Parameters.AddWithValue("@phonenumber", user.PhoneNumber);
            int insertID = insertCommand.ExecuteNonQuery();
            long lastInsertID = insertCommand.LastInsertedId;
            if (insertCommand.LastInsertedId > 0)
            {
                if (user.Active == 0)
                {
                    dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                    dbConnect.Open();

                MySqlCommand insertToken = new MySqlCommand("INSERT INTO tokens(token, userID, createdAt, expiresAt, tokenType)  VALUES(@token, @userID, NOW(), NOW() + INTERVAL 1 DAY, 1)", dbConnect);

                insertToken.Parameters.AddWithValue("@token", verifyCode);
                insertToken.Parameters.AddWithValue("@userID", insertID);
                insertToken.ExecuteNonQuery();

                dbConnect.Close();
                    return Ok("Sikeres regisztráció!");
                }
                return Ok("Sikeres regisztráció!");

            }
            return BadRequest("Sikertelen regisztráció!");
        }

        [HttpPost]
        [Route("register/")]
        public ActionResult<Users> RegisterUser([FromBody] Users user)
        {
            if (isUsernameExists(user.Name))
            {
                return BadRequest("Ez a felhasználónév már létezik!");
            }
            
            if (isEmailExists(user.Email))
            {
                return BadRequest("Ez az E-mail cím már foglalt!");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            Guid verifyCode = Guid.NewGuid();
            string registerLink = String.Format("http://uhvamm.szakdolgozat.site:3000/confirm/{0}", verifyCode);


            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand insertCommand = new MySqlCommand("INSERT INTO users(username, password, email, age, license_from, firstname, surname) VALUES(@username, @password, @email, @age, @licensefrom, @firstname, @surname)", dbConnect);

            insertCommand.Parameters.AddWithValue("@username", user.Name);

            insertCommand.Parameters.AddWithValue("@password", hashedPassword);
            insertCommand.Parameters.AddWithValue("@email", user.Email);
            insertCommand.Parameters.AddWithValue("@age", user.BirthDay);
            insertCommand.Parameters.AddWithValue("@licensefrom", user.LicenseFrom);
            insertCommand.Parameters.AddWithValue("@firstname", user.FirstName);
            insertCommand.Parameters.AddWithValue("@surname", user.SurName);
            insertCommand.ExecuteNonQuery();
            long insertID = insertCommand.LastInsertedId;

            if (insertID > -1)
            {
                dbConnect.Close();
                dbConnect.Open();
                _emailService.SendEmail(user.Email, "Regisztráció megerősítés", "", "Kérlek erősíts meg a regisztrációt erre a linkre kattintva: " + registerLink);
                MySqlCommand insertToken = new MySqlCommand("INSERT INTO tokens(token, userID, createdAt, expiresAt, tokenType) " +
                    " VALUES(@token, @userID, NOW(), NOW() + INTERVAL 1 DAY, 1)", dbConnect);

                insertToken.Parameters.AddWithValue("@token", verifyCode);
                insertToken.Parameters.AddWithValue("@userID", insertID);
                insertToken.ExecuteNonQuery();

                dbConnect.Close();
                return Ok("Sikeres regisztráció!");

            }
            return BadRequest("Sikertelen regisztráció!");
        }

        [HttpPost]
        [Route("searchForProfile/")]
        public ActionResult<Users> searchForProfile([FromBody] Users user)
        {
            user.FirstName = user.Name;
            List<Users> userList = new List<Users>();
            if (user.Name.Contains(" "))
            {
                user.FirstName = user.Name.Split(" ")[0];
                user.SurName = user.Name.Split(" ")[1];
            }
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();
            MySqlCommand? selectCommand = null;

            if (user.SurName.Length > 0)
            {
                selectCommand = new MySqlCommand("SELECT * FROM users WHERE firstname = @firstname AND surname LIKE @surname", dbConnect);

                selectCommand.Parameters.AddWithValue("@firstname", user.FirstName);
                selectCommand.Parameters.AddWithValue("@surname", user.SurName + "%");
                
                MySqlDataReader mysqlReader = selectCommand.ExecuteReader();
                if (mysqlReader.HasRows)
                {
                    while (mysqlReader.Read())
                    {
                        Users userSource = new Users();

                        userSource.ID = mysqlReader.GetInt32(0);
                        userSource.Name = mysqlReader.GetString(1);
                        userSource.PhoneNumber = mysqlReader.GetString(2);
                        userSource.Admin = mysqlReader.GetInt32(4);
                        userSource.Email = mysqlReader.GetString(5);
                        userSource.BirthDay = mysqlReader.GetDateTime(6);
                        userSource.LicenseFrom = mysqlReader.GetDateTime(7);
                        userSource.RegisterTime = mysqlReader.GetDateTime(8);
                        userSource.FirstName = mysqlReader.GetString(10);
                        userSource.SurName = mysqlReader.GetString(11);

                        userSource.FullName = mysqlReader.GetString(10) + " " + mysqlReader.GetString(11);
                        userSource.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, mysqlReader.GetString(9));

                        userList.Add(userSource);
                    }
                    return Ok(userList);
                } else
                {
                    return BadRequest("Nincs ilyen nevű felhasználó!");
                }
            } else
            {
                selectCommand = new MySqlCommand("SELECT * FROM users WHERE firstname LIKE @firstname", dbConnect);

                selectCommand.Parameters.AddWithValue("@firstname", user.FirstName +  "%");

                MySqlDataReader mysqlReader = selectCommand.ExecuteReader();
                if (mysqlReader.HasRows)
                {
                    while (mysqlReader.Read())
                    {
                        Users userSource = new Users();

                        userSource.ID = mysqlReader.GetInt32(0);
                        userSource.Name = mysqlReader.GetString(1);
                        userSource.PhoneNumber = mysqlReader.GetString(2);
                        userSource.Admin = mysqlReader.GetInt32(4);
                        userSource.Email = mysqlReader.GetString(5);
                        userSource.BirthDay = mysqlReader.GetDateTime(6);
                        userSource.LicenseFrom = mysqlReader.GetDateTime(7);
                        userSource.RegisterTime = mysqlReader.GetDateTime(8);
                        userSource.FirstName = mysqlReader.GetString(10);
                        userSource.SurName = mysqlReader.GetString(11);

                        userSource.FullName = mysqlReader.GetString(10) + " " + mysqlReader.GetString(11);
                        userSource.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, mysqlReader.GetString(9));

                        userList.Add(userSource);
                    }
                    return Ok(userList);
                }
                else
                {
                    return BadRequest("Nincs ilyen nevű felhasználó!");
                }
            }
            return BadRequest("Rossz");
        }


        [HttpPatch]
        [Route("updateUserByAdmin/{id:int}")]
        public async Task<ActionResult<Users>> updateUserByAdmin([FromForm] Users user, int id)
        {
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();
            MySqlCommand? updateCommand = null;

            if (user.Image != null)
            {
                IFormFile file = user.ImageFile;
                user.Image = await SaveImage(file);

                updateCommand = new MySqlCommand("UPDATE users SET username = @username, license_from = @licensefrom, image = @image, firstname = @firstname, surname = @surname, phonenumber = @phonenumber, email = @email, age = @age, admin = @admin, activated = @active WHERE id = @id", dbConnect);
                updateCommand.Parameters.AddWithValue("@image", user.Image);
                updateCommand.Parameters.AddWithValue("@firstname", user.FirstName);
                updateCommand.Parameters.AddWithValue("@surname", user.SurName);
                updateCommand.Parameters.AddWithValue("@username", user.Name);
                updateCommand.Parameters.AddWithValue("@licensefrom", user.LicenseFrom);
                updateCommand.Parameters.AddWithValue("@phonenumber", user.PhoneNumber);
                updateCommand.Parameters.AddWithValue("@email", user.Email);
                updateCommand.Parameters.AddWithValue("@age", user.BirthDay);
                updateCommand.Parameters.AddWithValue("@active", user.Active);
                updateCommand.Parameters.AddWithValue("@admin", user.Admin);
                updateCommand.Parameters.AddWithValue("@id", id);
            }
            else
            {
                updateCommand = new MySqlCommand("UPDATE users SET username = @username, license_from = @licensefrom, firstname = @firstname, surname = @surname, phonenumber = @phonenumber, email = @email, age = @age, admin = @admin, activated = @active WHERE id = @id", dbConnect);
                updateCommand.Parameters.AddWithValue("@firstname", user.FirstName);
                updateCommand.Parameters.AddWithValue("@surname", user.SurName);
                updateCommand.Parameters.AddWithValue("@username", user.Name);
                updateCommand.Parameters.AddWithValue("@licensefrom", user.LicenseFrom);
                updateCommand.Parameters.AddWithValue("@phonenumber", user.PhoneNumber);
                updateCommand.Parameters.AddWithValue("@email", user.Email);
                updateCommand.Parameters.AddWithValue("@age", user.BirthDay);
                updateCommand.Parameters.AddWithValue("@active", user.Active);
                updateCommand.Parameters.AddWithValue("@admin", user.Admin);
                updateCommand.Parameters.AddWithValue("@id", id);
            }



            updateCommand.ExecuteNonQuery();

            dbConnect.Close();
            if (user.Image != null)
            {
                user.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, user.Image);
                return Ok(user.Image);
            }
            return Ok(false);
        }

        [HttpPatch]
        [Route("updateUser/{id:int}")]
        public async Task<ActionResult<Users>> updateUser([FromForm] Users user, int id)
        {
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();
            MySqlCommand? updateCommand = null;

            if (user.Image != null)
            {
                IFormFile file = user.ImageFile;
                user.Image = await SaveImage(file);

                updateCommand = new MySqlCommand("UPDATE users SET image = @image, firstname = @firstname, surname = @surname, phonenumber = @phonenumber, email = @email, age = @age WHERE id = @id", dbConnect);
                updateCommand.Parameters.AddWithValue("@image", user.Image);
                updateCommand.Parameters.AddWithValue("@firstname", user.FirstName);
                updateCommand.Parameters.AddWithValue("@surname", user.SurName);
                updateCommand.Parameters.AddWithValue("@phonenumber", user.PhoneNumber);
                updateCommand.Parameters.AddWithValue("@email", user.Email);
                updateCommand.Parameters.AddWithValue("@age", user.BirthDay);
                updateCommand.Parameters.AddWithValue("@id", id);
            } else {
                updateCommand = new MySqlCommand("UPDATE users SET firstname = @firstname, surname = @surname, phonenumber = @phonenumber, email = @email, age = @age WHERE id = @id", dbConnect);
                updateCommand.Parameters.AddWithValue("@firstname", user.FirstName);
                updateCommand.Parameters.AddWithValue("@surname", user.SurName);
                updateCommand.Parameters.AddWithValue("@phonenumber", user.PhoneNumber);
                updateCommand.Parameters.AddWithValue("@email", user.Email);
                updateCommand.Parameters.AddWithValue("@age", user.BirthDay);
                updateCommand.Parameters.AddWithValue("@id", id);
            }



            updateCommand.ExecuteNonQuery();
  
            dbConnect.Close();
            if (user.Image != null)
            {
                user.Image = String.Format("{0}://{1}{2}/images/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, HttpContext.Request.PathBase, user.Image);
                return Ok(user.Image);
            }
            return Ok(false);
        }

        [HttpPatch]
        [Route("changePasswordByAdmin/{id:int}")]
        public ActionResult<Users> changePasswordByAdmin([FromBody] Users user, int id)
        {

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();
            try
            {
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

                    MySqlCommand updateCommand = new MySqlCommand("UPDATE users SET password = @password WHERE id = @id", dbConnect);
                    updateCommand.Parameters.AddWithValue("@password", hashedPassword);
                    updateCommand.Parameters.AddWithValue("@id", id);

                    updateCommand.ExecuteNonQuery();
                    dbConnect.Close();

                return Ok("Sikeres jelszó változtatás!");
            } catch
            {
                return BadRequest("Hiba!");
            }
            return BadRequest("Hiba! Rossz jelszót adtál meg!");


        }

        [HttpPatch]
        [Route("changePassword/{id:int}")]
        public ActionResult<Users> changePassword([FromBody] Users user, int id)
        {

            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT password FROM users WHERE id = @id", dbConnect);
            selectCommand.Parameters.AddWithValue("@id", id);
            MySqlDataReader sqlReader = selectCommand.ExecuteReader();
            if (sqlReader.HasRows)
            {
                
                var readLine = sqlReader.Read();
                if (readLine)
                {
                    if (BCrypt.Net.BCrypt.Verify(user.oldPassword, sqlReader.GetString(0)))
                    {
                        dbConnect.Close();
                        dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
                        dbConnect.Open();
                        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

                        MySqlCommand updateCommand = new MySqlCommand("UPDATE users SET password = @password WHERE id = @id", dbConnect);
                        updateCommand.Parameters.AddWithValue("@password", hashedPassword);
                        updateCommand.Parameters.AddWithValue("@id", id);

                        updateCommand.ExecuteNonQuery();

                        return Ok("Sikeresen megváltoztattad a jelszavad!");
                    }
                }
            }
            dbConnect.Close();
            return BadRequest("Hiba! Rossz jelszót adtál meg!");


        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageSource)
        {
            
            String imageName = new String(Guid.NewGuid() + Path.GetExtension(imageSource.FileName));
            imageName = imageName.Replace("-", "");

            // Image path létrehozása
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageSource.CopyToAsync(fileStream);               
            }
            return imageName;
        }

        [NonAction]
        public string CreateToken(Users user)
        {

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { 
                    new Claim("id", user.ID.ToString()),
                    new Claim("name", user.Name.ToString()),
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var jwtToken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(jwtToken);
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJuYmYiOjE2ODE4Mjg3NjEsImV4cCI6MTY4MTkxNTE2MSwiaWF0IjoxNjgxODI4NzYxfQ._5RhzM5_sCmIHPpc2aUc1Aq3LGpaZagTjhDn3TXGWv8
        }

        [HttpGet]
        [Route("loggedin/")]
        public bool isLoggedIn()
        {
            if  (Request.Cookies["token"] != null) {
                
                var token = Request.Cookies["token"];
                
                var tokenHandler = new JwtSecurityTokenHandler();

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                 _configuration.GetSection("AppSettings:Token").Value!));

                try
                {

                    tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ClockSkew = TimeSpan.Zero
                    }, out SecurityToken validatedToken);

                    // var jwtToken = (JwtSecurityToken)validatedToken;

                    return true;

                } catch
                {
                    return false;
                }
            }
            return false;
        }

        [NonAction]
        public bool isUsernameExists(string usernameString)
        {
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM users WHERE LOWER(username) = @username", dbConnect);

            selectCommand.Parameters.AddWithValue("@username", usernameString.ToLower());
            var sqlReader = selectCommand.ExecuteReader();
            
            if (sqlReader.HasRows)
            {
                dbConnect.Close();
                return true;
            }
            dbConnect.Close();
            return false;
        }


        [NonAction]
        public bool isEmailExists(string emailString)
        {
            MySqlConnection dbConnect = new MySqlConnection(_configuration.GetConnectionString("Default").ToString());
            dbConnect.Open();

            MySqlCommand selectCommand = new MySqlCommand("SELECT * FROM users WHERE LOWER(email) = @email", dbConnect);

            selectCommand.Parameters.AddWithValue("@email", emailString.ToLower());
            var sqlReader = selectCommand.ExecuteReader();

            if (sqlReader.HasRows)
            {
                dbConnect.Close();
                return true;
            }
            dbConnect.Close();
            return false;
        }
    }
}
