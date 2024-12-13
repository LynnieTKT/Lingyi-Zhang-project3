import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../utils/api"; 
import '../styles/LoginPage.css';

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(username, password);
        alert("Registration successful! Please log in.");
        setIsRegister(false);
      } else {
        const loginResponse = await login(username, password);
        console.log("Login response:", loginResponse);

        localStorage.setItem("token", loginResponse.token);
        localStorage.setItem("user", JSON.stringify(loginResponse.user)); 

        alert("Login successful!"); 
        navigate("/"); 
      }
    } catch (error) {
      console.error("Error during submission:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <div className="mt-3 text-center">
        <button
          className="btn btn-link"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? "Already have an account? Login here." : "Don't have an account? Register here."}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
