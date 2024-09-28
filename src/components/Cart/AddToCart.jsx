import React, { useState, useEffect } from "react";
import { getAllCustomers } from "../../Apis/Customer";
import { addToCart } from "../../Apis/Cart";

const AddToCart = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    jarsGiven: 0,
    jarsTaken: 0,
    customerPay: 0,
  });
  const [error, setError] = useState(""); // For validation error

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData = await getAllCustomers();
        if (customerData && customerData.customers.length > 0) {
          setCustomers(customerData.customers);
          setError(""); // Clear error if customers are found
        } else {
          setError("No customers found.");
        }
      } catch (error) {
        setError("Error fetching customers.");
      }
    };
    fetchCustomers();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredCustomers(
        customers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers([]);
    }
  }, [searchQuery, customers]);

  // Handle customer selection
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      jarsGiven: 0,
      jarsTaken: 0,
      customerPay: 0,
      customerId: customer._id,
    });
    setError(""); // Clear error when a customer is selected
  };

  // Handle form input changes for jarsGiven, jarsTaken, customerPay
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  // Submit form to add to cart
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { customerId, jarsGiven, jarsTaken, customerPay } = formData;

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    const response = await addToCart(
      customerId,
      Number(jarsGiven),
      Number(jarsTaken),
      Number(customerPay)
    );

    if (response.success) {
      alert("Item added to cart successfully!");
    } else {
      setError("Error adding to cart: " + response.message);
    }
  };

  return (
    <div className="container py-2">
      <h2>Add Entries</h2>

      {/* Show error if no customers or other errors */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search Input */}
      <div className="form-group">
        <label>Search Customer</label>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, phone, or address"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Show filtered customer list */}
      {searchQuery && filteredCustomers.length > 0 && (
        <div className="list-group mt-2">
          {filteredCustomers.map((customer) => (
            <button
              key={customer._id}
              className="list-group-item list-group-item-action"
              onClick={() => handleCustomerClick(customer)}
            >
              {customer.name} - {customer.phone} - {customer.address}
            </button>
          ))}
        </div>
      )}

      {/* No customers found message */}
      {searchQuery && filteredCustomers.length === 0 && (
        <p>No customers found matching your search.</p>
      )}

      {/* Add to Cart Form */}
      {selectedCustomer && (
        <form onSubmit={handleSubmit} className="mt-4">
          <h4>Customer Details</h4>

          {/* Customer Details */}
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              className="form-control"
              value={selectedCustomer.name}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              value={selectedCustomer.address}
              readOnly
            />
          </div>

          {/* Add to Cart Inputs */}
          <div className="form-group">
            <label>Jars Given</label>
            <input
              type="number"
              className="form-control"
              name="jarsGiven"
              value={formData.jarsGiven}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Jars Taken</label>
            <input
              type="number"
              className="form-control"
              name="jarsTaken"
              value={formData.jarsTaken}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Customer Payment</label>
            <input
              type="number"
              className="form-control"
              name="customerPay"
              value={formData.customerPay}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary my-3 w-100">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default AddToCart;
