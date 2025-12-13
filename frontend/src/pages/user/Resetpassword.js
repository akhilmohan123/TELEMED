import React, { useState } from 'react';
import './Resetpassword.css';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import  { auth_api } from '../axios/axios';

function Resetpassword() {
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [error, setError] = useState('');
  const {token}=useParams()
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      alert("before")
      await auth_api.post(`/reset-password/${token}`, { password: password,confirm_password:confirmpassword }).then((res)=>{
        console.log(res.data)
        if(res.data.Error){
          setError("Something went wrong please try again later!")
        }else{
            window.location.href="/login"
        }
      })
      console.log('Password reset successfully!');
    }
  };

  return (
    <div className='resetPassword'>
      <div className='resetPasswordBox'>
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type='password'
            placeholder='Confirm new password'
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />

          {error && <p className='error-text'>{error}</p>}

          <button type='submit'>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default Resetpassword;
