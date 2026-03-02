import React, { useEffect, useState } from "react";
import api, { BASE } from "../api/axios";
import RichTextEditor from "./RichTextEditor";

const TeamAdmin = () => {
  const [team, setTeam] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  // ✅ Fetch Team
  const fetchTeam = async () => {
    try {
      const res = await api.get("/team");
      setTeam(res.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // ✅ Handle Text Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle File Change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // ✅ Submit (Add + Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("role", formData.role);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        // UPDATE
        const res = await api.put(`/team/${editId}`, data);

        setTeam((prev) =>
          prev.map((member) =>
            member._id === editId ? res.data : member
          )
        );

        setMessage("Team Member Updated Successfully!");
        setEditId(null);
      } else {
        // CREATE
        const res = await api.post("/team", data);

        setTeam((prev) => [res.data, ...prev]);
        setMessage("Team Member Added Successfully!");
      }

      setFormData({
        name: "",
        role: "",
        description: "",
        image: null,
      });

    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Edit
  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description,
      image: null,
    });

    setEditId(member._id);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/team/${id}`);
      setTeam((prev) => prev.filter((member) => member._id !== id));
      setMessage("Team Member Deleted Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow max-w-4xl w-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Team Section</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <RichTextEditor
            value={formData.name}
            onChange={(html) => setFormData({ ...formData, name: html })}
            placeholder="Enter Name"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
          <RichTextEditor
            value={formData.role}
            onChange={(html) => setFormData({ ...formData, role: html })}
            placeholder="Enter Role"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <RichTextEditor
            value={formData.description}
            onChange={(html) => setFormData({ ...formData, description: html })}
            placeholder="Enter Description"
          />
        </div>

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border px-4 py-2 rounded-lg cursor-pointer"
        />

        <button
          type="submit"
          className="block bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg mx-auto p-2 cursor-pointer hover:scale-105 transition"
        >
          {editId ? "Update Team Member" : "Add Team Member"}
        </button>

        {message && (
          <p className="text-green-600 mt-2 text-sm text-center">
            {message}
          </p>
        )}
      </form>

      <hr className="my-6" />

      {/* Team List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member) => (
          <div key={member._id} className="border p-3 sm:p-4 rounded-lg shadow">
            {member.image && (
              <img
                src={`${BASE}/uploads/${member.image}`}
                alt={member.name}
                className="w-24 h-24 object-cover rounded-full mx-auto"
              />
            )}

            <div
              className="text-lg font-bold text-center mt-2 rich-text-content"
              dangerouslySetInnerHTML={{ __html: member.name }}
            />

            <div
              className="text-center text-gray-600 rich-text-content"
              dangerouslySetInnerHTML={{ __html: member.role }}
            />

            <div
              className="text-sm text-center mt-2 rich-text-content"
              dangerouslySetInnerHTML={{ __html: member.description }}
            />

            <div className="flex justify-between mt-5">
              <button
                onClick={() => handleEdit(member)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(member._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
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

export default TeamAdmin;