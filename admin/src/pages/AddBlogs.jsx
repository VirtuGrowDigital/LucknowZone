import { useState } from "react";
import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";

// Firebase imports
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddBlogs() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
    type: "blog",
    category: "Blog",
  });

  const [uploading, setUploading] = useState(false);

  // Handle text inputs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Upload image to Firebase
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const storageRef = ref(storage, `blogImages/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    setForm({ ...form, image: downloadURL });
    setUploading(false);
  };

  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/news", form);

    alert("Blog added successfully!");

    // Reset form
    setForm({
      title: "",
      content: "",
      image: "",
      tags: "",
      type: "blog",
      category: "Blog",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center mt-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-xl shadow-xl rounded-2xl p-8 border-t-4 border-red-600"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Add Blog</h1>

          {/* Title */}
          <label className="font-semibold">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-3 rounded-md mb-4"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* Content */}
          <label className="font-semibold">Blog Content</label>
          <textarea
            name="content"
            className="w-full border p-3 rounded-md mb-4"
            rows="6"
            value={form.content}
            onChange={handleChange}
            required
          />

          {/* Upload Image */}
          <label className="font-semibold">Upload Image from PC</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded-md mb-4"
            onChange={handleImageUpload}
          />

          {uploading && (
            <p className="text-red-600 text-sm mb-3">Uploading image...</p>
          )}

          {/* URL Input */}
          <label className="font-semibold">Or Paste Image URL</label>
          <input
            type="text"
            name="image"
            className="w-full border p-3 rounded-md mb-4"
            value={form.image}
            onChange={handleChange}
          />

          {/* Tags */}
          <label className="font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            className="w-full border p-3 rounded-md mb-6"
            value={form.tags}
            onChange={handleChange}
          />

          {/* Submit */}
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold w-full py-3 rounded-lg">
            Publish Blog
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
