import React, { useEffect, useState } from "react";
import api, { BASE } from "../api/axios"; // ✅ use custom axios

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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Testimonial Admin Panel
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-10"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            className="border p-3 rounded-lg md:col-span-2"
            required
          ></textarea>

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
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          All Testimonials
        </h2>

        <div className="space-y-4">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border p-4 rounded-lg"
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
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.role}
                  </p>
                  <p className="text-sm">{item.message}</p>
                </div>
              </div>

              <div className="flex space-x-2">
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