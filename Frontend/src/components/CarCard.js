import React, { useState, useMemo, useEffect } from 'react'
import "../design.css";
import {GoogleMap, useLoadScript, MarkerF} from "@react-google-maps/api";
import Geocode from "react-geocode";
import { getTravelsByCarID, travelService } from '../services/travelServices/travelService';

import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';


const CarCard = (props) => {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
    })
    const TokenValue = Cookies.get("token")
    const userID = jwt_decode(TokenValue).id
    const [modalData, setModalData] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [modalPage, setModalPage] = useState(1)

    const [travelData, setTravelData] = useState([])

    const showDetails = (car, onClose) => () => {
        setModalOpen(true)
        setModalData(car)
    }

    const onClose = () => {
        setModalOpen(false)
        setModalData([])
        setModalPage(1)
    }   

    return (     
        <>
        <div className="car-card">
           
            <img src={props.carimage} alt=""/>
            <ul> 
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
                    <div className="text">
                        {props.name} fő
                    </div>                       
                </li>
                <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M174.9 494.1c-18.7 18.7-49.1 18.7-67.9 0L14.9 401.9c-18.7-18.7-18.7-49.1 0-67.9l50.7-50.7 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 41.4-41.4 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 41.4-41.4 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 41.4-41.4 48 48c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-48-48 50.7-50.7c18.7-18.7 49.1-18.7 67.9 0l92.1 92.1c18.7 18.7 18.7 49.1 0 67.9L174.9 494.1z"/></svg>                
                    <div className="text">
                        {props.km} km
                    </div>
                         
                </li>
                
            </ul>
            <button className="details-button" onClick={showDetails(props)}>
                Részletek
            </button>
        </div>

        {modalOpen === true ?
            <div className="overlay" onClick={onClose}>
                <div className="modal-container" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    {modalPage === 1 ? 
                    <>         
                        <div className="button-container">
                                <div className="change-button selected-change-button">Autó lefoglalása</div>
                                <div className="change-button" onClick={(e) => {
                                    setModalPage(2);
                                    getTravelsByCarID(modalData.id).then(function(result) {
                                        setTravelData(result)
                                    });
                                }}>Lefoglalt időpontok</div>
                        </div>
                        <Map carID={modalData.id} closeAction={onClose} userID = {props.userid}/>                            
                    </>
                    :
                    <> 
                        <div className="button-container">
                            <div className="change-button" onClick={(e) => {
                                setModalPage(1)
                            }}>Autó lefoglalása</div>
                            <div className="change-button selected-change-button">Lefoglalt időpontok</div>
                        </div>
                        {console.log(travelData)}
                        {travelData.length > 0 ?
                            
                            travelData.map((travelSource) => 
                            <div className="modal-date">
                                <span>{travelSource.startDate.substring(0, 10)}</span>
                                <span><Link to={`/profile/${travelSource.driverID}`} className="driver-content">{travelSource.driverName}</Link></span>
                            </div>
                        )
                        :
                        <div className="modal-date">
                            Még nincs lefoglalva időpont erre a járműre
                        </div>
                        }
                        <div className="control-button-2" onClick={onClose}>
                            Mégse
                        </div>                   
                    </>  
                    }

                </div>
            </div>
            
        :
            <></>
        }
        </>
    )
}

function Map(props) {

    const [lat, setLat] = useState(46.072196074954576);
    const [lng, setLng] = useState(18.232828647192);
    const [slat, setsLat] = useState(46.072196074954576);
    const [slng, setsLng] = useState(18.232828647192);

    const [startAddress, setStartAddress] = useState(null);
    const [targetAddress, setTargetAddress] = useState("");
    const [date, setDate] = useState("");

    const centerPosition = useMemo(() => ({lat:46.072196074954576, lng: 18.232828647192}), []);

    useEffect(() => {
        GetGeoCode(lat, lng, "target").then(address => {
            console.log(address) 
            setStartAddress(address) 
        })           
    }, [lat, lng])

    useEffect(() => {
        GetGeoCode(slat, slng, "start").then(address => {
            console.log(address)
            setTargetAddress(address)  
        })       
    }, [slat, slng])
    
    function BookCar() {
        const carID = props.carID;
        const driverID = props.userID;
        const fromName = startAddress
        const toName = targetAddress
        const startDate = date;

        const postedData = {
            CarID: carID,
            DriverID: driverID,
            FromName: fromName,
            ToName: toName,
            FromLat: slat,
            FromLng: slng,
            ToLat: lat,
            ToLng: lng,
            StartDate: startDate,
        }

        travelService(postedData)
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
                <input onChange={(e) => {setDate(e.target.value)}} type="datetime-local"/>  
            </div> 
            <div className="control-button-container">
                <div className="control-button" onClick={BookCar}>
                    Lefoglal
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

export default CarCard
