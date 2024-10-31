import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { customerCart, updateCartItem, deleteCartItem } from "../../Apis/Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CustomerCartPage = () => {
  const { customerId } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({
    capsulesGiven: 0, capsulesTaken: 0,
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  useEffect(() => {
    if (customerId) {
      fetchCustomerCart();
    }
  }, [customerId]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  const handleEditClick = (item) => {
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

  const handleDeleteClick = (itemId) => {
    setSelectedItem(itemId);
    setShowDeleteModal(true);
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


          const totalCapsulesGiven = previousEntry.totalCapsulesGiven - previousEntry.capsulesGiven + editForm.capsulesGiven

          const totalJarsTaken =
            previousEntry.totalJarsTaken -
            previousEntry.jarsTaken +
            editForm.jarsTaken;

          const totalCapsulesTaken = previousEntry.totalCapsulesTaken - previousEntry.capsulesTaken + editForm.capsulesTaken

          const pendingJars = totalJarsGiven - totalJarsTaken;
          const pendingCapsules = totalCapsulesGiven - totalCapsulesTaken;

          const totalGiven = totalCapsulesGiven + totalJarsGiven
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

          if (updateResponse.success) {
            setCartItems((prevItems) =>
              prevItems.map((item) =>
                item._id === selectedItem._id
                  ? {
                    ...item,
                    ...editForm,
                    totalAmount,
                    totalCustomerPaid,
                    pendingJars,
                    pendingCapsules,
                    pendingPayment,
                  }
                  : item
              )
            );
            setShowEditModal(false);
            fetchCustomerCart();
          } else {
            setError(updateResponse.message);
          }
        } else {
          setError("Item not found.");
        }
      } else {
        setError("Failed to fetch previous entry details.");
      }
    } catch (error) {
      setError("Failed to update item. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCartItem(customerId, selectedItem);
      if (response.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== selectedItem)
        );
        setShowDeleteModal(false);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to delete item. Please try again.");
    }
  };

  const filteredCartItems = cartItems.filter((item) => {
    const itemDate = new Date(item.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && to) {
      return itemDate >= from && itemDate <= to;
    } else if (from) {
      return itemDate >= from;
    } else if (to) {
      return itemDate <= to;
    } else {
      return true;
    }
  });

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 160, 133); // Brand color (customize as needed)
    doc.text("F.G. Ro Plan - Child Water", 105, 10, null, null, "center");


    // Add Document Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Reset text color to black
    doc.text("Customer Bill", 105, 20, null, null, "center");
    // Add customer details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal"); // Reset font to normal

    doc.text(`Name: ${customerDetails.name}`, 10, 25);
    doc.text(`Phone: ${customerDetails.phone}`, 10, 35);
    doc.text(`Deposit Jar: ${customerDetails.jarDeposit}`, 10, 45);
    doc.text(`Deposit Capsule: ${customerDetails.jarDeposit}`, 10, 55);
    doc.text(`Price Per Capsule or Jar : ${customerDetails.pricePerJar}/-`, 10, 65);

    // Add a separator line
    doc.line(10, 70, 200, 70); // Added a line for separation

    // Add summary details
    if (cartItems.length > 0) {
      doc.setFontSize(14);
      doc.text("Summary", 10, 80);
      doc.setFontSize(12);

      // Added summary details with spacing
      doc.text(`Total Jars Given: ${cartItems[0].totalJarsGiven}`, 10, 90);
      doc.text(`Total Jars Taken: ${cartItems[0].totalJarsTaken}`, 10, 100);
      doc.text(`Pending Jars: ${cartItems[0].pendingJars}`, 10, 110);

      doc.text(`Total Capsules Given: ${cartItems[0].totalCapsulesGiven}`, 10, 120);
      doc.text(`Total Capsules Taken: ${cartItems[0].totalCapsulesTaken}`, 10, 130);
      doc.text(`Pending Capsules: ${cartItems[0].pendingCapsules}`, 10, 140);

      doc.text(`Total Amount: ${cartItems[0].totalAmount}/-`, 10, 150);
      doc.text(
        `Total Customer Paid: ${cartItems[0].totalCustomerPaid}/-`,
        10,
        160
      );
      doc.text(`Pending Payment: ${cartItems[0].pendingPayment}/-`, 10, 170);

      doc.line(10, 180, 200, 180); // Added a line for separation

    }



    // Add table
    doc.autoTable({
      head: [
        [
          "#",
          "Date & Time",
          "Jars Given",
          "Capsule Given",
          "Jars Taken",
          "Capsule Taken",
          "Amount Paid",
          "Pending Payment",
        ],
      ],
      body: filteredCartItems.map((item, index) => [
        index + 1,
        formatDateTime(item.date),
        item.jarsGiven,
        item.capsulesGiven,
        item.jarsTaken,
        item.capsulesTaken,
        `${item.customerPay}/-`,
        `${item.pendingPayment}/-`,
      ]),
      startY: 190, // Adjusted startY to avoid overlapping with the summary
      theme: "grid", // Adds grid lines to the table
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Custom header color
        textColor: [255, 255, 255], // White text color for header
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [245, 245, 245], // Light grey background for rows
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255], // White background for alternate rows
      },
    });

    // // Add footer
    // doc.setFontSize(10);
    // doc.text(
    //   `Generated on: ${new Date().toLocaleString()}`,
    //   105,
    //   doc.internal.pageSize.height - 10
    // );

    // doc.save("customer_cart.pdf");

    // Add footer with a centered alignment
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      105, // Centered horizontally
      doc.internal.pageSize.height - 10,
      null, // No specific alignment needed
      null,
      "center" // Center text
    );

    doc.save("customer_cart.pdf");
  };

  return (
    <div className="container bg-dark text-light p-4 rounded">
      <h2 className="text-center">Customer Report</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          {customerDetails && (
            <div className="customer-details mt-4">
              <p>
                <strong>Name:</strong> {customerDetails.name}
              </p>
              <p>
                <strong>Phone:</strong> {customerDetails.phone}
              </p>
              <p>
                <strong>Address:</strong> {customerDetails.address}
              </p>
              <p>
                <strong>Deposit Jars :</strong> {customerDetails.jarDeposit}
              </p>
              <p>

                <strong>Deposit Capsules :</strong> {customerDetails.capsuleDeposit}

              </p>
              <p>
                <strong>Price Per Capsule or Jar : </strong> ₹{customerDetails.pricePerJar}
              </p>

              {cartItems.length > 0 && (
                <div className="row mt-4 text-center">
                  <div className="col-6 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Total Jars Given:</strong>{" "}
                      {cartItems[0].totalJarsGiven}
                    </div>
                  </div>
                  <div className="col-6 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Total Jars Taken:</strong>{" "}
                      {cartItems[0].totalJarsTaken}
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Pending Jars:</strong> {cartItems[0].pendingJars}
                    </div>
                  </div>

                  <div className="col-6 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Total Capsules Given :</strong>{" "}
                      {cartItems[0].totalCapsulesGiven}
                    </div>
                  </div>

                  <div className="col-6 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Total Capsules Taken :</strong>{" "}
                      {cartItems[0].totalCapsulesTaken}
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Pending Capsules :</strong> {cartItems[0].pendingCapsules}
                    </div>
                  </div>


                  <div className="col-6 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Total Payment Count :</strong> ₹{cartItems[0].totalAmount}
                    </div>
                  </div>
                  <div className="col-6 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Total Customer Paid :</strong> ₹
                      {cartItems[0].totalCustomerPaid}
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mb-3">
                    <div className="bg-secondary p-3 rounded">
                      <strong>Pending Payment:</strong> ₹
                      {cartItems[0].pendingPayment}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="date-filter mt-4">
            <h4>Filter by Date</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="fromDate">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="toDate">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button variant="danger" className="mt-3 w-100" onClick={downloadPDF}>
            Download PDF
          </Button>
          {filteredCartItems.length > 0 ? (
            <div className="cart-items mt-4">
              <h4>Customer Entries</h4>
              <div className="table-responsive">
                <table
                  className="table table-dark table-bordered table-hover"
                  id="cart-table"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date & Time</th>
                      <th>Jars Given</th>
                      <th>Jars Taken</th>
                      <th>Capsules Given</th>
                      <th>Capsules Taken</th>

                      <th>Amount Paid</th>
                      <th>Pending Jars</th>
                      <th>Pending Capsules</th>
                      <th>Pending Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCartItems.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{formatDateTime(item.date)}</td>
                        <td>{item.jarsGiven}</td>
                        <td>{item.jarsTaken}</td>
                        <td>{item.capsulesGiven}</td>
                        <td>{item.capsulesTaken}</td>
                        <td>₹{item.customerPay}</td>
                        <td>{item.pendingJars}</td>
                        <td>{item.pendingCapsules}</td>
                        <td>₹{item.pendingPayment}</td>
                        <td>
                          <FaEdit
                            className="text-warning mx-2"
                            onClick={() => handleEditClick(item)}
                            style={{ cursor: "pointer" }}
                          />
                          <FaTrash
                            className="text-danger mx-2"
                            onClick={() => handleDeleteClick(item._id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>No entries found.</p>
          )}
        </>
      )}

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
    </div>
  );
};

export default CustomerCartPage;
