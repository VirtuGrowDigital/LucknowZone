import { useState, useEffect } from "react";
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

  // Drag & Drop Handler
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
      alert("Add a title or some content first to generate tags.");
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

      setForm((prev) => ({
        ...prev,
        tags: tags || prev.tags,
      }));
    } catch (err) {
      console.error(err);

      const text = `${form.title} ${form.content}`.toLowerCase();
      const words = Array.from(new Set(text.split(/\W+/)))
        .filter((w) => w.length > 3)
        .slice(0, 6);

      if (words.length) {
        setForm((prev) => ({
          ...prev,
          tags: words.join(", "),
        }));
        alert("AI endpoint not available. Generated simple tags instead.");
      } else {
        alert("Could not generate tags. Please try manually.");
      }
    } finally {
      setTagsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please upload an image or paste a URL.");
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

    setUploadSuccess(false);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center mt-10 px-3">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl w-full max-w-2xl shadow-2xl rounded-2xl p-10 border border-gray-200"
        >
          <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
            ✍️ Add New Blog
          </h1>

          {/* Title */}
          <label className="font-semibold text-gray-700">Blog Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-3 rounded-xl mb-4 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Enter blog title"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* Slug */}
          <label className="font-semibold text-gray-700 flex items-center justify-between">
            SEO Slug
            <span className="text-xs text-gray-500">
              Auto-generated from title (you can edit)
            </span>
          </label>
          <input
            type="text"
            name="slug"
            className="w-full border p-3 rounded-xl mb-5 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
            value={form.slug}
            onChange={handleChange}
          />

          {/* Editor Mode */}
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-gray-700">Blog Content</label>
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => setEditorMode("markdown")}
                className={`px-3 py-1 rounded-full border ${
                  editorMode === "markdown"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("rich")}
                className={`px-3 py-1 rounded-full border ${
                  editorMode === "rich"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Rich Text
              </button>
            </div>
          </div>

          {/* Content */}
          {editorMode === "markdown" ? (
            <textarea
              name="content"
              className="w-full border p-3 rounded-xl mb-5 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
              rows="7"
              placeholder="Write your blog content (Markdown supported)..."
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
            Image (Drag & Drop or URL)
          </label>

          {/* Drag and Drop */}
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
              Drag & drop an image here, or click to select a file.
            </p>
          </div>

          {/* URL Input Only */}
          <div className="mb-4">
            <input
              type="text"
              name="image"
              className="w-full border p-3 rounded-lg shadow-sm"
              placeholder="Paste image URL (optional)"
              value={form.image}
              onChange={handleChange}
            />
          </div>

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

          {/* Tags */}
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-gray-700">
              Tags (comma separated)
            </label>
            <button
              type="button"
              onClick={handleGenerateTags}
              className="text-xs px-3 py-1 rounded-full border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60"
              disabled={tagsLoading}
            >
              {tagsLoading ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          <input
            type="text"
            name="tags"
            className="w-full border p-3 rounded-xl mb-8 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="tech, lifestyle, trending"
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
