import { useState } from "react";
import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddNews() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    type: "news",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ----------------------------
  // Image Compression + Base64
  // ----------------------------
  const processImageFile = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      const base64Image = await fileToBase64(compressed);

      setForm((prev) => ({ ...prev, image: base64Image }));
      setUploadSuccess(true);
      toast.success("Image uploaded & compressed!");
    } catch (err) {
      toast.error("Failed to process the image");
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------
  // Drag & Drop Image
  // ----------------------------
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (files) => {
      if (files && files[0]) processImageFile(files[0]);
    },
  });

  // ----------------------------
  // Submit News
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      const res = await API.post("/news", form);

      if (res.data.success === false) {
        toast.error(res.data.error);
        return;
      }

      toast.success("News published successfully!");

      setForm({
        title: "",
        description: "",
        category: "",
        image: "",
        type: "news",
      });

      setUploadSuccess(false);
    } catch (err) {
      console.error(err);
      toast.error("Server Error — Try Again");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center mt-10 px-3">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl w-full max-w-2xl shadow-2xl rounded-2xl p-10 border border-gray-200"
        >
          <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
            📰 Publish News Article
          </h1>

          {/* Title */}
          <label className="font-semibold text-gray-700">News Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter headline"
            className="w-full border p-3 rounded-xl mb-4 shadow-sm focus:ring-2 focus:ring-red-600 outline-none"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <label className="font-semibold text-gray-700">Short Description</label>
          <textarea
            name="description"
            placeholder="Write a short summary..."
            rows="4"
            className="w-full border p-3 rounded-xl mb-5 shadow-sm focus:ring-2 focus:ring-red-600 outline-none"
            value={form.description}
            onChange={handleChange}
            required
          />

          {/* Category */}
          <label className="font-semibold text-gray-700">Category</label>
          <select
            name="category"
            className="w-full border p-3 rounded-xl mb-5 shadow-sm focus:ring-2 focus:ring-red-600 outline-none"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Local">Local</option>
            <option value="Politics">Politics</option>
            <option value="Sports">Sports</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Top Stories">Top Stories</option>
          </select>

          {/* Drag & Drop Upload */}
          <label className="font-semibold text-gray-700">News Image</label>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-4 text-center mb-4 cursor-pointer transition ${
              isDragActive
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600">
              Drag & drop or click to upload an image
            </p>
          </div>

          {/* URL Fallback */}
          <input
            type="text"
            name="image"
            placeholder="Paste image URL (optional)"
            className="w-full border p-3 rounded-xl mb-4 shadow-sm"
            value={form.image}
            onChange={handleChange}
          />

          {/* Upload Status */}
          {uploading && (
            <p className="text-blue-600 mb-3 font-medium">Processing image...</p>
          )}

          {uploadSuccess && (
            <p className="text-green-600 mb-3 font-semibold">
              Image ready & compressed!
            </p>
          )}

          {/* Preview */}
          {form.image && (
            <div className="mb-6">
              <img
                src={form.image}
                alt="preview"
                className="w-full rounded-xl shadow border"
              />
            </div>
          )}

          {/* Submit */}
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold w-full py-3 rounded-xl shadow-lg text-lg transition">
            Publish News 🚀
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
