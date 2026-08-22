<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
=======
import { useState, useEffect } from "react";

>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  CreditCard,
  Camera,
  Pencil,
  X,
} from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

import { useAuth } from "../context/AuthContext";


function Profile() {
<<<<<<< HEAD
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const cropStageRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState("");
  const [cropBox, setCropBox] = useState({ left: 20, top: 20, size: 60 });
  const [dragging, setDragging] = useState(false);

  const [employee, setEmployee] = useState({
    name: "Employee Name",
    email: currentUser?.email || "employee@dayflow.com",
    phone: "+91 9876543210",
    address: "Coimbatore, Tamil Nadu",
    dob: "1998-06-15",

    employeeId: "",
    department: "Engineering",
    designation: "Software Developer",
    joiningDate: "01 Jan 2026",
=======

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
>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b

    basicSalary: 0,
    allowances: 0,
    deductions: 0,

    profileImage: "",
  });

<<<<<<< HEAD
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
=======

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
>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
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

        setEmployee({
          ...employeeSnap.data(),

          // Make sure email is available
          email:
            employeeSnap.data().email ||
            userData.email ||
            currentUser.email ||
            "",

          employeeId:
            employeeSnap.data().employeeId ||
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
<<<<<<< HEAD
  }, [currentUser]);

  const formatDate = (value) => {
    if (!value) return "Not added";

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
=======

  }, [currentUser]);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b

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

<<<<<<< HEAD
  const openImagePicker = () => fileInputRef.current?.click();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setCropBox({ left: 20, top: 20, size: 60 });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCropPointerDown = (event) => {
    event.preventDefault();
    setDragging({
      startX: event.clientX,
      startY: event.clientY,
      originLeft: cropBox.left,
      originTop: cropBox.top,
    });
  };

  const handleCropPointerMove = (event) => {
    if (!dragging || !cropStageRef.current) return;

    const stageRect = cropStageRef.current.getBoundingClientRect();
    const deltaX = ((event.clientX - dragging.startX) / stageRect.width) * 100;
    const deltaY = ((event.clientY - dragging.startY) / stageRect.height) * 100;

    setCropBox((prev) => ({
      ...prev,
      left: Math.min(Math.max(dragging.originLeft + deltaX, 0), 100 - prev.size),
      top: Math.min(Math.max(dragging.originTop + deltaY, 0), 100 - prev.size),
    }));
  };

  const handleCropPointerUp = () => setDragging(false);

  const applyCrop = () => {
    const image = new Image();
    image.src = cropImage;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 600;
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      const left = (cropBox.left / 100) * image.naturalWidth;
      const top = (cropBox.top / 100) * image.naturalHeight;
      const cropSize = (cropBox.size / 100) * Math.min(image.naturalWidth, image.naturalHeight);

      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(
        image,
        left,
        top,
        cropSize,
        cropSize,
        0,
        0,
        size,
        size
      );

      setEmployee((prev) => ({
        ...prev,
        profileImage: canvas.toDataURL("image/jpeg", 0.92),
      }));

      setCropModalOpen(false);
      setCropImage("");
      setDragging(false);
    };
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
=======

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {

    if (!currentUser) {

      alert(
        "You are not logged in."
      );

      return;
>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
    }


    if (!employee.employeeId) {

      alert(
        "Employee ID not found."
      );

      return;
    }


    if (!employee.name.trim()) {

      alert(
        "Please enter your name."
      );

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
      // Save only editable profile data
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

          // Keep employee ID linked
          employeeId:
            employee.employeeId,

          // Keep email synced
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

<<<<<<< HEAD
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
=======

  // ==========================================
  // NET SALARY
  // ==========================================

  const netSalary =
    Number(employee.basicSalary || 0) +
    Number(employee.allowances || 0) -
    Number(employee.deductions || 0);
>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div className="profile-container">

        <h2>
          Loading profile...
        </h2>

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
<<<<<<< HEAD
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {employee.profileImage ? (
              <img
                src={employee.profileImage}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              employee.name
                ? employee.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "E"
            )}
          </div>

          {isEditing && (
            <>
              <button
                type="button"
                className="camera-button"
                onClick={openImagePicker}
                aria-label="Upload profile image"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </>
=======


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

>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
          )}

        </div>

<<<<<<< HEAD
        <div className="profile-info">
          <h1 className="profile-name">{employee.name || "Employee"}</h1>
          <p>{employee.designation || "Employee"}</p>
          <span>{employee.department || "Department"}</span>
=======

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

>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
        </div>


        {/* Edit Button */}

        <button
          type="button"
          className="edit-profile-btn"
          onClick={() => {

            setIsEditing(
              !isEditing
            );

          }}
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


          {/* Name */}

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
<<<<<<< HEAD
            <Calendar size={20} />
            <div>
              <label>Date of Birth</label>

              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={employee.dob || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{formatDate(employee.dob)}</p>
              )}
            </div>
          </div>

          <div className="profile-field">
=======

>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
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


          {/* Profile Image */}

          {isEditing && (

            <div className="profile-field">

              <CreditCard size={20} />

              <div>
<<<<<<< HEAD
                <label>Profile Image</label>
                <p className="profile-upload-note">Use the camera icon above to choose and crop a profile picture.</p>
=======

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

>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
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

<<<<<<< HEAD
      {cropModalOpen && (
        <div className="crop-modal-backdrop">
          <div className="crop-modal">
            <div className="crop-modal-header">
              <h3>Crop profile photo</h3>
              <button type="button" className="close-crop-btn" onClick={() => setCropModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div
              ref={cropStageRef}
              className="crop-stage"
              onPointerMove={handleCropPointerMove}
              onPointerUp={handleCropPointerUp}
              onPointerLeave={handleCropPointerUp}
            >
              <img src={cropImage} alt="Crop preview" className="crop-image" />
              <div
                className="crop-box"
                onPointerDown={handleCropPointerDown}
                style={{
                  left: `${cropBox.left}%`,
                  top: `${cropBox.top}%`,
                  width: `${cropBox.size}%`,
                  height: `${cropBox.size}%`,
                }}
              />
            </div>

            <div className="crop-controls">
              <label>Crop size</label>
              <input
                type="range"
                min="30"
                max="80"
                value={cropBox.size}
                onChange={(e) =>
                  setCropBox((prev) => ({
                    ...prev,
                    size: Number(e.target.value),
                    left: Math.min(prev.left, 100 - Number(e.target.value)),
                    top: Math.min(prev.top, 100 - Number(e.target.value)),
                  }))
                }
              />
            </div>

            <div className="crop-actions">
              <button type="button" className="cancel-btn" onClick={() => setCropModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="save-profile-btn" onClick={applyCrop}>
                Apply Crop
              </button>
            </div>
=======

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

>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b
          </div>

        </div>
<<<<<<< HEAD
      )}
=======

      </div>
>>>>>>> 77c86d7cde5cb46bddcc0421e49e068037ff150b


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
