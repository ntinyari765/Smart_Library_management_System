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
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "", bookAssigned: "", meetingDates: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
      // Refresh list
      const res = await API.get('/clubs');
      setClubs(res.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to add club";
      showToast(msg, "error");
    }
  };

  const handleSaveEdit = async (id) => {
    setSaving(true);
    try {
      const dates = (editData.meetingDates || "")
        .split(",")
        .map((d) => new Date(d.trim()))
        .filter((d) => !isNaN(d.getTime()))
        .map((d) => d.toISOString());

      const payload = { ...editData, meetingDates: dates };
      const res = await API.put(`/clubs/${id}`, payload);
      showToast("Club updated", "success");
      setEditingId(null);
      setEditData({ name: '', description: '', bookAssigned: '', meetingDates: '' });
      // update local list
      setClubs((prev) => prev.map(c => c._id === id ? res.data : c));
    } catch (err) {
      console.error('Error updating club:', err);
      showToast(err.response?.data?.message || 'Error updating club', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this club? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await API.delete(`/clubs/${id}`);
      showToast('Club deleted', 'success');
      setClubs((prev) => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Error deleting club:', err);
      showToast(err.response?.data?.message || 'Error deleting club', 'error');
    } finally {
      setDeletingId(null);
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
              className="btn-primary px-6 py-3 rounded-full font-semibold"
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
                  <div className="flex-1">
                    {editingId === club._id ? (
                      <div className="space-y-2">
                        <input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                        <input
                          value={editData.bookAssigned}
                          onChange={(e) => setEditData({ ...editData, bookAssigned: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(club._id)}
                            disabled={saving}
                            className="bg-teal-600 text-white px-3 py-1 rounded-lg font-medium"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditData({ name: '', description: '', bookAssigned: '', meetingDates: '' }); }}
                            className="bg-gray-200 px-3 py-1 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">{club.name}</p>
                        <p className="text-gray-600 text-sm">{club.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {editingId !== club._id && (
                      <>
                        <button
                          onClick={() => { setEditingId(club._id); setEditData({ name: club.name || '', description: club.description || '', bookAssigned: (club.bookAssigned && (club.bookAssigned._id || club.bookAssigned)) || '', meetingDates: (club.meetingDates || []).join(', ') }); }}
                          className="bg-yellow-400 px-3 py-1 rounded-lg font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(club._id)}
                          disabled={deletingId === club._id}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg font-medium"
                        >
                          {deletingId === club._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
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
