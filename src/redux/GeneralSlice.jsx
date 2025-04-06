import { createSlice } from "@reduxjs/toolkit";

export const GeneralSlice = createSlice({
  name: 'general',
  initialState:{
    appName: 'Myceph',
    loading: false,
    language: 'vi'
  },
  reducers:{
    setAppName: (state,action) => {
      state.appName = action.payload;
    },
    setLoadingModal: (state,action) => {
      state.loading = action.payload;
    },
    setLanguage: (state,action) => {
      state.language = action.payload;
    }
  }
})

export const {
  setLoadingModal,setLanguage,setAppName
} = GeneralSlice.actions;

export default GeneralSlice.reducer;