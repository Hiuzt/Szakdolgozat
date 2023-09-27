import axios from "axios";
import {toast} from "react-toastify"
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie';

export const getMyApplications = async () => {
    const TokenValue = Cookies.get("token")
    const userID = jwt_decode(TokenValue).id

      
	try {
		const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/applications/getMyApplications/${userID}`)
		console.log(responseText);
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const getMyTravels = async () => {
    const TokenValue = Cookies.get("token")
    const userID = jwt_decode(TokenValue).id

    try {
		const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/travels/getTravelsByUserID/${userID}`)
		console.log(responseText);
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const getComments = async (userID) => {
    try {
		const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/comments/getCommentForUser/${userID}`)
		console.log(responseText);
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const getUserData = async (userID) => {
    try {
		const responseText = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/getProfile/${userID}`)
		console.log(responseText);
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const writeComment = async (commentData) => {
    try {
		const responseText = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/comments/post/`, commentData)
		console.log(responseText);
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
}

export const deleteComment = async(commentID)  => {
	try {
	    const responseText = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/comments/delete/${commentID}`)
             return true;

	} catch (error) {
	      const errorMessage = (error.response && error.response.data) || error.message || error.toString();
             toast.error(errorMessage);
	
	}
}

export const saveUserServer = async (userData, userID) => {
    try {
		const responseText = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/users/updateUser/${userID}`, userData)
		return responseText.data
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}
	
}

export const changePasswordServer = async (userData, userID) => {
    try {
		console.log(userData)
		const responseText = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/users/changePassword/${userID}`, userData)
		toast.success(responseText.data);
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
	}	
}


export const searchForUsers = async (userData) => {
    try {
		console.log(userData)
		const responseText = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/searchForProfile/`, userData)
		toast.success(responseText.data);
		return responseText.data;
	} catch(error) {
		const errorMessage = (error.response && error.response.data) || error.message || error.toString();
        toast.error(errorMessage);
		return [];
	}	
}





