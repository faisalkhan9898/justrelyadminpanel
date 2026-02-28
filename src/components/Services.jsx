import React, { useEffect, useState } from "react";
import api, { BASE } from "../api/axios";

const ServiceAdmin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ Fetch Services
  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ✅ Submit (Add + Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (icon) formData.append("icon", icon);

      if (editId) {
        const res = await api.put(`/services/${editId}`, formData);

        // Update instantly
        setServices((prev) =>
          prev.map((service) =>
            service._id === editId ? res.data : service
          )
        );

        setEditId(null);
      } else {
        const res = await api.post("/services", formData);

        // Add instantly
        setServices((prev) => [res.data, ...prev]);
      }

      setTitle("");
      setDescription("");
      setIcon(null);

    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong!");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await api.delete(`/services/${id}`);

      // Remove instantly
      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed!");
    }
  };

  // ✅ Edit
  const handleEdit = (service) => {
    setTitle(service.title);
    setDescription(service.description);
    setIcon(null);
    setEditId(service._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Service Admin Panel
        </h2>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              placeholder="Service Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Service Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIcon(e.target.files[0])}
              className="w-full"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {editId ? "Update Service" : "Add Service"}
            </button>

          </form>
        </div>

        {/* Service List */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">
          All Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-center mb-4">
                {service.icon && (
                  <img
                    src={`${BASE}/uploads/${service.icon}`}
                    alt=""
                    className="w-16 h-16 object-cover rounded-full border"
                  />
                )}
              </div>

              <h4 className="text-lg font-semibold text-center text-gray-800">
                {service.title}
              </h4>

              <p className="text-gray-600 text-sm text-center mt-2">
                {service.description}
              </p>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(service._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
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

export default ServiceAdmin;