import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const VendorDashboard = () => {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({ totalBooks: 0, totalValue: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name =
          decoded.name ||
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setUsername(name);
        fetchStats();
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/vendor/my-stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Welcome, {username}</h2>

      {/* Stats Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body text-center">
              <h5>Total Books</h5>
              <h3>{stats.totalBooks}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mt-3 mt-md-0">
          <div className="card text-white bg-success shadow">
            <div className="card-body text-center">
              <h5>Total Value</h5>
              <h3>GHS {stats.totalValue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <div
            className="card shadow text-center hover-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/vendor/books")}>
            <div className="card-body text-info">
              <i className="fa fa-book fa-3x mb-2"></i>
              <h5>Manage Books</h5>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div
            className="card shadow text-center hover-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/vendor/books/new")}>
            <div className="card-body text-success">
              <i className="fa fa-plus-circle fa-3x mb-2"></i>
              <h5>Upload Book</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
