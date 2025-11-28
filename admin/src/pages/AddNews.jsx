import { useState } from "react";
import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddNews() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    type: "news",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const storageRef = ref(storage, `newsImages/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    setForm({ ...form, image: downloadURL });

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/news", form);

    alert("News added!");
    setForm({
      title: "",
      description: "",
      category: "",
      image: "",
      type: "news",
    });
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

          {/* Upload from PC */}
          <label>Upload Image from PC</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded-md mb-4"
            onChange={handleImageUpload}
          />

          {uploading && <p className="text-red-600 mb-3">Uploading...</p>}

          {/* URL input */}
          <label>Or Paste Image URL</label>
          <input
            type="text"
            name="image"
            className="w-full border p-3 rounded-md mb-6"
            value={form.image}
            onChange={handleChange}
          />

          <button className="bg-red-600 hover:bg-red-700 text-white font-bold w-full py-3 rounded-lg">
            Publish News
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
