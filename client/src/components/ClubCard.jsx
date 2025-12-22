import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ClubCard = ({ club }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const { showToast } = useToast();

  // Check if user is already a member (persists after refresh)
  useEffect(() => {
    if (user && club.members) {
      setJoined(club.members.includes(user._id));
    }
  }, [club.members, user]);

  const handleJoin = async () => {
    if (!user) {
      showToast("You must be logged in to join a club.", "error");
      return;
    }
    if (joined) {
      showToast("You are already part of this club!", "info");
      return;
    }

    try {
      await API.post(`/clubs/${club._id}/join`);
      setJoined(true);
      showToast("Successfully joined the club!", "success");
      // Redirect to club details page
      navigate(`/clubs/${club._id}`);
    } catch (error) {
      console.error("Error joining club:", error);
      showToast("Failed to join club.", "error");
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-teal-800 mb-2">{club.name}</h3>
      <p className="text-teal-700 text-sm mb-2">{club.description}</p>
      <p className="text-teal-600 font-medium mb-4">
        Members: {club.members?.length || 0}
      </p>

      <button
        onClick={handleJoin}
        className={`mt-auto btn-primary px-4 py-2 rounded-full font-semibold text-white ${
          joined ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={joined}
      >
        {joined ? "Joined" : "Join Club"}
      </button>
    </div>
  );
};

export default ClubCard;
