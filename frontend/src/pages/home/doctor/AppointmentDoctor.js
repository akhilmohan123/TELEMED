import React, { useEffect, useState } from 'react';
import axiosconfig from '../../axios/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';


function AppointmentDoctor() {
    const [data, Setdata] = useState([]);
  
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        axiosconfig.get("getdoctor-appointments", { headers: { Authorization: `Bearer ${token}` } })
            .then(async(res) => {
                
                Setdata(res.data);
                
            })
            .catch(error => {
               
                console.error("Error fetching appointments:", error);
                if (error.response && error.response.status === 404) {
                    Setdata([]); // Ensure data is an empty array if not found
                }
            });
    }, [token]);

    function handlepatient(id,ref) {
        navigate(`/patient-details/${id}/${ref}`);
    }

    function handleremove(id) {
        axiosconfig.delete(`appointmentdelete/${id}`)
            .then(() => {
                Setdata(prevData => prevData.filter(appointment => appointment.id !== id));
            })
            .catch(error => {
                console.error("Error removing appointment:", error);
            });
    }

    return (
        <div>
            <Navbar/>
            <h1 style={{ textAlign: 'center' }}>My Appointments</h1>
            {data.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No appointments available.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope='col'>Video Id</th>
                            <th scope="col">Status</th>
                            <th scope='col'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((d)=>d.status !='completed').map((d, index) => (
                            <tr key={d.id}>
                                <th scope="row">{index + 1}</th>
                                <td style={{ cursor: "pointer" }} onClick={() => handlepatient(d.id,d.referrence_no)}>{d.patient_name}</td>
                                <td>{d.date}</td>
                                <td>{d.time}</td>
                                <td>{d.referrence_no}</td>
                                <td>{d.status}</td>
                                <td>
                                    <button type="button" className="btn btn-danger" onClick={() => handleremove(d.id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AppointmentDoctor;
