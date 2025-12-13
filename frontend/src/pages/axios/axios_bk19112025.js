import axios from 'axios'


//regarding the auth api
export const auth_api=axios.create({
    baseURL:"/users/api"
})

//regarding the doctor_Service api

export const doctor_api=axios.create({
    baseURL:"/doctor/api"
})

//reagarding the patient service

export const patient_api=axios.create({
    baseURL:"/patient/api"
})

//regarding the appointment api

export const appointment_api=axios.create({
    baseURL:"/appointment/api"
})


//regarding the media api 

export const media_api=axios.create({
    baseURL:"http://127.0.0.1:8004/"
})



const axiosconfig=axios.create({
    baseURL:"http://127.0.0.1:8000/"
})

export default axiosconfig