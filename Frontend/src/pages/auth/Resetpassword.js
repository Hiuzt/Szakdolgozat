import React, {useRef, useState} from "react"
import { forgotPasswordForm, resetPasswordForm } from "../../services/authServices/authService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";


const Resetpassword = () => {
    const params = useParams();
    const newPassword = useRef();
    const passwordConfirm = useRef();
    const navigate = useNavigate();
    const [isSuccess, setSuccess] = useState(false);

    const handleForm = (e) => {
        e.preventDefault();
        if (newPassword.current.value !== passwordConfirm.current.value) {
            toast.error("A két jelszó nem eggyezik!")
            return;
        }
        if (newPassword.current.value.length < 5) {
            toast.error("A jelszónak minimum 5 karakterből kell állnia!");            
            return
        }
        if (params.resetToken.length < 5) {
            toast.error("Hibás a link!");
        }

        const userData = {
            Password: newPassword.current.value,
            
        }
        resetPasswordForm(params.resetToken, userData).then(function(result) {
            setSuccess(result);
            setTimeout(() => {
                navigate("/")
            }, 3000)
        });
    }

  return (
     <>
     
        {isSuccess ?
            <div className="reset-container">
                <div className="w4rAnimated_checkmark">
                    <svg width="300" height="300" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                        <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    </svg>
                </div>
                <h1>Sikeresen megváltoztattad a jelszavad!</h1>    
            </div>   
        :
        <div className="auth-container">
            <div className="box">
                <img src={require("../../files/towely-logo.png")} alt=""/>
                <h2>Elfelejtett jelszó</h2>
                <br></br>
                <form onSubmit={handleForm}>
                    <div className="input-container">                      
                    <input type = "password" ref={newPassword} id="password" required/>
                        <label for="password" >Új jelszó</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "password" ref={passwordConfirm} id="password2" required/>
                        <label for="password2">Jelszó megerősítés</label>
                    </div>		
                        <div className="btn">
                        <input type = "submit" value="Tovább"></input>
                    </div>            	
                </form>
            </div>
        </div>
        }
        
     </>
  )
}

export default Resetpassword