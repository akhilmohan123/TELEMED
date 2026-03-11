import React, { useEffect, useState } from 'react';
import Header from './Header';
import Doctorsection from './Doctorsection';
import axiosconfig from '../axios/axios';
import About from './about/About';

function Content() {


  return (
    <div>
      <Header />       
      <Doctorsection/>
      <div style={{marginTop:"60px"}}>
        <About/>
      </div>
    </div>
     
        
  );
}

export default Content;
