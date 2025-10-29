import { useState, useEffect } from "react";

export default function StoryGenerator({ onGenerate }) {
  const [palaces, setPalaces] = useState([]);
  const [selectedPalace, setSelectedPalace] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPalaces = async () => {
      try {
        const userId = localStorage.getItem("user_id") || "guest";
        const res = await fetch(`http://localhost:8000/palace/list?user_id=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch palaces");
        const data = await res.json();
        setPalaces(data || []);
      } catch (error) {
        console.error("Failed to fetch palaces:", error);
      }
    };
    fetchPalaces();
  }, []);

  const handleGenerate = async () => {
    if (!topic || !selectedPalace)
      return alert("Select a palace and enter a topic.");

    setLoading(true);
    try {
      // find the full palace object
      const palace = palaces.find(p => p.name === selectedPalace);
      if (!palace || !palace.spots || palace.spots.length === 0) {
        alert("Selected palace has no spots!");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          palace_spots: palace.spots // <-- send the actual spots array
        }),
      });

      const data = await res.json();
      onGenerate(data.story); // story keyed to spots
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 space-y-6 w-full border border-white/20 transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-3xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-2 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Generate Your Story
          </h2>
          <p className="text-slate-600 text-sm">Transform information into unforgettable narratives</p>
        </div>

        {/* Palace Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 pl-1">
            Memory Palace
          </label>
          <div className="relative group">
            <select
              className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-800 p-4 pr-10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all shadow-sm hover:shadow-md appearance-none cursor-pointer"
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 pl-1">
            Topic to Remember
          </label>
          <input
            type="text"
            placeholder="e.g., Chemical periodic table, Historical dates..."
            className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-800 placeholder-slate-400 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all shadow-sm hover:shadow-md"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full relative overflow-hidden p-4 rounded-2xl font-semibold text-white text-lg shadow-lg transition-all duration-300 group ${
            loading
              ? "bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 hover:bg-right hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating magic...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Generate Story</span>
              </>
            )}
          </span>
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </button>

        {/* <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>AI-powered memory enhancement</span>
        </div> */}
      </div>
    </div>
  );
}