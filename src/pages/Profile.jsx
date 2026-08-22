import { useState, useEffect, useRef } from "react";
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

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

function Profile() {
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

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

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
    }
  };

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
          )}
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{employee.name || "Employee"}</h1>
          <p>{employee.designation || "Employee"}</p>
          <span>{employee.department || "Department"}</span>
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
                <label>Profile Image</label>
                <p className="profile-upload-note">Use the camera icon above to choose and crop a profile picture.</p>
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
          </div>
        </div>
      )}

      {isEditing && (
        <button className="save-profile-btn" onClick={handleSave}>
          Save Changes
        </button>
      )}
    </div>
  );
}

export default Profile;