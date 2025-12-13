import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddBlogs() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    image: "",
    tags: "",
    type: "blog",
    category: "Blog",
  });

  const [editorMode, setEditorMode] = useState("markdown");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      slug: slugify(prev.title),
    }));
  }, [form.title]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const processImageFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadSuccess(false);

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      const base64 = await fileToBase64(compressedFile);

      setForm((prev) => ({
        ...prev,
        image: base64,
      }));
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to process image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        processImageFile(acceptedFiles[0]);
      }
    },
  });

  const handleGenerateTags = async () => {
    if (!form.title && !form.content) {
      alert("Add a title or some content first.");
      return;
    }

    setTagsLoading(true);
    try {
      const res = await API.post("/ai/generate-tags", {
        title: form.title,
        content: form.content,
      });

      const tags =
        Array.isArray(res.data.tags) ? res.data.tags.join(", ") : res.data.tags;

      setForm((prev) => ({ ...prev, tags }));
    } catch (err) {
      console.error(err);
    } finally {
      setTagsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please upload an image.");
      return;
    }

    await API.post("/blogs", form);

    alert("Blog added successfully!");

    setForm({
      title: "",
      slug: "",
      content: "",
      image: "",
      tags: "",
      type: "blog",
      category: "Blog",
    });
  };

  return (
    <DashboardLayout>
      {/* BACK BUTTON */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md px-4 py-2 
        rounded-xl shadow border border-gray-200 hover:bg-white transition text-sm"
      >
        ⬅ Back
      </button>

      <div className="flex justify-center mt-10 px-3">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-10 border"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-center">
            ✍️ Add New Blog
          </h1>

          {/* Title */}
          <label className="font-semibold text-gray-700">Blog Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-3 rounded-xl mb-4 shadow-sm"
            placeholder="Enter blog title"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* Slug */}
          <label className="font-semibold text-gray-700">SEO Slug</label>
          <input
            type="text"
            name="slug"
            className="w-full border p-3 rounded-xl mb-4 shadow-sm"
            value={form.slug}
            onChange={handleChange}
          />

          {/* Editor Mode */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <label className="font-semibold text-gray-700">Blog Content</label>

            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                type="button"
                onClick={() => setEditorMode("markdown")}
                className={`px-3 py-1 rounded-full border text-sm ${
                  editorMode === "markdown"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700"
                }`}
              >
                Markdown
              </button>

              <button
                type="button"
                onClick={() => setEditorMode("rich")}
                className={`px-3 py-1 rounded-full border text-sm ${
                  editorMode === "rich"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700"
                }`}
              >
                Rich Text
              </button>
            </div>
          </div>

          {/* Editor */}
          {editorMode === "markdown" ? (
            <textarea
              name="content"
              className="w-full border p-3 rounded-xl mb-5 shadow-sm min-h-[180px]"
              placeholder="Write blog content..."
              value={form.content}
              onChange={handleChange}
              required
            />
          ) : (
            <div className="mb-5">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, content: value }))
                }
                className="bg-white rounded-xl"
              />
            </div>
          )}

          {/* Image Upload */}
          <label className="font-semibold text-gray-700">
            Image (Drag & Drop)
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-4 text-center mb-4 cursor-pointer transition ${
              isDragActive ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600">
              Drag & drop or click to upload.
            </p>
          </div>

          {/* Preview */}
          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-full rounded-xl mb-4 shadow"
            />
          )}

          {/* Tags */}
          <label className="font-semibold text-gray-700">Tags</label>
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handleGenerateTags}
              disabled={tagsLoading}
              className="px-4 py-2 text-xs rounded-full border text-red-600 border-red-500 hover:bg-red-50"
            >
              {tagsLoading ? "Generating..." : "Generate Tags"}
            </button>
          </div>

          <input
            type="text"
            name="tags"
            className="w-full border p-3 rounded-xl mb-4 shadow-sm"
            placeholder="tech, trending, lifestyle"
            value={form.tags}
            onChange={handleChange}
          />

          <button className="bg-red-600 hover:bg-red-700 transition text-white font-bold w-full py-3 rounded-xl shadow-lg text-lg">
            Publish Blog 🚀
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
