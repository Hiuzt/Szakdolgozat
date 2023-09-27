import React, { useRef, useState } from 'react'
import useRedirectLoggedOut from '../../../customHook/useRedirectLoggedOut';
import { registerUserByAdmin } from '../../../services/authServices/authService';

const UserCreate = (props) => {
    useRedirectLoggedOut();
    const [imageInput, setImageInput] = useState("");
    const [imageFile, setImageFile] = useState("");
   
    const userNameRef = useRef();
    const passwordRef = useRef();
    const firstNameRef = useRef();
    const surNameRef = useRef();
    const emailRef = useRef();
    const phoneNumberRef = useRef();
    const bornRef = useRef();
    const licenseRef = useRef();
    const activeRef = useRef();
    const adminRef = useRef();

    function onChangeImage() {
        let profileImage = document.getElementById("profile-image")
        let inputFile = document.getElementById("file")
        let imageSrc = URL.createObjectURL(inputFile.files[0])
        profileImage.src = imageSrc

        setImageInput(inputFile.files[0].name);
        setImageFile(inputFile.files[0]);

    }

    const onCreateUser = () => {
        let adminValue = 0;
        let activeValue = 0;
        if (adminRef.current.checked) {
            adminValue = 1;
        }
        if (activeRef.current.checked) {
            activeValue  = 1;
        }

        const formData = new FormData();
        formData.append("ImageFile", imageFile);
        formData.append("Image", imageInput);
        formData.append("FirstName", firstNameRef.current.value)
        formData.append("SurName", surNameRef.current.value)
        formData.append("BirthDay", bornRef.current.value)
        formData.append("PhoneNumber", phoneNumberRef.current.value)
        formData.append("Email", emailRef.current.value)
        formData.append("LicenseFrom", licenseRef.current.value)
        formData.append("Admin", adminValue) 
        formData.append("Active", activeValue) 
        formData.append("Name", userNameRef.current.value)     
        formData.append("Password", passwordRef.current.value) 
        
        registerUserByAdmin(formData);
    }

  return (
    <div className="overlay">
        <div className="modal-container-admin" onClick={(e) => {e.stopPropagation()}}>
            <div className="header-modal">
                Új felhasználó létrehozása
            </div>
            <div className="modal-content-admin">
                <div className="image-container">
                    <input type="file" accept="image/*" name="images" id="file" required onChange={(e) => { 
                        onChangeImage();
                            
                    }} />
                    <label for="file">
                        <img src={require(`../../../files/van.jpg`)} alt="" id="profile-image"/>                  
                        <div className="upload-button">                           
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>                                   
                        </div>
                    </label>
                </div>
                <div className="row">
                    <div className="input-container">                      
                        <input type = "text" id = "Felhasználónév" ref={userNameRef} required/>
                        <label for="Felhasználónév" >Felhasználónév</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "password" id = "Jelszó" ref={passwordRef} required/>
                        <label for="Jelszó" >Jelszó</label>
                    </div> 
                </div>                 
                <div className="row">
                    <div className="input-container">                      
                        <input type = "text" id = "Vezetéknév" ref={firstNameRef} required/>
                        <label for="Vezetéknév" >Vezetéknév</label>
                    </div>                 
                    <div className="input-container">                      
                        <input type = "text" id = "Keresztnév" ref={surNameRef} required/>
                        <label for="Keresztnév" >Keresztnév</label>
                    </div>

                </div>   
                <div className="row">
                    <div className="input-container">                      
                        <input type = "text" id = "E-Mail" ref={emailRef} required />
                        <label for="E-Mail" >E-Mail cím</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "text" id = "Telefonszám" ref={phoneNumberRef} required/>
                        <label for="Telefonszám" >Telefonszám</label>
                    </div> 
                </div> 
                <div className="row">
                    <div className="input-container">                      
                        <input type = "date" id = "Születési idő" ref={bornRef} />
                        <label for="Születési idő" >Születési idő</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "date" id = "Jogosítvány megszerzése" ref={licenseRef} />
                        <label for="Jogosítvány megszerzése" >Jogosítvány megszerzése</label>
                    </div>
                </div>
                <div className="row">  
                    <div>                    
                        <input type = "checkbox" id = "Felhasználó aktiválása" ref={activeRef} />
                        <label for="Felhasználó aktiválása" >Felhasználó aktiválva</label>
                    </div>
                    <div>                    
                        <input type = "checkbox" id = "Admin" ref={adminRef} />
                        <label for="Admin" >Admin</label>
                    </div>                   
                </div>         
            </div>
            <div className="control-button-container">
                <div className="control-button" onClick={onCreateUser}>
                    Mentés
                </div>
                <div className="control-button" onClick={props.onClose}>
                    Mégse
                </div>
            </div>               
        </div>
    </div>                               
  )
}

export default UserCreate