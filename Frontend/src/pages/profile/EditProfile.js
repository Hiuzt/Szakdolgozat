import React, { useEffect, useState } from 'react'
import Menu from '../../components/Menu'
import { changePasswordServer, getUserData, saveUserServer } from '../../services/profileServices/profileServices'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import useRedirectLoggedOut from '../../customHook/useRedirectLoggedOut'

const EditProfile = () => {
    useRedirectLoggedOut("/");
    const [myProfileID, setMyProfileID] = useState(0);

    const [profilePicture, setProfilePicture] = useState("");
    const [firstName, setFirstName] = useState("");
    const [surName, setSurName] = useState("");
    const [birthDate, setBirthDate] = useState("2022-11-11")
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [imageInput, setImageInput] = useState("");
    const [imageFile, setImageFile] = useState("");

    // Jelszó
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");


    useEffect(() => {
        const getProfileData = async () => {
            const TokenValue = Cookies.get("token")
            const myUserID = jwt_decode(TokenValue).id

             setMyProfileID(myUserID)

            getUserData(myUserID).then(function(result) {              
                setFirstName(result.firstName);
                setSurName(result.surName);
                setEmail(result.email);
                setPhoneNumber(result.phoneNumber);
                setProfilePicture(result.image);
                
                setBirthDate(result.birthDay.substring(0, 10))
            })   
        }
        getProfileData();
    }, [])

    function saveUser() {
        if (oldPassword.length > 0 && newPassword.length > 0) {
            changePassword();
        }

        const formData = new FormData();
        formData.append("ImageFile", imageFile);
        formData.append("Image", imageInput);
        formData.append("FirstName", firstName)
        formData.append("SurName", surName)
        formData.append("BirthDay", birthDate)
        formData.append("PhoneNumber", phoneNumber)
        formData.append("Email", email)

        saveUserServer(formData, myProfileID).then(function(result) {
            toast.success("Sikeresen elmentetted a változásokat!");
            console.log(result)
            if (result) {
                setTimeout(() => {
                    localStorage.setItem("userImage", result);
                    window.location.reload(true)
                }, 1000)
            }
                
                
        })


    }

    function changePassword() {
        if (oldPassword === newPassword) {
            toast.error("A régi és az új jelszód nem lehet ugyanaz!");
            return
        }
        if (newPassword.length < 5) {
            toast.error("A jelszavadnak tartalmaznia kell minimum 5 karakter!");
            return
        }
        if (newPassword !== newPassword2) {
            toast.error("Kérlek erősítsd  meg az új jelszavad!");
            return
        }
        
        const serverData = {
            Password: newPassword,
            oldPassword: oldPassword
        }

        changePasswordServer(serverData, myProfileID)
    }

    function onChangeImage() {
        let profileImage = document.getElementById("profile-image")
        let inputFile = document.getElementById("file")
        let imageSrc = URL.createObjectURL(inputFile.files[0])
        profileImage.src = imageSrc

        setImageInput(inputFile.files[0].name);
        setImageFile(inputFile.files[0]);

    }


  return (
    <>

    
        <Menu pageNumber={9}/>
        <div className="profile-container">
            <div className="profile-edit">
            <form onSubmit={(e) => { e.preventDefault(); saveUser()}} >
                <div className="section-box">
                    <div className="image-container">
                        <input type="file" accept="image/*" name="images" id="file" onChange={(e) => { 
                            onChangeImage();
                            
                        }} />
                        <label for="file">
                            <img src={profilePicture} alt="" id="profile-image"/>                     
                            <div className="upload-button">                           
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>                                   
                            </div>
                        </label>
                    </div>
                </div>
                <div className="section-box">
                    
                        <div className="row">
                            <div className="input-container">                      
                                <input type = "text" id = "Keresztnév" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <label for="Keresztnév" >Keresztnév</label>
                            </div>
                            <div className="input-container">                      
                                <input type = "text" id = "Vezetéknév" value={surName} onChange={(e) => setSurName(e.target.value)} />
                                <label for="Vezetéknév" >Vezetéknév</label>
                            </div> 
                        </div>        
                        <div className="row">
                            <div className="input-container">                      
                                <input type = "text" id = "E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label for="E-Mail" >E-Mail cím</label>
                            </div>
                            <div className="input-container">                      
                                <input type = "text" id = "Telefonszám" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                <label for="Telefonszám" >Telefonszám</label>
                            </div> 
                        </div> 
                        <div className="row">
                            <div className="input-container">                      
                                <input type = "date" id = "Születési idő" onChange={(e) => {
                                    setBirthDate(e.target.value)
                                }} value={birthDate} />
                                <label for="Születési idő" >Születési idő</label>
                            </div>
                        </div>                                                         
                </div>
                <div className="section-box">
                        <div className="row">
                            <div className="input-container">                      
                                <input type = "password" id = "Régi jelszó" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                <label for="Régi jelszó" >Régi jelszó</label>
                            </div>  
                        </div>      
                        <div className="row">
                            <div className="input-container">                      
                                <input type = "password" id = "Jelszó" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <label for="Jelszó" >Új Jelszó</label>
                            </div> 
                        </div>
                        <div className="row">
                            <div className="input-container">                      
                                <input type = "password" id = "Jelszó megerősítés" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} />
                                <label for="Jelszó megerősítés" >Új Jelszó megerősítés</label>
                            </div>  
                        </div>   
                              
                </div>
                <div className="section-box">
                    <button className="save-button" type='submit'>
                        Mentés
                    </button>
                    <div className="cancel-button">
                        Mégse
                    </div>                    
                </div>
                </form> 
            </div>
            
        </div>
    </>
  )
}

export default EditProfile