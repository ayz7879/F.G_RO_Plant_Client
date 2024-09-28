import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
  return (
    <Router>
      <Navbar />
      <div className="mt-2 text-light bg-dark" style={{marginBottom:"4.5rem"}}>
        <Routes>
          <Route path="/admin-register" element={<AdminRegister />} />{" "}
          <Route path="/admin-login" element={<AdminLogin />} />{" "}
          <Route path="/all-admins" element={<AllAdmins />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/all-customers" element={<AllCustomers />} />
          <Route path="/add-to-cart" element={<AddToCart />} />
          <Route path="/get-cart/:customerId" element={<GetCart />} />
          <Route path="/history" element={<History />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>  
      <BottomBar/>
    </Router>
  );
};

export default App;
