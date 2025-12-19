import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ClubCard = ({ club }) => {
  const { user } = useAuth();
  const [joined, setJoined] = useState(club.members?.includes(user?._id));

  const handleJoin = async () => {
    if (!user) {
      alert("You must be logged in to join a club");
      return;
    }

    try {
      await API.post(`/clubs/${club._id}/join`, { userId: user._id });
      setJoined(true);
      alert("Successfully joined the club!");
    } catch (error) {
      console.error("Error joining club:", error);
      alert("Failed to join club");
    }
  };

  const handleLeave = async () => {
    if (!user) return;

    try {
      await API.post(`/clubs/${club._id}/leave`, { userId: user._id });
      setJoined(false);
      alert("You have left the club.");
    } catch (error) {
      console.error("Error leaving club:", error);
      alert("Failed to leave club");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col p-6">
      <h3 className="text-xl font-semibold text-teal-800 mb-2">{club.name}</h3>
      <p className="text-teal-700 text-sm mb-2">{club.description}</p>
      <p className="text-teal-600 font-medium mb-4">
        Members: {club.members?.length || 0}
      </p>

      {joined ? (
        <button
          onClick={handleLeave}
          className="mt-auto px-4 py-2 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition"
        >
          Leave Club
        </button>
      ) : (
        <button
          onClick={handleJoin}
          className="mt-auto px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-br from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 transition"
        >
          Join Club
        </button>
      )}
    </div>
  );
};

export default ClubCard;
