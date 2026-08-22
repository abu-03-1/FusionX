import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("employee");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setError("");

    setFormData({
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await loginUser(
      formData.email,
      formData.password
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid email or password.");
      return;
    }

    // Check the actual role stored in Firestore
    if (result.role === "employee") {
      // Employee account
      if (loginType !== "employee") {
        setError("This account is not an Admin / HR account.");
        return;
      }

      navigate("/employee-dashboard");
    } 
    
    else if (
      result.role === "admin" ||
      result.role === "hr"
    ) {
      // Admin / HR account
      if (loginType !== "admin") {
        setError("This account is not an Employee account.");
        return;
      }

      navigate("/admin-dashboard");
    } 
    
    else {
      setError("Invalid user role. Please contact HR/Admin.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Dayflow</h1>

        <p>Human Resource Management System</p>

        <h2>Login</h2>

        {/* Login Type */}
        <div className="login-type">

          <button
            type="button"
            className={
              loginType === "employee" ? "active" : ""
            }
            onClick={() =>
              handleLoginTypeChange("employee")
            }
          >
            Employee
          </button>

          <button
            type="button"
            className={
              loginType === "admin" ? "active" : ""
            }
            onClick={() =>
              handleLoginTypeChange("admin")
            }
          >
            Admin / HR
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* Employee Sign Up Only */}
        {loginType === "employee" && (
          <p>
            New employee?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;