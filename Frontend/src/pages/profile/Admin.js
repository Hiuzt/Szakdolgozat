import React, { useEffect, useRef, useState } from 'react'
import Menu from '../../components/Menu'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import useRedirectLoggedOut from '../../customHook/useRedirectLoggedOut'
import { createCar, deleteCar, getAllCars } from '../../services/carServices/carService'
import { Tooltip } from 'react-tooltip'
import { deleteTravelFromDB, getAllTravels, getAllTravelsAdmin } from '../../services/travelServices/travelService'
import { deleteUser, getAllUsers } from '../../services/authServices/authService'
import CarModal from "./components/CarModal";
import UpdateCar from './components/UpdateCar'
import TravelEdit from './components/TravelEdit'
import UserCreate from './components/UserCreate'
import EditUsers from './components/EditUsers'
import { Link } from 'react-router-dom'


const Admin = () => {
    useRedirectLoggedOut("/");
    const TokenValue = Cookies.get("token")
    const userID = jwt_decode(TokenValue).id

    const [activeSubPage, setActiveSubPage] = useState(1);
    const [carTable, setCarTable] = useState([]);
    const [travelTable, setTravelTable] = useState([]);
    const [usersTable, setUsersTable] = useState([]);

    const [modalData, setModalData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPage, setModalPage] = useState(0);

    useRedirectLoggedOut("/");
    useEffect(() => {
        const getCars = async () => {
            getAllCars().then(function(result){
                setCarTable(result);
            });
        }

        const getTravels = async () => {
            getAllTravelsAdmin().then(function(result) {
                setTravelTable(result)
            })
        }

        const getUsers = async () => {
            getAllUsers().then(function(result) {
                setUsersTable(result);
                console.log(result)
            })
        }

        getCars();
        getTravels();
        getUsers(userID);
    
      }, []);

    const getTravels = async () => {
        getAllTravelsAdmin().then(function(result) {
            setTravelTable(result)
        })
    }

        const getUsers = async () => {
            getAllUsers().then(function(result) {
                setUsersTable(result);
                console.log(result)
            })
        }

      const onClose = () => {
        setModalData([]);
        setModalOpen(false);
      }

    return (
        <>
        <Menu pageNumber={9}/>
        <div className="admin-container">  
            {activeSubPage === 1 ? 
                
                <>              
                <div className="header-content">
                <div className="sub-group">
                    <div className="info-header">
                        Összes adat: {carTable.length}
                    </div>
                    <div className="info-header" onClick={(e) => {                       
                        setModalOpen(true);
                        setModalPage(1);
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        Új autó létrehozása
                    </div>
                </div>
                    
                    
                    <div className="sub-group">
                        <div className="sub-button selected">Járművek</div>
                        <div className="sub-button" onClick={(e) => {setActiveSubPage(2)}}>Utazások
                        </div>
                        <div className="sub-button" onClick={(e) => {setActiveSubPage(3)}}>Felhasználók
                        </div>
                    </div>
                </div>
                <section className="admin-table">
                        <table >
                            <thead>
                                <tr>
                                    <th>Jármű azonosító<span></span></th>                             
                                    <th>Kép</th>
                                    <th>Férőhely</th>
                                    <th>Megtett km</th>
                                    <th>Akciók</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carTable.map((carSource, carIndex) =>
                                    <tr key={carIndex}>
                                        <td>{carSource.id}</td>
                                        <td><img src={carSource.image} alt=""></img></td>
                                        <td>{carSource.seatNumber}</td>
                                        <td>{carSource.distanceTravelled}</td>
                                        <td>
                                            <svg onClick={(e) => {
                                                
                                                setModalOpen(true);
                                                setModalPage(2);
                                                setModalData(carSource);
                                            }} data-tooltip-id="admin-tooltip" data-tooltip-content="Autó törlése" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                                            <svg onClick={(e) => {
                                                setModalOpen(true);
                                                setModalPage(3);
                                                setModalData(carSource);
                                            }} data-tooltip-id="admin-tooltip" data-tooltip-content="Szerkesztés" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                                        </td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </section>
                        {modalOpen ? 
                            modalPage === 1 ?
                                <CarModal onClose={onClose} modalData={modalData}/>
                            : modalPage === 2 ? 

                            
               
                                <div className="overlay" onClick={onClose}>
                                <div className="modal-container" onClick={(e) => {
                                        e.stopPropagation();
                                    }}>
                                    <div className="header-modal">
                                    Biztosan kiszeretnéd törölni?
                                </div>
                                <div className="control-button-container">
                                    <div className="control-button" onClick={(e) => {
                                            e.preventDefault();
                                            deleteCar(modalData.id).then(function(result) {
                                                if (result) {
                                                    onClose();
                                                    for (var i = 0; i < carTable.length; i++) {
                                                        if (carTable[i].id === modalData.id) {
                                                            delete carTable[i];
                                                        }
                                                    }
                                                }
                                            });
                                            
                                        }}>
                                        Igen
                                    </div>
                                    <div className="control-button" onClick={onClose}>
                                        Mégse
                                    </div>
                                </div>
                                    </div>
                                </div>
                                
                        : modalPage === 3 ? 
                            <UpdateCar onClose={onClose} modalData={modalData}/>
                        :
                        <> </>
                        :
                            <></>
                        }
                    </> 
                : activeSubPage === 2 ?                 
                        <>
                        <div className="header-content">
                <div className="info-header">
                    Összes adat: {travelTable.length} db
                </div>
                <div className="sub-group">
                    <div className="sub-button"  onClick={(e) => (setActiveSubPage(1))}>Járművek</div>
                    <div className="sub-button selected">Utazások</div>
                    <div className="sub-button"  onClick={(e) => (setActiveSubPage(3))}>Felhasználók</div>
                </div>
            </div>
            <section className="history-table">
                <table >
                    <thead>
                        <tr>
                            <th>Utazás azonosító<span></span></th>                             
                            <th>Sofőr neve</th>
                            <th>Indulás</th>
                            <th>Érkezés</th>
                            <th>Dátum</th>
                            <th>Státusz</th>
                            <th>Akció</th>                  
                        </tr>
                    </thead>
                    <tbody>
                        {travelTable.map((travelSource, index) => (                   
                            <tr key={index}>
                                <td>#{travelSource.id}</td>
                                <td><Link to={`/profile/${travelSource.driverID}`} className="driver-content">{travelSource.driverName}</Link></td>
                                <td>{travelSource.fromName}</td>
                                <td>{travelSource.toName}</td>
                                <td>{travelSource.startDate.replace("T", " ")}</td>
                                <td>
                                {travelSource.active === 0 ?
                                    <td className="bubble rejected">Inaktív</td>
                                :
                                    travelSource.active === 2 ?
                                        <td className="bubble rejected">Kitörölve</td>
                                    :
                                    <td className="bubble accepted">Aktív</td>
                                }
                                </td>
                                <td>
                                    <svg onClick={(e) => {
                                        setModalData(travelSource);
                                        setModalOpen(true);
                                        setModalPage(1);
                                    }} data-tooltip-id="admin-tooltip" data-tooltip-content="Utazás törlése az adatbázisból" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                                    <svg onClick={(e) => {
                                        setModalData(travelSource);
                                        setModalOpen(true);
                                        setModalPage(2); 
                                    }} data-tooltip-id="admin-tooltip" data-tooltip-content="Szerkesztés" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
 
                                </td>
                            </tr>                    
                        ))}
                    </tbody>
                </table>
                </section>
                {modalOpen ? 
                    modalPage === 1 ?        
               
                            <div className="overlay" onClick={onClose}>
                            <div className="modal-container" onClick={(e) => {
                                    e.stopPropagation();
                                }}>
                                <div className="header-modal">
                                Biztosan kiszeretnéd törölni?
                            </div>
                            <div className="control-button-container">
                                <div className="control-button" onClick={(e) => {
                                        e.preventDefault();
                                        deleteTravelFromDB(modalData.id).then(function(result) {
                                            if (result) {
                                                onClose();
                                                for (var i = 0; i < travelTable.length; i++) {
                                                    if (travelTable[i].id === modalData.id) {
                                                        delete travelTable[i];
                                                    }
                                                }
                                            }
                                        });                                      
                                    }}>
                                    Igen
                                </div>
                                <div className="control-button" onClick={onClose}>
                                    Mégse
                                </div>
                            </div>
                                </div>
                            </div>
                                
                        :
                            <TravelEdit onClose={onClose} modalData={modalData} getTravels = {getTravels}/>
                            
                        :
                            <></>
                        }
                </>
                : activeSubPage === 3 ?
                                
                   <>
                    
                    <div className="header-content">
                        <div className="sub-group">
                            <div className="info-header">
                                Összes adat: {usersTable.length}
                            </div>
                            <div className="info-header" onClick={(e) => {                       
                                setModalOpen(true);
                                setModalPage(2);
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                Új felhasználó létrehozása
                            </div>
                        </div>
                            
                        <div className="sub-group">
                            <div className="sub-button" onClick={(e) => {setActiveSubPage(1)}}>Járművek</div>
                            <div className="sub-button" onClick={(e) => {setActiveSubPage(2)}}>Utazások
                            </div>
                            <div className="sub-button selected">Felhasználók
                            </div>
                        </div>
                    </div>
                <section className="admin-table">
                        <table >
                            <thead>
                                <tr>
                                    <th>ID<span></span></th>  
                                    <th>Kép</th>                           
                                    <th>Felhasználónév</th>
                                    <th>Teljes név</th>
                                    <th>Rang</th>
                                    <th>E-Mail</th>
                                    <th>Születési idő</th>
                                    <th>Jogosítvány</th>
                                    <th>Megerősített</th>
                                    <th>Akció</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersTable.map((userSource, userIndex) =>
                                    <tr key={userIndex}>
                                        <td>{userSource.id}</td>
                                        <td><img src={userSource.image} alt=''></img></td>
                                        <td><Link to={`/profile/${userSource.id}`} className="driver-content">{userSource.name}</Link></td>
                                        
                                        <td><Link to={`/profile/${userSource.id}`} className="driver-content">{userSource.fullName}</Link></td>
                                        <td>{
                                            userSource.admin === 0 ?
                                            <div className="bubble blue">
                                                Felhasználó
                                            </div>
                                            :

                                            <>
                                            <div className="bubble green">
                                                Admin
                                            </div>
                                            </>

                                        }</td>
                                        <td>{userSource.email}</td>
                                        <td>{userSource.birthDay.substring(0, 10)}</td>
                                        <td>{userSource.licenseFrom.substring(0, 10)}</td>
                                        <td>{
                                            userSource.active === 1 ?
                                            <div className="bubble green">
                                                Megerősítve
                                            </div>
                                            :

                                            <div className="bubble red">
                                                Nincs megerősítve
                                            </div>
                                            }</td>

                                        <td>
                                            <svg onClick={(e) => {
                                                setModalOpen(true);
                                                setModalData(userSource);
                                                setModalPage(1);
                                            }} data-tooltip-id="admin-tooltip" data-tooltip-content="Felhasználó törlése" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                                            <svg onClick={(e) => {
                                                setModalOpen(true);
                                                setModalData(userSource);
                                                setModalPage(3);
                                            }} data-tooltip-id="admin-tooltip" data-tooltip-content="Szerkesztés" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                                        </td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </section>
                    {modalOpen ? 
                            
                        modalPage  === 1  ?
                            <div className="overlay" onClick={onClose}>
                                <div className="modal-container" onClick={(e) => {
                                        e.stopPropagation();
                                    }}>
                                    <div className="header-modal">
                                        Biztosan kiszeretnéd törölni?
                                    </div>
                                    <div className="control-button-container">
                                        <div className="control-button" onClick={(e) => {
                                                e.preventDefault();
                                                deleteUser(modalData.id).then(function(result) {
                                                    if (result) {
                                                        onClose();
                                                        for (var i = 0; i < usersTable.length; i++) {
                                                            if (usersTable[i].id === modalData.id) {
                                                                delete usersTable[i];
                                                            }
                                                        }
                                                    }
                                                });                                      
                                            }}>
                                            Igen
                                        </div>
                                        <div className="control-button" onClick={onClose}>
                                            Mégse
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            modalPage === 2 ?
                                <UserCreate onClose = {onClose} />
                            :
                                <EditUsers onClose = {onClose} modalData = {modalData} onRefresh={getUsers}/>
                        
                        :
                            <></>
                        }
                    </>
                :<></>}
            </div>
            <Tooltip id="admin-tooltip"/>  
        </>
    )
}



export default Admin