import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-teal-50">
      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-teal-600 to-teal-500 text-white">
          <div className="max-w-7xl mx-auto px-6 py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              A Smarter Way to Read&nbsp; 
              <br className="hidden md:block" />
             and Connect
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-teal-100 mb-12">
              BookVerse combines a smart digital library with interactive book
              clubs, creating a focused reading experience built for community.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 hover:shadow-lg transition"
              >
                Browse Books
              </Link>

              <Link
                to="/register"
                className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 hover:shadow-lg transition"
              >
                Join Clubs
              </Link>

            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <h2 className="text-3xl font-semibold text-teal-800 text-center mb-16">
              Built for Readers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Feature
                title="Smart Library"
                description="Search, organize, and manage books with intelligent tracking and categorization."
              />
              <Feature
                title="Curated Book Clubs"
                description="Participate in guided reading groups with structured discussions."
              />
              <Feature
                title="Reader Community"
                description="Connect with thoughtful readers and grow through shared insights."
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-teal-100">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold text-teal-800 mb-6">
              Start Your Reading Journey Today
            </h3>

            <p className="text-teal-700 mb-10 max-w-xl mx-auto">
              Whether you want to explore books or join discussions, BookVerse
              gives you a structured and engaging experience.
            </p>

              <Link
                to="/register"
                className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 hover:shadow-lg transition"
              >
                Create an Account
              </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-teal-700 text-teal-100">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm">
          © {new Date().getFullYear()} BookVerse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
      <h4 className="text-xl font-semibold text-teal-800 mb-4">{title}</h4>
      <p className="text-teal-700 leading-relaxed">{description}</p>
    </div>
  );
}
