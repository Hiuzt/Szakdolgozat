import { useState, useEffect, useRef } from "react";
import Menu from "../components/Menu"
import { changeApplicationStateService, getApplications } from "../services/travelServices/travelService";
import "../design.css";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";

export default function Applications() {
    const [applicationData, setApplicationData] = useState([])
    const reasonRef = useRef()
    useEffect(() => {
        const getApplicationsClient = async () => {
            getApplications().then(function(result) {
                setApplicationData(result)
            });
        }
        getApplicationsClient();
    }, [])

    function changeApplicationState(applicationStatus, applicationID, applicationReason, travelID, userEmail) {
        
        const postedData = {
            Type: applicationStatus,
            Reason: applicationReason,
            travelID: travelID,
            Email: userEmail
        }

        changeApplicationStateService(applicationID, postedData)
    }


    const [modalPage, setModalPage] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState([]);

    function onClose() {
        setModalOpen(false);
        setModalPage(0);
        setModalData([]);
    }

    return (<>
    
        <Menu pageNumber={3}/>
        <div className="application-container">

            
            <div className="header-content">
                    <div className="info-header">
                        Összes jelentkezés: {applicationData.length}
                    </div>
                    <div>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg> */}
                        {/* <input type = "text" placeholder="Keresés.." onChange={(e) => setSearch(e.target.value)}/> */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg> */}
                    </div>
                </div>
                <section className="application-table">
                    <table >
                        <thead>
                            <tr>
                                <th>Utazás azonosító<span></span></th>
                                <th>Jelentkező</th>       
                                <th>E-mail cím</th>
                                <th>Út</th>
                                <th>Jelentkezés dátuma</th>
                                <th>Kezelés</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicationData.map((travelValue, index) => (                    
                                    <tr className="table-rows">
                                        <td>#{travelValue.id}</td>
                                        <td>
                                         <Link to = {"/profile/" + travelValue.fromUser} className="driver-content">
                                            <img src={travelValue.userImage} alt=""></img>
                                            {travelValue.fullname}
                                        </Link>
                                        </td>                                  
                                        <td>{travelValue.email}</td>
                                        <td>{travelValue.fromTo}</td>
                                        <td>{travelValue.created.replace("T", " ")}</td>
                                        <td>
                                            <span data-tooltip-id="application-tooltip" data-tooltip-content="Elfogadás" onClick={
                                                (e) => {
                                                    setModalOpen(true);
                                                    setModalPage(1);
                                                    setModalData(travelValue);
                                                }
                                            }>                                     
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                                            </span>
                                            <span data-tooltip-id="application-tooltip" data-tooltip-content="Elutasítás" onClick={
                                                (e) => {
                                                    setModalOpen(true);
                                                    setModalPage(2);
                                                    setModalData(travelValue);
                                                }}>                
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                                            </span>
                                        </td>
                                    </tr>
        
                                ))}
                        </tbody>
                    </table>
                </section>
                <Tooltip id="application-tooltip" />
                {modalOpen === true ?
                    <div className="overlay" onClick={onClose}>
                        <div className="modal-container" onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        {modalPage === 1 ? 
                          <>
                            <div className="header-modal">
                                Biztosan elszeretnéd fogadni?
                            </div>
                            <div className="control-button-container">
                                <div className="control-button" onClick={(e) => {
                                        e.preventDefault();
                                        changeApplicationState(1, modalData.id, "Az utazásod el lett fogadva!", modalData.travelID, modalData.email);
                                        onClose();
                                        for (var i = 0; i < applicationData.length; i++) {
                                            if (applicationData[i].id === modalData.id) {
                                                delete applicationData[i];
                                            }
                                        }
                                    }}>
                                    Igen
                                </div>
                                <div className="control-button" onClick={onClose}>
                                    Mégse
                                </div>
                            </div>
                          </>  
                        :
                        <>  <div className="header-modal">
                                <textarea placeholder="Elutasítás indoka..." cols="30" rows="5" ref={reasonRef} ></textarea>
                            </div>
                            <div className="control-button-container">
                                <div className="control-button" onClick={(e) => {
                                        e.preventDefault();
                                        changeApplicationState(2, modalData.id, "Az utazásod el lett utasítva indok: " + reasonRef.current.value, modalData.travelID, modalData.email);
                                        onClose();
                                        
                                        for (var i = 0; i < applicationData.length; i++) {
                                            if (applicationData[i].id === modalData.id) {
                                                delete applicationData[i];
                                            }
                                        }
                                        
                                        
                                    }}>
                                    Elutasítás
                                </div>
                                <div className="control-button" onClick={onClose}>
                                    Mégse
                                </div>
                            </div>                                 
                            </>  
                        }
                        </div>
                    </div>                    
                :
                    <></>
                }
            </div>
    </>);
}



