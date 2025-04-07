import React, { useEffect, useState } from 'react';
import ButtonComponent from "../common/ButtonComponent.jsx";
import { postToServer } from '../services/getAPI.jsx';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import NavbarComponent from '../component/NavbarComponent.jsx';
import { useTranslation } from 'react-i18next';
import { isValidEmail, SITE_KEY_RECAPTCHA } from '../common/Utility.jsx';
import { useDispatch } from 'react-redux';
import { setAppName } from '../redux/GeneralSlice.jsx';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function RegisterPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDone,setIsDone] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('sign up')}`));
  },[])

  const onRegistration = (e) => {
    if (!email) setEmailError(t('email is required'));
    else if (!isValidEmail(email)) setEmailError(t("email is incorrect format"));
    else if (!password) setPasswordError(t('password is required'));
    else if (!confirmPassword) setConfirmPasswordError(t('confirm password is required'));
    else if (password !== confirmPassword) setConfirmPasswordError(t('password mismatch'));
    else {
      setLoading(true);
      executeRecaptcha('register').then(token => 
        postToServer(`/v1/doctor/${process.env.NODE_ENV==='development'?'registerDev':'register'}`, { email: email, password: password, tokenRecaptcha: token }).then((result) => {
          toast.success(result.message);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          if(process.env.NODE_ENV==='production') {
            setIsDone(true);
          }
        })
        .catch((err) => toast.error(t(err.message))).finally(() => setLoading(false))
      );
    }
  };

  return (
      <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: '100%',
        backgroundImage: `url("/assets/images/login_background.jpg")`,
        backgroundSize: '100% 100%',
      }}>
      <NavbarComponent />
      {
      isDone ? <div className="h-100 d-flex flex-column justify-content-center container align-items-center" style={{width:"60em"}}>
        <span className="mc-color text-center text-capitalize" style={{fontSize:"35px"}}>{t('thank you for registering for')}</span>
        <span className="mc-color text-center text-capitalize fw-bold" style={{fontSize:"70px"}}>MyCeph - Cephalometric</span>
        <div className="d-flex justify-content-center" style={{width:"40em"}}>
          <span className="text-center text-gray my-2" style={{fontSize:"20px"}}>{t("You're all set. You'll receive an email with details to confirm your email address. We look forward to confirm it and join with us.")}</span>
        </div>
        <div className="mt-3" style={{width:"300px"}}>
          <ButtonComponent label={t("going to email")} onClick={e=>window.open("https://mail.google.com")}/>
        </div>
        <div className="mt-3 d-flex flex-row justify-content-end">
          <span className="me-1">{t('Back to login:')}</span>
          <Link className="text-capitalize mc-color mc-color-hover" style={{textDecoration:"none"}} to={'/login'}>{t('login')}</Link>
        </div>
      </div>
      :     
      <div
        className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
        style={{ width: '360px' }}>
        <h1 className="my-4 text-center  text-capitalize mc-color" style={{ fontWeight: 'bold' }}>
          {t('sign up')}
        </h1>
        <div className={`mb-3 d-flex align-items-center justify-content-between input-group form-control border`}>
          <input
            type="email"
            className="border-0 flex-grow-1"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            onKeyDown={e=>{if(e.key === "Enter") onRegistration(e)}}
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
            onKeyDown={e=>{if(e.key === "Enter") onRegistration(e)}}
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
            onKeyDown={e=>{if(e.key === "Enter") onRegistration(e)}}
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
        {loading ? <div className="spinner-grow"></div> : <ButtonComponent label={t("sign up")} onClick={onRegistration} />}
        <div className="mt-3 d-flex align-items-center justify-content-center">
          <hr style={{ width: '140px' }} />
          <span className="mx-3 text-uppercase">or</span>
          <hr style={{ width: '140px' }} />
        </div>
        <div className="mt-3 d-flex flex-row justify-content-end w-100">
          <span className="me-1">{t('Already have an account?')}</span>
          <Link className="text-capitalize mc-color mc-color-hover" style={{textDecoration:"none"}} to={'/login'}>{t('login')}</Link>
        </div>
      </div>
      }
    </div>
  )
}

export default function Register(){
  return (
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY_RECAPTCHA}>
      <RegisterPage />
    </GoogleReCaptchaProvider>
  )
}
