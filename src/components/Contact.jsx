import React, { useEffect, useState } from "react";
import api from "../api/axios"; // ✅ use custom axios

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({
    phone: "",
    whatsapp: "",
    address: "",
    email: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ FETCH CONTACT
  const fetchContact = async () => {
    try {
      const res = await api.get("/contact"); // no localhost
      if (res.data) {
        setContact(res.data);
        setForm(res.data);
      } else {
        setContact(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (contact?._id) {
        // UPDATE
        await api.put(`/contact/${contact._id}`, form);
        setMessage("Contact Updated Successfully!");
      } else {
        // ADD
        const res = await api.post("/contact", form);
        setContact(res.data);
        setMessage("Contact Added Successfully!");
      }

      setEditMode(false);
      fetchContact();
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    await api.delete(`/contact/${contact._id}`);
    setContact(null);
    setForm({
      phone: "",
      whatsapp: "",
      address: "",
      email: "",
    });
    setMessage("Contact Deleted Successfully!");
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Contact (Get In Touch) Admin
      </h1>

      {message && (
        <p className="mb-4 text-green-600 font-semibold">{message}</p>
      )}

      {/* VIEW MODE */}
      {contact && !editMode && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Contact Details</h2>

          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>WhatsApp:</strong> {contact.whatsapp}</p>
          <p><strong>Address:</strong> {contact.address}</p>
          <p><strong>Email:</strong> {contact.email}</p>

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {(!contact || editMode) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-lg"
        >
          <div className="space-y-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp"
              value={form.whatsapp}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              {contact ? "Update Contact" : "Add Contact"}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Contact;