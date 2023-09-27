import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Resetpassword from "./pages/auth/Resetpassword";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Travels from "./pages/Travels";
import Applications from "./pages/Applications";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLoginStatus } from "./services/authServices/authService";
import {SET_LOGIN} from "./redux/features/auth/authSlice";
import History from "./pages/profile/History";
import Profile from "./pages/profile/Profile";
import "./design.css";
import EditProfile from "./pages/profile/EditProfile";
import Confirm from "./pages/auth/Confirm";
import Admin from "./pages/profile/Admin";

axios.defaults.withCredentials = true;



function App() {

	if (localStorage.getItem("activeTheme") === null) {
		localStorage.setItem("activeTheme", "light");
	}
	
	const bodyClass = document.body.classList;
    let activeTheme = localStorage.getItem("activeTheme");
    bodyClass.add(activeTheme);
	
	const dispatch = useDispatch()
	
	useEffect(() => {
		async function loginStatus() {
			const lStatus = await getLoginStatus();
			dispatch(SET_LOGIN(lStatus))
		}
		loginStatus()
	}, [dispatch]);


		

  	return (
		<>

			<BrowserRouter>
				<ToastContainer position="top-center" theme={activeTheme}/>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/forgot" element={<ForgotPassword />} />
					<Route path="/resetpassword/:resetToken" element={<Resetpassword />} />
					<Route path="/home" element={<Home />} />
					<Route path="/cars" element={<Cars />} />
					<Route path="/travels" element={<Travels />} />
					<Route path="/applications" element={<Applications />} />
					<Route path="/history" element={<History />} />
					<Route path="/profile/:userID" element={<Profile />} />
					<Route path="/editprofile/" element={<EditProfile />} />
					<Route path="/Confirm/:confirmCode" element={<Confirm />} />
					<Route path="/admin/" element={<Admin />} />
				</Routes>
			</BrowserRouter>
		</>		
  	);
}

export default App;
