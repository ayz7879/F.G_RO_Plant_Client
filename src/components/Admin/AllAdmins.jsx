import React, { useEffect, useState } from "react";
import { getAllAdmins } from "../../Apis/Admin"; // Import the API function

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]); // State to store the list of admins
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error messages

  // Fetch the list of admins when the component loads
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const result = await getAllAdmins(); // Call the API
        if (result.success) {
          setAdmins(result.admins); // Update the state with the list of admins
        } else {
          setError(result.message); // Set the error message if not successful
        }
      } catch (err) {
        setError("Failed to fetch admins");
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      className="d-flex justify-content-center align-items-center bg-dark text-white"
    >
      <div className="w-75">
        <h1 className="text-center mb-4">All Admins</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <table className="table table-dark table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>#</th> {/* New column for count */}
                <th>Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <tr key={admin._id}>
                    <td>{index + 1}</td> {/* Show the count starting from 1 */}
                    <td>{admin.name}</td>
                    <td>{admin.username}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No Admins Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllAdmins;
