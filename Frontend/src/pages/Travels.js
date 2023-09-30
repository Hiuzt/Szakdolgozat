import React, { useEffect, useState, useMemo } from 'react'
import Menu from "../components/Menu";
import { GoogleMap, MarkerF, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import useRedirectLoggedOut from '../customHook/useRedirectLoggedOut';
import { applyForTravelService, deleteTravel, getAllTravels, getTravellersByTravelID } from '../services/travelServices/travelService';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/features/auth/authSlice';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const Travels = () => {

    useRedirectLoggedOut("/");

    let baseSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>
    let ascSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>
    let descSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>
    
    const [travelData, setTravelData] = useState([]);
    const {isLoaded} =     useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
    }); 
    const [openModal, setModalOpen] = useState(false)
    const [modalPage, setModalPage] = useState(1)
    const [modalData, setModalData] = useState([]);

    const [directions, setDirections] =  useState();
    const [search, setSearch] = useState("");

    const [travelUsers, setTravelUsers] = useState([]);

    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortCol, setSortCol] = useState(0);
    const TokenValue = Cookies.get("token")
    const userID = jwt_decode(TokenValue).id

    const applyForTravel = (travelID, driverID) => {

        const postedData = {
            FromUser: userID,
            ToUser: driverID,
            TravelID: travelID
        }

        applyForTravelService(postedData)
       
    }

    const getTravellersByTravelIDClient = (travelID) => {
        getTravellersByTravelID(travelID).then(function(result) {
            setTravelUsers(result);
            console.log(result);
        })
    }

    const onClose = () => {
        setModalOpen(false)
    }
    useEffect(() => {
        const getAllTravelsClient = async () => {
            getAllTravels().then(function(result) {
                setTravelData(result)
            });
        }
        getAllTravelsClient();
    }, [])

    const sortTable = (col) => {
        console.log("ASD")
        if (sortOrder === "ASC") {
            let sortedTable = [];
            if (col === "id") {
                sortedTable = [...travelData].sort((a, b) =>
                    a[col] > b[col] ? 1: -1
                );   
            } else {
                sortedTable = [...travelData].sort((a, b) =>
                a[col] > b[col] ? 1: -1
                );
            }
                
            setTravelData(sortedTable)
            setSortCol(col);
            setSortOrder("DESC");
        } else if (sortOrder === "DESC") {
                let sortedTable = [];
                if (col === "id") {
                    sortedTable = [...travelData].sort((a, b) =>
                        a[col] < b[col] ? 1: -1
                    );   
                } else {
                    sortedTable = [...travelData].sort((a, b) =>
                    a[col] < b[col] ? 1: -1
                    );
                }
            setTravelData(sortedTable)
            setSortCol(col);
            setSortOrder("ASC");
        }
    }

  return (
    <div>
    <Menu pageNumber={2}/>

        
            <div className="travel-container">
            <div className="header-content">
                <div className="info-header">
                    Összes utazás: {travelData.length}
                </div>
                <div className="input-group">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                    <input type = "text" placeholder="Keresés.." onChange={(e) => setSearch(e.target.value)}/>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
                </div>
            </div>
            <section className="travel-table">
                <table >
                    <thead>
                        <tr>
                            <th onClick={(e) => sortTable("id")}>
                                <div className="filter">
                                    Utazás azonosító  
                                    {sortCol === "id" ? 
                                        sortOrder === "ASC" ? 
                                            ascSvg
                                        :
                                            descSvg
                                    :
                                        baseSvg
                                    }                              
                                </div>
                            </th>
                            <th onClick={(e) => sortTable("driverName")}>                                
                                <div className="filter">
                                    Sofőr
                                    {sortCol === "driverName" ? 
                                        sortOrder === "ASC" ? 
                                            ascSvg
                                        :
                                            descSvg
                                    :
                                        baseSvg
                                    }
                                </div>
                            </th>       
                            <th onClick={(e) => sortTable("fromName")}>                                
                                <div className="filter">
                                    Indulási hely  
                                    {sortCol === "fromName" ? 
                                        sortOrder === "ASC" ? 
                                            ascSvg
                                        :
                                            descSvg
                                    :
                                        baseSvg
                                    }     
                                </div>
                            </th>
                            <th onClick={(e) => sortTable("toName")}>
                                <div className="filter">
                                    Úti cél{sortCol === "toName" ? 
                                        sortOrder === "ASC" ? 
                                            ascSvg
                                        :
                                            descSvg
                                    :
                                        baseSvg
                                    }     
                                </div>
                            </th>
                            <th onClick={(e) => sortTable("startDate")}>
                                <div className="filter">
                                    Indulási idő
                                    {sortCol === "startDate" ? 
                                        sortOrder === "ASC" ? 
                                            ascSvg
                                        :
                                            descSvg
                                    :
                                        baseSvg
                                    }     
                                </div>
                            </th>
                            <th>Információ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {travelData.filter((item) => {
                            return search.toLowerCase() === "" ?
                                item
                            :
                            item.fromName.toLowerCase().includes(search.toLocaleLowerCase()) ||
                            item.toName.toLowerCase().includes(search.toLocaleLowerCase()) ||
                            item.startDate.toLowerCase().includes(search.toLocaleLowerCase()) ||
                            item.driverName.toLowerCase().includes(search.toLocaleLowerCase())

                        }).map(travelValue => (                    
                                <tr className="table-rows">
                                    <td>#{travelValue.id}</td>
                                    <td >
                                        <Link to = {"/profile/" + travelValue.driverID} className="driver-content">
                                            <img src={travelValue.driverImage} alt=''></img>
                                            {travelValue.driverName} 
                                        </Link>                                           
                                    </td>                                  
                                    <td>{travelValue.fromName}</td>
                                    <td>{travelValue.toName}</td>
                                    <td>{travelValue.startDate.replace("T", " ")}</td>
                                    <td>   
                                        <div onClick={(e) => {
                                            
                                            setModalOpen(true)                                                                 
                                            setModalData(travelValue)
                                            setModalPage(1)

                                            const targetPosition = {lat: travelValue.fromLat, lng: travelValue.fromLng};
                                            const startPosition = {lat: travelValue.toLat, lng: travelValue.toLng};

                                            const google = window.google;
                                            var  directionsService = null
                                            if (directionsService === null) {
                                                directionsService = new google.maps.DirectionsService();
                                            }
                                            
                                            directionsService.route(
                                                {
                                                    origin: startPosition,
                                                    destination: targetPosition,
                                                    travelMode: google.maps.TravelMode.DRIVING
                                                },
                                                (result, status) => {
                                                    if (status === google.maps.DirectionsStatus.OK) {                                          
                                                        setDirections(result);
                                                    } else {
                                                        console.error("HIBA " + result);
                                                    }
                                                }
                                            );
                                            
                                        }}>
                                            <svg data-tooltip-id="application-tooltip" data-tooltip-content="Információk" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0z" fill="none"/><path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 30h-4V22h4v12zm0-16h-4v-4h4v4z"/></svg>
                                         </div>
                                        {parseInt(userID) ===travelValue.driverID && (
                                            <div onClick={(e) => {
                                                deleteTravel(travelValue.id);
                                                for (var i = 0; i < travelValue.length; i++) {
                                                    if (travelValue[i].id === modalData.id) {
                                                        delete travelValue[i];
                                                    }
                                                }
                                                window.location.reload();
                                            }}>
                                                <svg data-tooltip-id="application-tooltip" data-tooltip-content="Utazás törlése" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                                            </div>
                                        )} 
                                      </td>
                                </tr>
      
                            ))}
                    </tbody>
                </table>
                </section>
            </div>
            {openModal === true ?
            <div className="overlay" onClick={onClose}>
                <div className="modal-container" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    {modalPage === 1 ? 
                    <>         
                        <div className="button-container">
                                <div className="change-button selected-change-button">Jelentkezés az útra</div>
                                <div className="change-button" onClick={(e) => {
                                    setModalPage(2);
                                    getTravellersByTravelIDClient(modalData.id)
                                }}>Utazáson résztvevő emberek</div>
                        </div>    
                        {isLoaded && (
                            <Map slat = {modalData.fromLat} slng = {modalData.fromLng} lat = {modalData.toLat} lng = {modalData.toLng} showRoutes={true} directions={directions} />  
                        )}    
                        <div className="control-button-container">
                            <div className="control-button" onClick={(e) => (applyForTravel(modalData.id, modalData.driverID))}>
                                Jelentkezés
                            </div>
                            <div className="control-button" onClick={onClose}>
                                Mégse
                            </div>
                        </div>                             
                                   
                    </>
                    : modalPage === 2 ?
                    <> 
                        <div className="button-container">
                            <div className="change-button" onClick={(e) => {
                                setModalPage(1)
                            }}>Jelentkezés az útra</div>
                            <div className="change-button selected-change-button">Utazáson résztvevő emberek</div>
                        </div>
                            <div  className="modal-date">
                                <span>1</span>
                                <Link to={"/profile/" + modalData.driverID} className="driver-content">{modalData.driverName}(Sofőr) </Link>
                            </div>
                            {travelUsers.map((userSource, index) => (
                                <div key={index} className="modal-date">
                                    <span>{index + 2}</span>
                                    <Link to={"/profile/" + userSource.id} className="driver-content">{userSource.name}</Link>
                                </div>
                            ))}

                        <div className="control-button-2" onClick={onClose}>
                            Mégse
                        </div>                   
                    </>  
                    
                    :
                    <>                      
                    </>
                    }
                </div>
            </div>
            
        :
            <></>
        }
        <Tooltip id="application-tooltip" />
        </div>
        
    )
}

function Map(props) {

    const targetPosition = useMemo(() => ({lat: props.slat, lng: props.slng}), [props]);
    const startPosition = useMemo(() => ({lat: props.lat, lng: props.lng}), [props]);
    const centerPosition = useMemo(() => ({lat: props.lat - (props.lat/2 - props.slat/2), lng: props.lng - (props.lng/2 - props.slng/2)}), [props])

    
    var mapContainerName = "map-container";



    return (
        <div>     
            <GoogleMap 
                center={centerPosition}
                zoom={10}
                mapContainerClassName={mapContainerName}
                options={{mapTypeControl: false, streetViewControl: false,  fullscreenControl: false, scaleControl: false, zoomControl: false}}
            >

            {props.showRoutes === true ? 
                <DirectionsRenderer directions={props.directions}/>
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

export default Travels