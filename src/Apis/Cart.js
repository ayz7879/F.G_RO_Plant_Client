import axios from "axios";

const BASE_URL = "https://f-g-ro-plant-api-1.onrender.com/api/cart";

// Add to Cart
export const addToCart = async (
  customerId,
  jarsGiven,
  jarsTaken,
  customerPay
) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, {
      customerId,
      jarsGiven,
      jarsTaken,
      customerPay,
    });
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};

// Get Customer Cart
export const customerCart = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/customer/${customerId}`);

    // Check if the response indicates success
    if (response.data.success) {
      return response.data;
    } else {
      return {
        message: response.data.message,
        success: false,
      };
    }
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};

// Update Cart Item
export const updateCartItem = async (
  customerId,
  itemId,
  jarsGiven,
  jarsTaken,
  customerPay,
  totalCustomerPaid,
  totalAmount,
  pendingJars,
  pendingPayment,
  totalJarsGiven,
  totalJarsTaken
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update/${customerId}/${itemId}`,
      {
        jarsGiven,
        jarsTaken,
        customerPay,
        totalCustomerPaid,
        totalAmount,
        pendingJars,
        pendingPayment,
        totalJarsGiven,
        totalJarsTaken,
      }
    );
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};

// Delete Cart Item
export const deleteCartItem = async (customerId, itemId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/remove/${customerId}/${itemId}`
    );
    return response.data;
  } catch (error) {
    return {
      message: error.response ? error.response.data.message : error.message,
      success: false,
    };
  }
};
