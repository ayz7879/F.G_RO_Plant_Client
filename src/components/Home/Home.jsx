import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Home = () => {
  const [todayStats, setTodayStats] = useState({
    totalJarsGivenToday: 0,
    totalJarsTakenToday: 0,
    totalCustomerPayToday: 0, // Added today pay stats
  });

  const [monthStats, setMonthStats] = useState({
    totalJarsGivenMonth: 0,
    totalJarsTakenMonth: 0,
    totalCustomerPayMonth: 0, // Added month pay stats
  });

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("https://f-g-ro-plant-api-1.onrender.com/api/cart/customers")
      .then((response) => {
        const carts = response.data.carts;

        // Calculate today's and this month's stats
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));

        let todayJarsGiven = 0;
        let todayJarsTaken = 0;
        let todayCustomerPay = 0; // Variable to store today's customer pay

        let monthJarsGiven = 0;
        let monthJarsTaken = 0;
        let monthCustomerPay = 0; // Variable to store this month's customer pay

        carts.forEach((cart) => {
          cart.item.forEach((entry) => {
            const entryDate = new Date(entry.date);

            // Calculate today's stats
            if (entryDate.toDateString() === startOfToday.toDateString()) {
              todayJarsGiven += entry.jarsGiven;
              todayJarsTaken += entry.jarsTaken;
              todayCustomerPay += entry.customerPay || 0; // Calculate today's pay
            }

            // Calculate this month's stats
            if (entryDate >= startOfMonth) {
              monthJarsGiven += entry.jarsGiven;
              monthJarsTaken += entry.jarsTaken;
              monthCustomerPay += entry.customerPay || 0; // Calculate this month's pay
            }
          });
        });

        // Set the state for today's and this month's stats
        setTodayStats({
          totalJarsGivenToday: todayJarsGiven,
          totalJarsTakenToday: todayJarsTaken,
          totalCustomerPayToday: todayCustomerPay, // Update today's pay
        });

        setMonthStats({
          totalJarsGivenMonth: monthJarsGiven,
          totalJarsTakenMonth: monthJarsTaken,
          totalCustomerPayMonth: monthCustomerPay, // Update this month's pay
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="container">
      {/* Section for Today's Data */}
      <h2 className="mb-4">Today's Data</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card text-center p-3">
            <h5>Jars Given</h5>
            <p className="fs-4">{todayStats.totalJarsGivenToday}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card  text-center p-3">
            <h5>Jars Taken</h5>
            <p className="fs-4">{todayStats.totalJarsTakenToday}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card  text-center p-3">
            <h5>Payment</h5>
            <p className="fs-4">₹{todayStats.totalCustomerPayToday}</p>
          </div>
        </div>
      </div>

      {/* Section for This Month's Data */}
      <h2 className="mb-4">This Month's Data</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card  text-center p-3">
            <h5>Jars Given</h5>
            <p className="fs-4">{monthStats.totalJarsGivenMonth}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card  text-center p-3">
            <h5>Jars Taken</h5>
            <p className="fs-4">{monthStats.totalJarsTakenMonth}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card  text-center p-3">
            <h5>Payment</h5>
            <p className="fs-4">₹{monthStats.totalCustomerPayMonth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
