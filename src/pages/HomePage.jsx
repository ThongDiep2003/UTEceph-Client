import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import NavbarComponent from "../component/NavbarComponent.jsx";
import { setAppName } from "../redux/GeneralSlice.jsx";

export default function HomePage(props) {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  useEffect(()=>{
    dispatch(setAppName(`Uteceph - ${t('homepage')}`));
  },[])

  return <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
    <NavbarComponent />
    <div className="h-100 w-100" style={{
      height: '100%',
      backgroundImage: `url("/assets/images/home-background-desktop.jpg")`,
      backgroundSize: 'cover',
    }}>
      <div className="container h-100">
        <h1 className="mt-5">Day la Homepage</h1>
      </div>
    </div>
    
  </div>
}
