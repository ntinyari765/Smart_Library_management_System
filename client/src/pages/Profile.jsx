// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Profile = () => {
  const { user } = useAuth();

  if (!user)
    return (
      <Layout>
        <p className="text-gray-500 text-center mt-10">Loading profile...</p>
      </Layout>
    );

  const readingHistory = user.readingHistory || [];
  const wishlist = user.wishlist || [];
  const clubsJoined = user.clubsJoined || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-800 mb-6">My Profile</h2>

        {/* User Info */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-teal-700 mb-2">User Info</h3>
          <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        </div>

        {/* Reading History */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Reading History</h3>
          {readingHistory.length === 0 ? (
            <p className="text-gray-500">No books read yet.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {readingHistory.map((book, i) => (
                <li key={i}>{book}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Wishlist */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Wishlist</h3>
          {wishlist.length === 0 ? (
            <p className="text-gray-500">No books in wishlist.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {wishlist.map((book, i) => (
                <li key={i}>{book}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Clubs Joined */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Clubs Joined</h3>
          {clubsJoined.length === 0 ? (
            <p className="text-gray-500">Not joined any clubs yet.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {clubsJoined.map((c, i) => {
                const id = c?._id || c;
                const label = c?.name || c?.title || id;
                return (
                  <li key={i}>
                    <Link to={`/clubs/${id}`} className="text-teal-600 hover:underline">
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
