import React, { useEffect, useState } from "react";
import api, { BASE } from "../api/axios";
import RichTextEditor from "./RichTextEditor"; // ✅ use custom axios

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  // ✅ Fetch Testimonials
  const fetchTestimonials = async () => {
    const res = await api.get("/testimonials"); // no localhost
    setTestimonials(res.data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("message", form.message);
    if (form.image) formData.append("image", form.image);

    if (editId) {
      await api.put(`/testimonials/${editId}`, formData);
      setEditId(null);
    } else {
      await api.post("/testimonials", formData);
    }

    setForm({ name: "", role: "", message: "", image: null });
    fetchTestimonials();
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await api.delete(`/testimonials/${id}`);
    fetchTestimonials();
  };

  // ✅ Edit
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      role: item.role,
      message: item.message,
      image: null,
    });
    setEditId(item._id);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Testimonial Admin Panel
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-8 sm:mb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <RichTextEditor
              value={form.name}
              onChange={(html) => setForm({ ...form, name: html })}
              placeholder="Write name…"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <RichTextEditor
              value={form.role}
              onChange={(html) => setForm({ ...form, role: html })}
              placeholder="Write role…"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <RichTextEditor
              value={form.message}
              onChange={(html) => setForm({ ...form, message: html })}
              placeholder="Write testimonial message…"
            />
          </div>

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {editId ? "Update Testimonial" : "Add Testimonial"}
        </button>
      </form>

      {/* LIST */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          All Testimonials
        </h2>

        <div className="space-y-4">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border p-3 sm:p-4 rounded-lg gap-3"
            >
              <div className="flex items-center gap-4">
                {item.image && (
                  <img
                    src={`${BASE}/uploads/${item.image}`} // ✅ dynamic base
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-bold rich-text-content" dangerouslySetInnerHTML={{ __html: item.name }} />
                  <div
                    className="text-sm text-gray-500 rich-text-content"
                    dangerouslySetInnerHTML={{ __html: item.role }}
                  />
                  <div
                    className="text-sm rich-text-content"
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 px-4 py-1 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;