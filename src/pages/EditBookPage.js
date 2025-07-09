import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const role = localStorage.getItem("userRole");
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await api.delete(`/books/${id}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBook((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
      toast.success("Image deleted");
    } catch (err) {
      console.error("Failed to delete image", err);
      toast.error("Failed to delete image");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 2) {
      toast.error("You can only upload up to 2 new images.");
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each image must be 5MB or less.");
        return;
      }
    }

    setNewImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const existingImageCount = book.images?.length || 0;
    const totalImages = existingImageCount + newImages.length;

    if (totalImages === 0) {
      toast.error("You must have at least one image.");
      setSubmitting(false);
      return;
    }

    if (totalImages > 2) {
      toast.error("You can only have up to 2 images total.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);
    newImages.forEach((img) => formData.append("images", img));

    try {
      await api.put(`/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book updated successfully");
      navigate(role === "Admin" ? "/admin" : "/vendor/books"); // Redirect based on role
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update book");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setBook(res.data);
        setForm({
          name: res.data.name,
          category: res.data.category,
          price: res.data.price,
          description: res.data.description,
        });
      } catch (err) {
        console.error("Failed to fetch book", err);
        toast.error("Could not load book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!book) return <div className="container mt-4">Book not found</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Edit Book</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Category</label>
          <input
            className="form-control"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Price</label>
          <input
            className="form-control"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        {/* Existing Images */}
        <div className="mb-3">
          <label>Existing Images</label>
          <div className="d-flex flex-wrap gap-3 mt-2">
            {book.images?.map((img) => (
              <div key={img.id} className="position-relative">
                <img
                  src={img.url}
                  alt=""
                  className="img-thumbnail"
                  style={{
                    height: "120px",
                    width: "120px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={() => handleDeleteImage(img.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div className="mb-3">
          <label>Upload New Images</label>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg"
            className="form-control"
            onChange={handleFileChange}
          />
          <small className="text-muted">
            Total images (existing + new) must not exceed 2. JPG/PNG only. Max
            5MB each.
          </small>
        </div>

        <button className="btn btn-success" disabled={submitting}>
          {submitting ? "Updating..." : "Update Book"}
        </button>
      </form>
    </div>
  );
};

export default EditBookPage;
