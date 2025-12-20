import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ClubDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  // Fetch club and check membership
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await API.get(`/clubs/${id}`);
        setClub(res.data);

        if (user && res.data.members?.some((m) => m._id === user._id || m === user._id)) {
          setJoined(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id, user]);

  const handleJoin = async () => {
    if (!user) return alert("You must be logged in to join this club.");
    if (joined) return alert("You are already part of this club!");

    try {
      await API.post(`/clubs/${id}/join`);
      setJoined(true);
      setClub((prev) => ({
        ...prev,
        members: [...prev.members, user._id],
      }));
      alert("Successfully joined the club!");
    } catch (err) {
      console.error(err);
      alert("Failed to join club.");
    }
  };

  const handleLeave = async () => {
    if (!user || !joined) return;

    try {
      await API.post(`/clubs/${id}/leave`);
      setJoined(false);
      setClub((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m._id !== user._id && m !== user._id),
      }));
      alert("You have left the club.");
      navigate("/clubs");
    } catch (err) {
      console.error(err);
      alert("Failed to leave club.");
    }
  };

  if (loading)
    return <p className="text-gray-500 text-center mt-10">Loading club details...</p>;
  if (!club)
    return <p className="text-red-500 text-center mt-10">Club not found</p>;

  return (
    <div className="min-h-screen bg-teal-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-800 mb-4">{club.name}</h2>
        <p className="text-teal-700 mb-6">{club.description || "No description provided."}</p>

        {/* Assigned Book */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-teal-800 mb-2">Assigned Book</h3>
          <p className="text-teal-600">{club.bookAssigned?.title || "No book assigned yet"}</p>
        </div>

        {/* Members */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-teal-800 mb-2">Members</h3>
          {club.members.length === 0 ? (
            <p className="text-teal-600">No members yet</p>
          ) : (
            <ul className="list-disc list-inside text-teal-700">
              {club.members.map((member, idx) => (
                <li key={idx}>{member.name || member}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Meeting Dates */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-teal-800 mb-2">Meeting Dates</h3>
          {club.meetingDates.length === 0 ? (
            <p className="text-teal-600">No meetings scheduled</p>
          ) : (
            <ul className="list-disc list-inside text-teal-700">
              {club.meetingDates.map((date, idx) => (
                <li key={idx}>{new Date(date).toLocaleString()}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Join / Leave Buttons */}
        <div className="flex gap-4 mt-6 flex-wrap">
          {joined ? (
            <button
              onClick={handleLeave}
              className="px-6 py-3 rounded-2xl font-semibold text-white bg-red-500 hover:bg-red-600 transition"
            >
              Leave Club
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joined}
              className={`px-6 py-3 rounded-2xl font-semibold text-white transition ${
                joined
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
              }`}
            >
              Join Club
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
git 