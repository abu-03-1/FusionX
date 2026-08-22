import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  CreditCard,
  Wallet,
  Pencil,
} from "lucide-react";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [employee, setEmployee] = useState({
    name: "Employee Name",
    email: "employee@dayflow.com",
    phone: "+91 9876543210",
    address: "Coimbatore, Tamil Nadu",

    employeeId: "EMP001",
    department: "Engineering",
    designation: "Software Developer",
    joiningDate: "01 Jan 2026",

    basicSalary: 30000,
    allowances: 5000,
    deductions: 2000,

    profileImage: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, "employees", "demoEmployee");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmployee((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await setDoc(
        doc(db, "employees", "demoEmployee"),
        employee
      );

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile");
    }
  };

  const netSalary =
    Number(employee.basicSalary || 0) +
    Number(employee.allowances || 0) -
    Number(employee.deductions || 0);

  return (
    <div className="profile-container">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {employee.profileImage ? (
            <img
              src={employee.profileImage}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            employee.name?.charAt(0) || "E"
          )}
        </div>

        <div>
          <h1>{employee.name}</h1>
          <p>{employee.designation}</p>
          <span>{employee.department}</span>
        </div>

        <button
          className="edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil size={18} />
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-grid">

        {/* Personal Details */}
        <div className="profile-card">
          <h2>Personal Details</h2>

          <div className="profile-field">
            <Mail size={20} />
            <div>
              <label>Email</label>
              <p>{employee.email}</p>
            </div>
          </div>

          <div className="profile-field">
            <Phone size={20} />
            <div>
              <label>Phone</label>

              {isEditing ? (
                <input
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                />
              ) : (
                <p>{employee.phone}</p>
              )}
            </div>
          </div>

          <div className="profile-field">
            <MapPin size={20} />
            <div>
              <label>Address</label>

              {isEditing ? (
                <input
                  name="address"
                  value={employee.address}
                  onChange={handleChange}
                />
              ) : (
                <p>{employee.address}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="profile-field">
              <CreditCard size={20} />
              <div>
                <label>Profile Image URL</label>

                <input
                  name="profileImage"
                  value={employee.profileImage}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                />
              </div>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="profile-card">
          <h2>Job Details</h2>

          <div className="profile-field">
            <CreditCard size={20} />
            <div>
              <label>Employee ID</label>
              <p>{employee.employeeId}</p>
            </div>
          </div>

          <div className="profile-field">
            <Building2 size={20} />
            <div>
              <label>Department</label>
              <p>{employee.department}</p>
            </div>
          </div>

          <div className="profile-field">
            <Briefcase size={20} />
            <div>
              <label>Designation</label>
              <p>{employee.designation}</p>
            </div>
          </div>

          <div className="profile-field">
            <Calendar size={20} />
            <div>
              <label>Joining Date</label>
              <p>{employee.joiningDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Structure */}
      <div className="salary-card">
        <div className="salary-title">
          <Wallet size={24} />
          <h2>Salary Structure</h2>
        </div>

        <div className="salary-grid">
          <div className="salary-item">
            <span>Basic Salary</span>
            <strong>₹{employee.basicSalary}</strong>
          </div>

          <div className="salary-item">
            <span>Allowances</span>
            <strong>₹{employee.allowances}</strong>
          </div>

          <div className="salary-item">
            <span>Deductions</span>
            <strong>₹{employee.deductions}</strong>
          </div>

          <div className="salary-item net-salary">
            <span>Net Salary</span>
            <strong>₹{netSalary}</strong>
          </div>
        </div>
      </div>

      {isEditing && (
        <button className="save-profile-btn" onClick={handleSave}>
          Save Changes
        </button>
      )}
    </div>
  );
}

export default Profile;