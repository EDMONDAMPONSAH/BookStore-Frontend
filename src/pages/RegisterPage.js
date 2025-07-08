import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">Register</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            autoFocus
            name="username"
            type="email"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="text-center mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
