import React, {useRef, useState} from "react"
import { Link } from "react-router-dom";
import { forgotPasswordForm } from "../../services/authServices/authService";

const Forgotpassword = () => {

    const Username = useRef();
    const Email = useRef();

    const handleForm = (e) => {
        e.preventDefault();
        const userData = {
            Name: Username.current.value,
            Email: Email.current.value,
        }

        forgotPasswordForm(userData);
    }

  return (
    <div className="auth-container">
		<div className="box">
			<img src={require("../../files/towely-logo.png")} alt=""/>
			<h2>Elfelejtett jelszó</h2>
			<br></br>
			<form onSubmit={handleForm}>
				<div className="input-container">                      
                <input type = "text" ref={Username} id="username" required/>
					<label for="username">Felhasználónév</label>
				</div>
				<div className="input-container">                      
					<input type = "text" ref={Email} id="email" required/>
					<label for="email">Email</label>
				</div>		
					<div className="btn">
					<input type = "submit" value="Tovább"></input>
				</div>            	
			</form>
			<Link to="/">Vissza a bejelentkezésre</Link>
		</div>
	</div>

  )
}

export default Forgotpassword