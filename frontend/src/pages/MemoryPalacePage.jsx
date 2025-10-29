import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function MemoryPalace() {
  // ✅ Generate or reuse anonymous user_id
  if (!localStorage.getItem("user_id")) {
    localStorage.setItem("user_id", crypto.randomUUID());
  }
  const user_id = localStorage.getItem("user_id");

  const [nickname, setNickname] = useState("");
  const [places, setPlaces] = useState([""]);
  const [loadedPalaces, setLoadedPalaces] = useState([]);
  const [selectedPalace, setSelectedPalace] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const inputRefs = useRef([]);

  const addPlace = (focus = true) => {
    setPlaces((prev) => [...prev, ""]);
    setTimeout(() => {
      if (focus && inputRefs.current[places.length]) {
        inputRefs.current[places.length].focus();
      }
    }, 0);
  };

  const updatePlace = (i, value) => {
    const newPlaces = [...places];
    newPlaces[i] = value;
    setPlaces(newPlaces);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (places[i].trim() !== "") addPlace();
      else if (inputRefs.current[i + 1]) inputRefs.current[i + 1].focus();
    }
  };

  // --- SAVE / CREATE ---
  const savePalace = async () => {
    const palace = { nickname, spots: places.filter((p) => p.trim() !== "") };
    if (!palace.nickname || palace.spots.length === 0) {
      alert("Please enter a nickname and at least one place.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/palace/upload?user_id=${user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(palace),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      setNickname("");
      setPlaces([""]);
      setIsEditing(false);
      await loadPalaces();
    } catch (err) {
      console.error(err);
      alert("Error saving palace");
    }
  };

  // --- LOAD ---
  const loadPalaces = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/palace/list?user_id=${user_id}`
      );
      const data = await res.json();
      setLoadedPalaces(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load palaces!");
    }
  };

  // --- EDIT ---
  const editPalace = (palace) => {
    setNickname(palace.name || palace.nickname || "");
    let spots = palace.spots;
    if (typeof spots === "string") {
      try {
        spots = JSON.parse(spots);
      } catch {
        spots = [];
      }
    }
    setPlaces(spots || []);
    setSelectedPalace(palace);
    setIsEditing(true);
  };

  // --- UPDATE ---
  const updatePalace = async () => {
    if (!selectedPalace?.id) {
      alert("No palace selected to update");
      return;
    }
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/palace/update/${selectedPalace.id}?user_id=${user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname,
            spots: places.filter((p) => p.trim() !== ""),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update");
      await loadPalaces();
      setNickname("");
      setPlaces([""]);
      setSelectedPalace(null);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating palace");
    }
  };

  // --- DELETE ---
  const deletePalace = async (id) => {
    if (!window.confirm("Are you sure you want to delete this palace?")) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/palace/delete/${id}?user_id=${user_id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      await loadPalaces();
    } catch (err) {
      console.error(err);
      alert("Error deleting palace");
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-8">
      <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
        Build Your First Memory Palace 
      </h1>

      {/* Intro Description */}
      <p className="max-w-2xl text-center text-lg text-slate-700 mb-8 leading-relaxed">
        A <span className="font-semibold text-purple-600">Memory Palace</span> is a technique used by memory athletes and learners 
        to store information visually inside familiar locations — like your house, school, or favorite café.
        <br />
        Think of each <span className="font-semibold text-indigo-600">spot</span> you enter below as a “mental room” where you’ll 
        later place vivid, imaginative scenes that help you recall complex information effortlessly.
      </p>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 text-center border border-white/50">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your palace name..."
          className="w-full text-lg p-4 mb-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-200 focus:outline-none text-gray-800"
        />

        {places.map((p, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            value={p}
            onChange={(e) => updatePlace(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            placeholder={`Spot ${i + 1}`}
            className="w-full text-lg p-4 mb-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-200 focus:outline-none text-gray-800"
          />
        ))}

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <button
            onClick={() => addPlace()}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform"
          >
            + Add Spot
          </button>

          {!isEditing ? (
            <button
              onClick={savePalace}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Save Palace
            </button>
          ) : (
            <button
              onClick={updatePalace}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Update Palace
            </button>
          )}

          <button
            onClick={loadPalaces}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform"
          >
            View Palaces
          </button>
        </div>
        
      </div>
     

      {/* Loaded Palaces */}
      {loadedPalaces.length > 0 && (
        <div className="w-full max-w-2xl mt-10 bg-white/90 p-6 rounded-3xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-slate-700">
            📚 Your Saved Palaces
          </h3>
          {loadedPalaces.map((p) => (
            <div
              key={p.id}
              className="mb-4 border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-gray-800">
                  {p.name || p.nickname}
                </h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => editPalace(p)}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium hover:scale-105 transition-transform"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePalace(p.id)}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium hover:scale-105 transition-transform"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <ul className="list-disc ml-5 text-gray-700 text-left">
                {p.spots?.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/story/generate"
        className="mt-16 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:from-purple-600 hover:via-blue-600 hover:to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-transform transform hover:scale-110 shadow-lg"

      >
        Step 2. Generate Your Memory Story
      </Link>
    </div>
    
  );
}
