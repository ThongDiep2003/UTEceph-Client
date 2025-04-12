import { createSlice } from "@reduxjs/toolkit";

export const ClinicSlice = createSlice({
  name: 'clinic',
  initialState:{
    idClinicDefault: null,
    roleOfDoctor: null,
    data: null
  },
  reducers:{
    setDataClinic: (state,action) => {
      state.data = action.payload;
    },
    setIdClinicDefault: (state,action) => {
      state.idClinicDefault = action.payload;
    },
    setRoleOfDoctor: (state,action) => {
      state.roleOfDoctor = action.payload;
    },
    clearClinicSlice: (state) => {
      state.data = null;
      state.idClinicDefault = null;
      state.roleOfDoctor = null;
    }
  }
})

export const {
  setDataClinic,setIdClinicDefault,setRoleOfDoctor,clearClinicSlice
} = ClinicSlice.actions;

export default ClinicSlice.reducer;
