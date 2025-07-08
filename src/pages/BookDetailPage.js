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
    <div className="container mt-5">
      <div className="row">
        {/* Image Carousel */}
        <div className="col-md-6 mb-4">
          {book.images && book.images.length > 0 && (
            <div
              id="bookImagesCarousel"
              className="carousel slide shadow-sm rounded"
              data-bs-ride="carousel">
              <div className="carousel-inner">
                {book.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                    <img
                      src={imgUrl}
                      className="d-block w-100"
                      alt={`Book image ${idx + 1}`}
                      style={{ maxHeight: "450px", objectFit: "contain" }}
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
        </div>

        {/* Book Details */}
        <div className="col-md-6">
          <div className="border p-4 rounded shadow-sm bg-white">
            <h2 className="mb-3 fw-semibold">{book.name}</h2>

            <h4 className="text-primary mb-3">${book.price.toFixed(2)}</h4>

            <p className="mb-2">
              <strong>Category:</strong> {book.category}
            </p>

            <hr />

            <p>
              <strong>Description:</strong>
              <br />
              {book.description}
            </p>

            <button className="btn btn-warning w-100 mt-4">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
