import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import axiosconfig from '../../axios/axios'
import { useNavigate } from 'react-router-dom'

function Appointmentdetails() {
    const [data,Setdata]=useState()
    const token=localStorage.getItem("token")
    const navigate=useNavigate()
    useEffect(()=>{
        axiosconfig.get("/appointments",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then((res)=>{
            console.log(res)
            Setdata(res.data)
        })
    },[token])
    function handleremove(id){
      axiosconfig.delete(`appointmentdelete/${id}`).then(res=>{
        Setdata(prevData => prevData.filter(appointment => appointment.id !== id))
      })
    
    }
    function handleVideocall(id,ref){
    
      navigate(`/video-call/${id}/${ref}`)
    }
  return (
    <div>
     <Navbar/>
       <h1 style={{textAlign:'center'}}>My Appointments</h1>
      <table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">No</th>
      <th scope="col">Name</th>
      <th scope="col">Date</th>
      <th scope="col">Time</th>
      <th scope='col'>Video-Id(Use this Id For Call)</th>
      <th scope='col'>Remove</th>
    </tr>
  </thead>
  <tbody>
    {data&& data.filter((d)=>d.status!='completed').map((d,index)=>(
      

<tr>  
      <th scope="row">{index+1}</th>
      <td style={{cursor:'pointer'}} onClick={()=>handleVideocall(d.id,d.referrence_no)}>{d.doctor_name}</td>
      <td>{d.date}</td>
      <td>{d.time}</td>
      <td>{d.referrence_no
      }</td>
      <button type="button" class="btn btn-danger" onClick={()=>{handleremove(d.id)}}>Remove</button>
    </tr>
    ))}
    

  </tbody>
</table>
    </div>
  )
}

export default Appointmentdetails
