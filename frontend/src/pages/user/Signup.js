import React, { useState } from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import axios from '../axios/axios';
import axiosconfig from '../axios/axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const[data,Setdata]=useState({Username:"",First_Name:"",Last_Name:"",Password:"",Email:"",role:null})
    const navigate=useNavigate()
    function handlechange(e){
        const{name,value}=e.target
        Setdata(prevdata=>({
            ...prevdata,
            [name]:value
        }))
    }
    async function handleclick(e){
        e.preventDefault()
        const userData = {
            username: data.Username,
            first_name: data.First_Name,
            last_name: data.Last_Name,
            email: data.Email,
            password: data.Password,
            role: data.role
        };
        Setdata({Username:"",First_Name:"",Last_Name:"",Email:"",Password:"",role:null})
        try {
            await axiosconfig.post("/register",userData,{
                headers:{
                    'Content-Type':'application/json',
                }
            }).then((res)=>{
                navigate("/login")
            })
        } catch (error) {
            
        }
    }
    
  return (
    <div style={{height:"100%",width:"100%"}}>
 <MDBContainer fluid className="p-3 my-5 h-custom">

<MDBRow>

  <MDBCol col='10' md='6'>
    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid" alt="Sample image" />
  </MDBCol>

  <MDBCol col='4' md='6'>

    <div className="d-flex flex-row align-items-center justify-content-center">
{/* 
      <p className="lead fw-normal mb-0 me-3">Sign in with</p> */}
{/* 
      <MDBBtn floating size='md' tag='a' className='me-2'>
        <MDBIcon fab icon='facebook-f' />
      </MDBBtn>

      <MDBBtn floating size='md' tag='a'  className='me-2'>
        <MDBIcon fab icon='twitter' />
      </MDBBtn>

      <MDBBtn floating size='md' tag='a'  className='me-2'>
        <MDBIcon fab icon='linkedin-in' />
      </MDBBtn> */}

    </div>
    <MDBInput wrapperClass='mb-4' label='UserName' id='formControlLg' type='text' size="lg"name="Username"value={data.Username} onChange={handlechange} required/>
    <MDBInput wrapperClass='mb-4' label='First Name' id='formControlLg' type='text' size="lg" name="First_Name"value={data.First_Name} onChange={handlechange} required/>
    <MDBInput wrapperClass='mb-4' label='Last Name' id='formControlLg' type='text' size="lg" name="Last_Name"value={data.Last_Name} onChange={handlechange} required/>
    <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" name="Email" value={data.Email} onChange={handlechange} required/>
    <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" name="Password"value={data.Password} onChange={handlechange} required/>
    <div style={{display:"flex"}}>
    
    <div style={{display:"inline-block"}}>
        <label>Patient</label>
    <input type='radio' value={1} id='patient'name='role' onChange={handlechange} required/> 
    <label>Doctor</label>
    <input type='radio' value={2} id='doctor'name='role' onChange={handlechange} required/>
    </div>
    </div>
    <div className='text-center text-md-start mt-4 pt-2'>
      <MDBBtn className="mb-0 px-5" size='lg' onClick={handleclick}>Login</MDBBtn>
      <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="/login" className="link-danger">Login</a></p>
    </div>
  </MDBCol>
</MDBRow>
<div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary" style={{position:"absolute",bottom:"0",width:"100%"}}>
  <div className="text-white mb-3 mb-md-0">
    Copyright © 2020. All rights reserved.
  </div>

  <div>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
      <MDBIcon fab icon='facebook-f' size="md"/>
    </MDBBtn>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
      <MDBIcon fab icon='twitter' size="md"/>
    </MDBBtn>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
      <MDBIcon fab icon='google' size="md"/>
    </MDBBtn>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
      <MDBIcon fab icon='linkedin-in' size="md"/>
    </MDBBtn>

  </div>

</div>

</MDBContainer>
    </div>
   
  );
}

export default Signup;
