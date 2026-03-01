import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { payment_api } from "../../axios/axios";
import "./PaymentStatus.css"

function PaymentStatus() {
  const { id } = useParams(); // appointment id
  const navigate = useNavigate();

  const [status, setStatus] = useState("CREATED");
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await payment_api.get(`/payment-status/${id}`);
        const paymentStatus = res.data.status;
        
        setStatus(paymentStatus);

        if (paymentStatus === "PAID") {
          setMessage("Payment successful! Redirecting...");
          clearInterval(interval);

          setTimeout(() => {
            navigate("/user");
          }, 2000);
        }

        if (paymentStatus === "FAILED") {
          setMessage("Payment failed. Please try again.");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error checking payment status", err);
        setMessage("Error checking payment status. Please try again later.");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, navigate]);

  return (

   <div className="payment-container">
  
  <div className="payment-card">
    <div className="spinner"></div>

    <h2 className="payment-heading">
      {status === "CREATED" && "Processing Payment"}
      {status === "PAID" && "Payment Successful"}
      {status === "FAILED" && "Payment Failed"}
    </h2>

    <p className="payment-message">{message}</p>

    {status === "FAILED" && (
      <button
        className="retry-button"
        onClick={() => navigate(`/payment/${id}`)}
      >
        Retry Payment
      </button>
    )}
  </div>
</div>

  );
}

export default PaymentStatus;
