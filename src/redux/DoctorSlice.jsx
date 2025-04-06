import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { cookies } from "../common/Untility.jsx";

export const DoctorSlice = createSlice({
  name: 'doctor',
  initialState:{
    doctor: null
  },
  reducers:{
    setDataDoctor: (state,action) => {
      state.doctor = action.payload;
    },
    logOutDoctor: (state) => {
      storage.removeItem('persist:root');
      cookies.remove('accessToken', {path: '/'});
      state.doctor = null;
    }
  }
})

export const {
  setDataDoctor,logOutDoctor
} = DoctorSlice.actions;

export default DoctorSlice.reducer;