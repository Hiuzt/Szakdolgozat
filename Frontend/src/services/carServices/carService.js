import axios from "axios";
import {toast} from "react-toastify"

export const getAllCars = async () => {
    try{
        
        const axiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cars/getAllCar/`, {withCredentials: true})
        
        console.log(axiosResponse.data)
        return axiosResponse.data;

        
    } catch (error) {
        const errorMessage = (error.response && error.response.data & error.response.datamessage) || error.message || error.toString();
        toast.error(errorMessage)  
    }
}

export const deleteCar = async (id) => {
    try{
        
        const axiosResponse = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/cars/deleteCar/${id}`, {withCredentials: true})
        
        toast.success("Sikeresen kitöröltél egy autót");
        return true;

        
    } catch (error) {
        const errorMessage = (error.response && error.response.data & error.response.datamessage) || error.message || error.toString();
        toast.error(errorMessage)  
    }
}

export const createCar = async (carData) => {
    try{
        
        const axiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cars/create/`, carData, {withCredentials: true})
        
        toast.success("Sikeresen létrehoztál egy járművet");
        window.location.reload();
        return true;

        
    } catch (error) {
        const errorMessage = (error.response && error.response.data & error.response.datamessage) || error.message || error.toString();
        toast.error(errorMessage)  
    }
}

export const updateCar = async (carData, carID) => {
    try {
    const axiosResponse = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/cars/updateCar/${carID}`, carData, {withCredentials: true})
        
    
        setTimeout(() => {
            window.location.reload();
        }, 2000)
    toast.success("Sikeresen szerkesztettél egy járművet");
    return true;

    
    } catch (error) {
        const errorMessage = (error.response && error.response.data & error.response.datamessage) || error.message || error.toString();
        toast.error(errorMessage)  
    }
}
