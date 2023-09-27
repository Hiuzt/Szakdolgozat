import axios from "axios";
import Cookies from "js-cookie";
import {toast} from "react-toastify"


export const RegisterUser = async (userData) => {
    try{
        const registerResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register/`, userData)
        if (registerResponse.statusText === "OK") {
            toast.success("Sikeresen regisztráltál!")
        }
    } catch (error) {
        const errorMessage = (error.response && error.response.data & error.response.datamessage) || error.message || error.toString();
        toast.error(errorMessage)       
    }
}

export const LoginUser = async (userData) => {
	try {
		const responseText = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login/`, {Name: userData.Name, Password: userData.Password}, {withCredentials: true})
		toast.success("Sikeres bejelentkezés!");
		console.log(responseText);
		
		Cookies.set("token", responseText.data.token, { path: '/' });
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
 }

 export const getLoginStatus = async () => {
	try {
		const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/loggedin/`)
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
 }

 export const confirmUser = async (confirmCode) => {
	try {
		const responseText = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/users/confirm/${confirmCode}`)
		return responseText.data
	} catch(error) {
        return false;
	}
 }

 export const forgotPasswordForm = async (userData) => {
	try {
		const responseText = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/forgot/`, userData)
		toast.success(responseText.data)
		return responseText.data
	} catch(error) {
        const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
 }

 export const resetPasswordForm = async (token, userData) => {
	try {
		await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/users/resetpassword/${token}`, userData)
		return true;
	} catch(error) {
        const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
		return false;
	}
 }

export const getAllUsers = async () => {
	try {
		const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/getAllUsers/`)
		return responseText.data;
	} catch(error) {
        const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
		// return errorMessage;
	}
}

export const deleteUser = async (id) => {
    try{
        
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/delete/${id}`, {withCredentials: true})
        
        toast.success("Sikeresen kitöröltél egy felhasználót!");
        return true;

        
    } catch (error) {
        const errorMessage = (error.response && error.response.data & error.response.datamessage) || error.message || error.toString();
        toast.error(errorMessage)  
    }
}


export const registerUserByAdmin = async (userData) => {
    try {
		console.log(userData)
		const responseText = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/registerByAdmin/`, userData)
		toast.success(responseText.data);
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}	
}

export const saveUserServerByAdmin = async (userData, userID) => {
    try {
		const responseText = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/users/updateUserByAdmin/${userID}`, userData)
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
	
}

export const changePasswordServerByAdmin = async (userData, userID) => {
    try {
		console.log(userData)
		const responseText = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/users/changePasswordByAdmin/${userID}`, userData)
		toast.success(responseText.data);
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}	
}

