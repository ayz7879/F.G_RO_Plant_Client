import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import AdminRegister from "./components/Admin/AdminRegister";
import AdminLogin from "./components/Admin/AdminLogin";
import AllAdmins from "./components/Admin/AllAdmins";
import AddCustomer from "./components/Customer/AddCustomer";
import AllCustomers from "./components/Customer/AllCustomer";
import AddToCart from "./components/Cart/AddToCart";
import GetCart from "./components/Cart/GetCustomerCart";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import BottomBar from "./components/BottomBar/BottomBar";
import History from "./components/History/History";

const App = () => {
  const isLoggedIn = localStorage.getItem("token");
  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <div className="pt-2 mb-5 text-light bg-dark" style={{ height: 'auto', minHeight: "100vh" }}>
        <Routes>
          <Route path="/admin-register" element={<AdminRegister />} />{" "}
          <Route path="/admin-login" element={<AdminLogin />} />{" "}

          {/* Protected Routes */}
          <Route path="/all-admins" element={isLoggedIn ? <AllAdmins /> : <Navigate to="/admin-login" />} />
          <Route path="/add-customer" element={isLoggedIn ? <AddCustomer /> : <Navigate to="/admin-login" />} />
          <Route path="/all-customers" element={isLoggedIn ? <AllCustomers /> : <Navigate to="/admin-login" />} />
          <Route path="/add-to-cart" element={isLoggedIn ? <AddToCart /> : <Navigate to="/admin-login" />} />
          <Route path="/get-cart/:customerId" element={isLoggedIn ? <GetCart /> : <Navigate to="/admin-login" />} />
          <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/admin-login" />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/admin-login" />} />
        </Routes>
      </div>
      {isLoggedIn && <BottomBar />}
    </Router>
  );
};

export default App;
