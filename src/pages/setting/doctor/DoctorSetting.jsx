import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MyProfile from "./MyProfile.jsx";

export default function DoctorSetting(props){
  const [selectedTab,setSelectedTab] = useState(0);
  let currentTab = null;
  
  const {t} = useTranslation();

  switch(selectedTab){
    case 0: currentTab = <MyProfile FONT_SIZE={props.FONT_SIZE} setSelectedTab={props.setSelectedTab}/>
    break;
    case 1: currentTab = <div className="d-flex my-3">
    </div>
    break;
    default: currentTab = <div>error</div>
  }

  return <div className="d-flex flex-column h-100">
    <div className="w-100 d-flex justify-content-end mc-background-color-white py-2">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <button type="button" className={`btn me-3 px-3 py-0 text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(0)}>
          <span className="text-capitalize" style={{fontSize:props.FONT_SIZE}}>{t('my profile')}</span>
        </button>
        <button type="button" className={`btn px-3 py-0 text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(1)}>
          <span className="text-capitalize" style={{fontSize:props.FONT_SIZE}}>{t('other doctor profile')}</span>
        </button>
      </div>
    </div>
    {currentTab}
  </div>
}