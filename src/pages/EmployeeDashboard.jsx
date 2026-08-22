import { useEffect, useState } from "react";
import {
  User,
  CalendarDays,
  ClipboardList,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function EmployeeDashboard() {
  const [employee, setEmployee] = useState({
    name: "Employee",
    department: "Engineering",
    designation: "Software Developer",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, "employees", "demoEmployee");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmployee(docSnap.data());
        }
      } catch (error) {
        console.error("Error loading employee:", error);
      }
    };

    fetchEmployee();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {employee.name} 👋</h1>
          <p>
            {employee.designation} • {employee.department}
          </p>
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
          <p>Check your daily and monthly attendance</p>
        </Link>

        <Link to="/leave" className="action-card">
          <ClipboardList size={32} />
          <h2>Leave Requests</h2>
          <p>Apply and track your leave requests</p>
        </Link>

        <Link to="/payroll" className="action-card">
          <Wallet size={32} />
          <h2>Payroll</h2>
          <p>View your salary and payroll details</p>
        </Link>
      </div>

      <div className="recent-activity">
        <h2>Employee Overview</h2>

        <div className="activity-item">
          <p>
            Welcome to <strong>Dayflow HRMS</strong>
          </p>
          <span>
            Manage your profile, attendance, leave requests and payroll from
            one place.
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;