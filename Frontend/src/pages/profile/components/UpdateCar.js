import React, { useRef, useState } from 'react'
import useRedirectLoggedOut from '../../../customHook/useRedirectLoggedOut';
import { updateCar } from '../../../services/carServices/carService';

const UpdateCar = (props) => {
    useRedirectLoggedOut();
    const [imageInput, setImageInput] = useState("");
    const [imageFile, setImageFile] = useState("");
   
    const [seatValue, setSeat] = useState(props.modalData.seatNumber);
    const [distanceValue, setDistance] = useState(props.modalData.distanceTravelled);


    function onChangeImage() {
        let profileImage = document.getElementById("profile-image")
        let inputFile = document.getElementById("file")
        let imageSrc = URL.createObjectURL(inputFile.files[0])
        profileImage.src = imageSrc

        setImageInput(inputFile.files[0].name);
        setImageFile(inputFile.files[0]);

    }

    function onUpdateCar() {

        const formData = new FormData();
        formData.append("ImageFile", imageFile);
        formData.append("Image", imageInput);
        formData.append("DistanceTravelled", distanceValue);
        formData.append("SeatNumber", seatValue);

        updateCar(formData, props.modalData.id).then(function(result) {
            
        })
    }

    return (
        <div className="overlay" onClick={props.onClose}>
        <div className="modal-container-admin" onClick={(e) => {
                e.stopPropagation();
            }}>
            <div className="header-modal">
                Új autó létrehozása
            </div>
            <div className="modal-content-admin">
            <div className="image-container">
                        <input type="file" accept="image/*" name="images" id="file" required onChange={(e) => { 
                            onChangeImage();
                            
                        }} />
                        <label for="file">
                            <img src={props.modalData.image} alt="" id="profile-image"/>                  
                            <div className="upload-button">                           
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>                                   
                            </div>
                        </label>
                    </div>
                    <div className="input-container">                      
                        <input type = "number" id = "Férőhely" value={seatValue} onChange={(e) => setSeat(e.target.value)} required />
                        <label for="Férőhely" >Férőhely</label>
                    </div>
                    <div className="input-container">                      
                        <input type = "number" id = "Megtett távolság" value={distanceValue} onChange={(e) => {setDistance(e.target.value)}} required />
                        <label for="Megtett távolság" >Megtett távolság</label>
                    </div>                    
            </div>
        <div className="control-button-container">
           
            <div className="control-button" onClick={(e) => onUpdateCar()}>
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

export default UpdateCar