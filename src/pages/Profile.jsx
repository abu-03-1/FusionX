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
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [employee, setEmployee] = useState({
    name: "Employee Name",
    email: currentUser?.email || "employee@dayflow.com",
    phone: "+91 9876543210",
    address: "Coimbatore, Tamil Nadu",

    employeeId: "",
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
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError("Your account information was not found.");
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const employeeId = userData.employeeId;

        if (!employeeId) {
          setError("Employee ID is missing from your account.");
          setLoading(false);
          return;
        }

        const employeeRef = doc(db, "employees", employeeId);
        const employeeSnap = await getDoc(employeeRef);

        if (!employeeSnap.exists()) {
          setError("Your employee profile has not been created in the database yet.");
          setLoading(false);
          return;
        }

        const employeeData = employeeSnap.data();
        setEmployee((prev) => ({
          ...prev,
          ...employeeData,
          email: employeeData.email || currentUser.email || prev.email,
          employeeId: employeeId,
        }));
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Unable to load employee profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [currentUser]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const employeeId = employee.employeeId || currentUser?.uid;

    if (!employeeId) {
      alert("No employee ID found for this profile.");
      return;
    }

    try {
      await setDoc(doc(db, "employees", employeeId), {
        ...employee,
        employeeId,
        uid: currentUser.uid,
        email: employee.email || currentUser.email,
      });

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

  if (loading) {
    return <div className="profile-container"><h2>Loading profile...</h2></div>;
  }

  if (error) {
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

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