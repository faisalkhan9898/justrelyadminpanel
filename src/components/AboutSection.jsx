import React, { useEffect, useState } from "react";
import api, { BASE } from "../api/axios";
import RichTextEditor from "./RichTextEditor";

const AboutSection = () => {
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [image, setImage] = useState(null);
  const [aboutList, setAboutList] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ Fetch About Data
  const fetchAbout = async () => {
    try {
      const res = await api.get("/about");
      setAboutList(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      console.error("Fetch error:", error);
      setAboutList([]);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ✅ Submit (Add + Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("paragraph", paragraph);
      if (image) formData.append("image", image);

      if (editId) {
        const res = await api.put(`/about/${editId}`, formData);

        setAboutList((prev) =>
          prev.map((item) =>
            item._id === editId ? res.data : item
          )
        );

        setEditId(null);
      } else {
        const res = await api.post("/about", formData);
        setAboutList((prev) => [res.data, ...prev]);
      }

      setHeading("");
      setParagraph("");
      setImage(null);

    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong!");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
      await api.delete(`/about/${id}`);
      setAboutList((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed!");
    }
  };

  // ✅ Edit
  const handleEdit = (about) => {
    setHeading(about.heading);
    setParagraph(about.paragraph);
    setEditId(about._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
          About Us
        </h2>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Heading</label>
              <RichTextEditor
                value={heading}
                onChange={setHeading}
                placeholder="Write heading…"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Paragraph</label>
              <RichTextEditor
                value={paragraph}
                onChange={setParagraph}
                placeholder="Write paragraph content…"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {editId ? "Update About" : "Add About"}
            </button>

          </form>
        </div>

        {/* About List */}
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">
          About Sections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {aboutList.map((about) => (
            <div
              key={about._id}
              className="bg-white shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-xl transition"
            >
              {about.image && (
                <img
                  src={`${BASE}/uploads/${about.image}`}
                  alt=""
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <div
                className="text-lg font-semibold text-gray-800 rich-text-content"
                dangerouslySetInnerHTML={{ __html: about.heading }}
              />

              <div
                className="text-gray-600 text-sm mt-2 rich-text-content"
                dangerouslySetInnerHTML={{ __html: about.paragraph }}
              />

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => handleEdit(about)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(about._id)}
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

export default AboutSection;