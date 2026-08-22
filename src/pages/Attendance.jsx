import { useState } from "react";
import { Calendar, Clock, LogIn, LogOut } from "lucide-react";

function Attendance() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString();
    setCheckedIn(true);
    setCheckInTime(time);
  };

  const handleCheckOut = () => {
    const time = new Date().toLocaleTimeString();
    setCheckOutTime(time);
    setCheckedIn(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#1f2937" }}>Attendance</h1>
      <p style={{ color: "#6b7280", marginBottom: "30px" }}>
        Track your daily attendance and working hours.
      </p>

      {/* Today's Attendance */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Calendar size={28} color="#4f46e5" />
          <h2 style={{ color: "#1f2937" }}>Today's Attendance</h2>
        </div>

        <p style={{ color: "#6b7280" }}>
          {new Date().toDateString()}
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "25px",
            flexWrap: "wrap",
          }}
        >
          {/* Check In */}
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              background: "#eef2ff",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <LogIn color="#4f46e5" />
              <h3>Check In</h3>
            </div>

            <p>
              {checkInTime ? checkInTime : "Not checked in yet"}
            </p>

            <button
              onClick={handleCheckIn}
              disabled={checkedIn || checkOutTime}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: checkedIn ? "#9ca3af" : "#4f46e5",
                color: "white",
                cursor: "pointer",
              }}
            >
              Check In
            </button>
          </div>

          {/* Check Out */}
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              background: "#fef2f2",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <LogOut color="#dc2626" />
              <h3>Check Out</h3>
            </div>

            <p>
              {checkOutTime ? checkOutTime : "Not checked out yet"}
            </p>

            <button
              onClick={handleCheckOut}
              disabled={!checkedIn || checkOutTime}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: !checkedIn || checkOutTime ? "#9ca3af" : "#dc2626",
                color: "white",
                cursor: "pointer",
              }}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Clock color="#4f46e5" />
          <h2 style={{ color: "#1f2937" }}>Attendance History</h2>
        </div>

        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Check In</th>
              <th style={{ padding: "12px" }}>Check Out</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr style={{ textAlign: "center" }}>
              <td style={{ padding: "15px" }}>
                {new Date().toDateString()}
              </td>
              <td>{checkInTime || "-"}</td>
              <td>{checkOutTime || "-"}</td>
              <td>
                {checkOutTime
                  ? "Completed"
                  : checkedIn
                  ? "Present"
                  : "Not Marked"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;