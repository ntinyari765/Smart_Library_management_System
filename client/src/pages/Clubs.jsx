import { useEffect, useState } from "react";
import API from "../api/axios";
import ClubCard from "../components/ClubCard";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      const res = await API.get("/clubs");
      setClubs(res.data);
    };
    fetchClubs();
  }, []);

  return (
    <div>
      <h2>Book Clubs</h2>
      {clubs.map((club) => (
        <ClubCard key={club._id} club={club} />
      ))}
    </div>
  );
};

export default Clubs;
