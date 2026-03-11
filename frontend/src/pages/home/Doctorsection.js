import React, { useEffect, useState } from 'react';
import Header from './Header';
import { doctor_api } from '../axios/axios';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBIcon
} from 'mdb-react-ui-kit';

function Content() {

  const [doctor, setDoctor] = useState([]);
  //const baseURL = "http://127.0.0.1:8000/";

  useEffect(() => {
    getAlldoctors()
  }, []);

  async function getAlldoctors() {
    await doctor_api.get('/get-all-doctors', {
      withCredentials: true
    }).then((res) => {
      setDoctor(res.data);
    })
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <Header />

      <section id="section1" className="py-16">
        <MDBContainer>

          <MDBTypography tag='h1' className="text-center text-4xl font-bold text-blue-900 mb-3">
            Our Expert Doctors
          </MDBTypography>

          <p className="text-center text-gray-600 mb-12">
            Book appointments with our highly qualified medical professionals
          </p>

          <MDBRow className="g-5">

            {doctor && doctor.map((data) => (

              <MDBCol md="6" lg="4" key={data.id}>

                <MDBCard
                  className="h-100 border-0 shadow-lg"
                  style={{
                    borderRadius: "20px",
                    transition: "all 0.3s ease"
                  }}
                >

                  <MDBCardBody className="text-center p-4">

                    {/* Doctor Image */}

                    <div className="mb-3">

                      <MDBCardImage
                        src={`${data.image}`}
                        alt="doctor"
                        className="rounded-circle shadow"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          border: "4px solid #fff"
                        }}
                        fluid
                      />

                    </div>

                    {/* Doctor Name */}

                    <MDBTypography tag="h4" className="fw-bold text-blue-800">
                      Dr. {data.first_name} {data.last_name}
                    </MDBTypography>

                    <p className="text-muted mb-2">
                      {data.speciality}
                    </p>

                    {/* Rating */}

                    <div className="mb-3">
                      <MDBIcon fas icon="star" className="text-warning me-1" />
                      <MDBIcon fas icon="star" className="text-warning me-1" />
                      <MDBIcon fas icon="star" className="text-warning me-1" />
                      <MDBIcon fas icon="star" className="text-warning me-1" />
                      <MDBIcon fas icon="star" className="text-warning me-1" />
                    </div>

                    {/* Details */}

                    <div className="text-start small text-gray-700 mb-3">

                      <p>
                        <MDBIcon fas icon="user-md" className="me-2 text-primary" />
                        {data.experiance} years experience
                      </p>

                      <p>
                        <MDBIcon fas icon="map-marker-alt" className="me-2 text-primary" />
                        {data.location}
                      </p>

                      <p>
                        <MDBIcon fas icon="phone" className="me-2 text-primary" />
                        {data.phone_number}
                      </p>

                      <p>
                        <MDBIcon fas icon="id-badge" className="me-2 text-primary" />
                        License: {data.license_no}
                      </p>

                      <p>
                        <MDBIcon fas icon="rupee-sign" className="me-2 text-success" />
                        Consultation: {data.amount} INR
                      </p>

                    </div>

                    {/* Availability */}

                    <div className="d-flex justify-content-between align-items-center mt-3">

                      <span className="badge bg-success px-3 py-2">
                        {data.available_status}
                      </span>

                      <MDBBtn
                        href={`doctor-appointment/${data.id}`}
                        className="rounded-pill px-4"
                        style={{
                          background: "linear-gradient(45deg,#007bff,#00c6ff)",
                          border: "none"
                        }}
                      >
                        Book
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