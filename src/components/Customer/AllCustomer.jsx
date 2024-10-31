import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Alert, Container } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
  addCustomer,
} from "../../Apis/Customer";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    advancePaid: "",
    pricePerJar: "",
    jarDeposit: "",
    capsuleDeposit: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", variant: "" });


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await getAllCustomers();
        if (result.success) {
          setCustomers(result.customers);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Error fetching customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.phone) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (!formData.pricePerJar) {
      errors.pricePerJar = "Price per jar is required";
    } else if (formData.pricePerJar <= 0) {
      errors.pricePerJar = "Price per jar must be a positive number";
    }
    // Add more validations as needed
    return errors;
  };

  const handleDelete = async () => {
    if (customerToDelete) {
      try {
        const result = await deleteCustomer(customerToDelete._id);
        if (result.success) {
          setCustomers(
            customers.filter(
              (customer) => customer._id !== customerToDelete._id
            )
          );
          setShowConfirmDelete(false);
          setAlert({ message: result.message, variant: "success" });
        } else {
          setAlert({ message: result.message, variant: "danger" });
        }
      } catch (err) {
        setAlert({ message: "Error deleting customer", variant: "danger" });
      }
    }
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      address: customer.address,
      phone: customer.phone,
      advancePaid: customer.advancePaid,
      jarDeposit: customer.jarDeposit,
      capsuleDeposit: customer.capsuleDeposit,
      pricePerJar: customer.pricePerJar,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setAlert({ message: "", variant: "" });
  };

  const handleCloseAddCustomerModal = () => {
    setShowAddCustomerModal(false);
    setAlert({ message: "", variant: "" });
  };

  const handleCloseConfirmDelete = () => setShowConfirmDelete(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (selectedCustomer) {
      try {
        const result = await updateCustomer(
          selectedCustomer._id,
          formData.name,
          formData.address,
          formData.phone,
          formData.advancePaid,
          formData.jarDeposit,
          formData.capsuleDeposit,
          formData.pricePerJar
        );
        if (result.success) {
          setCustomers(
            customers.map((customer) =>
              customer._id === selectedCustomer._id
                ? { ...customer, ...formData }
                : customer
            )
          );
          handleCloseEditModal();
          setAlert({ message: result.message, variant: "success" });
        } else {
          handleCloseEditModal();
          setAlert({ message: result.message, variant: "danger" });
        }
      } catch (err) {
        handleCloseEditModal();
        setAlert({ message: "Error updating customer", variant: "danger" });
      }
    }
  };

  const handleAddCustomer = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const result = await addCustomer(
        formData.name,
        formData.address,
        formData.phone,
        formData.advancePaid,
        formData.jarDeposit,
        formData.capsuleDeposit,
        formData.pricePerJar
      );
      if (result.success) {
        setCustomers([...customers, result.customer]);
        handleCloseAddCustomerModal();
        setAlert({ message: result.message, variant: "success" });
      } else {
        handleCloseAddCustomerModal();
        setAlert({ message: result.message, variant: "danger" });
      }
    } catch (err) {
      handleCloseAddCustomerModal();
      setAlert({ message: "Error adding customer", variant: "danger" });
    }
  };

  return (
    <Container
      fluid
      className="p-3"
      style={{
        backgroundColor: "#343a40",
        color: "#ffffff",
        borderRadius: "8px",
      }}
    >
      <h1 className="text-center mb-4">All Customers</h1>
      <h5 className="text-center mb-4">Total Customers: {customers.length}</h5>
      <div className="text-center mb-4">
        <Button variant="success" onClick={() => setShowAddCustomerModal(true)}>
          Add New Customer
        </Button>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      {alert.message && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ message: "", variant: "" })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      <div className="table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Advance</th>
              <th>Jar Deposit</th>
              <th>Capsule Deposit</th> {/* Added Header */}
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer._id} style={{ cursor: "pointer" }}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
                <td>{customer.advancePaid}</td>
                <td>{customer.jarDeposit}</td>
                <td>{customer.capsuleDeposit || '0'}</td> {/* Ensure data matches header */}
                <td>{customer.pricePerJar}</td>
                <td>
                  <FaEdit
                    className="text-warning mx-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(customer);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <FaTrash
                    className="text-danger mx-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomerToDelete(customer);
                      setShowConfirmDelete(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Name */}
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter name"
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Address */}
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Enter address"
                isInvalid={!!formErrors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.address}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Phone */}
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Enter phone"
                pattern="\d{10}"
                title="Phone number must be 10 digits"
                isInvalid={!!formErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Advance Paid */}
            <Form.Group controlId="formAdvancePaid">
              <Form.Label>Advance Paid</Form.Label>
              <Form.Control
                type="number"
                name="advancePaid"
                value={formData.advancePaid}
                onChange={handleFormChange}
                placeholder="Enter advance paid"
              />
            </Form.Group>

            {/* Jar Deposit */}
            <Form.Group controlId="formJarDeposit">
              <Form.Label>Jar Deposit</Form.Label>
              <Form.Control
                type="number"
                name="jarDeposit"
                value={formData.jarDeposit}
                onChange={handleFormChange}
                placeholder="Enter jar deposit"
              />
            </Form.Group>

            {/* Capsule Deposit */}
            <Form.Group controlId="formCapsuleDeposit">
              <Form.Label>Capsule Deposit</Form.Label>
              <Form.Control
                type="number"
                name="capsuleDeposit"
                value={formData.capsuleDeposit}
                onChange={handleFormChange}
                placeholder="Enter Capsule deposit"
              />
            </Form.Group>

            {/* Price Per Jar */}
            <Form.Group controlId="formPricePerJar">
              <Form.Label>Price Per Jar</Form.Label>
              <Form.Control
                type="number"
                name="pricePerJar"
                value={formData.pricePerJar}
                onChange={handleFormChange}
                placeholder="Enter price per jar"
                isInvalid={!!formErrors.pricePerJar}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.pricePerJar}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        show={showAddCustomerModal}
        onHide={handleCloseAddCustomerModal}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Name */}
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter name"
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Address */}
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Enter address"
                isInvalid={!!formErrors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.address}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Phone */}
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Enter phone"
                pattern="\d{10}"
                title="Phone number must be 10 digits"
                isInvalid={!!formErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Advance Paid */}
            <Form.Group controlId="formAdvancePaid">
              <Form.Label>Advance Paid</Form.Label>
              <Form.Control
                type="number"
                name="advancePaid"
                value={formData.advancePaid}
                onChange={handleFormChange}
                placeholder="Enter advance paid"
              />
            </Form.Group>

            {/* Jar Deposit */}
            <Form.Group controlId="formJarDeposit">
              <Form.Label>Jar Deposit</Form.Label>
              <Form.Control
                type="number"
                name="jarDeposit"
                value={formData.jarDeposit}
                onChange={handleFormChange}
                placeholder="Enter jar deposit"
              />
            </Form.Group>

            {/* Capsule Deposit */}
            <Form.Group controlId="formCapsuleDeposit">
              <Form.Label>Capsule Deposit</Form.Label>
              <Form.Control
                type="number"
                name="capsuleDeposit"
                value={formData.capsuleDeposit}
                onChange={handleFormChange}
                placeholder="Enter Capsule deposit"
              />
            </Form.Group>

            {/* Price Per Jar */}
            <Form.Group controlId="formPricePerJar">
              <Form.Label>Price Per Jar</Form.Label>
              <Form.Control
                type="number"
                name="pricePerJar"
                value={formData.pricePerJar}
                onChange={handleFormChange}
                placeholder="Enter price per jar"
                isInvalid={!!formErrors.pricePerJar}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.pricePerJar}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddCustomerModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddCustomer}>
            Add Customer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        show={showConfirmDelete}
        onHide={handleCloseConfirmDelete}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AllCustomers;


// import React, { useState, useEffect } from "react";
// import { Modal, Button, Table, Form, Alert, Container } from "react-bootstrap";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {
//   getAllCustomers,
//   deleteCustomer,
//   updateCustomer,
//   addCustomer,
// } from "../../Apis/Customer";

// const AllCustomers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [customerToDelete, setCustomerToDelete] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     advancePaid: "",
//     pricePerJar: "",
//     jarDeposit: "", // New field
//     capsuleDeposit: "", // New field
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [alert, setAlert] = useState({ message: "", variant: "" });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const result = await getAllCustomers();
//         if (result.success) {
//           setCustomers(result.customers);
//         } else {
//           setError(result.message);
//         }
//       } catch (err) {
//         setError("Error fetching customers");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name) errors.name = "Name is required";
//     if (!formData.address) errors.address = "Address is required";
//     if (!formData.phone) errors.phone = "Phone is required";
//     if (!/^\d{10}$/.test(formData.phone))
//       errors.phone = "Phone number must be 10 digits";
//     if (!formData.pricePerJar) errors.pricePerJar = "Price per jar is required";
//     if (formData.pricePerJar <= 0)
//       errors.pricePerJar = "Price per jar must be a positive number"; // Added validation
//     return errors;
//   };


//   const handleDelete = async () => {
//     if (customerToDelete) {
//       try {
//         const result = await deleteCustomer(customerToDelete._id);
//         if (result.success) {
//           setCustomers(
//             customers.filter(
//               (customer) => customer._id !== customerToDelete._id
//             )
//           );
//           setShowConfirmDelete(false);
//           setAlert({ message: result.message, variant: "success" });
//         } else {
//           setAlert({ message: result.message, variant: "danger" });
//         }
//       } catch (err) {
//         setAlert({ message: "Error deleting customer", variant: "danger" });
//       }
//     }
//   };

//   const handleEditClick = (customer) => {
//     setSelectedCustomer(customer);
//     setFormData({
//       name: customer.name,
//       address: customer.address,
//       phone: customer.phone,
//       advancePaid: customer.advancePaid,
//       jarDeposit: customer.jarDeposit,
//       capsuleDeposit: customer.capsuleDeposit,
//       pricePerJar: customer.pricePerJar,
//     });
//     setFormErrors({});
//     setShowEditModal(true);
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//     setAlert({ message: "", variant: "" });
//   };

//   const handleCloseAddCustomerModal = () => {
//     setShowAddCustomerModal(false);
//     setAlert({ message: "", variant: "" });
//   };

//   const handleCloseConfirmDelete = () => setShowConfirmDelete(false);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleUpdate = async () => {
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     if (selectedCustomer) {
//       try {
//         const result = await updateCustomer(
//           selectedCustomer._id,
//           formData.name,
//           formData.address,
//           formData.phone,
//           formData.advancePaid,
//           formData.jarDeposit,
//           formData.capsuleDeposit,
//           formData.pricePerJar
//         );
//         if (result.success) {
//           setCustomers(
//             customers.map((customer) =>
//               customer._id === selectedCustomer._id
//                 ? { ...customer, ...formData }
//                 : customer
//             )
//           );
//           handleCloseEditModal();
//           setAlert({ message: result.message, variant: "success" });
//         } else {
//           handleCloseEditModal();
//           setAlert({ message: result.message, variant: "danger" });
//         }
//       } catch (err) {
//         handleCloseEditModal();
//         setAlert({ message: "Error updating customer", variant: "danger" });
//       }
//     }
//   };

//   const handleAddCustomer = async () => {
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     try {
//       const result = await addCustomer(
//         formData.name,
//         formData.address,
//         formData.phone,
//         formData.advancePaid,
//         formData.jarDeposit,
//         formData.capsuleDeposit,
//         formData.pricePerJar
//       );
//       if (result.success) {
//         setCustomers([...customers, result.customer]);
//         handleCloseAddCustomerModal();
//         setAlert({ message: result.message, variant: "success" });
//       } else {
//         handleCloseAddCustomerModal();
//         setAlert({ message: result.message, variant: "danger" });
//       }
//     } catch (err) {
//       handleCloseAddCustomerModal();
//       setAlert({ message: "Error adding customer", variant: "danger" });
//     }
//   };

//   return (
//     <Container
//       fluid
//       className="p-3"
//       style={{
//         backgroundColor: "#343a40",
//         color: "#ffffff",
//         borderRadius: "8px",
//       }}
//     >
//       <h1 className="text-center mb-4">All Customers</h1>
//       <h5 className="text-center mb-4">Total Customers: {customers.length}</h5>
//       <div className="text-center mb-4">
//         <Button variant="success" onClick={() => setShowAddCustomerModal(true)}>
//           Add New Customer
//         </Button>
//       </div>
//       {loading && <p className="text-center">Loading...</p>}
//       {error && <p className="text-danger text-center">{error}</p>}
//       {alert.message && (
//         <Alert
//           variant={alert.variant}
//           onClose={() => setAlert({ message: "", variant: "" })}
//           dismissible
//         >
//           {alert.message}
//         </Alert>
//       )}
//       <div className="table-responsive">
//         <Table striped bordered hover variant="dark">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Address</th>
//               <th>Phone</th>
//               <th>Advance</th>
//               <th>Jar Deposit</th>
//               <th>Capsule Deposit</th>
//               <th>Price</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={customer._id} style={{ cursor: "pointer" }}>
//                 <td>{index + 1}</td>
//                 <td>{customer.name}</td>
//                 <td>{customer.address}</td>
//                 <td>{customer.phone}</td>
//                 <td>{customer.advancePaid}</td>
//                 <td>{customer.jarDeposit}</td>
//                 <td>{customer.capsuleDeposit || 'capsules'}</td>
//                 <td>{customer.pricePerJar}</td>
//                 <td>
//                   <FaEdit
//                     className="text-warning mx-2"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleEditClick(customer);
//                     }}
//                     style={{ cursor: "pointer" }}
//                   />
//                   <FaTrash
//                     className="text-danger mx-2"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setCustomerToDelete(customer);
//                       setShowConfirmDelete(true);
//                     }}
//                     style={{ cursor: "pointer" }}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       {/* Edit Modal */}
//       <Modal
//         show={showEditModal}
//         onHide={handleCloseEditModal}
//         backdrop="static"
//         keyboard={false}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Customer</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleFormChange}
//                 placeholder="Enter name"
//                 isInvalid={!!formErrors.name}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.name}
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId="formAddress">
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleFormChange}
//                 placeholder="Enter address"
//                 isInvalid={!!formErrors.address}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.address}
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId="formPhone">
//               <Form.Label>Phone</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleFormChange}
//                 placeholder="Enter phone"
//                 pattern="\d{10}"
//                 title="Phone number must be 10 digits"
//                 isInvalid={!!formErrors.phone}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.phone}
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId="formAdvancePaid">
//               <Form.Label>Advance Paid</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="advancePaid"
//                 value={formData.advancePaid}
//                 onChange={handleFormChange}
//                 placeholder="Enter advance paid"
//               />
//             </Form.Group>
//             <Form.Group controlId="formJarDeposit">
//               <Form.Label>Jar Deposit</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="jarDeposit"
//                 value={formData.jarDeposit}
//                 onChange={handleFormChange}
//                 placeholder="Enter jar deposit"
//               />
//             </Form.Group>
//             <Form.Group controlId="formCapsuleDeposit">
//               <Form.Label>Capsule Deposit</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="capsuleDeposit"
//                 value={formData.capsuleDeposit}
//                 onChange={handleFormChange}
//                 placeholder="Enter Capsule deposit"
//               />
//             </Form.Group>
//             <Form.Group controlId="formPricePerJar">
//               <Form.Label>Price Per Jar</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="pricePerJar"
//                 value={formData.pricePerJar}
//                 onChange={handleFormChange}
//                 placeholder="Enter price per jar"
//                 isInvalid={!!formErrors.pricePerJar} // Ensure this is correctly set
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.pricePerJar}
//               </Form.Control.Feedback>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseEditModal}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdate}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add Customer Modal */}
//       <Modal
//         show={showAddCustomerModal}
//         onHide={handleCloseAddCustomerModal}
//         backdrop="static"
//         keyboard={false}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Customer</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleFormChange}
//                 placeholder="Enter name"
//                 isInvalid={!!formErrors.name}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.name}
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId="formAddress">
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleFormChange}
//                 placeholder="Enter address"
//                 isInvalid={!!formErrors.address}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.address}
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId="formPhone">
//               <Form.Label>Phone</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleFormChange}
//                 placeholder="Enter phone"
//                 pattern="\d{10}"
//                 title="Phone number must be 10 digits"
//                 isInvalid={!!formErrors.phone}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.phone}
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group controlId="formAdvancePaid">
//               <Form.Label>Advance Paid</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="advancePaid"
//                 value={formData.advancePaid}
//                 onChange={handleFormChange}
//                 placeholder="Enter advance paid"
//               />
//             </Form.Group>
//             <Form.Group controlId="formJarDeposit">
//               <Form.Label>Jar Deposit</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="jarDeposit"
//                 value={formData.jarDeposit}
//                 onChange={handleFormChange}
//                 placeholder="Enter jar deposit"
//               />
//             </Form.Group>
//             <Form.Group controlId="formCapsuleDeposit">
//               <Form.Label>Capsule Deposit</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="capsuleDeposit"
//                 value={formData.capsuleDeposit}
//                 onChange={handleFormChange}
//                 placeholder="Enter Capsule deposit"
//               />
//             </Form.Group>
//             <Form.Group controlId="formPricePerJar">
//               <Form.Label>Price Per Jar</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="pricePerJar"
//                 value={formData.pricePerJar}
//                 onChange={handleFormChange}
//                 placeholder="Enter price per jar"
//                 isInvalid={!!formErrors.pricePerJar}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formErrors.pricePerJar}
//               </Form.Control.Feedback>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseAddCustomerModal}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleAddCustomer}>
//             Add Customer
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Confirm Delete Modal */}
//       <Modal
//         show={showConfirmDelete}
//         onHide={handleCloseConfirmDelete}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseConfirmDelete}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default AllCustomers;
