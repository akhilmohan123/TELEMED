
import React, { useState, useEffect } from 'react';
import axiosconfig, { appointment_api, media_api } from '../../axios/axios';
import Navbar from '../Navbar';
import {toast} from 'react-toastify'
function MedicineDetails({id}) {
    const [formData, setFormData] = useState({
       appointment:id,
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        additional_notes: ''
    });
    

    // State for appointments list (assuming appointments are fetched from API)
    
    const token=localStorage.getItem('token')
    // Fetch appointments on component mount (mock API call here)
    // useEffect(() => {
    //     axios.get('/api/appointments/')
    //         .then((response) => {
    //             setAppointments(response.data);
    //         })
    //         .catch((error) => {
    //             console.error('There was an error fetching the appointments!', error);
    //         });
    // }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        await appointment_api.post('/add-medicine', formData,{
           withCredentials:true
        })
            .then((response) => {
                console.log('Form submitted successfully:', response.data);
                toast("added ")
            
            })
            .catch((error) => {
                console.error('There was an error submitting the form!', error);
                toast.error("Something went wrong please try again after sometime!")
            });
    };

  return (
    <div>
      
        <form onSubmit={handleSubmit} className="container mt-4">
            <h2>Add Medicine</h2>

            {/* Appointment (ForeignKey) */}
            <div className="mb-3">
                <label >Appointment Id</label>
                  <input type='text' value={id} readOnly/>
            </div>

            {/* Medicine Name */}
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Medicine Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Dosage */}
            <div className="mb-3">
                <label htmlFor="dosage" className="form-label">Dosage</label>
                <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    className="form-control"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Frequency */}
            <div className="mb-3">
                <label htmlFor="frequency" className="form-label">Frequency</label>
                <input
                    type="text"
                    id="frequency"
                    name="frequency"
                    className="form-control"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Duration */}
            <div className="mb-3">
                <label htmlFor="duration" className="form-label">Duration</label>
                <input
                    type="text"
                    id="duration"
                    name="duration"
                    className="form-control"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Additional Notes */}
            <div className="mb-3">
                <label htmlFor="additional_notes" className="form-label">Additional Notes</label>
                <textarea
                    id="additional_notes"
                    name="additional_notes"
                    className="form-control"
                    value={formData.additional_notes}
                    onChange={handleInputChange}
                />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
    </div>
  )
}

export default MedicineDetails
