import React, { useEffect, useState } from "react";
import api, { BASE } from "../api/axios";
import RichTextEditor from "./RichTextEditor";

const USPSection = () => {
  const [usps, setUsps] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    icon: null,
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch USP
  const fetchUsps = async () => {
    try {
      const res = await api.get("/usp");
      setUsps(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUsps();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      icon: e.target.files[0],
    });
  };

  // ✅ Submit (Add + Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.icon) {
        data.append("icon", formData.icon);
      }

      if (editId) {
        const res = await api.put(`/usp/${editId}`, data);

        setUsps((prev) =>
          prev.map((item) =>
            item._id === editId ? res.data : item
          )
        );

        setMessage("USP Updated Successfully!");
        setEditId(null);
      } else {
        const res = await api.post("/usp", data);
        setUsps((prev) => [res.data, ...prev]);
        setMessage("USP Added Successfully!");
      }

      setFormData({
        title: "",
        icon: null,
      });

    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/usp/${id}`);
      setUsps((prev) => prev.filter((item) => item._id !== id));
      setMessage("USP Deleted Successfully!");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ✅ Edit
  const handleEdit = (usp) => {
    setFormData({
      title: usp.title,
      icon: null,
    });
    setEditId(usp._id);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow max-w-4xl w-full">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">USP Section</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">USP Title</label>
          <RichTextEditor
            value={formData.title}
            onChange={(html) => setFormData({ ...formData, title: html })}
            placeholder="Write USP title…"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border px-4 py-2 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          {editId ? "Update USP" : "Add USP"}
        </button>

        {message && (
          <p className="text-green-600 text-sm">{message}</p>
        )}
      </form>

      {/* USP List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {usps.map((usp) => (
          <div
            key={usp._id}
            className="border p-3 sm:p-4 rounded-lg shadow-sm"
          >
            {usp.icon && (
              <img
                src={`${BASE}/uploads/${usp.icon}`}
                alt=""
                className="w-16 h-16 object-cover mb-3"
              />
            )}

            <div
              className="font-semibold rich-text-content"
              dangerouslySetInnerHTML={{ __html: usp.title }}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(usp)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(usp._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default USPSection;