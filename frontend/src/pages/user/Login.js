import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import axiosconfig, { auth_api } from "../axios/axios";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";
import PulseLoader from "react-spinners/PulseLoader"; // More professional loader
import axios from "axios";

// Spinner CSS for centering
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // Center the loader
};

function Login() {
  const [data, Setdata] = useState({
    Username: "",
    First_Name: "",
    Last_Name: "",
    Password: "",
    Email: "",
    role: null,
  });
  const [loading, setLoading] = useState(false); // loading state
  const [color, setColor] = useState("#36D7B7"); // Professional green-blue spinner color
  const navigate = useNavigate();

  async function handlechange(e) {
    const { name, value } = e.target;
    Setdata((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  }

  async function handleclick(e) {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    const userData = {
      email: data.Email,
      password: data.Password,
    };

    Setdata({ Email: "", Password: "" });
    console.log(userData);

    try {
      const res = await auth_api.post("/login", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res);
      localStorage.setItem("role", res.data.user.role);
      if (res.status == 200) {
        alert(23)
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MDBContainer fluid className="p-3 my-5 flex-grow-1">
        <MDBRow>
          <MDBCol col="10" md="6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </MDBCol>

          <MDBCol col="4" md="6">
            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
              id="formControlLg"
              type="email"
              size="lg"
              name="Email"
              value={data.Email}
              onChange={handlechange}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="formControlLg"
              type="password"
              size="lg"
              name="Password"
              value={data.Password}
              onChange={handlechange}
            />

            <div className="text-center text-md-start mt-4 pt-2">
              <MDBBtn
                className="mb-0 px-5"
                size="lg"
                onClick={handleclick}
                disabled={loading}
              >
                {" "}
                {/* Disable button when loading */}
                {loading ? "Logging in..." : "Login"}{" "}
                {/* Change text when loading */}
              </MDBBtn>
              <p className="small fw-bold mt-2 pt-1 mb-2">
                Don't have an account?{" "}
                <a href="/signup" className="link-danger">
                  Register
                </a>
              </p>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Footer */}
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>
        <div>
          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="facebook-f" size="md" />
          </MDBBtn>
          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="twitter" size="md" />
          </MDBBtn>
          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="google" size="md" />
          </MDBBtn>
          <MDBBtn
            tag="a"
            color="none"
            className="mx-3"
            style={{ color: "white" }}
          >
            <MDBIcon fab icon="linkedin-in" size="md" />
          </MDBBtn>
        </div>
      </div>

      {/* Centered loader */}
      {loading && (
        <PulseLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
}

export default Login;
