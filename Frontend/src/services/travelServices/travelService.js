import React from 'react'
import axios from "axios";
import {toast} from "react-toastify"
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie';



export const travelService = async (travelData) => {
    if (travelData.DriverID <= 0) {
        const TokenValue = Cookies.get("token")
        const userID = jwt_decode(TokenValue).id
        
        travelData.DriverID = userID;
    }

    try {
        const responseText = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cars/bookCarForTravel/`, travelData)
        toast.success(responseText.data)
		return responseText.data

    } catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}

}

export const deleteTravel = async(travelID) => {
	try {
		const responseText = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/travels/archivetravel/${travelID}`)
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const deleteTravelFromDB = async(travelID) => {
	try {
		const responseText = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/travels/delete/${travelID}`)

        toast.success("Sikeresen kitöröltél egy utazást az adatbázisból!");
        return true;
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const applyForTravelService = async (travelData) => {
    if (travelData.FromUser <= 0) {
        const TokenValue = Cookies.get("token")
        const userID = jwt_decode(TokenValue).id
        
        travelData.FromUser = parseInt(userID);
    }
      
	try {
		const responseText = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/applications/applytravel/`, travelData)
		toast.success("Sikeresen jelentkeztél erre az útra!");
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);     
            
	}
}

export const changeApplicationStateService = async (travelID, travelData) => {
    if (travelData.FromUser <= 0) {
        const TokenValue = Cookies.get("token")
        const userID = jwt_decode(TokenValue).id
        
        travelData.FromUser = parseInt(userID);
    }

    console.log(travelID)
      
	try {
		const responseText = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/applications/changeApplicationState/${travelID}`, travelData)
		console.log(responseText);
		toast.success("Sikeresen elfogadtad a jelentkezést!");
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const getApplications = async () => {
    const TokenValue = Cookies.get("token")
    const userID = jwt_decode(TokenValue).id

      
	try {
		const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/applications/getApplications/${userID}`)
		console.log(responseText);
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const getTravelsByCarID = async(carID) => {
    if (carID > 0) {
        try {
            const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/travels/getTravelsByCarID/${carID}`);
            return responseText.data; 
        } catch(error) {
            const errorMessage = (error.response && error.response.data) || error.message || error.toString();
            toast.error(errorMessage);           
        }
    }
}

export const getTravelsByUserID = async(carID) => {
    if (carID > 0) {
        try {
            const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/travels/getTravelsByUserID/${carID}`);
            return responseText.data; 
        } catch(error) {
            const errorMessage = (error.response && error.response.data) || error.message || error.toString();
            toast.error(errorMessage);           
        }
    }
}

export const getAllTravels = async() => {
    try {
        const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/travels/getAllTravels/`);
        console.log(responseText.data)
        return responseText.data; 
    } catch(error) {
        const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);           
    }   
}

export const getAllTravelsAdmin = async() => {
    try {
        const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/travels/getAllTravelsAdmin/`);
        console.log(responseText.data)
        return responseText.data; 
    } catch(error) {
        const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);           
    }   
}



export const getTravellersByTravelID = async(travelID) => {
    try {
        const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/travels/getTravellersByTravelID/${travelID}`);
        console.log(responseText.data)
        return responseText.data; 
    } catch(error) {
        const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);           
    }   
}

export const updateTravel = async (travelData, travelID) => {
    try {
    const axiosResponse = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/travels/updateTravel/${travelID}`, travelData, {withCredentials: true})
        

    toast.success("Sikeresen szerkesztettél egy utazást");
    return true;

    
    } catch (error) {
        const errorMessage = (error.response && error.response.data & error.response.datamessage) || error.message || error.toString();
        toast.error(errorMessage)  
    }
}