import React, { lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';
import Discussion from "./pages/discussion/Discussion.jsx";
import LateralCeph from "./pages/lateralCephalometricAnalysis/LateralCeph.jsx";
const ForgotPassword = lazy(() => import('./auth/ForgotPassword.jsx'));
const Login = lazy(() => import('./auth/Login.jsx'));
const Register = lazy(() => import('./auth/Register.jsx'));
const BigCalendar = lazy(() => import('./pages/calendar/BigCalendar.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LibraryImages = lazy(() => import('./pages/libraryImages/LibraryImages.jsx'));
const MedicalRecord = lazy(() => import('./pages/medicalRecord/MedicalRecord.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
const PatientList = lazy(() => import('./pages/patientList/PatientList.jsx'));
const Setting = lazy(() => import('./pages/setting/Setting.jsx'));

function App() {
  return (
    <Suspense fallback={
      <div className="h-100 w-100 d-flex justify-content-center align-items-center">
        <span className='loader'></span>
      </div>
    }>
      <Routes>
        <Route path="*" element={<NotFoundPage />}/>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/forgotPassword" element={<ForgotPassword />}/>
        <Route path="/setting" element={<Setting />}/>
        <Route path="/patientListManagement" element={<PatientList />}/>
        <Route path="/medicalRecord" element={<MedicalRecord />}/>
        <Route path="/libraryImagesManagement" element={<LibraryImages />}/>
        <Route path="/schedule" element={<BigCalendar />}/>
        <Route path="/discussion" element={<Discussion />}/>
        <Route path="/lateralCeph" element={<LateralCeph />}/>
      </Routes>
    </Suspense>
  );
}

export default App;
