import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaUser, FaHistory, FaHome } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { Modal, Button, Form } from "react-bootstrap";
import { getAllCustomers } from "../../Apis/Customer";
import { customerCart } from "../../Apis/Cart";

const BottomBar = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [error, setError] = useState(""); // Added error state

  const navigate = useNavigate(); // useNavigate replaces useHistory in React Router v6

  // Fetch customers from an API or state
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await getAllCustomers(); // Fetching customers
        if (result && result.customers) {
          setCustomers(result.customers);
          setFilteredCustomers(result.customers); // Fix for setting initial customer data
        } else {
          setError("No customers found.");
        }
      } catch (err) {
        setError("Error fetching customers");
      }
    };
    fetchCustomers();
  }, [showModal, searchQuery]);

  // Filter customers based on search input
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredCustomers(customers); // Show all customers if search query is empty
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase()) ||
          customer.phone.toLowerCase().includes(query.toLowerCase()) ||
          customer.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  // Handle customer selection and redirect
  const handleCustomerClick = async (customerId) => {
    try {
      // Fetch the customer's cart
      const response = await customerCart(customerId);

      if (response.success) {
        // Safely check if cart and items exist before accessing length
        if (
          response.cart &&
          response.cart.item &&
          response.cart.item.length > 0
        ) {
          // Navigate to the cart page
          navigate(`/get-cart/${customerId}`);
          setShowModal(false);
        } else {
          // Show error if the cart is empty or not found
          alert("Cart is empty or not found");
        }
      } else {
        // Handle API error
        alert("Cart Not Found");
      }
    } catch (error) {
      // Handle network or other errors
      alert("Failed to fetch data. Please try again later.");
    }
  };

  return (
    <>
      <div className="fixed-bottom bg-light text-dark shadow bottom-bar">
        <div className="d-flex justify-content-between align-items-center">
          <Link
            to="/"
            className="text-dark text-decoration-none d-flex flex-column align-items-center p-2 icon-link"
          >
            <FaHome size={21} />
            <span style={{ fontSize: "10px" }} className="small">
              Home
            </span>
          </Link>
          <Link
            to="/all-customers"
            className="text-dark text-decoration-none d-flex flex-column align-items-center p-2 icon-link"
          >
            <FaUser size={21} />
            <span style={{ fontSize: "10px" }} className="small">
              Customers
            </span>
          </Link>

          <Link
            to="/add-to-cart"
            className="text-dark text-decoration-none d-flex flex-column align-items-center p-2 icon-link"
          >
            <FaPlus size={21} />
            <span style={{ fontSize: "10px" }} className="small">
              Add
            </span>
          </Link>
          <div
            className="text-dark text-decoration-none d-flex flex-column align-items-center p-2 icon-link"
            style={{ cursor: "pointer" }}
            onClick={() => setShowModal(true)}
          >
            <FaCircleInfo size={21} />
            <span style={{ fontSize: "10px" }} className="small">
              Details
            </span>
          </div>
          <Link
            to="/history"
            className="text-dark text-decoration-none d-flex flex-column align-items-center p-2 icon-link"
          >
            <FaHistory size={21} />
            <span style={{ fontSize: "10px" }} className="small">
              History
            </span>
          </Link>
        </div>
      </div>

      {/* Modal for Customer Search */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Search Customers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="searchQuery">
            <Form.Control
              type="text"
              placeholder="Search by name, phone, or address..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form.Group>

          {/* Customer list */}
          <div
            style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}
          >
            {error ? (
              <p>{error}</p>
            ) : filteredCustomers.length === 0 ? (
              <p>No customers found</p>
            ) : (
              <ul className="list-group">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => handleCustomerClick(customer._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <span>
                      {customer.name} - {customer.phone} - {customer.address}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BottomBar;
