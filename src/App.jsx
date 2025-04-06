import React from "react";
 import { Routes, Route } from 'react-router-dom';
 import Login from "./auth/login.jsx";
 import Register from "./auth/Register.jsx";
 import HomePage from "./pages/HomePage.jsx";
 
 function App() {
   return (
     <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
     </Routes>
   );
 }
