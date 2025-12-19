import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await API.get(`/clubs/${id}`);
        setClub(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  if (loading)
    return <p className="text-gray-500 text-center mt-10">Loading club details...</p>;
  if (!club)
    return <p className="text-red-500 text-center mt-10">Club not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      {/* Club Name */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{club.name}</h2>

      {/* Club Description */}
      <p className="text-gray-600 mb-6">
        {club.description || "No description provided"}
      </p>

      {/* Assigned Book */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Assigned Book</h3>
        <p className="text-gray-500">
          {club.bookAssigned?.title || "No book assigned yet"}
        </p>
      </div>

      {/* Members */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Members</h3>
        {club.members.length === 0 ? (
          <p className="text-gray-500">No members yet</p>
        ) : (
          <ul className="list-disc list-inside text-gray-600">
            {club.members.map((member, idx) => (
              <li key={idx}>{member.name || member}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Meeting Dates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Meeting Dates</h3>
        {club.meetingDates.length === 0 ? (
          <p className="text-gray-500">No meetings scheduled</p>
        ) : (
          <ul className="list-disc list-inside text-gray-600">
            {club.meetingDates.map((date, idx) => (
              <li key={idx}>{new Date(date).toLocaleString()}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
