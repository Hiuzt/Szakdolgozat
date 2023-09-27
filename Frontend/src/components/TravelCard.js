import { GoogleMap, MarkerF, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import React, { useMemo, useState } from 'react'

const TravelCard = (props) => {


    useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY
        
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [modalPage, setModalPage] = useState(1);
    const [modalData, setModalData] = useState([]);

    function onClose() {
        setModalOpen(false);
        setModalPage(1);
    }

  return (
    <>

    
        <div className="travel-card">
            <div className="travel-card-map">
                {/* <Map lat={props.tLat} lng = {props.tLng} slat = {props.sLat} slng = {props.sLng} showRoutes = {false} /> */}
                <ul> 
                    <li>
                        <span>
                        Utazás azonosító
                        </span>
                        <span>
                            #{props.id}
                        </span>                   
                    </li>
                    <li>
                        <span>
                            Indulás
                        </span>
                        <span>
                            {props.fromName}
                        </span>                          
                    </li>
                    <li>
                        <span>
                            Érkezés
                        </span>
                        <span>
                            {props.toName}
                        </span>   
                    </li>
    
                    <li>
                        <span>
                            Sofőr neve
                        </span>
                        <span>
                            {props.driverName}
                        </span>                 
                    </li>  
                    <li>
                        <span>
                            Indulás
                        </span>
                        <span>
                            {props.startDate}
                        </span>                 
                    </li>                                             
                </ul>
                <button className="submit-button" onClick={(e) => (
                    setModalOpen(true)
                )}>
                    Részletek
                </button>            
            </div>
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
                                }}>Utazáson résztvevő emberek</div>
                        </div>                                     
                        <Map slat = {props.sLat} slng = {props.sLng} lat = {props.lat} lng = {props.Lng} showRoutes={true} />         
                    </>
                    :
                    <> 
                        <div className="button-container">
                            <div className="change-button" onClick={(e) => {
                                setModalPage(1)
                            }}>Jelentkezés az útra</div>
                            <div className="change-button selected-change-button">Utazáson résztvevő emberek</div>
                        </div>
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

    console.log("TASEDUIhiuoashdjni")

    // const directionsService = new window.google.maps.DirectionsService();

    const targetPosition = useMemo(() => ({lat: props.slat, lng: props.slng}), []);
    const startPosition = useMemo(() => ({lat: props.lat, lng: props.lng}), []);
    const centerPosition = useMemo(() => ({lat: props.lat - (props.lat/2 - props.slat/2), lng: props.lng - (props.lng/2 - props.slng/2)}))
    const [directions, setDirections] = useState();
    var directionsService = null
    
    var mapContainerName = "map-container-travel";
    // if (props.showRoutes === true) {
    //     mapContainerName = "map-container-travel-big"
    //     // const google = window.google;
    //     // if (directionsService === null) {
    //         // directionsService = new google.maps.DirectionsService();
    //     // }
         
    //     directionsService.route(
    //         {
    //             origin: startPosition,
    //             destination: targetPosition,
    //             travelMode: google.maps.TravelMode.DRIVING
    //         },
    //         (result, status) => {
    //             if (status === google.maps.DirectionsStatus.OK) {
    //                 setDirections(result)
    //             } else {
    //                 console.error(`error fetching directions ${result}`);
    //             }
    //         }
    //     );
    //}



    

    return (
        <div>     
            <GoogleMap 
                center={centerPosition}
                zoom={10}
                mapContainerClassName={mapContainerName}
                options={{mapTypeControl: false, streetViewControl: false,  fullscreenControl: false, scaleControl: false, zoomControl: false}}
            >

            {props.showRoutes === true ? 
                <DirectionsRenderer directions={directions}/>
                :
                <>
                    <MarkerF position={targetPosition}/>
                    <MarkerF position={startPosition}/>
                </>
            }
            
            </GoogleMap>              
        </div>
    )
  }


export default TravelCard