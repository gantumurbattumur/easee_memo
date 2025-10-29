import { useState } from "react";
import StoryGenerator from "../components/StoryGenerator";

export default function StoryPage() {
  const [story, setStory] = useState("");

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex flex-col justify-center items-center overflow-y-auto">
      {/* Page Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col space-y-10">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          Story Generator
        </h1>

        {/* Generator Card */}
        <StoryGenerator onGenerate={setStory} />

        {/* Generated Story Section */}
        {story && (
          <div className="w-full bg-white/70 backdrop-blur-xl shadow-2xl border border-white/30 rounded-3xl p-8 transition-all hover:shadow-purple-300/40">
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">
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

