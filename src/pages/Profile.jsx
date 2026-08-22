import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
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
    department: "Engineering",
    designation: "Software Developer",
    joiningDate: "01 Jan 2026",
  });

  // Load employee data from Firestore
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, "employees", "demoEmployee");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmployee(docSnap.data());
        } else {
          console.log("No employee profile found");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchEmployee();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile to Firestore
  const handleSave = async () => {
    try {
      await setDoc(
        doc(db, "employees", "demoEmployee"),
        employee
      );

      alert("Profile saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {employee.name ? employee.name.charAt(0) : "E"}
        </div>

        <div>
          <h1>{employee.name}</h1>
          <p>{employee.designation}</p>
        </div>

        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-grid">

        {/* Personal Information */}
        <div className="profile-card">
          <h2>Personal Information</h2>

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
                  type="text"
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
                  type="text"
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
            <button
              className="save-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Job Information */}
        <div className="profile-card">
          <h2>Job Information</h2>

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
    </div>
  );
}

export default Profile;