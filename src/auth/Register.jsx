import React, { useState } from 'react';
import ButtonComponent from "../common/ButtonComponent.jsx";
import { postToServer } from '../services/getAPI.jsx';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import NavbarComponent from '../component/NavbarComponent.jsx';
import { useTranslation } from 'react-i18next';
import { isValidEmail } from '../common/Untility.jsx';

export default function Register(props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [loading, setLoading] = useState(false);
	const nav = useNavigate();
  const { t } = useTranslation();

	const onRegistration = (e) => {
		if (!email) setEmailError(t('email is required'));
    else if (!isValidEmail(email)) setEmailError(t("email is incorrect format"));
		else if (!password) setPasswordError(t('password is required'));
		else if (!confirmPassword) setConfirmPasswordError(t('confirm password is required'));
		else if (password !== confirmPassword) setConfirmPasswordError(t('password mismatch'));
		else {
			setLoading(true);
			postToServer('/v1/doctor/register', { email: email, password: password})
				.then((result) => {
					toast.success(result.message);
					setEmail('');
					setPassword('');
					setConfirmPassword('');
					nav('/login');
				})
				.catch((text) => toast.error(text.message))
				.finally(() => setLoading(false));
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
			<div
				className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
				style={{ width: '360px' }}>
				<h1 className="my-4 text-center viceph-color text-capitalize mc-color" style={{ fontWeight: 'bold' }}>
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
		</div>
	);
}
