import React, { useEffect, useState } from 'react'
import axiosconfig from '../../axios/axios'
import { useParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap's JavaScript
import $ from 'jquery'; // Import jQuery
function SpeceficMedicine() {
    const[data,Setdata]=useState()
    const[error,Seterror]=useState()
    const {id}=useParams()
    const token=localStorage.getItem('token')
    useEffect(()=>{
     axiosconfig.get(`/specefic-medicine/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
     }).then((res)=>{
        Setdata(res.data)
     }).catch((err)=>{
        Seterror(err)
     })
    },[])
    if(error){
        <center>Error While Loading Data</center>
    }
  return (
    <div>
    
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">
  Launch demo modal
</button>


<div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" >
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        this is data tobe download efwewjefklwnefjkwefjkwjkefjkqekjfjjkqwejkfjkwqehfjjhqjwkefjkwqhekjfnhwef
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default SpeceficMedicine
