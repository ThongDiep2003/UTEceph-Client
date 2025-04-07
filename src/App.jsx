import React from "react";
 import { Routes, Route } from 'react-router-dom';
 import ForgotPassword from "./auth/ForgotPassword.jsx";
 import Login from "./auth/login.jsx";
 import Register from "./auth/Register.jsx";
 import HomePage from "./pages/HomePage.jsx";
import Setting from "./pages/setting/Setting.jsx";
 @@ -10,6 +11,7 @@ function App() {
       <Route path="/" element={<HomePage />} />
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/forgotPassword" element={<ForgotPassword />} />
       <Route path="/setting" element={<Setting />} />
     </Routes>
   );
 }
