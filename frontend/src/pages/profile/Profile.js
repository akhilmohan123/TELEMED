import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosconfig, { auth_api } from '../axios/axios';
import Navbar from '../home/Navbar';



const Profile = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    auth_api.get("/user", {
      withCredentials:true
    }).then((res) => {
      setData(res.data);
      console.log(res.data)
    }).catch(error => {
      console.error("Error fetching user data:", error);
    });
  }, []);

  const handleAdd = () => {
    navigate("/add");
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
    <Navbar/>
      <div style={{ 
        maxWidth: '400px', 
        margin: '3rem auto', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem 1.5rem', paddingTop: '4rem', textAlign: 'center' }}>
          <h2 style={{ margin: '0.5rem 0', fontSize: '1.75rem', color: '#333', fontWeight: 'bold' }}>
            {data ? `${data.first_name} ${data.last_name}` : 'Loading...'}
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{data?.email}</p>
          <button
            onClick={handleAdd}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 2px 10px rgba(74, 144, 226, 0.3)'
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const socialButtonStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#f0f0f0',
  border: 'none',
  fontSize: '1.2rem',
  color: '#333',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s ease',
};

export default Profile;