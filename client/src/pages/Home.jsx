import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Welcome to Bookverse, A universe of books and readers connected.</h1>
      <p>Discover books, join clubs and track your reading journey.</p>
      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Home;
