import React, { useEffect, useState } from "react";

export default function Recall() {
  const [palaces, setPalaces] = useState([]);
  const [selectedPalace, setSelectedPalace] = useState("");
  const [recalls, setRecalls] = useState([]); // { spot, topic, answer }
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user's memory palaces
  useEffect(() => {
    const fetchPalaces = async () => {
      try {
        const userId = localStorage.getItem("user_id") || "guest";
        const res = await fetch(
          `https://easee-memo.onrender.com/palace/list?user_id=${userId}`
        );
        if (!res.ok) throw new Error("Failed to load palaces");
        const data = await res.json();
        setPalaces(data || []);
      } catch (err) {
        console.error("Failed to load palaces:", err);
      }
    };
    fetchPalaces();
  }, []);

  // When a palace is selected, populate spots with blank fields
  useEffect(() => {
    if (selectedPalace) {
      const palace = palaces.find((p) => p.name === selectedPalace);
      setRecalls(
        palace?.spots?.map((s) => ({ spot: s, topic: "", answer: "" })) || []
      );
      setFeedback("");
    }
  }, [selectedPalace]);

  const handleChange = (index, field, value) => {
    setRecalls((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

    const handleRecall = async () => {
    if (!selectedPalace)
        return alert("Please choose a memory palace before submitting.");

    setLoading(true);
    setFeedback("");

    try {
        const palace = palaces.find((p) => p.name === selectedPalace);
        const responses = [];

        // Only send non-empty topics or answers
        const filled = recalls.filter((r) => r.topic.trim() || r.answer.trim());

        if (filled.length === 0) {
        alert("Nothing to recall yet — fill at least one spot.");
        setLoading(false);
        return;
        }

        for (const r of filled) {
        const res = await fetch("https://easee-memo.onrender.com/story/recall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            topic: r.topic || "",
            answer: r.answer || "",
            palace_spots: palace?.spots || [],
            }),
        });
        const data = await res.json();
        responses.push({
            spot: r.spot,
            topic: r.topic || "(no topic)",
            feedback: data.feedback || data.story || "No feedback",
        });
        }

        const summary = responses
        .map(
            (r, i) =>
            `${i + 1}. ${r.spot} — **${r.topic}** → ${r.feedback}`
        )
        .join("\n");

        setFeedback(summary);
    } catch (err) {
        console.error("Error checking recall:", err);
        alert("Error checking recall. Try again.");
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white py-16 px-6 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 border border-slate-200">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-600">
          Recall Practice
        </h1>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          Use your <span className="font-semibold text-blue-500">Memory Palace</span> spots below as cues.  
          For each location, enter the topic you associated there and what you recall about it.
        </p>

        {/* Palace Selector */}
        <div className="mb-8 text-left">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Select Memory Palace
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            value={selectedPalace}
            onChange={(e) => setSelectedPalace(e.target.value)}
          >
            <option value="">Choose your palace...</option>
            {palaces.map((p, i) => (
              <option key={i} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Palace Spots List */}
        {selectedPalace && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Palace Spots
            </h3>
            <ol className="list-decimal ml-6 space-y-6">
              {recalls.map((r, i) => (
                <li key={i} className="space-y-3">
                  <div className="font-semibold text-slate-700">
                    Spot: {r.spot}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter topic for this location..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    value={r.topic}
                    onChange={(e) =>
                      handleChange(i, "topic", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Write your recalled description..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none"
                    value={r.answer}
                    onChange={(e) =>
                      handleChange(i, "answer", e.target.value)
                    }
                  />
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Submit Button */}
        {selectedPalace && (
          <button
            onClick={handleRecall}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition transform hover:scale-[1.02] ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Checking..." : "Submit Recall"}
          </button>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-xl p-6 text-left overflow-auto whitespace-pre-wrap">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              Feedback
            </h3>
            <p className="text-slate-700">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
