import { useState, useEffect, useRef } from "react";
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
  Camera,
  X,
} from "lucide-react";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { currentUser } = useAuth();

  const fileInputRef = useRef(null);
  const cropStageRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState("");
  const [cropBox, setCropBox] = useState({
    left: 20,
    top: 20,
    size: 60,
  });
  const [dragging, setDragging] = useState(false);

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    employeeId: "",
    department: "",
    designation: "",
    joiningDate: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    profileImage: "",
  });

  // Fetch logged-in employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get logged-in user's document
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError("User account information not found.");
          return;
        }

        const userData = userSnap.data();
        const employeeId = userData.employeeId;

        if (!employeeId) {
          setError("Employee ID is missing from your account.");
          return;
        }

        // Get actual employee document
        const employeeRef = doc(db, "employees", employeeId);
        const employeeSnap = await getDoc(employeeRef);

        if (!employeeSnap.exists()) {
          setError("Employee profile not found.");
          return;
        }

        const employeeData = employeeSnap.data();

        setEmployee({
          name: employeeData.name || "",
          email:
            employeeData.email ||
            userData.email ||
            currentUser.email ||
            "",
          phone: employeeData.phone || "",
          address: employeeData.address || "",
          dob: employeeData.dob || "",
          employeeId:
            employeeData.employeeId || employeeId,
          department: employeeData.department || "",
          designation: employeeData.designation || "",
          joiningDate: employeeData.joiningDate || "",
          basicSalary: employeeData.basicSalary || 0,
          allowances: employeeData.allowances || 0,
          deductions: employeeData.deductions || 0,
          profileImage: employeeData.profileImage || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Unable to load employee profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [currentUser]);

  const formatDate = (value) => {
    if (!value) return "Not provided";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Open image picker
  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  // Read selected image
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setCropImage(String(reader.result));

      setCropBox({
        left: 20,
        top: 20,
        size: 60,
      });

      setCropModalOpen(true);
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Start dragging crop box
  const handleCropPointerDown = (event) => {
    event.preventDefault();

    setDragging({
      startX: event.clientX,
      startY: event.clientY,
      originLeft: cropBox.left,
      originTop: cropBox.top,
    });
  };

  // Move crop box
  const handleCropPointerMove = (event) => {
    if (!dragging || !cropStageRef.current) return;

    const stageRect =
      cropStageRef.current.getBoundingClientRect();

    const deltaX =
      ((event.clientX - dragging.startX) /
        stageRect.width) *
      100;

    const deltaY =
      ((event.clientY - dragging.startY) /
        stageRect.height) *
      100;

    setCropBox((previous) => ({
      ...previous,
      left: Math.min(
        Math.max(dragging.originLeft + deltaX, 0),
        100 - previous.size
      ),
      top: Math.min(
        Math.max(dragging.originTop + deltaY, 0),
        100 - previous.size
      ),
    }));
  };

  const handleCropPointerUp = () => {
    setDragging(false);
  };

  // Apply crop
  const applyCrop = () => {
    const image = new Image();

    image.src = cropImage;

    image.onload = () => {
      const canvas = document.createElement("canvas");

      const size = 600;

      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");

      if (!context) return;

      const left =
        (cropBox.left / 100) *
        image.naturalWidth;

      const top =
        (cropBox.top / 100) *
        image.naturalHeight;

      const cropSize =
        (cropBox.size / 100) *
        Math.min(
          image.naturalWidth,
          image.naturalHeight
        );

      context.fillStyle = "#ffffff";

      context.fillRect(
        0,
        0,
        size,
        size
      );

      context.drawImage(
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

      setEmployee((previous) => ({
        ...previous,
        profileImage: canvas.toDataURL(
          "image/jpeg",
          0.92
        ),
      }));

      setCropModalOpen(false);
      setCropImage("");
      setDragging(false);
    };
  };

  // Save profile
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

      const employeeRef = doc(
        db,
        "employees",
        employee.employeeId
      );

      await setDoc(
        employeeRef,
        {
          name: employee.name.trim(),
          phone: employee.phone || "",
          address: employee.address || "",
          dob: employee.dob || "",
          profileImage:
            employee.profileImage || "",
          employeeId:
            employee.employeeId,
          email:
            employee.email ||
            currentUser.email ||
            "",
        },
        { merge: true }
      );

      alert("Profile updated successfully!");

      setIsEditing(false);
    } catch (err) {
      console.error(
        "Error saving profile:",
        err
      );

      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const netSalary =
    Number(employee.basicSalary || 0) +
    Number(employee.allowances || 0) -
    Number(employee.deductions || 0);

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <h2>Employee Profile</h2>

        <p className="error-message">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="profile-container">

      {/* PROFILE HEADER */}

      <div className="profile-header">

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
                ?.trim()
                ?.charAt(0)
                ?.toUpperCase() || "E"
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
          )}

        </div>

        <div className="profile-info">

          <h1 className="profile-name">
            {employee.name || "Employee Name"}
          </h1>

          <p>
            {employee.designation || "Employee"}
          </p>

          <span>
            {employee.department || "Department"}
          </span>

        </div>

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


      {/* PROFILE DETAILS */}

      <div className="profile-grid">

        {/* PERSONAL DETAILS */}

        <div className="profile-card">

          <h2>Personal Details</h2>

          <div className="profile-field">

            <User size={20} />

            <div>

              <label>Full Name</label>

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


          <div className="profile-field">

            <Mail size={20} />

            <div>

              <label>Email</label>

              <p>
                {employee.email ||
                  "Not provided"}
              </p>

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


          <div className="profile-field">

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
                <p>
                  {formatDate(employee.dob)}
                </p>
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


          {isEditing && (

            <div className="profile-field">

              <CreditCard size={20} />

              <div>

                <label>Profile Image</label>

                <p className="profile-upload-note">
                  Use the camera icon above to
                  choose and crop a profile photo.
                </p>

              </div>

            </div>

          )}

        </div>


        {/* JOB DETAILS */}

        <div className="profile-card">

          <h2>Job Details</h2>

          <div className="profile-field">

            <CreditCard size={20} />

            <div>

              <label>Employee ID</label>

              <p>
                {employee.employeeId ||
                  "Not provided"}
              </p>

            </div>

          </div>


          <div className="profile-field">

            <Building2 size={20} />

            <div>

              <label>Department</label>

              <p>
                {employee.department ||
                  "Not provided"}
              </p>

            </div>

          </div>


          <div className="profile-field">

            <Briefcase size={20} />

            <div>

              <label>Designation</label>

              <p>
                {employee.designation ||
                  "Not provided"}
              </p>

            </div>

          </div>


          <div className="profile-field">

            <Calendar size={20} />

            <div>

              <label>Joining Date</label>

              <p>
                {formatDate(
                  employee.joiningDate
                )}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* SALARY STRUCTURE */}

      <div className="salary-card">

        <div className="salary-title">

          <Wallet size={24} />

          <h2>Salary Structure</h2>

        </div>


        <div className="salary-grid">

          <div className="salary-item">

            <span>Basic Salary</span>

            <strong>
              ₹{employee.basicSalary || 0}
            </strong>

          </div>


          <div className="salary-item">

            <span>Allowances</span>

            <strong>
              ₹{employee.allowances || 0}
            </strong>

          </div>


          <div className="salary-item">

            <span>Deductions</span>

            <strong>
              ₹{employee.deductions || 0}
            </strong>

          </div>


          <div className="salary-item net-salary">

            <span>Net Salary</span>

            <strong>
              ₹{netSalary}
            </strong>

          </div>

        </div>

      </div>


      {/* IMAGE CROP MODAL */}

      {cropModalOpen && (

        <div className="crop-modal-backdrop">

          <div className="crop-modal">

            <div className="crop-modal-header">

              <h3>Crop profile photo</h3>

              <button
                type="button"
                className="close-crop-btn"
                onClick={() =>
                  setCropModalOpen(false)
                }
              >
                <X size={18} />
              </button>

            </div>


            <div
              ref={cropStageRef}
              className="crop-stage"
              onPointerMove={
                handleCropPointerMove
              }
              onPointerUp={
                handleCropPointerUp
              }
              onPointerLeave={
                handleCropPointerUp
              }
            >

              <img
                src={cropImage}
                alt="Crop preview"
                className="crop-image"
              />

              <div
                className="crop-box"
                onPointerDown={
                  handleCropPointerDown
                }
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
                onChange={(e) => {

                  const newSize =
                    Number(e.target.value);

                  setCropBox((previous) => ({
                    ...previous,
                    size: newSize,
                    left: Math.min(
                      previous.left,
                      100 - newSize
                    ),
                    top: Math.min(
                      previous.top,
                      100 - newSize
                    ),
                  }));
                }}
              />

            </div>


            <div className="crop-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setCropModalOpen(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-profile-btn"
                onClick={applyCrop}
              >
                Apply Crop
              </button>

            </div>

          </div>

        </div>

      )}


      {/* SAVE BUTTON */}

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