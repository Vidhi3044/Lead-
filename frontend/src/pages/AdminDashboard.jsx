import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/adminDashboard.css";
import ThemeToggle from "../components/ThemeToggle";


function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReservations: 0,
    newLeads: 0,
    confirmed: 0,
    followUps: 0,
  });
  const [dueToday, setDueToday] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchDueToday();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        "/api/reservations/dashboard-stats"
      );

      setStats(response.data);
    } catch (error) {
      console.log("Dashboard stats fetch error:", error);
    }
  };
  const fetchDueToday = async () => {
  try {
    const response = await axios.get(
      "/api/reservations/all"
    );

    const today =
      new Date().toISOString().split("T")[0];

    const filtered =
      response.data.filter(
        (lead) =>
          lead.nextFollowUp &&
          lead.nextFollowUp.split("T")[0] ===
            today
      );

    setDueToday(filtered);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-dashboard">
      <div className="dashboard-header">
  <h1>Dashboard</h1>

 <ThemeToggle />
</div>

        {/* <div className="stats-container">
          <div className="stat-card">
            <h2>{stats.totalReservations}</h2>
            <p>Total Reservations</p>
          </div>

          <div className="stat-card">
            <h2>{stats.newLeads}</h2>
            <p>New Leads</p>
          </div>

          <div className="stat-card">
            <h2>{stats.confirmed}</h2>
            <p>Confirmed</p>
          </div>

          <div className="stat-card">
            <h2>{stats.followUps}</h2>
            <p>Follow Ups</p>
          </div>
        </div> */}
  <div className="dashboard-card">
  <h2>New Leads</h2>

  <p>
    {stats.newLeads} New Leads Waiting
  </p>

  <button
    className="dashboard-btn"
    onClick={() => navigate("/admin/leads")}
  >
    View All Leads
  </button>
</div>

<div className="dashboard-card">
  <h2>Due Today</h2>

  {dueToday.length > 0 ? (
    dueToday.map((lead) => (
      <div
        key={lead._id}
        className="due-today-item"
      >
        <div>
          <strong>
            {lead.fullName || "N/A"}
          </strong>

          <p>{lead.phone}</p>
        </div>

        <button
          className="dashboard-btn"
          onClick={() =>
            navigate(`/admin/leads/${lead._id}`)
          }
        >
          View
        </button>
      </div>
    ))
  ) : (
    <p>No Follow-Ups Due Today</p>
  )}
</div>

      </div>
    </div>
  );
}

export default AdminDashboard;