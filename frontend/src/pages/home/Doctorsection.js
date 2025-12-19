import React, { useEffect, useState } from 'react';
import Header from './Header';
import axiosconfig, { doctor_api } from '../axios/axios';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';

function Content() {
  const [doctor, setDoctor] = useState([]);
  
  const baseURL = "http://127.0.0.1:8000/";

  useEffect(() => {
  getAlldoctors()
  }, []);

  async function getAlldoctors()
  {
      await doctor_api.get('/get-all-doctors', {
      withCredentials:true
    }).then((res) => {
      console.log(res)
      setDoctor(res.data);
    });
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <section id="section1" className="py-12">
        <MDBContainer>
          <MDBTypography tag='h1' className="text-center text-3xl font-bold text-blue-800 mb-10">
            Our Expert Doctors
          </MDBTypography>
          <MDBRow className="g-4">
            {doctor && doctor.map((data) => (
              <MDBCol md="6" lg="4" key={data.id}>
                <MDBCard className="h-100 shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderRadius: '15px' }}>
                  <MDBCardBody className="p-4">
                    <div className="text-center mb-4">
                      <MDBCardImage
                        src={`${baseURL}${data.image}`}
                        alt={`Dr ${data.first_name} ${data.last_name}`}
                        className="rounded-circle mx-auto"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        fluid
                      />
                      <MDBTypography tag='h2' className="mt-3 font-bold text-xl text-blue-900">
                        Dr. {data.first_name} {data.last_name}
                      </MDBTypography>
                      <p className="text-gray-600 mb-2">{data.speciality}</p>
                      <div className="flex justify-center items-center mb-3">
                        <MDBIcon icon="star" className="text-yellow-400" />
                        <MDBIcon icon="star" className="text-yellow-400" />
                        <MDBIcon icon="star" className="text-yellow-400" />
                        <MDBIcon icon="star" className="text-yellow-400" />
                        <MDBIcon icon="star" className="text-yellow-400" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="flex items-center mb-2 text-gray-700">
                        <MDBIcon fas icon="user-md" className="mr-2 text-blue-600" /> {data.experiance} years experience
                      </p>
                      <p className="flex items-center mb-2 text-gray-700">
                        <MDBIcon fas icon="map-marker-alt" className="mr-2 text-blue-600" /> {data.location}
                      </p>
                      <p className="flex items-center mb-2 text-gray-700">
                        <MDBIcon fas icon="id-badge" className="mr-2 text-blue-600" /> License: {data.license_no}
                      </p>
                      <p className="flex items-center mb-2 text-gray-700">
                        <MDBIcon fas icon="envelope" className="mr-2 text-blue-600" /> {data.user_email}
                      </p>
                      <p className="flex items-center mb-2 text-gray-700">
                        <MDBIcon fas icon="phone" className="mr-2 text-blue-600" /> {data.phone_number}
                      </p>
                      <p className="flex items-center mb-2 text-gray-700">
                        <MDBIcon fas icon="amount" className="mr-2 text-blue-600" /> Consultation Price : {data.amount} INR
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-green-600 font-semibold flex items-center">
                        <MDBIcon far icon="clock" className="mr-2" /> {data.available_status}
                      </p>
                      <MDBBtn color="primary" rounded className="px-4 py-2" href={`doctor-appointment/${data.id}`}>
                        Book Appointment
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBContainer>
      </section>
    </div>
  );
}

export default Content;