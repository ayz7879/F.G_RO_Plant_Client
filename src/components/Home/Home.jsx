import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [todayStats, setTodayStats] = useState({
    jarsGiven: 0,
    jarsTaken: 0,
    capsulesGiven: 0,
    capsulesTaken: 0, customerPay: 0
  });

  const [monthStats, setMonthStats] = useState({
    jarsGiven: 0,
    jarsTaken: 0,
    capsulesGiven: 0,
    capsulesTaken: 0, customerPay: 0
  });

  const [customRangeStats, setCustomRangeStats] = useState({
    jarsGiven: 0,
    jarsTaken: 0,
    capsulesGiven: 0,
    capsulesTaken: 0, customerPay: 0
  });

  const [dateFilter, setDateFilter] = useState({
    fromDate: "",
    toDate: "",
  });

  // Fetch stats
  const fetchStats = () => {
    const params = {
      startDate: dateFilter.fromDate,
      endDate: dateFilter.toDate,
    };

    axios
      .get("https://f-g-ro-plant-api-1.onrender.com/api/cart/for/dashbord", { params })
      // .get("http://localhost:1000/api/cart/for/dashbord", { params })
      .then((response) => {
        const { today, thisMonth, customRange } = response.data.stats;

        setTodayStats({
          jarsGiven: today.jarsGiven || 0,
          jarsTaken: today.jarsTaken || 0,
          capsulesGiven: today.capsulesGiven || 0,
          capsulesTaken: today.capsulesTaken || 0,
          customerPay: today.customerPay || 0
        });

        setMonthStats({
          jarsGiven: thisMonth.jarsGiven || 0,
          jarsTaken: thisMonth.jarsTaken || 0,
          capsulesGiven: thisMonth.capsulesGiven || 0,
          capsulesTaken: thisMonth.capsulesTaken || 0,
          customerPay: thisMonth.customerPay || 0
        });

        setCustomRangeStats({
          jarsGiven: customRange.jarsGiven || 0,
          jarsTaken: customRange.jarsTaken || 0,
          capsulesGiven: customRange.capsulesGiven || 0,
          capsulesTaken: customRange.capsulesTaken || 0,
          customerPay: customRange.customerPay || 0
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Fetch stats on load and when dateFilter changes
  useEffect(() => {
    fetchStats();
  }, [dateFilter]);

  // Handle date filter changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container pb-5">
      <h2 className="mb-4">Today's Data</h2>
      <div className="row">
        <DataCard title="Jars" given={todayStats.jarsGiven} taken={todayStats.jarsTaken} />
        <DataCard title="Capsules" given={todayStats.capsulesGiven} taken={todayStats.capsulesTaken} />
        <PaymentCart title="Payment Resive" customerPay={todayStats.customerPay || 0} />
      </div>

      <h2 className="mb-4">This Month's Data</h2>
      <div className="row">
        <DataCard title="Jars" given={monthStats.jarsGiven} taken={monthStats.jarsTaken} />
        <DataCard title="Capsules" given={monthStats.capsulesGiven} taken={monthStats.capsulesTaken} />
        <PaymentCart title="Payment Resive" customerPay={monthStats.customerPay || 0} />

      </div>

      <h2 className="mb-4">Filter By Date</h2>
      <div className="row mb-4">
        <div className="col">
          <label>From Date:</label>
          <input type="date" className="form-control" name="fromDate" value={dateFilter.fromDate} onChange={handleDateChange} />
        </div>
        <div className="col">
          <label>To Date:</label>
          <input type="date" className="form-control" name="toDate" value={dateFilter.toDate} onChange={handleDateChange} />
        </div>
      </div>

      <h2 className="mb-4">Custom Range Data</h2>
      <div className="row">
        <DataCard title="Jars" given={customRangeStats.jarsGiven} taken={customRangeStats.jarsTaken} />
        <DataCard title="Capsules" given={customRangeStats.capsulesGiven} taken={customRangeStats.capsulesTaken} />
        <PaymentCart title="Payment Resive" customerPay={customRangeStats.customerPay || 0} />

      </div>
    </div>
  );
};

// Card Component
const DataCard = ({ title, given, taken }) => (
  <div className="col-md-6 mb-4">
    <div className="card p-3 text-center">
      <h5>{title}</h5>
      <div className="d-flex justify-content-around align-items-center">
        <div className="text-center" style={{ flex: 1 }}>
          <h6>Given</h6>
          <p className="fs-4">{given}</p>
        </div>
        <div className="vr mx-3" style={{ height: "50px", borderColor: "#ddd" }}></div>
        <div className="text-center" style={{ flex: 1 }}>
          <h6>Taken</h6>
          <p className="fs-4">{taken}</p>
        </div>
      </div>

    </div>
  </div>
);
const PaymentCart = ({ title, customerPay }) => (
  <div className="col-md-6 mb-4">
    <div className="card p-3 text-center">
      <h5>{title}</h5>
      <div className="text-center" style={{ flex: 1 }}>
        <p className="fs-4">{customerPay}</p>
      </div>
      {/* <div className="d-flex justify-content-around align-items-center">
      </div> */}

    </div>
  </div>
);

export default Home;


