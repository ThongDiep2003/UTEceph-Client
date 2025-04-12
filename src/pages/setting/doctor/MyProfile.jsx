import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import UploadImage from "../../../common/UploadImage.jsx";
import { convertISOToVNDateString, deleteImage, splitAvatar, splitPublic_id, toISODateString, upLoadImage } from "../../../common/Utility.jsx";
import { clearClinicSlice, setIdClinicDefault, setRoleOfDoctor } from "../../../redux/ClinicSlice.jsx";
import { logOutDoctor, setDataDoctor } from "../../../redux/DoctorSlice.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";

const WIDTH_HEAD = "150px";
const WIDTH_CHILD = "300px";
const FONT_SIZE_ICON = "18px";
const FONT_SIZE_BUTTON_ICON = "40px";
const AVATAR_HEIGHT = "300px";
const AVATAR_WIDTH = "200px";

export default function MyProfile(props){
  const loading = useSelector(state=>state.general.loading);
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic.data);
  const [image,setImage] = useState('');
  const [newAvatarUrl,setNewAvatarUrl] = useState();
  const [editMode,setEditMode] = useState(false);
  const [fullName,setFullName] = useState();
  const [avatar,setAavatar] = useState();
  const [publicIdAvatar,setPublicIdAvatar] = useState();
  const [gender,setGender] = useState();
  const [birthday,setBirthday] = useState();
  const [phoneNumber,setPhoneNumber] = useState();
  const [speciality,setSpeciality] = useState();
  const [diploma,setDiploma] = useState();
  const [position,setPosition] = useState();
  const [description,setDescription] = useState();

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(()=>{
    getInformation();
  },[])

  const getInformation = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/doctor/getInformationDoctor/${doctor.email}`).then(result => {
        dispatch(setDataDoctor(result.data));
        setFullName(result.data.fullName);
        setGender(result.data.gender);
        setBirthday(result.data.birthday);
        setPhoneNumber(result.data.phoneNumber);
        setSpeciality(result.data.speciality);
        setDiploma(result.data.diploma);
        setPosition(result.data.position);
        setDescription(result.data.description);
        setAavatar(splitAvatar(result.data.avatar,'/assets/images/doctor.png'));
        setPublicIdAvatar(splitPublic_id(result.data.avatar));
        resolve();
      }).catch((err) => {
        if(err.isLogin===false){
          dispatch(logOutDoctor());
          dispatch(clearClinicSlice());
          nav("/login");
        }else{
          toast.error(t(err.message));
        }
        reject(err.message);
      }).finally(() => dispatch(setLoadingModal(false)))
    });
  }

  const onCancel = () => {
    setFullName(doctor.fullName);
    setGender(doctor.gender);
    setBirthday(doctor.birthday);
    setPhoneNumber(doctor.phoneNumber);
    setSpeciality(doctor.speciality);
    setDiploma(doctor.diploma);
    setPosition(doctor.position);
    setDescription(doctor.description);
    setImage('');
    setNewAvatarUrl('');
    setEditMode(false);
  }

  const pushDataToServer = (avatar) =>{
    putToServerWithToken(`/v1/doctor/updateInformation/${doctor.id}`,{
      fullName: fullName,
      avatar: avatar,
      gender: gender,
      birthday: birthday,
      phoneNumber: phoneNumber,
      speciality: speciality,
      diploma: diploma,
      position: position,
      description: description
    }).then(result => {
      getInformation().then(()=>setEditMode(false));
    }).catch((err) => toast.error(t(err.message))).finally(() => dispatch(setLoadingModal(false)));
  }

  const onUpdate = async () => {
    dispatch(setLoadingModal(true));
    if(image){
      if(avatar!=='/assets/images/doctor.png'){
        deleteImage(publicIdAvatar).then(async (response) => {
          if(response.data.result==="ok"){
            const responseData = await upLoadImage(image);
            const newAvatar = responseData.data.secure_url + '_' + responseData.data.public_id;
            pushDataToServer(newAvatar);
          }else{
            toast.error(t('update avatar failed'));
            dispatch(setLoadingModal(false))
          }
        })
      }else{
        const responseData = await upLoadImage(image);
        const newAvatar = responseData.data.secure_url + '_' + responseData.data.public_id;
        pushDataToServer(newAvatar);
      }
    }else{
      if(avatar!=='/assets/images/doctor.png'){
        pushDataToServer(doctor.avatar);
      }else{
        pushDataToServer('');
      }
    }
  }

  const onToClinic = (idClinic,roleOfDoctor) => {
    dispatch(setIdClinicDefault(idClinic));
    dispatch(setRoleOfDoctor(roleOfDoctor));
    props.setSelectedTab(1);
  }


  return <div className="d-flex flex-column h-100">
    <div className="d-flex justify-content-end mt-2">
      {
        editMode ?
        <div>
          <IconButtonComponent className="btn-outline-success me-2" onClick={onUpdate} icon="done" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("save")}/>
          <IconButtonComponent className="btn-outline-danger" onClick={onCancel} icon="close" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("cancel")}/>
        </div>
        :
        <IconButtonComponent className="btn-outline-warning" onClick={e=>setEditMode(true)} icon="edit" FONT_SIZE_ICON={FONT_SIZE_ICON} title={t("edit")}/>
      }
    </div>
    <span className="w-100 d-flex justify-content-end my-2" style={{fontSize:props.FONT_SIZE}}>
      <span className="text-capitalize mc-color fw-bold me-2">{t('update at')}: </span>
      {convertISOToVNDateString(toISODateString(new Date(doctor.updatedAt?doctor.updatedAt:new Date())))}
    </span>
    {
      !loading && <div className="d-flex flex-row flex-grow-1">
        <div className="border position-relative d-flex justify-content-center align-items-center rounded mc-background-color-white rounded" style={{height:AVATAR_HEIGHT,width:AVATAR_WIDTH}}>
          {
            editMode && <UploadImage className="position-absolute btn-primary" style={{height:FONT_SIZE_BUTTON_ICON,width:FONT_SIZE_BUTTON_ICON,top:"0px",right:"0px",fontSize:props.FONT_SIZE}} getUrlImage={value =>setNewAvatarUrl(value)} getImage={value=>setImage(value)}/>
          }
          <img alt="avatar" className="rounded" src={`${editMode?(newAvatarUrl?newAvatarUrl:avatar):avatar}`} style={{height:AVATAR_HEIGHT,width:AVATAR_WIDTH,objectFit:"cover"}}/>
        </div>
        <div className="d-flex flex-column flex-grow-1 ms-5">
          <div className={`d-flex mb-3 ${editMode?'border-bottom':''}`}>
            <span className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('email')}:</span>
            <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded" style={{fontSize:props.FONT_SIZE,width:WIDTH_CHILD}}>{doctor.email}</span>
            <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('full name')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:props.FONT_SIZE}} value={fullName} onChange={e=>setFullName(e.target.value)}/>
              :
              <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:props.FONT_SIZE}}>{fullName?fullName:'no data'}</span>
            }
          </div>
          <div className={`d-flex mb-3 ${editMode?'border-bottom':''}`}>
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('gender')}:</label>
            {
              editMode ? 
              <select className="text-gray border-0 p-0 text-capitalize" style={{outline:"none",width:WIDTH_CHILD}} value={gender} onChange={e=>setGender(e.target.value)}>
                <option selected disabled={true}>no data</option>
                <option className="text-gray border-0 text-capitalize" value={'male'} style={{fontSize:props.FONT_SIZE,width:WIDTH_CHILD}}>
                  {t('male')}
                </option>
                <option className="text-gray border-0 text-capitalize" value={'female'} style={{fontSize:props.FONT_SIZE,width:WIDTH_CHILD}}>
                  {t('female')}
                </option>
              </select>
              :
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded" style={{fontSize:props.FONT_SIZE,width:WIDTH_CHILD}}>{gender?gender:'no data'}</span>
            }
            <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('birth of day')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 flex-grow-1" style={{outline:"none",fontSize:props.FONT_SIZE}} onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} type="date" value={toISODateString(new Date(birthday?birthday:new Date()))} onChange={e=>setBirthday(e.target.value)}/>
              :
              <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:props.FONT_SIZE}}>{convertISOToVNDateString(toISODateString(new Date(birthday?birthday:new Date())))}</span>
            }
          </div>
          <div className={`d-flex mb-3 ${editMode?'border-bottom':''}`}>
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('phone number')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:props.FONT_SIZE,width:WIDTH_CHILD}} type="number" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)}/>
              :
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded" style={{fontSize:props.FONT_SIZE,width:WIDTH_CHILD}}>{phoneNumber?phoneNumber:'no data'}</span>
            }
            
            <div className="d-flex flex-wrap flex-grow-1" style={{width:WIDTH_CHILD}}>
            <label className="text-capitalize mc-color fw-bold ms-2" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('speciality')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:props.FONT_SIZE}} value={speciality} onChange={e=>setSpeciality(e.target.value)}/>
              :
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:props.FONT_SIZE}}>{speciality?speciality:'no data'}</span>
            }
            </div>
          </div>
          <div className={`d-flex flex-row mb-3 ${editMode?'border-bottom':''}`}>
            <span className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('clinics')}:</span>
            <div className="d-flex flex-row flex-wrap flex-grow-1" style={{width:WIDTH_CHILD}}>
              {
                clinic?.map(clinic => {
                  return <button key={clinic.id} type="button" className="btn btn-primary px-2 text-capitalize shadow me-3 mb-1" style={{fontSize:props.FONT_SIZE}} onClick={e=>onToClinic(clinic.id,clinic.roleOfDoctor)}>
                    {
                      clinic.roleOfDoctor === 'admin' && <img alt="logo" className="me-1 mb-1" src="/assets/icons/user.png" height={"15px"}/>
                    }
                    <span>{clinic.nameClinic}</span>
                  </button>
                })
              }
            </div>
          </div>
          <div className={`d-flex mb-3 ${editMode?'border-bottom':''}`}>
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('diploma')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:props.FONT_SIZE}} value={diploma} onChange={e=>setDiploma(e.target.value)}/>
              :
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:props.FONT_SIZE}}>{diploma?diploma:'no data'}</span>
            }
          </div>
          <div className={`d-flex mb-3 ${editMode?'border-bottom':''}`}>
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('position')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:props.FONT_SIZE}} value={position} onChange={e=>setPosition(e.target.value)}/>
              :
              <span className="text-capitalize text-gray mc-background-color-white px-2 py-1 rounded flex-grow-1" style={{fontSize:props.FONT_SIZE}}>{position?position:'no data'}</span>
            }
          </div>
          <div className={`d-flex ${editMode?'border-bottom':''}`}>
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('description')}:</label>
            {
              editMode ? 
              <textarea className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none",fontSize:props.FONT_SIZE}} value={description} onChange={e=>setDescription(e.target.value)}/>
              :
              <span className="text-capitalize text-gray flex-grow-1 mc-background-color-white px-2 py-1 rounded" style={{fontSize:props.FONT_SIZE}}>{description?description:'no data'}</span>
            }
          </div>
        </div>
      </div>
    }
    <div className="my-3 d-flex align-items-center justify-content-center w-100">
      <hr style={{ width: '140px' }} />
      <span className="mx-3 mc-color fw-bold text-uppercase">{t('my profile')}</span>
      <hr style={{ width: '140px' }} />
    </div>
  </div>
}