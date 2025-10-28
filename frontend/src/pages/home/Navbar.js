import React, { useState } from 'react';
import {Link,useLocation} from 'react-router-dom';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse
} from 'mdb-react-ui-kit';
import axiosconfig, { auth_api } from '../axios/axios';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location=useLocation()
  const navigate = useNavigate();
  const role=localStorage.getItem("role")
  let logoutTimer
  async function handlelogout() {
    clearTimeout(logoutTimer);
      logoutTimer = setTimeout(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    await auth_api.post("/logout",
      {
        withCredentials:true
      }
    );
    navigate("/login");
  }, 300);
  }
  function handledoctors(){
    if(location.pathname !=='/'){
     window.location.href='/user#section1'
    }else {
      // If you're already on the /user page, scroll smoothly to the Doctors section
      document.getElementById('section1').scrollIntoView({ behavior: 'smooth' });
  }
  }
  
  return (
  <>
    {role==='2'?
    
    <MDBNavbar expand='lg' light bgColor='light'>
    <MDBContainer fluid style={{ position: 'relative' }}>
      <MDBNavbarBrand href='/doctor'>Doctor</MDBNavbarBrand>
      <MDBNavbarToggler
        type='button'
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={() => setOpenNav(!openNav)}
      >
      </MDBNavbarToggler>
      <MDBCollapse navbar open={openNav}>
        <MDBNavbarNav>
          <MDBNavbarItem>
            <MDBNavbarLink active aria-current='page' href='/doctor'>
              Home
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='/appointments-doctor'>LatestAppointments</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='/doctor-profile'>Profile</MDBNavbarLink>
          </MDBNavbarItem>
         
        </MDBNavbarNav>
      </MDBCollapse>
      <div style={{
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)'
      }}>
        <MDBNavbarLink href='#' tabIndex={-1} aria-disabled='true' onClick={handlelogout}>
          Logout
        </MDBNavbarLink>
      </div>
    </MDBContainer>
  </MDBNavbar>
:
<MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid style={{ position: 'relative' }}>
        <MDBNavbarBrand href='#'>Patient</MDBNavbarBrand>
        <MDBNavbarToggler
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenNav(!openNav)}
        >
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openNav}>
          <MDBNavbarNav>
            <MDBNavbarItem>
              <MDBNavbarLink aria-current='page' href='/home'>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink as={Link} href='#section1'onClick={handledoctors} >Doctors</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/profile'>Profile</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/appointment-details'>Appointments</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
            <MDBNavbarLink href='/get-medicine'>Medicine</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink   href='/get-refers'>Refers</MDBNavbarLink>
          </MDBNavbarItem>
          
          </MDBNavbarNav>
        </MDBCollapse>
        <div style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            listStyleType: 'none', // Remove bullet points
            padding: 0, // Remove padding
            margin: 0 // Remove margin
          }}>
          <MDBNavbarItem>
           <MDBNavbarLink href="#section2" style={{ padding: '0', margin: '0' ,cursor:'pointer'}}>About</MDBNavbarLink>
           </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink href='#' tabIndex={-1} aria-disabled='true' onClick={handlelogout} style={{ padding: '0', margin: '0' }}>
                Logout
              </MDBNavbarLink>
            </MDBNavbarItem>
          </div>
      </MDBContainer>
    </MDBNavbar>
  
       }
   
           </>
   
  );
}