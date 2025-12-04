import { useState } from "react";
import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";

export default function AddNews() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",   // Base64 OR URL
    type: "news",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // -----------------------------
  // HANDLE TEXT INPUT
  // -----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setUploadSuccess(false); // fix: prevent "uploaded" showing on URL paste
  };

  // -----------------------------
  // HANDLE IMAGE UPLOAD (Base64)
  // -----------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,  // Base64 string
      }));

      setUploading(false);
      setUploadSuccess(true);
    };

    reader.readAsDataURL(file);
  };

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Upload an image or paste an image URL first!");
      return;
    }

    try {
      await API.post("/news", form);
      alert("News added!");

      setForm({
        title: "",
        description: "",
        category: "",
        image: "",
        type: "news",
      });

      setUploadSuccess(false);
    } catch (err) {
      console.error("Error adding news:", err);
      alert("Failed to add news");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center mt-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-xl shadow-xl rounded-2xl p-8 border-t-4 border-red-600"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Add News</h1>

          <label>Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-3 rounded-md mb-4"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            className="w-full border p-3 rounded-md mb-4"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <input
            type="text"
            name="category"
            className="w-full border p-3 rounded-md mb-4"
            value={form.category}
            onChange={handleChange}
            required
          />

          {/* Upload Base64 OR Paste URL */}
          <label>Upload Image OR Paste URL</label>
          <div className="flex gap-3 mb-4">
            <input
              type="file"
              accept="image/*"
              className="border p-2 rounded-md w-1/2"
              onChange={handleImageUpload}
            />

            <input
              type="text"
              name="image"
              placeholder="https://image-url"
              className="border p-2 rounded-md w-1/2"
              value={form.image}
              onChange={handleChange}
            />
          </div>

          {uploading && <p className="text-blue-600 mb-3">Uploading...</p>}

          {uploadSuccess && (
            <p className="text-green-600 mb-3 font-semibold">
              Image Uploaded Successfully!
            </p>
          )}

          <button className="bg-red-600 hover:bg-red-700 text-white font-bold w-full py-3 rounded-lg">
            Publish News
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
