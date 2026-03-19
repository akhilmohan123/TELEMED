import axios from 'axios';
import { attachAuthInterceptors } from './interceptors';

const BASE_URL = "https://nginx-8qgi.onrender.com";

// Auth API
export const auth_api = axios.create({
    baseURL: `${BASE_URL}/users/api`
});

// Doctor API
export const doctor_api = axios.create({
    baseURL: `${BASE_URL}/doctor/api`
});

// Patient API
export const patient_api = axios.create({
    baseURL: `${BASE_URL}/patient/api`
});

// Appointment API
export const appointment_api = axios.create({
    baseURL: `${BASE_URL}/appointment/api`
});

// Media API
export const media_api = axios.create({
    baseURL: `${BASE_URL}/media/api`
});

// Payment API
export const payment_api = axios.create({
    baseURL: `${BASE_URL}/payment/api`
});

[
  doctor_api,
  patient_api,
  appointment_api,
  media_api,
  payment_api
].forEach(attachAuthInterceptors);

const axiosconfig = axios.create({
    baseURL: BASE_URL
});

export default axiosconfig;