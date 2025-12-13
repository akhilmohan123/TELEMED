import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import Content from './Content'
import Login from '../user/Login'

function Patient() {
    const navigate=useNavigate()
    // useEffect(() => {
    //     if (!token) {
    //         navigate("/login");
    //     } else {
    //         navigate("/home");
    //     }
    // }, [token, navigate]);
  return (
    <div>
        <><Navbar/> <Content/></>
      
    </div>
  )
}

export default Patient
