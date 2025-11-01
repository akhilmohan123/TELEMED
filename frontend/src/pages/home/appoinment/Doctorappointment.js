import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Form, Button, Container, Row, Col } from 'react-bootstrap';
import axiosconfig, { appointment_api } from '../../axios/axios';
import '../appoinment/Doctorappointment.css';

function Doctorappointment() {
  const [data, setData] = useState({ date: '', time: '', note: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const backgroundImage = '/img/services.jpg';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await appointment_api.post(`/createdoctor/${id}`, data, {
        withCredentials:true
      });
      console.log(response)
      setSuccess(true);
      setError('');
    } catch (err) {
      setSuccess(false);
      setError("There is an Appointment on the same date! Choose another date and time.");
    }
  };

  return (
    <Container fluid className="p-0">
      <div className='main-doctor-div' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className='form-content bg-white p-4 rounded shadow'>
              <h1 className="text-center mb-4">Doctor Appointment Request Form</h1>
              <p className="text-center mb-4">Fill the form below, and we will get back to you soon with updates to plan your appointment.</p>

              {success && (
                <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                  <Alert.Heading>Appointment Booked Successfully!</Alert.Heading>
                  <p>Your appointment has been scheduled. </p>
                </Alert>
              )}

              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  <Alert.Heading>Booking Failed</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Appointment Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Appointment Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={data.time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Reason for the Appointment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="note"
                    value={data.note}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Doctorappointment;