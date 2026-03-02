import { useEffect, useState } from "react";
import React from "react";
import api, { BASE } from "../api/axios";
import RichTextEditor from "./RichTextEditor"; // ✅ USE CUSTOM AXIOS

export default function OurProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch Projects
  const fetchProjects = async () => {
    const res = await api.get("/projects"); // ❌ removed localhost
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editId) {
        const res = await api.put(`/projects/${editId}`, data);
        setProjects((prev) =>
          prev.map((p) => (p._id === editId ? res.data : p))
        );
        setMessage("Project Updated Successfully!");
        setEditId(null);
      } else {
        const res = await api.post("/projects", data);
        setProjects([res.data, ...projects]);
        setMessage("Project Added Successfully!");
      }

      setFormData({ title: "", image: null });
      setPreview(null);
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(projects.filter((p) => p._id !== id));
  };

  // ✅ Edit
  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      image: null,
    });
    setEditId(project._id);
    setPreview(`${BASE}/uploads/${project.image}`); // ✅ dynamic base
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Projects Section
      </h1>

      {message && (
        <p className="text-center text-green-600 font-semibold mb-4">
          {message}
        </p>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
          <RichTextEditor
            value={formData.title}
            onChange={(html) => setFormData({ ...formData, title: html })}
            placeholder="Write project title…"
          />
        </div>

        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full mb-4"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover mb-4 rounded"
          />
        )}

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-green-600 text-white p-2 rounded transition"
        >
          {editId ? "Update Project" : "Add Project"}
        </button>
      </form>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
        {projects.map((project) => (
          <div
            key={project._id}
            className="relative rounded-xl overflow-hidden shadow-lg group"
          >
            <img
              src={`${BASE}/uploads/${project.image}`} // ✅ dynamic
              alt={project.title}
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
            />

            <div
              className="absolute bottom-0 bg-black bg-opacity-50 w-full text-white text-center py-2 rich-text-content"
              dangerouslySetInnerHTML={{ __html: project.title }}
            />

            <div className="absolute top-2 right-2 space-x-2">
              <button
                onClick={() => handleEdit(project)}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(project._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}