import React, { useEffect, useState } from 'react'
import axiosconfig, { doctor_api } from '../../axios/axios'
import './doctor.css'
import Navbar from '../Navbar'
import {toast} from 'react-toastify'
function DoctorProfile() {
    const [user,Setuser]=useState({organization_name:"",location:"",phonenumber:null,speciality:"",licensenumber:null,experiance:null,amount:""})
    const[availablity,Setavailability]=useState()
    const[fileimage,Setfileimage]=useState(null)
    const[profilepic,Setprofilepic]=useState()
    const token=localStorage.getItem("token")
    const baseURL="http://127.0.0.1:8000/"
    useEffect(()=>{
    doctor_api.get("get-doctor",{
       withCredentials:true
    }).then((res)=>{
        console.log(res)
        Setprofilepic(res.data.image)
        if(res){
            Setavailability(res.data.available_status)
            Setuser(
               {
                organization_name:res.data.organization_name,
                location:res.data.location,
                phonenumber:res.data.phone_number,
                speciality:res.data.speciality,
                licensenumber:res.data.license_no,
                experiance:res.data.experiance,
                amount:res.data.amount
               }

            )
        }
    }).catch(err=>{
        Setuser(
            {
             organization_name:"",
             location:"",
             phonenumber:"",
             speciality:"",
             licensenumber:"",
             experiance:"",
             amount:""
            }

        )
        Setavailability('')
    })
    },[])
    const imageURL = profilepic ? `${baseURL}${profilepic}` : "http://bootdey.com/img/Content/avatar/avatar1.png"; // Default image if no image is available
    function handlechange(e){
        const {name,value}=e.target
        Setuser((prevvalue)=>({...prevvalue,[name]:value}))
    }
    function handlesubmit(e){
        e.preventDefault()
        const userdata={ 
        phone_number:user.phonenumber,
        speciality:user.speciality,
        license_no:user.licensenumber,
        organization_name:user.organization_name,
        experiance:user.experiance,
        location:user.location,
        available_status:availablity,
        image:fileimage,
        amount:user.amount
      }
      console.log(userdata)
      const formData = new FormData();
      alert("amount is ====="+userdata.amount)
// Append each field to FormData
formData.append('phone_number', userdata.phone_number);
formData.append('speciality', userdata.speciality);
formData.append('license_no', userdata.license_no);
formData.append('organization_name', userdata.organization_name);
formData.append('experiance', userdata.experiance);
formData.append('location', userdata.location);
formData.append('available_status', userdata.available_status);
formData.append('amount', userdata.amount);
// Append the image file
if (userdata.image) {
    formData.append('image', userdata.image);
}
console.log(formData)
     doctor_api.post("/profile-create",formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        },
        withCredentials:true
     }).then((res)=>{
        if(res){
            
            toast("Profile Updated")

        }
     })
    }
    function handlestatus(e){
        console.log("clicked status change")
        const status=e.target.value
        console.log(status)
        Setavailability(status)
    }
    function handleimage(e){
        Setfileimage(e.target.files[0])
    }
    console.log(profilepic)
  return (
    <div>
        <Navbar/>
      <div class="container-xl px-4 mt-4">
    <hr class="mt-0 mb-4"/>
    <div class="row">
        <div class="col-xl-4">   
            <div class="card mb-4 mb-xl-0">
                <div class="card-header">Profile Picture</div>
                <div class="card-body text-center">
                    
               
                          <img className="img-account-profile rounded-circle mb-2" src={imageURL} alt="Profile" />
                           
                          
                             

                    <div class="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                    
                    <input  type='file' align="right" name='image'onChange={handleimage}></input>
                  
                    
                    <button class="btn btn-primary" type="file" >Add</button>
                </div>
            </div>
        </div>
        <div class="col-xl-8">
            
            <div class="card mb-4">
                <div class="card-header">Account Details</div>
                <div class="card-body">
                    <form>
                        
                        
                     
                        {/* <div class="row gx-3 mb-3">
                            
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputFirstName">First name</label>
                                <input class="form-control" id="inputFirstName" type="text" placeholder="Enter your first name" value="Valerie"/>
                            </div>
                           
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputLastName">Last name</label>
                                <input class="form-control" id="inputLastName" type="text" placeholder="Enter your last name" value="Luna"/>
                            </div>
                        </div> */}

                        <div class="row gx-3 mb-3">
                            
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputOrgName">Organization name</label>
                                <input class="form-control" id="inputOrgName" type="text" placeholder="Enter your organization name"name='organization_name' value={user.organization_name} onChange={handlechange}/>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputLocation">Location</label>
                                <input class="form-control" id="inputLocation" type="text" placeholder="Enter your location"name='location' value={user.location} onChange={handlechange}/>
                            </div>
                        </div>
                        
                        
                       
                        <div class="row gx-3 mb-3">
                            
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">Phone number</label>
                                <input class="form-control" id="inputPhone" type="number" placeholder="Enter your phone number" name='phonenumber' value={user.phonenumber} onChange={handlechange}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">Speciality</label>
                                <input class="form-control" id="inputPhone" type="text" placeholder="Enter your Speciality" name='speciality' value={user.speciality} onChange={handlechange}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">License number</label>
                                <input class="form-control" id="inputPhone" type="number" placeholder="Enter your License number" name='licensenumber' value={user.licensenumber} onChange={handlechange}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">Experiance</label>
                                <input class="form-control" id="inputPhone" type="number" placeholder="Enter your Experiance" name='experiance' value={user.experiance}onChange={handlechange}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">Amount</label>
                                <input class="form-control" id="inputPhone" type="number" placeholder="Enter your Amount" name='amount' value={user.amount} onChange={handlechange}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1 p-2" for="inputPhone" id='label-doctor'>Availability</label>
                                <select 
                                                className="form-control" 
                                                id="inputAvailability" 
                                                value={availablity} 
                                                onChange={handlestatus}
                                            >
                                                <option value="">Select availability</option>
                                                <option value="available">Available</option>
                                                <option value="busy">Busy</option>
                                                <option value="offline">Offline</option>
                                                <option value="in_consultation">In Consultation</option>
                                            </select>
                            </div>
                           
                        </div>
                        
                        <button class="btn btn-primary" type="button"onClick={handlesubmit}>Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
    </div>
  )
}

export default DoctorProfile
