import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table, Pagination } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";

const History = () => {
  const [itemsWithCustomers, setItemsWithCustomers] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items to show per page


  const fetchAllCart = async () => {
    try {
      const response = await axios.get(
        "https://f-g-ro-plant-api-1.onrender.com/api/cart/customers"
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
    doc.text("F.G. RO Plant Child Water - Customer History", 105, 10, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 20);

    doc.autoTable({
      head: [["#", "Date", "Name", "Address", "Jars Given", "Jars Taken", "Capsules Given", "Capsules Taken", "Payment", "Phone"]],
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
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontStyle: "bold" },
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
      <Pagination className="justify-content-center mt-4">
        {[...Array(Math.ceil(filteredItems.length / itemsPerPage)).keys()].map(
          (pageNum) => (
            <Pagination.Item
              key={pageNum + 1}
              active={pageNum + 1 === currentPage}
              onClick={() => handlePageChange(pageNum + 1)}
            >
              {pageNum + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
    </div>
  );
};

export default History;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// import Table from "react-bootstrap/Table";

// const History = () => {
//   const [itemsWithCustomers, setItemsWithCustomers] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]); // To store filtered data
//   const [fromDate, setFromDate] = useState(""); // From Date state
//   const [toDate, setToDate] = useState(""); // To Date state

//   const fetchAllCart = async () => {
//     try {
//       const response = await axios.get(
//         "https://f-g-ro-plant-api-1.onrender.com/api/cart/customers"
//       );
//       const carts = response.data.carts;
//       const itemsWithCustomerDetails = carts.flatMap((cart) =>
//         cart.item.map((item) => ({
//           ...item,
//           customerId: cart.customerId,
//         }))
//       );

//       itemsWithCustomerDetails.sort(
//         (a, b) => new Date(b.date) - new Date(a.date)
//       );

//       setItemsWithCustomers(itemsWithCustomerDetails);
//       setFilteredItems(itemsWithCustomerDetails); // Set initial filtered data
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Filter items based on date range
//   const filterByDate = () => {
//     if (!fromDate && !toDate) {
//       setFilteredItems(itemsWithCustomers); // Show all items if no date is selected
//     } else {
//       const filtered = itemsWithCustomers.filter((item) => {
//         const itemDate = new Date(item.date).setHours(0, 0, 0, 0); // Normalize date
//         const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
//         const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

//         if (from && to) {
//           return itemDate >= from && itemDate <= to;
//         } else if (from) {
//           return itemDate >= from;
//         } else if (to) {
//           return itemDate <= to;
//         }
//         return true;
//       });

//       setFilteredItems(filtered);
//     }
//   };

//   useEffect(() => {
//     fetchAllCart();
//   }, []);

//   // Trigger the filter whenever fromDate or toDate changes
//   useEffect(() => {
//     filterByDate();
//   }, [fromDate, toDate, itemsWithCustomers]); // Run the filter whenever dates or data changes

//   return (
//     <div className="container">
//       <h1>History</h1>

//       {/* Date Range Filters */}
//       <div className="row mb-4">
//         <div className="col">
//           <label>From Date:</label>
//           <input
//             type="date"
//             className="form-control"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div className="col">
//           <label>To Date:</label>
//           <input
//             type="date"
//             className="form-control"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="table-responsive">
//         <Table striped bordered hover variant="dark" responsive>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Name</th>
//               <th>Address</th>
//               <th>Jars Given</th>
//               <th>Jars Taken</th>
//               <th>Capsules Given</th>
//               <th>Capsules Taken</th>
//               <th>Payment</th>
//               <th>Phone</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.length > 0 ? (
//               filteredItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{new Date(item.date).toLocaleDateString()}</td>
//                   <td>{item.customerId.name}</td>
//                   <td>{item.customerId.address}</td>
//                   <td>{item.jarsGiven}</td>
//                   <td>{item.jarsTaken}</td>
//                   <td>{item.capsulesGiven}</td>
//                   <td>{item.capsulesTaken}</td>
//                   <td>{item.customerPay}</td>
//                   <td>{item.customerId.phone}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6">No records found</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default History;
