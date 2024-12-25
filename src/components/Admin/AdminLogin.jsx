import React, { useState } from "react";
import { adminLogin } from "../../Apis/Admin";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change and update formData state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission and call the adminLogin API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Validation
    if (!username || !password) {
      alert("Both username and password are required.");
      return;
    }
    try {
      const result = await adminLogin(username, password);
      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", username);
        window.location.href = '/';
        alert(result.message);
      } else {
        setMessage(result.message);
        alert(result.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{ width: "100%",height:"100vh" }}
      className="d-flex flex-column justify-content-center align-items-center gap-5 mt-4 bg-dark text-white"
    >
      <h1 className="text-center">Welcome to F.G RO Plant</h1>
      <div className="container">
        <h1 className="text-center">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="text-center">
            <input
              type="submit"
              value="Login"
              className="btn btn-primary btn-block w-100"
            />
          </div>
        </form>
        {message && <p className="text-center mt-3">{message}</p>}
        {/* Link to Register Page */}
        <div className="text-center mt-3">
          <p className="text-white">
            Don't have an account?{" "}
            <Link to="/admin-register" className="text-primary">
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
