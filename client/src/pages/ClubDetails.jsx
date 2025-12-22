// src/pages/ClubDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";

export default function ClubDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

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
    if (!user) {
      showToast("You must be logged in to join this club.", "error");
      return;
    }
    if (joined) {
      showToast("You are already part of this club!", "info");
      return;
    }

    try {
      await API.post(`/clubs/${id}/join`);
      setJoined(true);
      setClub((prev) => ({ ...prev, members: [...prev.members, user._id] }));
      showToast("Successfully joined the club!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to join club.", "error");
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
      showToast("You have left the club.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to leave club.", "error");
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="text-gray-500 text-center mt-10">Loading club details...</p>
      </Layout>
    );
  if (!club)
    return (
      <Layout>
        <p className="text-red-500 text-center mt-10">Club not found</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-teal-800 mb-2">{club.name}</h2>
        <p className="text-gray-600 mb-6">{club.description || "No description provided"}</p>

        {/* Assigned Book */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Assigned Book</h3>
          <p className="text-gray-500">{club.bookAssigned?.title || "No book assigned yet"}</p>
        </div>

        {/* Members */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Members</h3>
          {club.members.length === 0 ? (
            <p className="text-gray-500">No members yet</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {club.members.map((member, idx) => (
                <li key={idx}>{member.name || member}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Meeting Dates */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Meeting Dates</h3>
          {club.meetingDates.length === 0 ? (
            <p className="text-gray-500">No meetings scheduled</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {club.meetingDates.map((date, idx) => (
                <li key={idx}>{new Date(date).toLocaleString()}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Join / Leave Buttons */}
        <div className="flex gap-4">
          {joined ? (
            <button
              onClick={handleLeave}
              className="px-6 py-2 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition"
            >
              Leave Club
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className={`px-6 py-2 rounded-full font-semibold text-white transition ${
                joined
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
              }`}
              disabled={joined}
            >
              Join Club
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
