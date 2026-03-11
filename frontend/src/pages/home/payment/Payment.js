import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appointment_api, payment_api } from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import './Payment.css'
import { toast } from "react-toastify";
function Payment() {
  const [data,setData]=useState(0);
  const { id } = useParams(); // appointment id
  const navigate=useNavigate();
  //function to get the order details 

  async function getOrderDetails() {

    await appointment_api.get(`/appointment/${id}`, {
      withCredentials:true
    }).then((response)=>{
      console.log(response.data)
      setData(response.data.amount)
    }).catch((error)=>{
      console.log("Error in fetching order details",error)
      

    })
  }

  useEffect(()=>{
    console.log("Appointment id from the payment is ===",process.env.REACT_APP_RAZORPAY_KEY_ID)

    getOrderDetails();
    alert("key is -======"+process.env.REACT_APP_RAZORPAY_KEY_ID)

  },[])
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const startPayment = async () => {
  const res = await loadRazorpay();
  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }


  //Call Payment Service
  const order =  await payment_api.post(
    "/create-order",
    {
      appointment_id: id,
      amount: data,
    }
  );

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: order.data.amount,
    currency: "INR",
    name: "Telemed",
    description: "Doctor Appointment",
    order_id: order.data.razorpay_order_id,

    handler: async function (response) {
      try{
      console.log("Payment success:", response);

      await payment_api.post(
        "/verify-order",
        {
          appointment_id: id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }
      );

      navigate(`/payment-status/${id}`);
    }catch(error){
      toast.error("Payment verification failed. Please try again later.")
    }
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  return (
<div className="payment-page">
  <div className="payment-card">
    <h2 className="payment-title">Complete Your Payment</h2>

    <p className="payment-id">
      Appointment ID: <span>{id}</span>
    </p>

    <div className="amount-box">
      <span className="currency">₹</span>
      <span className="amount">{data}</span>
    </div>

    <button className="pay-button" onClick={startPayment}>
      Pay Now
    </button>

    <p className="secure-text">🔒 Secure payment powered by Razorpay</p>
  </div>
</div>

  );
}

export default Payment;
