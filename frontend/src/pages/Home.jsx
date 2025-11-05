import React, { useRef, useState } from "react";
import { FaHome, FaBrain, FaRocket, FaRedoAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PalaceBuilder from "./MemoryPalacePage";
import StoryGenerator from "../components/StoryGenerator";

export default function Home() {
  const navigate = useNavigate();
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // 👇 This controls when Step 3 should reload palace list
  const [refreshPalaces, setRefreshPalaces] = useState(false);

  const scrollToSection = (index) => {
    if (sectionRefs[index].current) {
      sectionRefs[index].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // called by Step 2 after saving palace
  const handlePalaceSaved = () => setRefreshPalaces((prev) => !prev);

  return (
    <div className="scroll-smooth font-sans text-slate-800">
      {/* STEP 1 ------------------------------------------------ */}
      <section
        ref={sectionRefs[0]}
        className="min-h-screen flex flex-col justify-center items-center text-center px-8 bg-gradient-to-b from-white to-blue-50"
      >
        <h1 className="text-6xl font-extrabold mb-6 text-blue-600">Easee Memo</h1>
        <p className="max-w-2xl text-lg text-slate-600 leading-relaxed mb-12">
          Transform the way you memorize — build your memory palace, craft vivid AI stories,
          and test your recall all in one place.
        </p>

        <div className="bg-white shadow-lg rounded-3xl p-10 max-w-xl border border-slate-200">
          <FaHome size={50} className="mx-auto mb-6 text-blue-500" />
          <h2 className="text-3xl font-semibold mb-4">
            Step 1: Imagine Your Memory Palace
          </h2>
          <p className="text-slate-600 mb-8">
            Think of a familiar place — your home, school, or favorite café. Each spot will
            hold a piece of what you want to remember.
          </p>
          <button
            onClick={() => scrollToSection(1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
          >
            Next
          </button>
        </div>
      </section>

      {/* STEP 2 ------------------------------------------------ */}
      <section
        ref={sectionRefs[1]}
        className="min-h-screen flex flex-col justify-center items-center px-8 bg-gradient-to-b from-blue-50 to-purple-50"
      >
        <div className="text-center mb-10">
          <FaBrain size={50} className="mx-auto mb-6 text-purple-500" />
          <h2 className="text-4xl font-semibold mb-4">Step 2: Build Your Memory Palace</h2>
          <p className="max-w-2xl text-slate-600">
            Add locations one by one — doorway, couch, desk, window — to create your personal palace.
          </p>
        </div>

        {/* Palace Builder Component */}
        <PalaceBuilder onPalaceSaved={handlePalaceSaved} />

        <button
          onClick={() => scrollToSection(2)}
          className="mt-10 bg-blue-500 hover:bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
        >
          Next
        </button>
      </section>

      {/* STEP 3 ------------------------------------------------ */}
      <section
        ref={sectionRefs[2]}
        className="min-h-screen flex flex-col justify-center items-center px-8 bg-gradient-to-b from-purple-50 to-pink-50"
      >
        <div className="text-center mb-10">
          <FaRocket size={50} className="mx-auto mb-6 text-pink-500" />
          <h2 className="text-4xl font-semibold mb-4">Step 3: Generate a Story</h2>
          <p className="max-w-2xl text-slate-600">
            Enter a topic or list — vocabulary, facts, or concepts — and let the AI turn them
            into a vivid, walkable story through your palace.
          </p>
        </div>

        {/* Story Generator Component */}
        <StoryGenerator refreshTrigger={refreshPalaces} />
        
        <button
          onClick={() => scrollToSection(3)}
          className="mt-10 bg-blue-500 hover:bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
        >
          Next
        </button>
      </section>

      {/* STEP 4 ------------------------------------------------ */}
      <section
        ref={sectionRefs[3]}
        className="min-h-screen flex flex-col justify-center items-center text-center px-8 bg-gradient-to-b from-pink-50 to-white"
      >
        <div className="max-w-3xl bg-white shadow-lg rounded-3xl p-10 border border-slate-200">
          <FaRedoAlt size={50} className="mx-auto mb-6 text-green-500" />
          <h2 className="text-4xl font-semibold mb-4">Step 4: Recall & Review</h2>
          <p className="text-slate-600 mb-8">
            Picture the story inside your memory palace. Recall each detail, spot by spot,
            and strengthen your imagination into super-memory.
          </p>
          <button
            onClick={() => navigate("/story/recall")}
            className="bg-green-500 hover:bg-green-600 text-white px-10 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
          >
            Recall Now
          </button>
        </div>
      </section>
    </div>
  );
}
