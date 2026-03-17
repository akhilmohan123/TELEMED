import axios from 'axios';
import { attachAuthInterceptors } from './interceptors';
const REACT_APP_AUTH_BASEURL = import.meta.env.AUTH_BASEURL || "http://localhost";
const REACT_APP_DOCTOR_BASEURL = import.meta.env.DOCTOR_BASEURL || "http://localhost";
const REACT_APP_PATIENT_BASEURL = import.meta.env.PATIENT_BASEURL || "http://localhost";
const REACT_APP_APPOINT_BASEURL = import.meta.env.APPOINT_BASEURL || "http://localhost";
const REACT_APP_MEDIA_BASEURL = import.meta.env.MEDIA_BASEURL || "http://localhost";
const REACT_APP_PAYMENT_BASEURL = import.meta.env.PAYMENT_BASEURL || "http://localhost";
// Auth API
export const auth_api = axios.create({
    baseURL: `${REACT_APP_AUTH_BASEURL}/users/api`
});

// Doctor API
export const doctor_api = axios.create({
    baseURL: `${REACT_APP_DOCTOR_BASEURL}/doctor/api`
});

// Patient API
export const patient_api = axios.create({
    baseURL: `${REACT_APP_PATIENT_BASEURL}/patient/api`
});

// Appointment API
export const appointment_api = axios.create({
    baseURL: `${REACT_APP_APPOINT_BASEURL}/appointment/api`
});

// Media API (keep full URL only if media is not behind Nginx)
export const media_api = axios.create({
    baseURL: `${REACT_APP_MEDIA_BASEURL}/media/api`  // if routed through nginx
});


// Payment API (keep full URL only if media is not behind Nginx)
export const payment_api = axios.create({
    baseURL: `${REACT_APP_PAYMENT_BASEURL}/payment/api`  // if routed through nginx
});
[
  doctor_api,
  patient_api,
  appointment_api,
  media_api,
  payment_api
].forEach(attachAuthInterceptors);

// Default axios
const axiosconfig = axios.create({
    baseURL: "/"   // use root, nginx handles routing
});

export default axiosconfig;