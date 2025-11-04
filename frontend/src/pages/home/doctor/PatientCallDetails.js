import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosconfig, { appointment_api, doctor_api } from '../../axios/axios';
import  './PatientCallDetails.css'

function PatientCallDetails() {
    const [data, setData] = useState();
    const [doctors, setDoctors] = useState();
    const [value,Setvalue] =useState()
    const [refer,Setrefer]=useState()
    const { id,ref } = useParams();
    const navigate=useNavigate()
    useEffect(() => {
       async function getSpecefic()
       {
         appointment_api.get(`/getspecefic/${id}`, {
            withCredentials:true
        }).then(res => {
    
            setData(res.data);
            Setvalue(res.data.status)
            Setrefer(res.data.refer_doctor)
        });
       }
       getSpecefic()
    }, [ id]);

    useEffect(() => {
        async function getAlldoctors()
        {
            doctor_api.get('/get-all-doctors', {
            withCredentials:true
        }).then((res) => {
            
            setDoctors(res.data);
            
        });
        }
        getAlldoctors()
    }, []);
    async function handleoptions(e){
        const options=e.target.value
        Setvalue(options)
        const data={status:options}
      
         appointment_api.put(`/edit-patient/${id}`,data,{
            withCredentials:true
        })

    }
   async function handlerefer(e){
    const refervalue=e.target.value
    Setrefer(refervalue)
    const data={refer:refervalue}

    appointment_api.put(`/edit-patient/${id}`,data,{
        withCredentials:true
    })
   }
   function handlecall(){
    navigate(`/video-call/${id}/${ref}`)
   }
    return (
        <div className="patient-details">
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-12 col-xl-6">
                            <div className="card shadow-lg" style={{ borderRadius: '15px' }}>
                                <div className="card-body text-center p-4">
                                    <h4 className="mb-3">Patient Name - {data && data.patient_name}</h4>
                                    <p className="text-muted">Reason: {data && data.note}</p>
                                    <p className="text-muted">Medical History: {data && data.medical_history}</p>

                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg btn-rounded me-3"
                                            style={{ padding: '10px 30px' }}
                                        onClick={()=>handlecall(id)}>
                                            Call
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <p>Refer to:</p>
                                        <select className="form-select mb-3" style={{ width: 'auto', margin: '0 auto' }} value={refer} onChange={handlerefer} >
                                            {doctors && doctors.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    Dr. {d.first_name} {d.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="d-flex justify-content-between text-center mt-4">
                                        <div>
                                            <p className="mb-2 h6">Date:</p>
                                            <p>{data && data.date}</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 h6">Time:</p>
                                            <p>{data && data.time}</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 h6">Status:</p>
                                            <select className="form-select" value={value} onChange={handleoptions}>
                                                <option value='pending'>Pending</option>
                                                <option value='completed'>Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PatientCallDetails;
