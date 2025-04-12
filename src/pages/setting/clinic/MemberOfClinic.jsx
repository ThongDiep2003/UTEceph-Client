import { Pagination } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmComponent from "../../../common/ConfirmComponent.jsx";
import IconButtonComponent from "../../../common/IconButtonComponent.jsx";
import SelectFieldInput from "../../../common/SelectFieldInput.jsx";
import TextFieldInput from "../../../common/TextFieldInput.jsx";
import { isValidEmail, moveElementToStartArray, splitFirst, splitLast } from "../../../common/Utility.jsx";
import { clearClinicSlice, setIdClinicDefault, setRoleOfDoctor } from "../../../redux/ClinicSlice.jsx";
import { logOutDoctor } from "../../../redux/DoctorSlice.jsx";
import { setLoadingModal } from "../../../redux/GeneralSlice.jsx";
import { deleteToServerWithToken, getToServerWithToken, postToServerWithToken, putToServerWithToken } from "../../../services/getAPI.jsx";
import DoctorRows from "./DoctorRows.jsx";

const PAGE_SIZE = 4;
let nameSearchTimeout = null;

export default function MemberOfClinic(props){
  const loading = useSelector(state=>state.general.loading);
  const doctor = useSelector(state=>state.doctor.data);
  const clinic = useSelector(state=>state.clinic);
  const [listDoctor,setListDoctor] = useState([]);
  const [nameSearch,setNameSearch] = useState('');
  const [newDoctor,setNewDoctor] = useState();
  const [count,setCount] = useState();
  const [page,setPage] = useState(1);
  const [openConfirm,setOpenConfirm] = useState(false);
  const [openDeleteConfirm,setOpenDeleteConfirm] = useState(false);

  const [loadingSearch,setLoadingSearch] = useState(false);

  const [idDoctorUpdate,setIdDoctorUpdate] = useState();
  const [roleDoctorUpdate,setRoleDoctorUpdate] = useState();
  const nav = useNavigate();

  const {t} = useTranslation();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(clinic.idClinicDefault) getAllDoctorInClinic();
  },[clinic.idClinicDefault,page])

  const onNameSearchChange = e => {
    console.log(e.target.value);
    setNameSearch(e.target.value);
    if (nameSearchTimeout) clearTimeout(nameSearchTimeout);
    nameSearchTimeout = setTimeout(getAllDoctorInClinic,500,e.target.value);
  }

  const getAllDoctorInClinic = (name) => {
    return new Promise((resolve, reject) =>{
      setLoadingSearch(true);
      getToServerWithToken(`/v1/clinic/getAllDoctorFromClinic/${clinic.idClinicDefault}?page=${page}&pageSize=${PAGE_SIZE}&nameSearch=${name?name:''}`).then(result => {
        if(page===1 && !name && !nameSearch){
          const newData = moveElementToStartArray(result.data,doctor.email);
          setListDoctor(newData);
        }else{
          setListDoctor(result.data);
        }
        setCount(result.count);
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
      }).finally(() =>setLoadingSearch(false));
    });
  }

  const onChangeRoleOfDoctor = (idDoctor,roleOfdoctor) => {
    setOpenConfirm(true);
    setIdDoctorUpdate(idDoctor);
    setRoleDoctorUpdate(roleOfdoctor);
  }

  const onDeleteHandle = (idDoctor) =>{
    setOpenDeleteConfirm(true);
    setIdDoctorUpdate(idDoctor);
  }

  const updateRoleOfDoctor = () => {
    setOpenConfirm(false);
    return new Promise((resolve, reject) =>{
      dispatch(setLoadingModal(true));
      putToServerWithToken(`/v1/clinic/updateRoleOfDoctor/${clinic.idClinicDefault}`,{
        idDoctor: idDoctorUpdate,
        roleOfDoctor: roleDoctorUpdate
      }).then(response=>{
        getAllDoctorInClinic().then(()=>{
          setIdDoctorUpdate('');
          setRoleDoctorUpdate('');
        });
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

  const deleteDoctorFromClinic = (idDoctorCheck) => {
    if(idDoctorUpdate!==idDoctorCheck){
      toast.error(t('id doctor not found'));
    }else{
      setOpenDeleteConfirm(false);
      return new Promise((resolve, reject) =>{
        dispatch(setLoadingModal(true));
        deleteToServerWithToken(`/v1/clinic/deleteDoctorFromClinic/${clinic.idClinicDefault}?idDoctor=${idDoctorUpdate}`).then(response=>{
          getAllDoctorInClinic().then(()=>{
            setIdDoctorUpdate('');
            toast.success(t(response.message));
          });
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
  }

  const addDoctorToClinic = () => {
    return new Promise((resolve, reject) =>{
      if(!isValidEmail(newDoctor)) toast.error(t('email is incorrect format'));
      else{
        dispatch(setLoadingModal(true));
        postToServerWithToken(`/v1/clinic/addDoctorToClinic/${clinic.idClinicDefault}`,{
          email: newDoctor,
          roleOfDoctor: 'member'
        }).then(result=>{
          setNewDoctor('');
          toast.success(t(result.message))
          getAllDoctorInClinic().then(()=>{
            resolve()
          });
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
      }
    });
  }

  const onChangePage = (event,value) => {
    setPage(value);
  }

  const handleClose = () => {
    setOpenConfirm(false);
    setOpenDeleteConfirm(false);
  };

  return <div className="d-flex flex-column align-items-start justify-content-start h-100 py-3">
    <div className="d-flex flex-row w-100 flex-wrap justify-content-between mb-2">
      <div style={{width:"400px"}}>
        {
          clinic.idClinicDefault && <SelectFieldInput legend={t('select clinic')} defaultValue={clinic.idClinicDefault+'_'+clinic.roleOfDoctor} value={clinic.idClinicDefault+'_'+clinic.roleOfDoctor} onChange={value=>{dispatch(setIdClinicDefault(splitFirst(value)));dispatch(setRoleOfDoctor(splitLast(value)))}}>
            {
              clinic.data?.map(clinic=>{
                return <option selected={clinic.roleOfDoctor==='admin'} className="text-gray border-0 text-capitalize" value={clinic.id+'_'+clinic.roleOfDoctor} key={clinic.id}>
                  {clinic.nameClinic}
                </option>
              })
            }
          </SelectFieldInput>
        }
      </div>
      {
        clinic.roleOfDoctor==='admin' && <div className="d-flex flex-row align-items-end">
          <div style={{width:"400px"}}>
            <TextFieldInput className="p-1 me-2" legend={t('Add new doctor to clinic')} placeholder={t('Name of new doctor')} value={newDoctor} onChange={value=>setNewDoctor(value)}/>
          </div>
          <IconButtonComponent className="btn-outline-success" styleButton={{height:"50px",width:"50px"}} onClick={addDoctorToClinic} icon="add" FONT_SIZE_ICON={"40px"} title={t("add doctor")}/>
        </div>
      }
    </div>
    <div className="d-flex flex-row justify-content-start mb-2">
      <span className="text-capitalize mc-color fw-bold me-2" style={{fontSize:props.FONT_SIZE}}>{t('you are')}: </span>
      <span className={`text-uppercase fw-bold ${clinic.roleOfDoctor==='admin'?'text-success':'text-warning'}`}>{clinic.roleOfDoctor}</span>
    </div>
    <React.Fragment>
      <div className="w-100">
        <table className="table table-bordered table-striped text-center rounded">
          <thead className='mc-background text-white text-uppercase'>
            <tr>
              <th colSpan={2} style={{minWidth:"350px",fontSize:props.FONT_SIZE}}>
                <div className={`d-flex align-items-center justify-content-between border form-control w-100`} >
                  <input type="text" className="border-0 flex-grow-1 w-100" placeholder={t("type doctor name to search")} style={{ outline: "none" }} value={nameSearch} onChange={onNameSearchChange}/>
                  <span className="material-symbols-outlined vc-teal fw-bolder">search</span>
                </div>
              </th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{minWidth:"170px",fontSize:props.FONT_SIZE}}>{t("email")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:props.FONT_SIZE}}>{t("date of birth")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{maxWidth:"60px",fontSize:props.FONT_SIZE}}>{t("gender")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{maxWidth:"50px",fontSize:props.FONT_SIZE}}>{t("admin")}</th>
              <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:props.FONT_SIZE}}>{t("speciality")}</th>
              {
                clinic.roleOfDoctor==='admin' && <th className='align-middle mc-heading-middle d-lg-table-cell d-none' style={{fontSize:props.FONT_SIZE}}>{t("Delete")}</th>
              }
            </tr>
          </thead>
          {
            loadingSearch ? 
            <div className="spinner-grow"></div>
            :
            <React.Fragment>
              <tbody>{listDoctor.map((doctor, index) => <DoctorRows key={index} doctor={doctor} changeRoleOfDoctor={(idDoctor,roleOfDoctor)=>onChangeRoleOfDoctor(idDoctor,roleOfDoctor)} deleteDoctorFromClinic={onDeleteHandle} FONT_SIZE={props.FONT_SIZE}/>)}</tbody>
              <tfoot className="align-middle">
                <tr>
                  <td colSpan={8} align='center'>
                    <div className="d-flex flex-grow-1 justify-content-center">
                    <Pagination 
                        count={Math.ceil(count/PAGE_SIZE) || 0}
                        page={page}
                        onChange={onChangePage}
                        variant="outlined"
                        color="primary"
                      />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </React.Fragment>
          }
        </table>
      </div>
      <ConfirmComponent 
        FONT_SIZE={props.FONT_SIZE}
        open={openDeleteConfirm} 
        title={<span className="text-capitalize fw-bold text-danger" style={{fontSize:"20px"}}>{t('confirm remove doctor from clinic')}</span>} 
        content={
          <div>
            <span className="me-1" style={{fontSize:props.FONT_SIZE}}>{t('To remove this doctor from the clinic, enter the id')}</span>
            <span style={{fontSize:props.FONT_SIZE}} className="text-danger fw-bold">{idDoctorUpdate}</span>
            <span className="ms-1" style={{fontSize:props.FONT_SIZE}}>{t('in the box below and press agree')}</span>
          </div>
        } 
        label={t('Id doctor')}
        handleClose={handleClose} 
        handleSubmit={value=>deleteDoctorFromClinic(value)}
      />
      <ConfirmComponent 
        FONT_SIZE={props.FONT_SIZE}
        open={openConfirm} 
        title={<span className="text-capitalize fw-bold mc-color" style={{fontSize:"20px"}}>{t('confirm change role of doctor')}</span>} 
        content={
          <div>
            <span style={{fontSize:props.FONT_SIZE}}>{t('Do you want to switch role of doctor from')}</span>
            <span className={`fw-bold text-uppercase ms-1 ${roleDoctorUpdate==='admin'?'text-warning':'text-success'}`} style={{fontSize:props.FONT_SIZE}}>{roleDoctorUpdate==='admin'?'member':'admin'}</span>
            <span className="mx-1">{t('to')}</span>
            <span className={`fw-bold text-uppercase ${roleDoctorUpdate==='admin'?'text-success':'text-danger'}`} style={{fontSize:props.FONT_SIZE}}>{roleDoctorUpdate==='admin'?'admin':'member'}</span>
          </div>
        }
        handleClose={handleClose} 
        handleSubmit={updateRoleOfDoctor}
      />
    </React.Fragment>
  </div>
}