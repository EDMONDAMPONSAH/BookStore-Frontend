import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const UploadBookPage = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 2) {
      toast.error("You can only upload up to 2 images.");
      return;
    }

    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each image must not exceed 5MB.");
        return;
      }
    }

    setForm({ ...form, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    if (form.images.length > 2) {
      toast.error("You can only upload up to 2 images.");
      return;
    }

    for (let file of form.images) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each image must not exceed 5MB.");
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("description", form.description);
      form.images.forEach((file) => formData.append("images", file));

      await api.post("/books", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book uploaded successfully!");
      navigate("/vendor/books");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload book. Please check your input.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="text-center mb-4">Upload a New Book</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Book Name</label>
          <input
            name="name"
            type="text"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            name="category"
            type="text"
            className="form-control"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (GHS)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            className="form-control"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            rows={4}
            className="form-control"
            value={form.description}
            onChange={handleChange}
            required></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload up to 2 Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            onChange={handleFileChange}
          />
          <div className="mt-2 d-flex gap-2 flex-wrap">
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                className="img-thumbnail"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-success w-100" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Book"}
        </button>
      </form>
    </div>
  );
};

export default UploadBookPage;
