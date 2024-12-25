import React, { useState } from "react";
import { adminRegister } from "../../Apis/Admin";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Spinner } from "react-bootstrap";
const AdminRegister = () => {
  // State to capture form data
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState(""); // State for success/error messages

  const navigate = useNavigate(); // useNavigate hook for redirection

  // Handle input change and update formData state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.toLowerCase(), // Dynamically update the input fields
    });
  };

  // Handle form submission and call the adminRegister API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, username, password } = formData;

    // Validation
    if (!username || !password || !name) {
      alert("All field are required.");
      return;
    }
    setIsLoading(true);
    // Call the API with the form data
    try {
      const result = await adminRegister(name, username, password);
      if (result.success) {
        window.location.href = "/admin-login";
        alert("Registration successful! Redirecting to login...");
      } else {
        setMessage(result.message); // Show error message if registration failed
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
            <button
              type="submit"
              className="btn btn-primary btn-block w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        {message && <p className="text-center mt-3 text-danger">{message}</p>}
        <div className="text-center mt-3">
          <p className="text-white">
            You have an account?{" "}
            <Link to="/admin-login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
