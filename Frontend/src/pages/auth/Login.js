import React, {useState} from "react"
import { toast } from "react-toastify";
import "./auth.css"
import { LoginUser } from "../../services/authServices/authService";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { SET_LOGIN, SET_USER_NAME, SET_USER } from "../../redux/features/auth/authSlice";
import Cookies from "js-cookie";

const Home = () => {

	const dispatch = useDispatch();
	const navigate = useNavigate();

    const [userName, setUserName] = useState("")
    const [userPass, setUserPass] = useState("")

    const handleLogin = async(e) => {
        e.preventDefault();

        const postedData = {
            Name: userName,
            Password: userPass,
        }
		
		if (!postedData.Name || !postedData.Password) {
			return toast.error("Nem töltötted ki az összes mezőt!");
		}
		try {
			LoginUser(postedData).then(function(result) {
				if (result) {

					dispatch(SET_LOGIN(true));
					dispatch(SET_USER(result));				
					localStorage.setItem("userImage", result.image)
					Cookies.set("token", result.token);
					navigate("/home");
				}
			});

			
		} catch(error) {

			console.log(error)
		}
  	};

  return (		
	<div className="login-auth-container">
		<div className="box">
			<img src={require("../../files/towely-logo.png")} alt=""/>
			<h2>Kérlek jelentkezz be!</h2>
			<br></br>
			<form onSubmit={handleLogin}>
				<div className="input-container">                      
					<input type = "text" value={userName} onChange={(e) => setUserName(e.target.value)} id = "Felhasználónév" required />
					<label for="Felhasználónév" >Felhasználónév</label>
				</div>
				<div className="input-container">                      
					<input type = "password" value={userPass} onChange={(e) => setUserPass(e.target.value)} id = "Jelszó" required/>
					<label for="Jelszó" >Jelszó</label>
				</div>		
					<div className="btn">
					<input type = "submit" value="Bejelentkezés"></input>
				</div>            	
			</form>
			<Link to="/register">Nincs felhasználód? Ide kattintva tudsz regisztrálni.</Link>
			<Link to="/forgot">Elfelejtett jelszó</Link>
		</div>
	</div>

  	)
}

export default Home
