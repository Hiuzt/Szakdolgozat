import React, { useEffect, useMemo, useState } from 'react'
import useRedirectLoggedOut from '../../../customHook/useRedirectLoggedOut';
import {GoogleMap, useLoadScript, MarkerF} from "@react-google-maps/api";
import Geocode from "react-geocode";
import { updateTravel } from '../../../services/travelServices/travelService';

const TravelEdit = (props) => {
    useRedirectLoggedOut();
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
    })
   
console.log(process.env.REACT_APP_GOOGLE_MAP_API_KEY)
    return (
            <div className="overlay" onClick={props.onClose}>
                <div className="modal-container" onClick={(e) => {
                    e.stopPropagation();
                }}>
		{isLoaded && (     
                    <Map modalData={props.modalData} closeAction={props.onClose} getTravels = {props.getTravels}/>                                          
		)}
                </div>
            </div>
    )
}

function Map(props) {

    const [lat, setLat] = useState(props.modalData.toLat);
    const [lng, setLng] = useState(props.modalData.toLng);
    const [slat, setsLat] = useState(props.modalData.fromLat);
    const [slng, setsLng] = useState(props.modalData.fromLng);

    const [startAddress, setStartAddress] = useState("");
    const [targetAddress, setTargetAddress] = useState("");
    const [date, setDate] = useState(props.modalData.startDate.substring(0, 16));

    const centerPosition = useMemo(() => ({lat:46.072196074954576, lng: 18.232828647192}), []);

    useEffect(() => {
        GetGeoCode(lat, lng, "target").then(address => {
            setStartAddress(address) 
        })           
    }, [lat, lng])

    useEffect(() => {
        GetGeoCode(slat, slng, "start").then(address => {
           
            setTargetAddress(address)  
        })       
    }, [slat, slng])
    
    function onUpdateTravel() {
        const fromName = startAddress
        const toName = targetAddress
        const startDate = date;

        const postedData = {
            FromName: fromName,
            ToName: toName,
            FromLat: slat,
            FromLng: slng,
            ToLat: lat,
            ToLng: lng,
            StartDate: startDate,
        }
        updateTravel(postedData, props.modalData.id).then(function() {
            props.closeAction();
            props.getTravels();
        });
    }

    return (
        <div>

        
            <GoogleMap 
                center={centerPosition}
                zoom={10}
                mapContainerClassName="map-container"
                onClick={(e) => {
                    var latLng = e.latLng;
                    setLat(latLng.lat());
                    setLng(latLng.lng());

                    console.log("Lat: " + lat + " lng: " + lng);
                }}
                onRightClick={(e) => {
                    var latLng = e.latLng;
                    setsLat(latLng.lat());
                    setsLng(latLng.lng());
                }}
                options={{mapTypeControl: false, streetViewControl: false}}
            >
            <MarkerF position={{lat: lat, lng: lng}} draggable={true} onDragEnd={(e) => {
                    var latLng = e.latLng;
                    setLat(latLng.lat());
                    setLng(latLng.lng());                                  
            }}/>
            <MarkerF 
                position={{lat: slat, lng: slng}} 
                draggable={true} 
                onDragEnd={(e) => {
                    var latLng = e.latLng;
                    setsLat(latLng.lat());
                    setsLng(latLng.lng());                               
            }} />        
            </GoogleMap>
            
            <div className="modal-content">
                    <span>
                        Indulási pozíció(Bal klikk):
                    </span>
                    <span>
                        {startAddress}
                    </span>
            </div>
            <div className="modal-content">
                 <span>
                    Érkezés(Jobb klikk):
                </span>
                <span>
                    {targetAddress}
                </span>
            </div> 
            <div className="modal-content">
                <label>Foglalás dátuma</label>
                <input onChange={(e) => {setDate(e.target.value)
                    console.log(e.target.value)
                }} value = {date} type="datetime-local"/>  
            </div> 
            <div className="control-button-container">
                <div className="control-button" onClick={onUpdateTravel}>
                    Szerkesztés
                </div>
                <div className="control-button" onClick={props.closeAction}>
                    Mégse
                </div>
            </div>
                
        </div>
    )
}


const GetGeoCode = async (lat, lng) => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY);
    Geocode.setLanguage("hu");
    Geocode.setRegion("hu");
    Geocode.setLocationType("GEOMETRIC_CENTER");

    const resultText = await Geocode.fromLatLng(lat, lng)
    const address = resultText.results[0].address_components[1].long_name + ", " + resultText.results[0].address_components[2].long_name;
            
    return address;       
}

export default TravelEdit
