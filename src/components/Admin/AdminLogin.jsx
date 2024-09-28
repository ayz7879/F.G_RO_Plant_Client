import React, { useState } from "react";
import { adminLogin } from "../../Apis/Admin";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const AdminLogin = () => {
  // State to capture form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // State for success/error messages

  // Handle input change and update formData state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the input fields
    });
  };

  // Handle form submission and call the adminLogin API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Call the API with the form data
    const result = await adminLogin(username, password);

    // Update the message based on API response
    setMessage(result.message);
  };

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      className="d-flex justify-content-center align-items-center bg-dark text-white"
    >
      <div className="w-50">
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
