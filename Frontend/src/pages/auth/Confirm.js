import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { confirmUser } from '../../services/authServices/authService';

const Confirm = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [isLoaded, setLoaded] = useState(false);
    const [isSuccess, setSuccess] = useState(false);

    setTimeout(() => {
        confirmUser(params.confirmCode).then(function(result) {
            // setLoaded(true);
            if (result) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/")
                }, 1500)

            } else {
                setSuccess(false);
            }
            setLoaded(true);
        });
        
    }, 2000)

    return (
            
            <div className="confirm-container">
            {!isLoaded ?   
                <> 
                <svg width="300" height="300" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                            <stop stop-color="#000" stop-opacity="0" offset="0%"/>
                            <stop stop-color="#000" stop-opacity=".631" offset="63.146%"/>
                            <stop stop-color="#000" offset="100%"/>
                        </linearGradient>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)">
                            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="2s"
                                    repeatCount="indefinite" />
                            </path>
                            <circle fill="#fff" cx="36" cy="18" r="1">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="2s"
                                    repeatCount="indefinite" />
                            </circle>
                        </g>
                    </g>
                </svg>
                <h1>Felhasználó megerősítése folyamatban!</h1>    
                </>
            :
            <>  
                {isSuccess ? 
                    <>
                        <div class="w4rAnimated_checkmark">
                            <svg width="300" height="300" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                            </svg>
                        </div>
                        <h1>Sikeresen megerősítetted a felhasználódat!</h1>       
                    </>         
                :
                    <>
                        <div class="w4rAnimated_checkmark">


                            <svg width="300" height="300" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                <circle class="path circle" fill="none" stroke="#D06079" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                <line class="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                                <line class="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                            </svg>
                        </div>
                        <h1>Nem sikerült megerősíteni a felhasználót!</h1>      
                    </>
                }        

            </>
            }
        </div>       
  )
}

export default Confirm