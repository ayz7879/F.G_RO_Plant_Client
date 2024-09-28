import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../../Apis/Customer";

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    advancePaid: "",
    pricePerJar: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, address, phone, advancePaid, pricePerJar } = formData;

    try {
      const result = await addCustomer(
        name,
        address,
        phone,
        advancePaid,
        pricePerJar
      );
      setMessage(result.message);
      alert(result.message); // Show alert with the message

      if (result.success) {
        setTimeout(() => navigate("/all-customers"), 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      setMessage("An error occurred.");
      alert("An error occurred.");
    }
  };

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      className="d-flex justify-content-center align-items-center bg-dark text-white"
    >
      <div className="w-100 p-3">
        <h1 className="text-center">Add Customer</h1>
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
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter address"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Advance Paid</label>
            <input
              type="number"
              name="advancePaid"
              value={formData.advancePaid}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter advance paid"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Price Per Jar</label>
            <input
              type="number"
              name="pricePerJar"
              value={formData.pricePerJar}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter price per jar"
              required
            />
          </div>
          <div className="text-center">
            <input
              type="submit"
              value="Add Customer"
              className="btn btn-primary btn-block w-100"
            />
          </div>
        </form>
        {message && <p className="text-center mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default AddCustomer;
