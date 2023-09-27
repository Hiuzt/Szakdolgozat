import React, { useEffect, useState } from 'react'

import Menu from "../components/Menu";
import "../design.css";
import CarCard from "../components/CarCard";


import useRedirectLoggedOut from '../customHook/useRedirectLoggedOut';

import { getAllCars } from '../services/carServices/carService';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';


const Cars = () => {
    const TokenValue = Cookies.get("token")
    const userID = jwt_decode(TokenValue).id

    const [carTable, setCarTable] = useState([]);
    useRedirectLoggedOut("/");
    useEffect(() => {
        const getCars = async () => {
            getAllCars().then(function(result){
                setCarTable(result);
            });
        }
        getCars();
    
      }, []);
    return (
    <>
        <Menu pageNumber = {1}/>         
        <div className="filter-container">
            </div>
            <div className="car-container">
            {carTable.map((carValue) => 
                <div>
                
                    <CarCard carimage={carValue.image} name={carValue.seatNumber} km={carValue.distanceTravelled} from={"Nincs lefoglalva"} to={"Nincs lefoglalva"} id = {carValue.id} userid = {userID}/>
                </div>
            )} 
                    
                    
                                
            </div>           
    </>
  )
}

export default Cars

