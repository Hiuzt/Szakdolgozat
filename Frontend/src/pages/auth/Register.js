import React, {useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../../design.css";
import "./auth.css"
import { toast } from "react-toastify";
import { RegisterUser } from "../../services/authServices/authService";

const Register = () => {
    const navigate =  useNavigate();
    const Username = useRef()
    const Email = useRef()
    const FirstName = useRef()
    const SurName = useRef()
    const Password = useRef()
    const Password2 = useRef()
    const birthDay = useRef()
    const licenseFrom = useRef()

    const handleClick = (e) => {
        e.preventDefault();
        if (isNaN(Date.parse(birthDay.current.value))) {
            toast.error("Töltsd ki az összes mezőt!");
            return;
        }
        if (isNaN(Date.parse(licenseFrom.current.value))) {
            toast.error("Töltsd ki az összes mezőt!");
            return;
        }
        if (Password.current.value !== Password2.current.value) {
            toast.error("A 2 jelszó nem eggyezik!");
            return;
        }

        const userData = {
            Name: Username.current.value,
            Password: Password.current.value,
            FirstName: FirstName.current.value,
            Email: Email.current.value,
            SurName: SurName.current.value,
            BirthDay: birthDay.current.value,
            LicenseFrom: licenseFrom.current.value,
        }
        RegisterUser(userData).then(function(result) {
            navigate("/");
            toast.success("Sikeresen regisztráltál!");
        });
  	};


  return (
    <>
    <div className="auth-container">
            <div className="box">
                    
                <div className="right-box">
                    <div className="header">
                        <div className="logo">
                            <img src={require("../../files/towely-logo.png")} alt=""/>
                        </div>
                        <Link to="/">Bejelentkezéshez kattints ide</Link>
                    </div>
                    <div className="main-content">
                        <div>
                            <h2>Üdvözöllek a Towely cégnél</h2>
                            <h4>Kérlek regisztrálj</h4>
                        </div>
                        <form>
                            <div className="input-container">                      
                                <input type = "text" id = "Felhasználónév" ref={Username} required/>
                                <label for="Felhasználónév">Felhasználónév</label>
                            </div>
                            <div className="input-container">    
                                <input type="mail" id = "Email" ref={Email} required/>
                                <label for="Email">E-Mail</label>                
                                
                                
                            </div>
                            <div className="row">                           
                                <div className="input-container">
                                    
                                    <input type = "text" ref={FirstName} required/>
                                    <label>Vezetéknév</label>
                                </div>
                                <div className="input-container">                             
                                    <input type = "text" ref={SurName} required/>
                                    <label>Keresztnév</label>
                                </div>
                            </div>  
                            <div className="row">                           
                                <div className="input-container">
                                    
                                    <input type = "password" ref={Password} required/>
                                    <label for="Jelszó">Jelszó</label>
                                </div>
                                <div className="input-container">                             
                                    <input type = "password" ref={Password2} required/>
                                    <label>Jelszó megerősítése</label>
                                </div>
                            </div>
                          
                            <div className="input-container">     
                                <input type = "date" id = "Születési idő" ref={birthDay} />
                                <label for="Születési idő" >Születési idő</label>
                            </div> 
                            <div className="input-container">     
                                <input type = "date" id = "Jogosítvány" ref={licenseFrom} />
                                <label for="Jogosítvány" >Jogosítvány megszerezésének az ideje</label>
                            </div>                             
                            <div className="btn">
                                <input className="btn" type = "submit" value="Regisztráció" onClick={handleClick}></input>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Register
