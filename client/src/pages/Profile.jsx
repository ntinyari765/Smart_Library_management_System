import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h3>Reading History</h3>
      {user.readingHistory.length === 0 ? <p>No books read yet.</p> : (
        <ul>
          {user.readingHistory.map((book, i) => <li key={i}>{book}</li>)}
        </ul>
      )}

      <h3>Wishlist</h3>
      {user.wishlist.length === 0 ? <p>No books in wishlist.</p> : (
        <ul>
          {user.wishlist.map((book, i) => <li key={i}>{book}</li>)}
        </ul>
      )}

      <h3>Clubs Joined</h3>
      {user.clubsJoined.length === 0 ? <p>Not joined any clubs yet.</p> : (
        <ul>
          {user.clubsJoined.map((clubId, i) => <li key={i}>{clubId}</li>)}
        </ul>
      )}
    </div>
  );
};

export default Profile;
