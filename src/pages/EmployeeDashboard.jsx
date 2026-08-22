import { User, CalendarDays, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

function EmployeeDashboard() {
  const employeeName = "Employee";

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {employeeName} 👋</h1>
          <p>Here's an overview of your workday.</p>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/profile" className="action-card">
          <User size={32} />
          <h2>My Profile</h2>
          <p>View and update your personal details</p>
        </Link>

        <Link to="/attendance" className="action-card">
          <CalendarDays size={32} />
          <h2>Attendance</h2>
          <p>Check your daily and weekly attendance</p>
        </Link>

        <Link to="/leave" className="action-card">
          <ClipboardList size={32} />
          <h2>Leave Requests</h2>
          <p>Apply and track your leave requests</p>
        </Link>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>

        <div className="activity-item">
          <p>Welcome to Dayflow HRMS</p>
          <span>Your employee dashboard is ready.</span>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;