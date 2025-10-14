import logo from './logo.svg';
import './App.css';
import Signup from './pages/user/Signup';
import Login from './pages/user/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Patient from './pages/home/Patient';
import Profile from './pages/profile/Profile';
import Add from './pages/profile/Add';
import Doctor from './pages/home/doctor/Doctor';
import Seperator from './pages/home/Seperator';
import DoctorProfile from './pages/home/doctor/DoctorProfile';
import Doctorappointment from './pages/home/appoinment/Doctorappointment';
import Appointmentdetails from './pages/home/appointmentdetails/Appointmentdetails';
import AppointmentDoctor from './pages/home/doctor/AppointmentDoctor';
import PatientCallDetails from './pages/home/doctor/PatientCallDetails';
import Videocall from './pages/home/doctor/Videocall';
import Medicine from './pages/home/medicine/Medicine';
import SpeceficMedicine from './pages/home/medicine/SpeceficMedicine';
import Refer from './pages/home/refers/Refer';
import Resetpassword from './pages/user/Resetpassword';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/user' element={<Patient/>}/>
      <Route path='/doctor' element={<Doctor/>}/>
      <Route path='/home' element={<Seperator/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/add' element={<Add/>}/>
      <Route path='/doctor-profile' element={<DoctorProfile/>}/>
      <Route path='/doctor-appointment/:id' element={<Doctorappointment/>}/>
      <Route path='/appointment-details' element={<Appointmentdetails/>}/>
      <Route path='/appointments-doctor' element={<AppointmentDoctor/>}/>
      <Route path='/patient-details/:id/:ref' element={<PatientCallDetails/>}/>
      <Route path='/video-call/:id/:ref' element={<Videocall/>}/>
      <Route path='/get-medicine' element={<Medicine/>}/>
      <Route path='/specefic-medicine/:id' element={<SpeceficMedicine/>}/>
      <Route path='/get-refers' element={<Refer/>}/>
      <Route path='/reset-password/:token' element={<Resetpassword/>}></Route>
      
     
    </Routes>
    </BrowserRouter>
  );
}

export default App;
