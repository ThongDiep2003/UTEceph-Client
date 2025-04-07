import React, { useEffect, useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonComponent from "../common/ButtonComponent.jsx";
import { isValidEmail, SITE_KEY_RECAPTCHA } from "../common/Utility.jsx";
import NavbarComponent from "../component/NavbarComponent.jsx";
import { setAppName } from "../redux/GeneralSlice.jsx";
import { getToServer, postToServer } from "../services/getAPI.jsx";

function ForgotPasswordPage(props){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab,setSelectedTab] = useState(0);
  const nav = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {executeRecaptcha} = useGoogleReCaptcha();

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('Forgot password')}`));
  },[])

  const onSubmit = (e) => {
		if (!email) setEmailError(t('email is required'));
    else if (!isValidEmail(email)) setEmailError(t("email is incorrect format"));
		else {
			setLoading(true);
      executeRecaptcha('login').then(token => 
        postToServer(`/v1/doctor/findDoctorEmail/${email}`, { tokenRecaptcha: token }).then((result) => {
          setEmail(result.email);
          setSelectedTab(1);
        })
        .catch((err) => toast.error(t(err.message))).finally(() => setLoading(false))
      );
		}
	};

  const onReset = (e) => {
    if (!password) setPasswordError(t('password is required'));
    else if (!confirmPassword) setConfirmPasswordError(t('confirm password is required'));
    else if (password !== confirmPassword) setConfirmPasswordError(t('password mismatch'));
    else{
      setLoading(true);
      executeRecaptcha('login').then(token => 
        postToServer(`/v1/doctor/resetPassword`, { email: email, password: password}).then((result) => {
          toast.success(result.message);
          setSelectedTab(2);
        })
        .catch((err) => toast.error(t(err.message))).finally(() => setLoading(false))
      );
    }
  }

  let currentTab = null;

  switch(selectedTab){
    case 0: currentTab = <div className="d-flex flex-column justify-content-center align-items-center">
      <h1 className="my-4 text-center  text-capitalize mc-color fw-bold">
        {t('Looking for your account')}
      </h1>
      <div className={`mb-3 mt-2 d-flex align-items-center justify-content-between input-group form-control border`}>
          <input
            type="email"
            className="border-0 flex-grow-1"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            onKeyDown={e=>{if(e.key === "Enter") onSubmit(e)}}
            placeholder={t("Email")}
            autocomplete="off"
            style={{ height: '45px', outline: 'none' }}
          />
          <span className="material-symbols-outlined mc-color">person</span>
        </div>
        {emailError && (
          <p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
            <span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
              error
            </span>
            {emailError}
          </p>
        )}
        <div className="mt-2 w-100 d-flex justify-content-center">
          {loading ? <div className="spinner-grow"></div> : <ButtonComponent label={t('find your email')} onClick={onSubmit} />}
        </div>
    </div>
    break;
    case 1: currentTab = <div className="d-flex flex-column justify-content-center align-items-center">
      <h1 className="my-3 text-center text-capitalize mc-color fw-bold">
        {t('reset your password')}
      </h1>
      <h4 className="my-2 text-center text-capitalize mc-pale-color fw-bold">
        {t('welcome to')} 
      </h4>
      <span className="mb-2 text-center mc-pale-color fw-bold">{email}</span>
      <div
        className={`mb-3 d-flex align-items-center justify-content-between input-group border form-control border`}>
        <input
          type="password"
          className="border-0 flex-grow-1"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError('');
          }}
          onKeyDown={e=>{if(e.key === "Enter") onReset(e)}}
          placeholder={t("password")}
          autocomplete="off"
          style={{ height: '45px', outline: 'none' }}
        />
        <span className="material-symbols-outlined mc-color">password</span>
      </div>
      {passwordError && (
        <p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
          <span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
            error
          </span>
          {passwordError}
        </p>
      )}
      <div
        className={`mb-3 d-flex align-items-center justify-content-between input-group border form-control border`}>
        <input
          type="password"
          className="border-0 flex-grow-1"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmPasswordError('');
          }}
          onKeyDown={e=>{if(e.key === "Enter") onReset(e)}}
          placeholder={t("Re-enter Password")}
          autocomplete="off"
          style={{ height: '45px', outline: 'none' }}
        />
        <span className="material-symbols-outlined mc-color">password</span>
      </div>
      {confirmPasswordError && (
        <p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
          <span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
            error
          </span>
          {confirmPasswordError}
        </p>
      )}
      <div className="mt-2 w-100 d-flex justify-content-center">
        {loading ? <div className="spinner-grow"></div> : <ButtonComponent label={t('reset your password')} onClick={onReset} />}
      </div>
    </div>
    break;
    case 2: currentTab = <div className="d-flex flex-column justify-content-center container align-items-center" style={{width:"60em"}}>
      <span className="mc-color text-center text-capitalize" style={{fontSize:"35px"}}>{t('Reset password for account ')}{email} {t('successfully')}</span>
      <span className="mc-color text-center text-capitalize fw-bold" style={{fontSize:"70px"}}>MyCeph - Cephalometric</span>
      <div className="d-flex justify-content-center" style={{width:"40em"}}>
        <span className="text-center text-gray my-2" style={{fontSize:"20px"}}>{t("You'll receive an email with details to confirm your email address to reset your password. Please check your email within 3 minutes!")}</span>
      </div>
      <div className="mt-3" style={{width:"300px"}}>
        <ButtonComponent label={t("going to email")} onClick={e=>window.open("https://mail.google.com")}/>
      </div>
    </div>
    break;
    default: currentTab = null;
  }

  return <div
    className="d-flex flex-column justify-content-start align-items-center"
    style={{
      height: '100%',
      backgroundImage: `url("/assets/images/login_background.jpg")`,
      backgroundSize: '100% 100%',
    }}>
    <NavbarComponent />
    <div className="h-100 d-flex flex-column align-items-center justify-content-center">
      {currentTab}
      <div className="mt-3 d-flex align-items-center justify-content-center">
        <hr style={{ width: '140px' }} />
        <span className="mx-3 text-uppercase">or</span>
        <hr style={{ width: '140px' }} />
      </div>
      <div className="mt-3 d-flex flex-row justify-content-end">
        <span className="me-1">{t('Already have an account?')}</span>
        <Link className="text-capitalize mc-color mc-color-hover" style={{textDecoration:"none"}} to={'/login'}>{t('login')}</Link>
      </div>
    </div>
  </div>
}

export default function ForgotPassword(){
  return (
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY_RECAPTCHA}>
      <ForgotPasswordPage />
    </GoogleReCaptchaProvider>
  )
}
