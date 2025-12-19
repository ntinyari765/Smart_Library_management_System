import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const ClubDetails = () => {
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

  if (loading) return <p>Loading club details...</p>;
  if (!club) return <p>Club not found</p>;

  return (
    <div>
      <h2>{club.name}</h2>
      <p>{club.description}</p>

      <h3>Assigned Book</h3>
      <p>{club.bookAssigned || "No book assigned yet"}</p>

      <h3>Members</h3>
      {club.members.length === 0 ? <p>No members yet</p> : (
        <ul>
          {club.members.map((member, idx) => (
            <li key={idx}>{member.name || member}</li>
          ))}
        </ul>
      )}

      <h3>Meeting Dates</h3>
      {club.meetingDates.length === 0 ? <p>No meetings scheduled</p> : (
        <ul>
          {club.meetingDates.map((date, idx) => (
            <li key={idx}>{new Date(date).toLocaleString()}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClubDetails;
