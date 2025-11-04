import { useState, useEffect } from "react";

export default function StoryGenerator() {
  const [palaces, setPalaces] = useState([]);
  const [selectedPalace, setSelectedPalace] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(""); // ✅ store story locally

  // Load user's saved palaces
  useEffect(() => {
    const fetchPalaces = async () => {
      try {
        const userId = localStorage.getItem("user_id") || "guest";
        const res = await fetch(
          `https://easee-memo.onrender.com/palace/list?user_id=${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch palaces");
        const data = await res.json();
        setPalaces(data || []);
      } catch (error) {
        console.error("Failed to fetch palaces:", error);
      }
    };
    fetchPalaces();
  }, []);

  // Generate story from API
  const handleGenerate = async () => {
    if (!topic || !selectedPalace)
      return alert("Select a palace and enter a topic.");

    setLoading(true);
    setStory(""); // reset previous story
    try {
      const palace = palaces.find((p) => p.name === selectedPalace);
      if (!palace || !palace.spots || palace.spots.length === 0) {
        alert("Selected palace has no spots!");
        setLoading(false);
        return;
      }

      const res = await fetch("https://easee-memo.onrender.com/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          palace_spots: palace.spots,
        }),
      });

      const data = await res.json();
      setStory(data.story); // show inside same component
    } catch (error) {
      console.error("Error generating story:", error);
      alert("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center text-center">
      <h2 className="text-3xl font-semibold mb-4 text-blue-600">
        Generate a Story
      </h2>
      <p className="max-w-2xl text-slate-600 mb-8 text-base leading-relaxed">
        Enter a topic you want to memorize. The AI will turn it into a vivid,
        walkable story through your chosen memory palace.
      </p>

      {/* Card */}
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
        {/* Palace Selector */}
        <div className="mb-6 text-left">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Memory Palace
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            value={selectedPalace}
            onChange={(e) => setSelectedPalace(e.target.value)}
          >
            <option value="">Choose your palace...</option>
            {palaces.map((palace, i) => (
              <option key={i} value={palace.name}>
                {palace.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Input */}
        <div className="mb-6 text-left">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Topic to Remember
          </label>
          <input
            type="text"
            placeholder="e.g., Human anatomy, world capitals, programming terms..."
            className="w-full border border-gray-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition transform hover:scale-[1.02] ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>

        {/* Story Output */}
        {story && (
          <div className="mt-8 text-left bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              Generated Story
            </h3>
            <p className="text-slate-700 whitespace-pre-line">{story}</p>
          </div>
        )}
      </div>
    </div>
  );
}
