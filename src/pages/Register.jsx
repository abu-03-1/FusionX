import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      employeeId,
      email,
      password,
      confirmPassword,
    } = formData;

    // Check empty fields
    if (!employeeId || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Register employee
    const result = await registerUser(
      employeeId,
      email,
      password
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess("Employee account created successfully!");

    // Redirect to login
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>Dayflow</h1>

        <p>Employee Registration</p>

        <h2>Create Employee Account</h2>

        <form onSubmit={handleSubmit}>

          {/* Employee ID */}
          <div>
            <label>Employee ID</label>

            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>

        </form>

        {/* Login Link */}
        <p>
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;