import React, { useEffect, useState } from 'react';
import axiosconfig, { auth_api, patient_api } from '../axios/axios';

function Add() {
  const [medicalHistory, setMedicalHistory] = useState('');
  const [showOtherField, setShowOtherField] = useState(false);
  const [data, setData] = useState({
    phone_number: '',
    address: '',
    date_of_birth: '',
    medical_history: '',
    additional_information: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await patient_api.get("getprofile", {
         withCredentials:true
        });
        if (res.data) {
          setUser(res.data);
          setData({
            phone_number: res.data.phone_number || '',
            address: res.data.address || '',
            date_of_birth: res.data.date_of_birth || '',
            additional_information: res.data.additional_information || ''
          });
          setMedicalHistory(res.data.medical_history || '');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    getProfile();
  }, []);

  const handleMedicalHistoryChange = (event) => {
    const selectedOption = event.target.value;
    setMedicalHistory(selectedOption);
    setShowOtherField(selectedOption === 'other');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const formData = {
      ...data,
      medical_history: medicalHistory
    };
    try {
      await patient_api.post("/addprofile", formData, {
        withCredentials:true
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Update Profile</h2>
      <form onSubmit={submit}>
        <div style={inputGroupStyle}>
          <label htmlFor="dob" style={labelStyle}>Date of Birth</label>
          <input
            type="date"
            id="dob"
            name='date_of_birth'
            value={data.date_of_birth}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="phone" style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name='phone_number'
            value={data.phone_number}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="address" style={labelStyle}>Address</label>
          <input
            type="text"
            id="address"
            name='address'
            value={data.address}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="medical-history" style={labelStyle}>Medical History</label>
          <select
            id="medical-history"
            name="medical-history"
            value={medicalHistory}
            onChange={handleMedicalHistoryChange}
            style={inputStyle}
          >
            <option value="none">No significant medical history</option>
            <option value="allergies">Allergies</option>
            <option value="asthma">Asthma</option>
            <option value="diabetes">Diabetes</option>
            <option value="heart-disease">Heart Disease</option>
            <option value="hypertension">Hypertension (High Blood Pressure)</option>
            <option value="cancer">Cancer</option>
            <option value="kidney-disease">Kidney Disease</option>
            <option value="liver-disease">Liver Disease</option>
            <option value="thyroid-disorders">Thyroid Disorders</option>
            <option value="chronic-pain">Chronic Pain</option>
            <option value="mental-health">Mental Health Conditions</option>
            <option value="arthritis">Arthritis</option>
            <option value="surgeries">Previous Surgeries</option>
            <option value="pregnancy">Pregnancy</option>
            <option value="immunization-records">Immunization Records</option>
            <option value="other">Other (Specify)</option>
          </select>
        </div>

        {showOtherField && (
          <div style={inputGroupStyle}>
            <label htmlFor="other-details" style={labelStyle}>Please specify:</label>
            <input
              type="text"
              id="other-details"
              name="other-details"
              style={inputStyle}
            />
          </div>
        )}

        <div style={inputGroupStyle}>
          <label htmlFor="additional-info" style={labelStyle}>Additional Information</label>
          <textarea
            id="additional-info"
            name='additional_information'
            value={data.additional_information}
            onChange={handleChange}
            rows="4"
            style={{...inputStyle, minHeight: '100px'}}
          ></textarea>
        </div>

        <button type="submit" style={submitButtonStyle}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

const inputGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  color: '#555',
  fontSize: '14px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#4a90e2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Add;