import React, { useEffect, useState } from 'react'
import useRedirectLoggedOut from '../../../customHook/useRedirectLoggedOut';
import { changePasswordServerByAdmin, saveUserServerByAdmin } from '../../../services/authServices/authService';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

const EditUsers = (props) => {
    useRedirectLoggedOut();
    const [imageInput, setImageInput] = useState("");
    const [imageFile, setImageFile] = useState("");

    const [username, setUserName] = useState(props.modalData.name);
    const [password, setPassword] = useState(props.modalData.password);
    const [firstName, setFirstName] = useState(props.modalData.firstName);
    const [surName, setSurName] = useState(props.modalData.surName);
    const [email, setEmail] = useState(props.modalData.email);
    const [phoneNumber, setPhoneNumber] = useState(props.modalData.phoneNumber);
    const [age, setAge] = useState(props.modalData.birthDay.substring(0, 10));
    const [license, setLicense] = useState(props.modalData.licenseFrom.substring(0, 10));
    const [active, setActive] = useState(false);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        if  (props.modalData.admin === 1) {
            setAdmin(true);
        }
        if  (props.modalData.active === 1) {
            setActive(true);
        }        
    }, [])

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
        if (admin) {
            adminValue = 1;
        }
        if (active) {
            activeValue  = 1;
        }

        const TokenValue = Cookies.get("token")
        const myUserID = jwt_decode(TokenValue).id

        if (!admin && parseInt(props.modalData.id) === parseInt(myUserID)) {
            
            return toast.error("Magadtól nem veheted el a jogosultságot!");
        }

        const formData = new FormData();
        formData.append("ImageFile", imageFile);
        formData.append("Image", imageInput);
        formData.append("FirstName", firstName)
        formData.append("SurName", surName)
        formData.append("BirthDay", age)
        formData.append("PhoneNumber", phoneNumber)
        formData.append("Email", email)
        formData.append("LicenseFrom", license)
        formData.append("Admin", adminValue) 
        formData.append("Active", activeValue) 
        formData.append("Name", username)     
        // formData.append("Password", password) 
        
        
        saveUserServerByAdmin(formData, props.modalData.id).then(function(result) {
            toast.success("Sikeresen frissítetted a felhasználót")
            props.onClose();
            props.onRefresh();
        })

        if (password.length > 0) {
            if (password.length < 4) {
                return toast.error("Ha jelszót szeretnél változtatni akkor minimum 4 karaktert kell tartalmaznia!");               
            }

            const serverData = {
                Password: password

            }

            changePasswordServerByAdmin(serverData, props.modalData.id)
        }
    }

  return (
    <div className="overlay">
        <div className="modal-container-admin" onClick={(e) => {e.stopPropagation()}}>
            <div className="header-modal">
            	Felhasználó szerkesztése
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
                        <input type = "text" id = "Felhasználónév" value = {username} onChange={(e) => setUserName(e.target.value)} required/>
                        <label for="Felhasználónév" >Felhasználónév</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "password" id = "Jelszó"  value = {password} onChange={(e) => setPassword(e.target.value)} required/>
                        <label for="Jelszó" >Jelszó</label>
                    </div> 
                </div>                 
                <div className="row">
                    <div className="input-container">                      
                        <input type = "text" id = "Vezetéknév" value = {firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                        <label for="Vezetéknév" >Vezetéknév</label>
                    </div>                 
                    <div className="input-container">                      
                        <input type = "text" id = "Keresztnév" value = {surName} onChange={(e) => setSurName(e.target.value)} required/>
                        <label for="Keresztnév" >Keresztnév</label>
                    </div>

                </div>   
                <div className="row">
                    <div className="input-container">                      
                        <input type = "text" id = "E-Mail" value = {email} onChange={(e) => setEmail(e.target.value)} required />
                        <label for="E-Mail" >E-Mail cím</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "text" id = "Telefonszám" value = {phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required/>
                        <label for="Telefonszám" >Telefonszám</label>
                    </div> 
                </div> 
                <div className="row">
                    <div className="input-container">                      
                        <input type = "date" id = "Születési idő" value = {age} onChange={(e) => setAge(e.target.value)} />
                        <label for="Születési idő" >Születési idő</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "date" id = "Jogosítvány megszerzése" value = {license} onChange={(e) => setLicense(e.target.value)} />
                        <label for="Jogosítvány megszerzése" >Jogosítvány megszerzése</label>
                    </div>
                </div>
                <div className="row">  
                    <div>                    
                        <input type = "checkbox" id = "Felhasználó aktiválása" checked = {active} onChange={(e) => setActive(e.target.checked)} />
                        <label for="Felhasználó aktiválása" >Felhasználó aktiválva</label>
                    </div>
                    <div>                    
                        <input type = "checkbox" id = "Admin" checked = {admin} onChange={(e) => setAdmin(e.target.checked)} />
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

export default EditUsers
