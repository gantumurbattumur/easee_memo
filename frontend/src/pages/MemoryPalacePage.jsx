import React, { useState, useRef } from "react";

export default function MemoryPalace({ onPalaceSaved }) {
  // Generate or reuse anonymous user_id
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

  // --- Add a new spot field ---
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
        `https://easee-memo.onrender.com/palace/upload?user_id=${user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(palace),
        }
      );
      if (!res.ok) throw new Error("Failed to save");

      // Reset local state
      setNickname("");
      setPlaces([""]);
      setIsEditing(false);
      await loadPalaces();

      // Notify parent (Home.jsx) so Step 3 refreshes instantly
      if (onPalaceSaved) onPalaceSaved();

    } catch (err) {
      console.error(err);
      alert("Error saving palace");
    }
  };

  // --- LOAD FROM BACKEND ---
  const loadPalaces = async () => {
    try {
      const res = await fetch(
        `https://easee-memo.onrender.com/palace/list?user_id=${user_id}`
      );
      const data = await res.json();
      setLoadedPalaces(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load palaces!");
    }
  };

  // --- EDIT / UPDATE / DELETE ---
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

  const updatePalace = async () => {
    if (!selectedPalace?.id) {
      alert("No palace selected to update");
      return;
    }

    try {
      const res = await fetch(
        `https://easee-memo.onrender.com/palace/update/${selectedPalace.id}?user_id=${user_id}`,
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

      // Notify Home.jsx for refresh after editing too
      if (onPalaceSaved) onPalaceSaved();

    } catch (err) {
      console.error(err);
      alert("Error updating palace");
    }
  };

  const deletePalace = async (id) => {
    if (!window.confirm("Are you sure you want to delete this palace?")) return;

    try {
      const res = await fetch(
        `https://easee-memo.onrender.com/palace/delete/${id}?user_id=${user_id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      await loadPalaces();

      if (onPalaceSaved) onPalaceSaved();
    } catch (err) {
      console.error(err);
      alert("Error deleting palace");
    }
  };

  // --- UI ---
  return (
    <div className="w-full flex flex-col justify-center items-center text-center text-slate-800">
      {/* <h2 className="text-3xl font-semibold mb-4 text-blue-600">
        Build Your Memory Palace
      </h2>
      <p className="max-w-2xl text-slate-600 mb-8 text-base leading-relaxed">
        A <span className="font-semibold text-blue-500">Memory Palace</span> is
        a familiar place you can visualize to store information in different
        spots. Add a few locations below to begin building yours.
      </p> */}

      {/* Input Card */}
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your palace name..."
          className="w-full text-lg p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        {places.map((p, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            value={p}
            onChange={(e) => updatePlace(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            placeholder={`Spot ${i + 1}`}
            className="w-full text-lg p-3 mb-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        ))}

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            onClick={() => addPlace()}
            className="px-5 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            + Add Spot
          </button>

          {!isEditing ? (
            <button
              onClick={savePalace}
              className="px-5 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition"
            >
              Save Palace
            </button>
          ) : (
            <button
              onClick={updatePalace}
              className="px-5 py-2 rounded-md bg-yellow-400 text-white font-medium hover:bg-yellow-500 transition"
            >
              Update Palace
            </button>
          )}

          <button
            onClick={loadPalaces}
            className="px-5 py-2 rounded-md bg-gray-500 text-white font-medium hover:bg-gray-600 transition"
          >
            View Palaces
          </button>
        </div>
      </div>

      {/* Saved Palaces */}
      {loadedPalaces.length > 0 && (
        <div className="w-full max-w-2xl mt-10 bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">
            Your Saved Palaces
          </h3>
          {loadedPalaces.map((p) => (
            <div
              key={p.id}
              className="mb-3 p-4 border border-gray-200 rounded-lg text-left hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800">
                  {p.name || p.nickname}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => editPalace(p)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePalace(p.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <ul className="list-disc ml-5 text-gray-700">
                {p.spots?.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
