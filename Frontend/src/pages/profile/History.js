import React, {useState, useEffect} from 'react'
import Menu from '../../components/Menu';
import "./profile.css";
import {getMyApplications, getMyTravels} from "../../services/profileServices/profileServices";
import useRedirectLoggedOut from '../../customHook/useRedirectLoggedOut';

const History = () => {
    useRedirectLoggedOut("/");
    const [applicationData, setApplicationData] = useState([])
    const [travelData, setTravelData] = useState([])
    const [historyPage, setHistoryPage] = useState(1)
    const [loadedApplications, setLoadedApplications] = useState(false);
    const [loadedTravels, setLoadedTravels] = useState(false);

    useEffect(() => {
        const getMyApplicationsClient = async () => {
            getMyApplications().then(function(result) {
                setApplicationData(result)
                setLoadedApplications(true)
                
            });
        }
        const getMyTravelsClient = async () => {
            getMyTravels().then(function(result) {
                setTravelData(result)
                console.log(result);
                setLoadedTravels(true);
            });
        }

        getMyApplicationsClient();
        getMyTravelsClient();
    }, [])

  return (
    <>
        <Menu pageNumber={9}/>
        <div className="history-container">
        {historyPage === 1 ? 
            <>
            <div className="header-content">
                <div className="info-header">
                {loadedApplications === true ? <>Összes adat: {applicationData.length} db</>:<></>}
                </div>
                <div className="sub-group">
                    <div className="sub-button selected">Jelentkezéseim</div>
                    <div className="sub-button" onClick={(e) => {
                        setHistoryPage(2)

                    }}>Utazásaim</div>
                </div>
            </div>
            <section className="history-table">
                <table >
                    <thead>
                        <tr>
                            <th>Utazás azonosító<span></span></th>                             
                            <th>Út</th>
                            <th>Módosítás dátuma</th>
                            <th>Jelentkezés dátuma</th>
                            <th>Indok</th>
                            <th>Státusz</th>                               
                        </tr>
                    </thead>
                    <tbody>
                        {loadedApplications === true ?           
                            applicationData.map((applicationSource, index)  => (                   
                                <tr key={index}>
                                    <td>#{applicationSource.id}</td>
                                    <td>{applicationSource.fromTo}</td>
                                    <td>{applicationSource.created.replace("T", " ")}</td>
                                    <td>{applicationSource.modified.replace("T", " ")}</td>
                                    <td>{applicationSource.reason}</td>
                                    <td>
                                        {applicationSource.type === 0 ?
                                            <div className="bubble pending">Feldolgozás alatt</div>
                                        : applicationSource.type === 1 ? 
                                            <div className="bubble accepted">Elfogadva</div>
                                        :
                                            <div className="bubble rejected">Elutasítva</div>
                                        }
                                    </td>
                                </tr>                    
                            ))
                        :
                            <></>
                        }
                    </tbody>
                </table>
            </section>           
            </>
        :
        <>
        <div className="header-content">
                <div className="info-header">
                    Összes adat: {travelData.length} db
                </div>
                <div className="sub-group">
                    <div className="sub-button"  onClick={(e) => (setHistoryPage(1))}>Jelentkezéseim</div>
                    <div className="sub-button selected">Utazásaim</div>
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
                        </tr>
                    </thead>
                    <tbody>
                        {travelData.map((travelSource, index) => (                   
                            <tr key={index}>
                                <td>#{travelSource.id}</td>
                                <td>{travelSource.driverName}</td>
                                <td>{travelSource.fromName}</td>
                                <td>{travelSource.toName}</td>
                                <td>{travelSource.startDate.replace("T", " ")}</td>

                                {travelSource.active === 0 ?
                                    <td className="bubble rejected">Inaktív</td>
                                :
                                    travelSource.active === 2 ?
                                        <td className="bubble rejected">Kitörölve</td>
                                    :
                                    <td className="bubble accepted">Aktív</td>
                                }
                            </tr>                    
                        ))}
                    </tbody>
                </table>
            </section>
        </>
        }
            

        </div>
        </>
            
  )
}

export default History