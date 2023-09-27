import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SET_LOGIN } from '../redux/features/auth/authSlice'
import { getLoginStatus } from '../services/authServices/authService'
import {toast} from "react-toastify"

const useRedirectLoggedOut = (path) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const redirectLoggedOut = async () => {
            const isLoggedIn = await getLoginStatus();
            dispatch(SET_LOGIN(isLoggedIn));

            if (!isLoggedIn) {
                navigate(path)
            };
        };
        redirectLoggedOut();
    }, [navigate, path, dispatch])
}

export default useRedirectLoggedOut