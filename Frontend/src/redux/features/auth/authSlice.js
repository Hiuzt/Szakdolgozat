import { createSlice } from '@reduxjs/toolkit'

const name = JSON.parse(localStorage.getItem("name"))


const initialState = {
    isLoggedIn: false,
    name: name ? name : "",
    user: {
		id: 0,
		username: "",
      	name: "",
      	email: "",
      	admin: 0,
      	age: 0,
      	license_from: "0000-00-00",
      	registeredAt: "0000-00-00",
    },
}

const authSlice = createSlice({
  	name: "auth",
  	initialState,
  	reducers: {
    	SET_LOGIN(state, action) {
			state.isLoggedIn = action.payload;
    	},

		SET_USER_NAME(state, action) {
			localStorage.setItem("name", JSON.stringify(action.payload));
			state.name = action.payload;
		},

		SET_USER(state, action) {
			const userData = action.payload;

			state.user.id = userData.id;
			state.user.username = userData.name;
			state.user.name = userData.name;
			state.user.email = userData.email;
			state.user.admin = userData.admin;
			state.user.age = userData.age;
			state.user.license_from = userData.license_from;
			state.user.registeredAt = userData.registeredAt;
			
		},
  	},
});

export const {SET_LOGIN, SET_USER_NAME, SET_USER} = authSlice.actions;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
