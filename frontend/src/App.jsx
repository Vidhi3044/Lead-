import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import SpacesPage from "./pages/SpacesPage";
import ReservationPage from "./pages/ReservationPage";

import AdminDashboard from "./pages/AdminDashboard";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailsPage from "./pages/LeadDetailsPage";
import NewLeadPage from "./pages/NewLeadPage";
import AdminAuth from "./components/AdminAuth";

// Layout wrapper to apply client-specific CSS styles
function PublicLayout({ children }) {
  return <div className="public-app">{children}</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Portal Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/spaces" element={<PublicLayout><SpacesPage /></PublicLayout>} />
        <Route path="/reservation" element={<PublicLayout><ReservationPage /></PublicLayout>} />

        {/* Admin Portal Routes */}
        <Route
  path="/admin"
  element={
    <AdminAuth>
      <AdminDashboard />
    </AdminAuth>
  }
/>
        <Route
  path="/admin/leads"
  element={
    <AdminAuth>
      <LeadsPage />
    </AdminAuth>
  }
/>
        <Route
  path="/admin/leads/:id"
  element={
    <AdminAuth>
      <LeadDetailsPage />
    </AdminAuth>
  }
/>
        <Route
  path="/admin/new-lead"
  element={
    <AdminAuth>
      <NewLeadPage />
    </AdminAuth>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
