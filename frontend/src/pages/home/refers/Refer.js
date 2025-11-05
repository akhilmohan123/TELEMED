import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { PersonFill, ClockFill, CalendarFill } from 'react-bootstrap-icons';
import axiosconfig, { appointment_api } from '../../axios/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const Refer = () => {
  const[data,Setdata]=useState()
  const [error,setError]=useState()
  const navigate=useNavigate()
  const token=localStorage.getItem('token')
  useEffect(()=>{
   getReferappointment()
  },[])

  async function getReferappointment()
  {
     await appointment_api.get("/get-refer-appointments",{
      withCredentials:true
  }).then((res)=>{
      console.log(res)
      Setdata(res.data)
  }).catch((err)=>{
    setError(err)
  })
  }
  function handleclick(id){
   navigate(`/doctor-appointment/${id}`)
  }
  return (
    <>
    <Navbar/>
    {data?(
      <Container className="py-5">
      <h2 className="text-center mb-4">Your Referral Information</h2>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header as="h5" className="bg-primary text-white">Doctor Referral</Card.Header>
            <Card.Body>
              <Card.Title>You have been referred to a <strong>{data.special} </strong>specialist</Card.Title>
              <div className="my-4">
                <p className="d-flex align-items-center">
                  <PersonFill className="mr-2 text-primary" />
                  <strong>Dr. {data.refer_doctor_name}</strong>
                </p>
                <p className="d-flex align-items-center">
                  <ClockFill className="mr-2 text-success" />
                  {data.special}
                </p>
              </div>
              <Button variant="primary" block className="d-flex align-items-center justify-content-center" onClick={()=>handleclick(data.refer_doctor)}>
                <CalendarFill className="mr-2" />
                Book Appointment
              </Button>
            </Card.Body>
          </Card>

          {/* <Alert variant="success" className="mt-3">
            <Alert.Heading>Appointment Booked Successfully!</Alert.Heading>
            <p>Your appointment has been scheduled. Please check your email for details.</p>
          </Alert> */}

          {/* <Alert variant="danger" className="mt-3">
            <Alert.Heading>Booking Failed</Alert.Heading>
            <p>We couldn't book your appointment. Please try again later or contact support.</p>
          </Alert> */}
{/* 
          <Alert variant="info" className="mt-3">
            <Alert.Heading>No Referral Found</Alert.Heading>
            <p>You currently have no referrals to other doctors.</p>
          </Alert> */}
        </Col>
      </Row>
    </Container>
    ):(<Alert variant="info" className="mt-3">
      <Alert.Heading>No Referral Found</Alert.Heading>
      <p>You currently have no referrals to other doctors.</p>
    </Alert>)}
    
    </>
  );
};

export default Refer;