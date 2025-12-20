// src/pages/Clubs.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import ClubCard from "../components/ClubCard";
import Layout from "../components/Layout";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await API.get("/clubs");
        setClubs(res.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800">
            Book Clubs
          </h2>
          <p className="text-teal-700 mt-2">
            Join a community of readers and participate in engaging discussions.
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clubs.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No clubs available
            </p>
          ) : (
            clubs.map((club) => <ClubCard key={club._id} club={club} />)
          )}
        </div>
      </div>
    </Layout>
  );
}
