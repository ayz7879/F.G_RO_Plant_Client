import React, { useState } from "react";
import { adminRegister } from "../../Apis/Admin";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminRegister = () => {
  // State to capture form data
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // State for success/error messages

  const navigate = useNavigate(); // useNavigate hook for redirection

  // Handle input change and update formData state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the input fields
    });
  };

  // Handle form submission and call the adminRegister API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, username, password } = formData;

    // Call the API with the form data
    const result = await adminRegister(name, username, password);

    // Check the result and act accordingly
    if (result.success) {
      alert("Registration successful! Redirecting to login..."); // Show success alert
      navigate("/admin-login"); // Redirect to login page
    } else {
      setMessage(result.message); // Show error message if registration failed
    }
  };

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      className="d-flex flex-column justify-content-center align-items-center gap-5 mt-4 bg-dark text-white"
    >
      <h1 className="text-center">Welcome to F.G RO Plant</h1>
      <div className="container">
        <h1 className="text-center">Admin Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter name"
              required
            />
          </div>
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
              value="Register"
              className="btn btn-primary btn-block w-100"
            />
          </div>
        </form>
        {message && <p className="text-center mt-3 text-danger">{message}</p>}
      </div>
    </div>
  );
};

export default AdminRegister;
