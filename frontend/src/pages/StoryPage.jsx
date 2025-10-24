import { useState } from "react";
import StoryGenerator from "../components/StoryGenerator";

export default function StoryPage() {
  const [story, setStory] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-10 text-slate-40 py-12 px-4">
      <div className="w-full max-w-3xl flex flex-col items-center space-y-10">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-60 bg-clip-text text-transparent drop-shadow-sm">
          🧠 Memory Palace Story Generator
        </h1>

        {/* Generator Card */}
        <div className="w-full">
          <StoryGenerator onGenerate={setStory} />
        </div>

        {/* Generated Story Section */}
        {story && (
          <div className="w-full bg-white/70 backdrop-blur-xl shadow-2xl border border-white/30 rounded-3xl p-8 transition-all hover:shadow-purple-300/40">
            <h3 className="text-2xl font-semibold text-purple-70 mb-4">
              ✨ Generated Story
            </h3>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed text-lg">
              {story}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
