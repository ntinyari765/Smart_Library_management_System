import API from "../api/axios";

const ClubCard = ({ club }) => {
  const joinClub = async () => {
    await API.post(`/clubs/${club._id}/join`);
    alert("Joined club");
  };

  return (
    <div>
      <h3>{club.name}</h3>
      <p>{club.description}</p>
      <button onClick={joinClub}>Join</button>
    </div>
  );
};

export default ClubCard;
