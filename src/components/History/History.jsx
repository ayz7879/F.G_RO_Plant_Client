import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Pagination } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { customerCart, deleteCartItem, updateCartItem } from "../../Apis/Cart";

const History = () => {
  const username = localStorage.getItem("username");
  const validUsernames = ["htg", "ls", "boldrunner"];
  const lowerCaseUsername = username ? username.toLowerCase() : "";
  const isValidUser = validUsernames.includes(lowerCaseUsername);
  const [itemsWithCustomers, setItemsWithCustomers] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items to show per page
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({
    capsulesGiven: 0,
    capsulesTaken: 0,
    jarsGiven: 0,
    jarsTaken: 0,
    customerPay: 0,
    totalCustomerPaid: 0,
    totalAmount: 0,
    pendingJars: 0,
    pendingPayment: 0,
    totalJarsGiven: 0,
    totalJarsTaken: 0,
  });
  // a.y
  const fetchCustomerCart = async () => {
    try {
      setLoading(true);
      const response = await customerCart(customerId);
      if (response.success) {
        setCustomerDetails(response.customer);
        const sortedCart = response.cart.item.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setCartItems(sortedCart);
      } else {
        setError("Error fetching cart details: " + response.message);
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // a.y
  useEffect(() => {
    if (customerId) {
      fetchCustomerCart();
    }
  }, [customerId]);

  const fetchAllCart = async () => {
    try {
      const response = await axios.get(
        "https://f-g-ro-plant-api-1.onrender.com/api/cart/customers"
        // "http://localhost:1000/api/cart/customers"
      );
      const carts = response.data.carts;
      const itemsWithCustomerDetails = carts.flatMap((cart) =>
        cart.item.map((item) => ({
          ...item,
          customerId: cart.customerId,
        }))
      );

      itemsWithCustomerDetails.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setItemsWithCustomers(itemsWithCustomerDetails);
      setFilteredItems(itemsWithCustomerDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterByDate = () => {
    if (!fromDate && !toDate) {
      setFilteredItems(itemsWithCustomers);
    } else {
      const filtered = itemsWithCustomers.filter((item) => {
        const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
        const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

        if (from && to) {
          return itemDate >= from && itemDate <= to;
        } else if (from) {
          return itemDate >= from;
        } else if (to) {
          return itemDate <= to;
        }
        return true;
      });

      setFilteredItems(filtered);
      setCurrentPage(1); // Reset to first page on filter
    }
  };

  useEffect(() => {
    fetchAllCart();
  }, []);

  useEffect(() => {
    filterByDate();
  }, [fromDate, toDate, itemsWithCustomers]);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "F.G. RO Plant Child Water - Customer History",
      105,
      10,
      null,
      null,
      "center"
    );
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 20);

    doc.autoTable({
      head: [
        [
          "#",
          "Date",
          "Name",
          "Address",
          "Jars Given",
          "Jars Taken",
          "Capsules Given",
          "Capsules Taken",
          "Payment",
          "Phone",
        ],
      ],
      body: filteredItems.map((item, index) => [
        index + 1,
        new Date(item.date).toLocaleDateString(),
        item.customerId.name,
        item.customerId.address,
        item.jarsGiven,
        item.jarsTaken,
        item.capsulesGiven,
        item.capsulesTaken,
        `${item.customerPay}/-`,
        item.customerId.phone,
      ]),
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      startY: 30,
    });

    doc.save("customer_history.pdf");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // delete a.y
  const handleDeleteClick = (itemId, customerId) => {
    setCustomerId(customerId);
    setSelectedItem(itemId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCartItem(customerId, selectedItem);
      if (response.success) {
        fetchAllCart();
        alert("SuccessFully Updated");
        setShowDeleteModal(false);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Failed to delete item. Please try again.");
    }
  };

  // edit a.y
  const handleEditClick = (item, customerId) => {
    setCustomerId(customerId);
    setSelectedItem(item);
    setEditForm({
      jarsGiven: item.jarsGiven,
      capsulesGiven: item.capsulesGiven,
      capsulesTaken: item.capsulesTaken,
      jarsTaken: item.jarsTaken,
      customerPay: item.customerPay,
      totalCustomerPaid: item.totalCustomerPaid,
      totalAmount: item.totalAmount,
      pendingJars: item.pendingJars,
      pendingPayment: item.pendingPayment,
      totalJarsGiven: item.totalJarsGiven,
      totalJarsTaken: item.totalJarsTaken,
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await customerCart(customerId);
      if (response.success) {
        const previousEntry = response.cart.item.find(
          (entry) => entry._id === selectedItem._id
        );
        if (previousEntry) {
          const totalJarsGiven =
            previousEntry.totalJarsGiven -
            previousEntry.jarsGiven +
            editForm.jarsGiven;

          const totalCapsulesGiven =
            previousEntry.totalCapsulesGiven -
            previousEntry.capsulesGiven +
            editForm.capsulesGiven;

          const totalJarsTaken =
            previousEntry.totalJarsTaken -
            previousEntry.jarsTaken +
            editForm.jarsTaken;

          const totalCapsulesTaken =
            previousEntry.totalCapsulesTaken -
            previousEntry.capsulesTaken +
            editForm.capsulesTaken;

          const pendingJars = totalJarsGiven - totalJarsTaken;
          const pendingCapsules = totalCapsulesGiven - totalCapsulesTaken;

          const totalGiven = totalCapsulesGiven + totalJarsGiven;
          const totalAmount = totalGiven * customerDetails.pricePerJar;

          const totalCustomerPaid =
            previousEntry.totalCustomerPaid -
            previousEntry.customerPay +
            editForm.customerPay;

          const pendingPayment = totalAmount - totalCustomerPaid;

          const updateResponse = await updateCartItem(
            customerId,
            selectedItem._id,
            editForm.jarsGiven,
            editForm.jarsTaken,
            editForm.customerPay,
            totalCustomerPaid,
            totalAmount,
            pendingJars,
            pendingPayment,
            totalJarsGiven,
            totalJarsTaken,
            editForm.capsulesGiven,
            editForm.capsulesTaken,
            totalCapsulesGiven,
            totalCapsulesTaken,
            pendingCapsules
          );
          console.log(updateResponse);
          if (updateResponse.success) {
            fetchAllCart();
            setShowEditModal(false);
            alert("Successfullt Updated");
          } else {
            alert(updateResponse.message);
          }
        } else {
          alert("Item not found.");
        }
      } else {
        alert("Failed to fetch previous entry details.");
      }
    } catch (error) {
      alert("Failed to update item. Please try again.");
    }
  };
  //a.y
  return (
    <div className="container">
      <h1>History</h1>

      {/* Date Range Filters */}
      <div className="row mb-4">
        <div className="col">
          <label>From Date:</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col">
          <label>To Date:</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Download PDF Button */}
      <Button onClick={downloadPDF} variant="primary" className="mb-3">
        Download PDF
      </Button>

      <div className="table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Address</th>
              <th>Jars Given</th>
              <th>Jars Taken</th>
              <th>Capsules Given</th>
              <th>Capsules Taken</th>
              <th>Payment</th>
              <th>Phone</th>
              {isValidUser && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.customerId.name}</td>
                  <td>{item.customerId.address}</td>
                  <td>{item.jarsGiven}</td>
                  <td>{item.jarsTaken}</td>
                  <td>{item.capsulesGiven}</td>
                  <td>{item.capsulesTaken}</td>
                  <td>{item.customerPay}</td>
                  <td>{item.customerId.phone}</td>
                  {isValidUser && (
                    <td>
                      <FaEdit
                        className="text-warning mx-2"
                        onClick={() =>
                          handleEditClick(item, item.customerId._id)
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <FaTrash
                        className="text-danger mx-2"
                        onClick={() =>
                          handleDeleteClick(item._id, item.customerId._id)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No records found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div>
        <div className="overflow-auto">
          <Pagination className="d-flex justify-content-start mt-4">
            {[
              ...Array(Math.ceil(filteredItems.length / itemsPerPage)).keys(),
            ].map((pageNum) => (
              <Pagination.Item
                key={pageNum + 1}
                active={pageNum + 1 === currentPage}
                onClick={() => handlePageChange(pageNum + 1)}
              >
                {pageNum + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Cart Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="jarsGiven">Jars Given</label>
              <input
                type="number"
                className="form-control"
                id="jarsGiven"
                value={editForm.jarsGiven}
                onChange={(e) =>
                  setEditForm({ ...editForm, jarsGiven: +e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="jarsGiven">Capsules Given</label>
              <input
                type="number"
                className="form-control"
                id="capsulesGiven"
                value={editForm.capsulesGiven}
                onChange={(e) =>
                  setEditForm({ ...editForm, capsulesGiven: +e.target.value })
                }
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="jarsTaken">Jars Taken</label>
              <input
                type="number"
                className="form-control"
                id="jarsTaken"
                value={editForm.jarsTaken}
                onChange={(e) =>
                  setEditForm({ ...editForm, jarsTaken: +e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="jarsTaken">Capsules Taken</label>
              <input
                type="number"
                className="form-control"
                id="capsulesTaken"
                value={editForm.capsulesTaken}
                onChange={(e) =>
                  setEditForm({ ...editForm, capsulesTaken: +e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="customerPay">Amount Paid</label>
              <input
                type="number"
                className="form-control"
                id="customerPay"
                value={editForm.customerPay}
                onChange={(e) =>
                  setEditForm({ ...editForm, customerPay: +e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="totalAmount">Total Amount</label>
              <input
                type="number"
                className="form-control"
                id="totalAmount"
                value={editForm.totalAmount}
                readOnly
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="pendingJars">Pending Jars</label>
              <input
                type="number"
                className="form-control"
                id="pendingJars"
                value={editForm.pendingJars}
                readOnly
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="pendingPayment">Pending Payment</label>
              <input
                type="number"
                className="form-control"
                id="pendingPayment"
                value={editForm.pendingPayment}
                readOnly
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="totalJarsGiven">Total Jars Given</label>
              <input
                type="number"
                className="form-control"
                id="totalJarsGiven"
                value={editForm.totalJarsGiven}
                readOnly
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="totalJarsTaken">Total Jars Taken</label>
              <input
                type="number"
                className="form-control"
                id="totalJarsTaken"
                value={editForm.totalJarsTaken}
                readOnly
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="totalJarsTaken">Total customer Paid</label>
              <input
                type="number"
                className="form-control"
                id="totalCustomerPaid"
                value={editForm.totalCustomerPaid}
                readOnly
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default History;
