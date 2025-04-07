import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadImage from "../../common/UploadImage.jsx";
import { convertISOToVNDateString, deleteImage, splitAvatar, splitPublic_id, toISODateString, upLoadImage } from "../../common/Utility.jsx";
import { logOutDoctor, setDataDoctor } from "../../redux/DoctorSlice.jsx";
import { setLoadingModal } from "../../redux/GeneralSlice.jsx";
import { getToServerWithToken, putToServerWithToken } from "../../services/getAPI.jsx";

const WIDTH_HEAD = "150px";

export default function DoctorSetting(props){
  const doctor = useSelector(state=>state.doctor.data);
  const [image,setImage] = useState('');
  const [newAvatarUrl,setNewAvatarUrl] = useState();
  const [selectedTab,setSelectedTab] = useState(0);
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

  let currentTab = null;
  
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(()=>{
    getInformation();
  },[])

  const getInformation = () =>{
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      getToServerWithToken(`/v1/doctor/getInformationDoctor/${doctor.email}`,dispatch).then(result => {
        dispatch(setDataDoctor(result.data));
        setFullName(result.data.fullName);
        setGender(result.data.gender);
        setBirthday(result.data.birthday);
        setPhoneNumber(result.data.phoneNumber);
        setSpeciality(result.data.speciality);
        setDiploma(result.data.diploma);
        setPosition(result.data.position);
        setDescription(result.data.description);
        setAavatar(splitAvatar(result.data.avatar));
        setPublicIdAvatar(splitPublic_id(result.data.avatar));
        resolve();
      }).catch((err) => {
        if(!err.isLogin){
          dispatch(logOutDoctor());
          toast.warning(t(err.message));
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
      pushDataToServer('');
    }
  }

  switch(selectedTab){
    case 0: currentTab = <div className="d-flex flex-column h-100">
      <div className="d-flex flex-grow-1 justify-content-end mt-2">
        {
          editMode ?
          <div>
            <button type="button" className="btn btn-outline-success p-0 text-white-hover me-2" title={t('save')} onClick={onUpdate}>
              <span className="material-symbols-outlined mt-1 mx-1">
                done
              </span>
            </button>
            <button type="button" className="btn btn-outline-danger p-0 text-white-hover" title={t('cancel')} onClick={onCancel}>
              <span className="material-symbols-outlined mt-1 mx-1">
                close
              </span>
            </button>
          </div>
          :
          <button type="button" className="btn btn-outline-warning p-0 text-white-hover" title={t('edit profile')} onClick={e=>setEditMode(true)}>
            <span className="material-symbols-outlined mt-1 mx-1">
              edit
            </span>
          </button>
        }
      </div>
      <div className="d-flex flex-row flex-grow-1">
        <div className="border position-relative d-flex justify-content-center align-items-center rounded mc-background-color-white rounded" style={{height:"350px",width:"250px"}}>
          {
            editMode && <UploadImage className="position-absolute" style={{height:"50px",width:"50px",top:"0px",right:"0px"}} getUrlImage={value =>setNewAvatarUrl(value)} getImage={value=>setImage(value)}/>
          }
          <img alt="avatar" className="rounded" src={`${editMode?(newAvatarUrl?newAvatarUrl:avatar):avatar}`} style={{height:"350px",width:"250px",objectFit:"cover"}}/>
        </div>
        <div className="d-flex flex-column flex-grow-1 ms-5">
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('email')}:</label>
            <span className="text-capitalize text-gray fw-bold">{doctor.email}</span>
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('full name')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} value={fullName} onChange={e=>setFullName(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{fullName?fullName:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('gender')}:</label>
            {
              editMode ? 
              <select className="text-gray border-0 p-0 text-capitalize" style={{outline:"none"}} value={gender} onChange={e=>setGender(e.target.value)}>
                <option selected disabled={true}>no data</option>
                <option className="text-gray border-0 text-capitalize" value={'male'}>
                  {t('male')}
                </option>
                <option className="text-gray border-0 text-capitalize" value={'female'}>
                  {t('female')}
                </option>
              </select>
              :
              <span className="text-capitalize text-gray fw-bold">{gender?gender:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('birth of day')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0" style={{outline:"none"}} onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} type="date" value={toISODateString(new Date(birthday?birthday:new Date()))} onChange={e=>setBirthday(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{convertISOToVNDateString(toISODateString(new Date(birthday?birthday:new Date())))}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('phone number')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} type="number" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{phoneNumber?phoneNumber:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('speciality')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} value={speciality} onChange={e=>setSpeciality(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{speciality?speciality:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('diploma')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} value={diploma} onChange={e=>setDiploma(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{diploma?diploma:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom mb-4">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('position')}:</label>
            {
              editMode ? 
              <input className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} value={position} onChange={e=>setPosition(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{position?position:'no data'}</span>
            }
          </div>
          <div className="d-flex border-bottom">
            <label className="text-capitalize mc-color fw-bold" style={{fontSize:props.FONT_SIZE,width:WIDTH_HEAD}}>{t('description')}:</label>
            {
              editMode ? 
              <textarea className="text-gray border-0 d-flex flex-grow-1" onKeyDown={e=>{if(e.key === "Enter") onUpdate(e); if(e.key === "Escape") onCancel()}} style={{outline:"none"}} value={description} onChange={e=>setDescription(e.target.value)}/>
              :
              <span className="text-capitalize text-gray fw-bold">{description?description:'no data'}</span>
            }
          </div>
        </div>
      </div>
    </div>
    break;
    case 1: currentTab = <div className="d-flex my-3">
    </div>
    break;
    default: currentTab = <div>error</div>
  }

  return <div className="d-flex flex-column h-100">
    <div className="w-100 d-flex justify-content-end mc-background-color-white py-2">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <button type="button" className={`btn me-3  text-white-hover ${selectedTab===0?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(0)}>
          <span className="text-capitalize">{t('my profile')}</span>
        </button>
        <button type="button" className={`btn  text-white-hover ${selectedTab===1?'mc-pale-background text-white':'hoverGreenLight'}`} onClick={e=>setSelectedTab(1)}>
          <span className="text-capitalize">{t('other profile')}</span>
        </button>
      </div>
    </div>
    {currentTab}
  </div>
}