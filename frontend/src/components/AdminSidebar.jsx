import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.css";


function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("adminVerified");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`mobile-menu-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`admin-sidebar ${
          isOpen ? "open" : ""
        }`}
      >
        <h2 className="sidebar-logo">
          
        </h2>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active-link"
                : "sidebar-link"
            }
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/leads"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active-link"
                : "sidebar-link"
            }
            onClick={() => setIsOpen(false)}
          >
            Leads
          </NavLink>

          <a
            href="/reservation"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
            onClick={() => setIsOpen(false)}
          >
            New Lead
          </a>


          <button
            className="sidebar-link logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}

export default AdminSidebar;
