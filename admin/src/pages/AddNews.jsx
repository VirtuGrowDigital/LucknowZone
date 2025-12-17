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
      <div className="flex justify-center px-3 sm:px-6 py-6 sm:py-10">
        <form
          onSubmit={handleSubmit}
          className="
          w-full max-w-3xl
          bg-white/90 backdrop-blur-xl
          shadow-xl sm:shadow-2xl
          rounded-2xl
          p-5 sm:p-8 md:p-10
          border border-gray-200
        "
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              📰 Publish News Article
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Add headline, image & category to publish
            </p>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="font-semibold text-gray-700 block mb-1">
              News Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter headline"
              className="
              w-full border p-3 rounded-xl
              shadow-sm focus:ring-2 focus:ring-red-600
              outline-none text-sm sm:text-base
            "
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="font-semibold text-gray-700 block mb-1">
              Short Description
            </label>
            <textarea
              name="description"
              placeholder="Write a short summary..."
              rows="4"
              className="
              w-full border p-3 rounded-xl
              shadow-sm focus:ring-2 focus:ring-red-600
              outline-none resize-none
              text-sm sm:text-base
            "
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="font-semibold text-gray-700 block mb-1">
              Category
            </label>
            <select
              name="category"
              className="w-full border p-3 rounded-xl
  shadow-sm focus:ring-2 focus:ring-red-600
  outline-none text-sm sm:text-base"
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

              {/* ✅ NEW */}
              <option value="DontMiss">Don’t Miss</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="font-semibold text-gray-700 block mb-2">
              News Image
            </label>

            <div
              {...getRootProps()}
              className={`
              border-2 border-dashed rounded-xl
              p-4 sm:p-6
              text-center cursor-pointer
              transition-all
              ${
                isDragActive
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }
            `}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-600">
                Drag & drop or tap to upload image
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG / PNG · Auto compressed
              </p>
            </div>
          </div>

          {/* URL Fallback */}
          <input
            type="text"
            name="image"
            placeholder="Or paste image URL (optional)"
            className="
            w-full border p-3 rounded-xl mb-4
            shadow-sm text-sm sm:text-base
          "
            value={form.image}
            onChange={handleChange}
          />

          {/* Status */}
          {uploading && (
            <p className="text-blue-600 mb-3 font-medium text-sm">
              Processing image...
            </p>
          )}

          {uploadSuccess && (
            <p className="text-green-600 mb-3 font-semibold text-sm">
              Image ready & compressed!
            </p>
          )}

          {/* Preview */}
          {form.image && (
            <div className="mb-6">
              <img
                src={form.image}
                alt="preview"
                className="
                w-full max-h-[300px] object-cover
                rounded-xl shadow border
              "
              />
            </div>
          )}

          {/* Submit (Sticky on mobile) */}
          <div className="sticky bottom-0 bg-white pt-3 sm:static sm:bg-transparent">
            <button
              className="
              bg-red-600 hover:bg-red-700
              text-white font-bold
              w-full py-3
              rounded-xl shadow-lg
              text-base sm:text-lg
              transition
            "
            >
              Publish News 🚀
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
