import { Switch } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import { convertISOToVNDateString, splitAvatar, toISODateString } from "../../../common/Utility.jsx";

const AVATAR_HEIGHT = "70px";
const AVATAR_WIDTH = "50px";

export default function DoctorRows(props){
  const clinic = useSelector(state=>state.clinic);
  const doctor = useSelector(state=>state.doctor.data);
  const {t} = useTranslation();
  return <tr className={`align-middle ${props.doctor.roleOfDoctor === 'admin' && 'mc-pale-background'}`}>
    <td className="d-lg-table-cell d-none">
      <img alt="avatar" className="rounded" src={splitAvatar(props.doctor.avatar,'/assets/images/doctor.png')} style={{height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
    </td>
    <td className={`${props.doctor.roleOfDoctor==='admin'?'text-white':'text-gray'}`} style={{fontSize:props.FONT_SIZE}}>
      {props.doctor.fullName?props.doctor.fullName:t('no data')}
    </td>
    <td className={`d-lg-table-cell d-none ${props.doctor.roleOfDoctor==='admin'?'text-white':'text-gray'}`} style={{fontSize:props.FONT_SIZE}}>
      {props.doctor.email?props.doctor.email:t('no data')}
    </td>
    <td className={`d-lg-table-cell d-none ${props.doctor.roleOfDoctor==='admin'?'text-white':'text-gray'}`} style={{fontSize:props.FONT_SIZE}}>
      {props.doctor.birthday?convertISOToVNDateString(toISODateString(new Date(props.doctor.birthday))):t('no data')}
    </td>
    <td className={`d-lg-table-cell d-none ${props.doctor.roleOfDoctor==='admin'?'text-white':'text-gray'}`} style={{fontSize:props.FONT_SIZE}}>
      {props.doctor.gender?props.doctor.gender:t('no data')}
    </td>
    <td className={`d-lg-table-cell d-none ${props.doctor.roleOfDoctor==='admin'?'text-white':'text-gray'}`}>
      <div className="form-check form-switch d-flex justify-content-center">
        <input 
          className="form-check-input" 
          type="checkbox" 
          role="switch" 
          checked={props.doctor.roleOfDoctor==='admin'} 
          value={props.doctor.roleOfDoctor} 
          onChange={e=>{
            if(e.target.value==='member') props.changeRoleOfDoctor(props.doctor.idDoctor,'admin');
            else props.changeRoleOfDoctor(props.doctor.idDoctor,'member');
          }} 
          disabled={props.doctor.email===doctor.email || clinic.roleOfDoctor!=='admin'} 
          placeholder={t('change to admin')}/>
      </div>
    </td>
    <td className={`d-lg-table-cell d-none ${props.doctor.roleOfDoctor==='admin'?'text-white':'text-gray'}`} style={{fontSize:props.FONT_SIZE}}>
      {props.doctor.speciality?props.doctor.speciality:t('no data')}
    </td>
    {
      clinic.roleOfDoctor==='admin' && <td className="d-lg-table-cell d-none">
        <IconButtonComponent className="btn-outline-danger border-0 p-0" icon="delete" FONT_SIZE_ICON={"25px"} title={t("delete doctor from clinic")} onClick={e=>props.deleteDoctorFromClinic(props.doctor.idDoctor)} disabled={props.doctor.email===doctor.email}/>
      </td>
    }
  </tr>
}