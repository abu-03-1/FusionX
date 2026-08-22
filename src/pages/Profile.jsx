import { useState, useEffect } from "react";

import {
  User,
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

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";


function Profile() {

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  const { currentUser } = useAuth();


  // ==========================================
  // EDIT MODE
  // ==========================================

  const [isEditing, setIsEditing] =
    useState(false);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // SAVING
  // ==========================================

  const [saving, setSaving] =
    useState(false);


  // ==========================================
  // EMPLOYEE DATA
  // ==========================================

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",

    employeeId: "",
    department: "",
    designation: "",
    joiningDate: "",

    basicSalary: 0,
    allowances: 0,
    deductions: 0,

    profileImage: "",
  });


  // ==========================================
  // ERROR
  // ==========================================

  const [error, setError] =
    useState("");


  // ==========================================
  // FETCH EMPLOYEE PROFILE
  // ==========================================

  useEffect(() => {

    const fetchEmployee = async () => {

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {

        setLoading(true);
        setError("");


        // ======================================
        // STEP 1:
        // Get logged-in user's document
        // ======================================

        const userRef = doc(
          db,
          "users",
          currentUser.uid
        );

        const userSnap =
          await getDoc(userRef);


        if (!userSnap.exists()) {

          setError(
            "User account information not found."
          );

          setLoading(false);
          return;
        }


        const userData =
          userSnap.data();


        // ======================================
        // STEP 2:
        // Get Employee ID
        // ======================================

        const employeeId =
          userData.employeeId;


        if (!employeeId) {

          setError(
            "Employee ID is missing from your account."
          );

          setLoading(false);
          return;
        }


        // ======================================
        // STEP 3:
        // Get actual employee document
        // ======================================

        const employeeRef = doc(
          db,
          "employees",
          employeeId
        );

        const employeeSnap =
          await getDoc(employeeRef);


        if (!employeeSnap.exists()) {

          setError(
            "Employee profile not found."
          );

          setLoading(false);
          return;
        }


        // ======================================
        // STEP 4:
        // Store employee data
        // ======================================

        const employeeData =
          employeeSnap.data();


        setEmployee({
          ...employeeData,

          email:
            employeeData.email ||
            userData.email ||
            currentUser.email ||
            "",

          employeeId:
            employeeData.employeeId ||
            employeeId,
        });

      } catch (error) {

        console.error(
          "Error loading profile:",
          error
        );

        setError(
          "Unable to load employee profile."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchEmployee();

  }, [currentUser]);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setEmployee((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {

    if (!currentUser) {

      alert("You are not logged in.");
      return;
    }


    if (!employee.employeeId) {

      alert("Employee ID not found.");
      return;
    }


    if (!employee.name.trim()) {

      alert("Please enter your name.");
      return;
    }


    try {

      setSaving(true);


      // ======================================
      // Employee document reference
      // ======================================

      const employeeRef = doc(
        db,
        "employees",
        employee.employeeId
      );


      // ======================================
      // Save profile changes
      // ======================================

      await setDoc(
        employeeRef,
        {
          name:
            employee.name.trim(),

          phone:
            employee.phone || "",

          address:
            employee.address || "",

          profileImage:
            employee.profileImage || "",

          employeeId:
            employee.employeeId,

          email:
            employee.email ||
            currentUser.email ||
            "",
        },
        {
          merge: true,
        }
      );


      // ======================================
      // Update local state
      // ======================================

      setEmployee((previous) => ({
        ...previous,
        name: employee.name.trim(),
      }));


      alert(
        "Profile updated successfully!"
      );


      setIsEditing(false);

    } catch (error) {

      console.error(
        "Error saving profile:",
        error
      );

      alert(
        "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // NET SALARY
  // ==========================================

  const netSalary =
    Number(employee.basicSalary || 0) +
    Number(employee.allowances || 0) -
    Number(employee.deductions || 0);


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (
      <div className="profile-container">
        <h2>Loading profile...</h2>
      </div>
    );

  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {

    return (
      <div className="profile-container">

        <h2>
          Employee Profile
        </h2>

        <p className="error-message">
          {error}
        </p>

      </div>
    );

  }


  // ==========================================
  // PROFILE PAGE
  // ==========================================

  return (

    <div className="profile-container">


      {/* ======================================
          PROFILE HEADER
      ======================================= */}

      <div className="profile-header">

        {/* Profile Avatar */}

        <div className="profile-avatar">

          {employee.profileImage ? (

            <img
              src={employee.profileImage}
              alt="Profile"
              className="profile-image"
            />

          ) : (

            employee.name
              ?.trim()
              ?.charAt(0)
              ?.toUpperCase() || "E"

          )}

        </div>


        {/* Employee Name */}

        <div>

          <h1>
            {employee.name ||
              "Employee Name"}
          </h1>

          <p>
            {employee.designation ||
              "Employee"}
          </p>

          <span>
            {employee.department ||
              "Department"}
          </span>

        </div>


        {/* Edit Button */}

        <button
          type="button"
          className="edit-profile-btn"
          onClick={() =>
            setIsEditing(!isEditing)
          }
        >

          <Pencil size={18} />

          {isEditing
            ? "Cancel"
            : "Edit Profile"}

        </button>

      </div>


      {/* ======================================
          PROFILE GRID
      ======================================= */}

      <div className="profile-grid">


        {/* ====================================
            PERSONAL DETAILS
        ===================================== */}

        <div className="profile-card">

          <h2>
            Personal Details
          </h2>


          {/* Full Name */}

          <div className="profile-field">

            <User size={20} />

            <div>

              <label>
                Full Name
              </label>

              {isEditing ? (

                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />

              ) : (

                <p>
                  {employee.name ||
                    "Not provided"}
                </p>

              )}

            </div>

          </div>


          {/* Email */}

          <div className="profile-field">

            <Mail size={20} />

            <div>

              <label>
                Email
              </label>

              <p>
                {employee.email ||
                  "Not provided"}
              </p>

            </div>

          </div>


          {/* Phone */}

          <div className="profile-field">

            <Phone size={20} />

            <div>

              <label>
                Phone
              </label>

              {isEditing ? (

                <input
                  type="text"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              ) : (

                <p>
                  {employee.phone ||
                    "Not provided"}
                </p>

              )}

            </div>

          </div>


          {/* Address */}

          <div className="profile-field">

            <MapPin size={20} />

            <div>

              <label>
                Address
              </label>

              {isEditing ? (

                <input
                  type="text"
                  name="address"
                  value={employee.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />

              ) : (

                <p>
                  {employee.address ||
                    "Not provided"}
                </p>

              )}

            </div>

          </div>


          {/* Profile Image URL */}

          {isEditing && (

            <div className="profile-field">

              <CreditCard size={20} />

              <div>

                <label>
                  Profile Image URL
                </label>

                <input
                  type="text"
                  name="profileImage"
                  value={
                    employee.profileImage
                  }
                  onChange={handleChange}
                  placeholder="Paste image URL"
                />

              </div>

            </div>

          )}

        </div>


        {/* ====================================
            JOB DETAILS
        ===================================== */}

        <div className="profile-card">

          <h2>
            Job Details
          </h2>


          {/* Employee ID */}

          <div className="profile-field">

            <CreditCard size={20} />

            <div>

              <label>
                Employee ID
              </label>

              <p>
                {employee.employeeId ||
                  "Not provided"}
              </p>

            </div>

          </div>


          {/* Department */}

          <div className="profile-field">

            <Building2 size={20} />

            <div>

              <label>
                Department
              </label>

              <p>
                {employee.department ||
                  "Not provided"}
              </p>

            </div>

          </div>


          {/* Designation */}

          <div className="profile-field">

            <Briefcase size={20} />

            <div>

              <label>
                Designation
              </label>

              <p>
                {employee.designation ||
                  "Not provided"}
              </p>

            </div>

          </div>


          {/* Joining Date */}

          <div className="profile-field">

            <Calendar size={20} />

            <div>

              <label>
                Joining Date
              </label>

              <p>
                {employee.joiningDate ||
                  "Not provided"}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          SALARY STRUCTURE
      ======================================= */}

      <div className="salary-card">

        <div className="salary-title">

          <Wallet size={24} />

          <h2>
            Salary Structure
          </h2>

        </div>


        <div className="salary-grid">


          {/* Basic Salary */}

          <div className="salary-item">

            <span>
              Basic Salary
            </span>

            <strong>
              ₹{employee.basicSalary || 0}
            </strong>

          </div>


          {/* Allowances */}

          <div className="salary-item">

            <span>
              Allowances
            </span>

            <strong>
              ₹{employee.allowances || 0}
            </strong>

          </div>


          {/* Deductions */}

          <div className="salary-item">

            <span>
              Deductions
            </span>

            <strong>
              ₹{employee.deductions || 0}
            </strong>

          </div>


          {/* Net Salary */}

          <div className="salary-item net-salary">

            <span>
              Net Salary
            </span>

            <strong>
              ₹{netSalary}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================
          SAVE BUTTON
      ======================================= */}

      {isEditing && (

        <button
          type="button"
          className="save-profile-btn"
          onClick={handleSave}
          disabled={saving}
        >

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      )}

    </div>

  );

}


export default Profile;