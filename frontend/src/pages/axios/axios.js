import axios from 'axios';
import { attachAuthInterceptors } from './interceptors';
// Auth API
export const auth_api = axios.create({
    baseURL: "/users/api"
});

// Doctor API
export const doctor_api = axios.create({
    baseURL: "/doctor/api"
});

// Patient API
export const patient_api = axios.create({
    baseURL: "/patient/api"
});

// Appointment API
export const appointment_api = axios.create({
    baseURL: "/appointment/api"
});

// Media API (keep full URL only if media is not behind Nginx)
export const media_api = axios.create({
    baseURL: "/media/api"  // if routed through nginx
});


// Payment API (keep full URL only if media is not behind Nginx)
export const payment_api = axios.create({
    baseURL: "/payment/api"  // if routed through nginx
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
