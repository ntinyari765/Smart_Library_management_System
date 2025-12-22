// src/pages/AdminClubs.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Layout from "../../components/Layout";
import { useToast } from "../../context/ToastContext";

export default function AdminClubs() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bookAssigned: "",
    meetingDates: "",
  });
  const { showToast } = useToast();

  // Fetch clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await API.get("/clubs");
        setClubs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClubs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    try {
      // Parse and validate meeting dates; accept ISO or date strings separated by commas
      const dates = (formData.meetingDates || "")
        .split(",")
        .map((d) => new Date(d.trim()))
        .filter((d) => !isNaN(d.getTime()))
        .map((d) => d.toISOString());

      const payload = { ...formData, meetingDates: dates };

      await API.post("/clubs", payload);
      showToast("Club added!", "success");
      setFormData({ name: "", description: "", bookAssigned: "", meetingDates: "" });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to add club";
      showToast(msg, "error");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-teal-800">Admin Clubs Panel</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/books')}
              className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              Go to Admin Books
            </button>
          </div>
        </div>

        {/* Add Club Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Add New Club</h3>
          <form className="space-y-4" onSubmit={handleAddClub}>
            <input
              type="text"
              name="name"
              placeholder="Club Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="bookAssigned"
              placeholder="Assigned Book"
              value={formData.bookAssigned}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="meetingDates"
              placeholder="Meeting Dates (comma-separated)"
              value={formData.meetingDates}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">Enter dates as <code>YYYY-MM-DD</code> or ISO <code>YYYY-MM-DDTHH:mm</code>, separated by commas.</p>
            <button
              type="submit"
              className="bg-gradient-to-br from-teal-600 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:from-teal-700 hover:to-teal-600 transition"
            >
              Add Club
            </button>
          </form>
        </div>

        {/* Clubs List */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Existing Clubs</h3>
          {clubs.length === 0 ? (
            <p className="text-gray-500">No clubs added yet.</p>
          ) : (
            <ul className="space-y-3">
              {clubs.map((club) => (
                <li key={club._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{club.name}</p>
                    <p className="text-gray-600 text-sm">{club.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-yellow-400 px-3 py-1 rounded-lg font-medium">Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg font-medium">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
