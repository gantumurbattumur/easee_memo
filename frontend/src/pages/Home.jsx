// frontend/src/pages/Home.jsx
import React from "react";
import { FaHome, FaBrain, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  const steps = [
    {
      icon: <FaHome size={40} />,
      title: "1. Pick a Place You Know",
      description:
        "Choose a familiar place — your home, your school, or your favorite café. Picture the route through key spots like the door, sofa, kitchen, or balcony.",
    },
    {
      icon: <FaBrain size={40} />,
      title: "2. Create a Story",
      description:
        "Imagine a vivid and funny story happening at each spot. Connecting ideas with emotion or humor helps your brain retain information naturally.",
    },
    {
      icon: <FaRocket size={40} />,
      title: "3. Generate & Memorize",
      description:
        "Use Easee Memory’s AI-powered story generator to bring your palace to life. Learn and recall information faster through imagination.",
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col items-center p-8 font-sans">
      <h1 className="text-6xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
        Welcome to Easee Memory
      </h1>

      <p className="max-w-3xl text-center text-xl mb-16 text-slate-700 leading-relaxed">
        Transform the way you memorize using the{" "}
        <b className="text-purple-600">Memory Palace</b> technique — powered by{" "}
        <span className="text-blue-600 font-semibold">AI</span> to make
        learning faster, visual, and unforgettable.
      </p>

      {/* Steps Section */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-white/60 hover:border-purple-300 transition transform hover:scale-105 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center"
          >
            <div className="mb-5 text-purple-600">{step.icon}</div>
            <h2 className="text-2xl font-bold mb-3 text-slate-800">
              {step.title}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <Link
        to="/palace/upload"
        className="mt-16 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:from-purple-600 hover:to-white-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-transform transform hover:scale-110 shadow-lg"
      >
        Create Your Memory Palace
      </Link>

      {/* Footer */}
      <footer className="mt-20 text-slate-500 text-sm">
        © {new Date().getFullYear()} Easee Memory — Making learning truly memorable.
      </footer>
    </div>
  );
}
