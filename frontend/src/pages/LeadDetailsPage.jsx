import { useEffect, useState } from "react";
import { useParams,useNavigate, } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/leadDetailsPage.css";
import Swal from "sweetalert2";

function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState("");

  const [followUpNote, setFollowUpNote] =
    useState("");

  const [nextFollowUp, setNextFollowUp] =
    useState("");

    const [isEditing, setIsEditing] =
  useState(false);

const [editData, setEditData] =
  useState({});

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await axios.get(
        `/api/reservations/${id}`
      );

      setLead(response.data);
      setEditData(response.data);
      setStatus(response.data.status || "New Lead");

      if (response.data.nextFollowUp) {
        setNextFollowUp(
          response.data.nextFollowUp
            .split("T")[0]
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditChange = (e) => {
  setEditData({
    ...editData,
    [e.target.name]: e.target.value,
  });
};

const saveReservationChanges = async () => {
  try {
    // Exclude immutable fields from the request body to prevent database write errors
    const { _id, createdAt, updatedAt, __v, ...updatePayload } = editData;

    await axios.put(
      `/api/reservations/${id}`,
      updatePayload
    );

    Swal.fire({
      icon: "success",
      title: "Changes Saved",
      text: "Reservation details updated successfully.",
      confirmButtonColor: "#d4af37",
    });

    setIsEditing(false);

    fetchLead();
  } catch (error) {
    console.log(error);

    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Could not save changes.",
      confirmButtonColor: "#d4af37",
    });
  }
};


  const updateStatus = async () => {
    try {
      await axios.put(
        `/api/reservations/${id}/status`,
        {
          status,
        }
      );

     Swal.fire({
  icon: "success",
  title: "Status Updated",
  text: "Lead status has been updated successfully.",
  confirmButtonColor: "#d4af37",
});

      fetchLead();
    } catch (error) {
      console.log(error);
    }
  };

  const addFollowUp = async () => {
    try {
      await axios.put(
        `/api/reservations/${id}/followup`,
        {
          note: followUpNote,
        }
      );

      Swal.fire({
  icon: "success",
  title: "Follow-Up Added",
  text: "The follow-up note has been saved successfully.",
  confirmButtonColor: "#d4af37",
});

      setFollowUpNote("");

      fetchLead();
    } catch (error) {
      console.log(error);
    }
  };

  const saveNextFollowUp = async () => {
    try {
      await axios.put(
        `/api/reservations/${id}/next-followup`,
        {
          nextFollowUp,
        }
      );

      Swal.fire({
  icon: "success",
  title: "Saved!",
  text: "Next Follow-Up Saved Successfully",
  confirmButtonColor: "#d4af37",
});

      fetchLead();
    } catch (error) {
      console.log(error);
    }
  };
  
  const deleteLead = async () => {
const result = await Swal.fire({
  title: "Delete Lead?",
  text: "This action cannot be undone.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d4af37",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, Delete",
});

if (!result.isConfirmed) {
  return;
}

  try {
    await axios.delete(
      `/api/reservations/${id}`
    );

   Swal.fire({
  icon: "success",
  title: "Deleted!",
  text: "Lead deleted successfully",
  confirmButtonColor: "#d4af37",
});

    navigate("/admin/leads");
  } catch (error) {
    console.log(error);

    Swal.fire({
  icon: "error",
  title: "Deletion Failed",
  text: "Something went wrong while deleting the lead.",
  confirmButtonColor: "#d4af37",
});
  }
};

  if (!lead) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="lead-details-page">
          <h2>Loading Lead...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="lead-details-page">

        <h1>Lead Details</h1>

      
        {/* CUSTOMER INFO */}
        <div className="details-grid two-columns">

      <div className="details-card">
         <h2>Customer Information</h2>

         {isEditing ? (
           <>
          <div className="form-group">
         <label>Full Name</label>
         <input
          type="text"
          name="fullName"
          value={editData.fullName || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          name="phone"
          value={editData.phone || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={editData.email || ""}
          onChange={handleEditChange}
         />
         </div>
         </>
       ) : (
          <>
      <p>
        <strong>Name:</strong> {lead.fullName || "N/A"}
      </p>

      <p>
        <strong>Phone:</strong> {lead.phone || "N/A"}
      </p>

      <p>
        <strong>Email:</strong> {lead.email || "N/A"}
      </p>
    </>
  )}
</div>

        {/* RESERVATION INFO */}

  <div className="details-card">
  <h2>Reservation Information</h2>

  {isEditing ? (
    <>
      <div className="form-group">
        <label>Reservation Type</label>
        <input
          type="text"
          name="reservationType"
          value={editData.reservationType || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Number of Guests</label>
        <input
          type="number"
          name="guests"
          value={editData.guests || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={editData.date || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Time</label>
        <input
          type="time"
          name="time"
          value={editData.time || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Duration</label>
        <input
          type="text"
          name="duration"
          value={editData.duration || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Occasion</label>
        <input
          type="text"
          name="occasion"
          value={editData.occasion || ""}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group">
        <label>Package</label>
        <input
          type="text"
          name="package"
          value={editData.package || ""}
          onChange={handleEditChange}
        />
      </div>
    </>
  ) : (
  
    <>
      <p>
        <strong>Reservation Type:</strong>{" "}
        {lead.reservationType || "N/A"}
      </p>

      <p>
        <strong>Guests:</strong>{" "}
        {lead.guests || "N/A"}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {lead.date || "N/A"}
      </p>

      <p>
        <strong>Time:</strong>{" "}
        {lead.time || "N/A"}
      </p>

      <p>
        <strong>Duration:</strong>{" "}
        {lead.duration || "N/A"}
      </p>

      <p>
        <strong>Occasion:</strong>{" "}
        {lead.occasion || "N/A"}
      </p>

      <p>
        <strong>Package:</strong>{" "}
        {lead.package || "N/A"}
      </p>
    </>
  )}
</div>
</div>


        {/* REQUIREMENTS */}
        <div className="details-grid two-columns">
<div className="details-card">
  <h2>Requirements</h2>

  {isEditing ? (
    <textarea
      name="requirements"
      rows="4"
      value={editData.requirements || ""}
      onChange={handleEditChange}
    />
  ) : (
    <p>{lead.requirements || "N/A"}</p>
  )}
</div>

        {/* NOTES */}

       <div className="details-card">
  <h2>Additional Notes</h2>

  {isEditing ? (
    <textarea
      name="notes"
      rows="4"
      value={editData.notes || ""}
      onChange={handleEditChange}
    />
  ) : (
    <p>{lead.notes || "N/A"}</p>
  )}
</div>

 <div className="edit-action-row">
  {!isEditing ? (
    <button
      className="save-btn"
      onClick={() => setIsEditing(true)}
    >
      Edit Reservation
    </button>
  ) : (
    <button
      className="save-btn"
      onClick={saveReservationChanges}
    >
      Save Changes
    </button>
  )}
</div>

{/* <div className="details-card">

  {!isEditing ? (
    <button
      className="save-btn"
      onClick={() => setIsEditing(true)}
    >
      Edit Reservation
    </button>
  ) : (
    <button
      className="save-btn"
      onClick={saveReservationChanges}
    >
      Save Changes
    </button>
  )}
</div> */}
</div>

        {/* FOLLOW-UP HISTORY */}

        <div className="details-card">
          <h2>Follow-Up History</h2>

          {lead.followUps &&
          lead.followUps.length > 0 ? (
            lead.followUps.map(
              (item, index) => (
                <div
                  key={index}
                  className="followup-item"
                >
                  <p>
                    <strong>
                      {new Date(
                        item.date
                      ).toLocaleDateString()}
                    </strong>
                  </p>

                  <p>{item.note}</p>

                  <hr />
                </div>
              )
            )
          ) : (
            <p>
              No Follow-Ups Added Yet
            </p>
          )}
        </div>

        {/* ADD FOLLOW-UP */}

        <div className="details-card">
          <h2>Add Follow-Up</h2>

          <textarea
            rows="4"
            value={followUpNote}
            onChange={(e) =>
              setFollowUpNote(
                e.target.value
              )
            }
            placeholder="Enter follow-up note..."
          />

          <button
            className="save-btn"
            onClick={addFollowUp}
          >
            Save Follow-Up
          </button>
        </div>

        {/* NEXT FOLLOW-UP */}
        <div className="details-grid two-columns">

        <div className="details-card">
          <h2>Next Follow-Up Date</h2>

          <input
            type="date"
            value={nextFollowUp}
            onChange={(e) =>
              setNextFollowUp(
                e.target.value
              )
            }
          />

          <button
            className="save-btn"
            onClick={saveNextFollowUp}
          >
            Save Next Follow-Up
          </button>
        </div>

        {/* STATUS */}

        <div className="details-card">
          <h2>Status Management</h2>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="Menu sent">
              Menu sent
            </option>

            <option value="Price Discussion">
              Price Discussion
            </option>

            <option value="Reservation Done">
              Reservation Done
            </option>
          </select>

          <button
            className="save-btn"
            onClick={updateStatus}
          >
            Save Status
          </button>
          </div>
    

          {/* <button
  className="delete-btn"
  onClick={deleteLead}
>
  Delete Lead
</button> */}
        </div>

      </div>
    </div>
  );
}

export default LeadDetailsPage;