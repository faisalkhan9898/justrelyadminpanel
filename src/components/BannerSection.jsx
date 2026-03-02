import React, { useEffect, useState } from "react";
import api, { BASE } from "../api/axios";
import RichTextEditor from "./RichTextEditor";

const BannerSection = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [banners, setBanners] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ Fetch Banners
  const fetchBanners = async () => {
    try {
      const res = await api.get("/banner");
      setBanners(res.data);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("buttonText", buttonText);
      if (video) formData.append("video", video);

      if (editId) {
        const res = await api.put(`/banner/${editId}`, formData);

        setBanners((prev) =>
          prev.map((item) =>
            item._id === editId ? res.data : item
          )
        );

        console.log(formData)

        setEditId(null);
      } else {
        const res = await api.post("/banner", formData);
        setBanners((prev) => [res.data, ...prev]);
      }

      // Reset
      setTitle("");
      setButtonText("");
      setVideo(null);

    } catch (error) {
      console.error("Submit failed:", error);
      alert("Something went wrong!");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await api.delete(`/banner/${id}`);
      setBanners((prev) => prev.filter((banner) => banner._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed!");
    }
  };

  // ✅ Edit
  const handleEdit = (banner) => {
    setTitle(banner.title);
    setButtonText(banner.buttonText);
    setVideo(null);
    setEditId(banner._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
          Banner Section
        </h2>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Title</label>
              <RichTextEditor
                value={title}
                onChange={setTitle}
                placeholder="Write banner title…"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Button Text</label>
              <RichTextEditor
                value={buttonText}
                onChange={setButtonText}
                placeholder="Write button text…"
              />
            </div>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="w-full"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {editId ? "Update Banner" : "Add Banner"}
            </button>

          </form>
        </div>

        {/* Banner List */}
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">
          All Banners
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-xl transition"
            >
              {banner.video && (
                <video
                  src={`${BASE}/uploads/${banner.video}`}
                  controls
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <div
                className="text-lg font-semibold text-gray-800 rich-text-content"
                dangerouslySetInnerHTML={{ __html: banner.title }}
              />

              <div className="text-gray-600 text-sm mt-2">
                <span>Button: </span>
                <span className="rich-text-content" dangerouslySetInnerHTML={{ __html: banner.buttonText }} />
              </div>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => handleEdit(banner)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(banner._id)}
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

export default BannerSection;