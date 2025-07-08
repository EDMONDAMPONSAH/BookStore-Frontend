import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  const fetchBook = async () => {
    try {
      const res = await api.get(`/home/${id}`);
      setBook(res.data);
    } catch (err) {
      setError("Failed to load book details");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (error) {
    return (
      <div className="container mt-4">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mt-4">
        <h5>Loading...</h5>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{book.name}</h2>

      {/* Carousel for Book Images */}
      {book.images && book.images.length > 0 && (
        <div
          id="bookImagesCarousel"
          className="carousel slide mb-4"
          data-bs-ride="carousel">
          <div className="carousel-inner">
            {book.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                <img
                  src={imgUrl}
                  className="d-block w-100 rounded"
                  alt={`Book image ${idx + 1}`}
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          {book.images.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#bookImagesCarousel"
                data-bs-slide="prev">
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#bookImagesCarousel"
                data-bs-slide="next">
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      )}

      <p>
        <strong>Price:</strong>{" "}
        <span className="text-primary">${book.price.toFixed(2)}</span>
      </p>
      <p>
        <strong>Category:</strong> {book.category}
      </p>
      <p>
        <strong>Description:</strong>
        <br />
        {book.description}
      </p>
    </div>
  );
};

export default BookDetailPage;
