import axios from "axios";

const API_BASE_URL = "https://f-g-ro-plant-api-1.onrender.com/api/customer";
// const API_BASE_URL_LOCAL = "http://localhost:1000/api/customer";

// Add a new customer
export const addCustomer = async (
  name,
  address,
  phone,
  advancePaid,
  jarDeposit,
  capsuleDeposit,
  pricePerJar
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addCustomer`, {
      name,
      address,
      phone,
      advancePaid,
      jarDeposit,
      capsuleDeposit,
      pricePerJar,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error adding customer" };
  }
};

// Get all customers
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllCustomer`);
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error fetching customers" };
  }
};

// Update a customer
export const updateCustomer = async (
  id,
  name,
  address,
  phone,
  advancePaid,
  jarDeposit,
  capsuleDeposit,
  pricePerJar
) => {
  try {


    const response = await axios.put(`${API_BASE_URL}/update/${id}`, {
      name,
      address,
      phone,
      advancePaid,
      jarDeposit,
      capsuleDeposit,
      pricePerJar,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error updating customer" };
  }
};

// Delete a customer
export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error deleting customer" };
  }
};
