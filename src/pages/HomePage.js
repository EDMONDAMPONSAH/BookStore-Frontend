import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 2;

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await api.get(`/home`, {
        params: {
          search: search,
          page: page,
          pageSize: pageSize,
        },
      });

      setBooks(res.data.data);
      setTotalPages(Math.ceil(res.data.total / pageSize));
    } catch (err) {
      console.error("Error loading books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Explore Books</h2>

      <div className="row mb-4 justify-content-center">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by name or category"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page on new search
            }}
          />
        </div>
      </div>

      <div className="row">
        {books.map((book) => (
          <div
            key={book.id}
            className="col-6 col-md-3 mb-4"
            onClick={() => navigate(`/books/${book.id}`)}
            style={{ cursor: "pointer" }}>
            <div className="card h-100 shadow-sm">
              {book.firstImageUrl && (
                <img
                  src={book.firstImageUrl}
                  className="card-img-top"
                  alt={book.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{book.name}</h5>
                <p className="card-text text-primary fw-bold">
                  GHS {book.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}>
            Prev
          </button>
          <span className="align-self-center">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
