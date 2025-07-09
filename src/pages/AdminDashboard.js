import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [booksRes, statsRes] = await Promise.all([
        api.get("/admin/books", { headers }),
        api.get("/admin/stats", { headers }),
      ]);

      setBooks(booksRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success("Book deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Could not delete book");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Admin Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Books</h5>
              <p className="card-text fs-4">{stats.totalBooks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text fs-4">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">All Uploaded Books</h4>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.category}</td>
                  <td>GHS {book.price}</td>
                  <td>{book.uploadedBy}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/vendor/books/${book.id}/edit`)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
