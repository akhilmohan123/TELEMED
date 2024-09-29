import React, { useEffect } from 'react'
import Doctor from './doctor/Doctor'
import Patient from './Patient'
import { useNavigate } from 'react-router-dom'
import Login from '../user/Login'

function Seperator() {
    const role=localStorage.getItem("role")
    const token=localStorage.getItem("token")
    const navigate=useNavigate()
   useEffect(()=>{
    if(role==2){
        navigate("/doctor")
    }else{
        navigate("/user")
    }
    if(!token){
        navigate("/login")
    }
   },[token])
  return (
    <>
    {   token?role==2?<Doctor/>:<Patient/>:<Login/>

        
    }
    </>
  )
}

export default Seperator
