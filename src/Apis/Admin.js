import axios from "axios";

const API_BASE_URL = "https://f-g-ro-plant-api-1.onrender.com/api/admin";
// const API_BASE_URL_LOCAL = "http://localhost:1000//api/admin";

// Admin Register API using axios
export const adminRegister = async (name, username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      name,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Something went wrong." };
  }
};

// Admin Login API using axios
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Something went wrong." };
  }
};

// Get All Admins API using axios
export const getAllAdmins = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllAdmin`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Something went wrong." };
  }
};
