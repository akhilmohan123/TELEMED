import React, { useEffect, useState } from 'react';
import axiosconfig from '../../axios/axios';
import { Container, Row, Col, Card, Modal, Button, Badge } from 'react-bootstrap';
import { FaPills, FaCalendarAlt, FaClock, FaFileDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import Navbar from '../Navbar';

function Medicine() {
  const token = localStorage.getItem("token");
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getMedicine = async () => {
      try {
        const res = await axiosconfig.get('get-medicines', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMedicines(res.data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    getMedicine();
  }, [token]);

  const handleMedicineClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const handleDownload = () => {
    const element = document.querySelector('#modelcontent');
    html2pdf(element);
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <h1 className="text-center mb-5">Your Medications</h1>
        <Row xs={1} md={2} lg={3} className="g-4">
          {medicines.map(medicine => (
            <Col key={medicine.id}>
              <Card 
                className="h-100 shadow-sm transition-transform hover-effect" 
                onClick={() => handleMedicineClick(medicine)}
              >
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>{medicine.name}</span>
                    <Badge bg="primary" pill>{medicine.dosage}</Badge>
                  </Card.Title>
                  <Card.Text>
                    <FaPills className="me-2 text-primary" />
                    Prescribed by Dr. {medicine.doctor_name}
                  </Card.Text>
                  <Card.Text>
                    <FaClock className="me-2 text-secondary" />
                    {medicine.frequency}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Medication Details</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modelcontent">
            {selectedMedicine && (
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>{selectedMedicine.name}</h2>
                  <Badge bg="primary" pill className="px-3 py-2">{selectedMedicine.dosage}</Badge>
                </div>
                <p className="text-muted mb-4">
                  <FaCalendarAlt className="me-2" />
                  Prescribed on: {selectedMedicine.date}
                </p>
                <h5>Prescription Details:</h5>
                <ul className="list-unstyled">
                  <li><strong>Doctor:</strong> Dr. {selectedMedicine.doctor_name}</li>
                  <li><strong>Frequency:</strong> {selectedMedicine.frequency}</li>
                  <li><strong>Duration:</strong> {selectedMedicine.duration}</li>
                </ul>
                {selectedMedicine.additional_notes && (
                  <div className="mt-4">
                    <h5>Additional Notes:</h5>
                    <p>{selectedMedicine.additional_notes}</p>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleDownload}>
              <FaFileDownload className="me-2" />
              Download PDF
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default Medicine;