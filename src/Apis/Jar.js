import axios from "axios";

const BASE_URL = "https://f-g-ro-plant-api-1.onrender.com/api/jar";

// Add Jar
export const addJar = async (
  jarsGiven,
  jarsTaken = 0,
  customerPay = 0,
  totalAmount,
  pendingJars = 0,
  pendingPayment = 0,
  totalJarsGiven,
  totalJarsTaken
) => {
  try {
    const response = await axios.post(`${BASE_URL}/addJar`, {
      jarsGiven,
      jarsTaken,
      customerPay,
      totalAmount,
      pendingJars,
      pendingPayment,
      totalJarsGiven,
      totalJarsTaken,
    });
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};

// Get All Jars
export const getAllJars = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllJar`);
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};

// Get Jar by ID
export const getJarById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};

// Update Jar by ID
export const updateJarById = async (
  id,
  jarsGiven,
  jarsTaken = 0,
  customerPay = 0,
  totalAmount,
  pendingJars = 0,
  pendingPayment = 0,
  totalJarsGiven,
  totalJarsTaken
) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, {
      jarsGiven,
      jarsTaken,
      customerPay,
      totalAmount,
      pendingJars,
      pendingPayment,
      totalJarsGiven,
      totalJarsTaken,
    });
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};

// Delete Jar by ID
export const deleteJarById = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};
