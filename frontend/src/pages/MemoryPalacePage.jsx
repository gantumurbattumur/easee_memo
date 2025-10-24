// frontend/src/MemoryPalace.jsx
import React, { useState } from "react";

export default function MemoryPalace() {
  const [nickname, setNickname] = useState("");
  const [places, setPlaces] = useState([""]);
  const [saved, setSaved] = useState(null);

  const addPlace = () => setPlaces([...places, ""]);
  const updatePlace = (i, value) => {
    const newPlaces = [...places];
    newPlaces[i] = value;
    setPlaces(newPlaces);
  };

  const savePalace = async () => {
    const palace = { nickname, places: places.filter(p => p.trim() !== "") };

    if (!palace.nickname || palace.places.length === 0) {
      alert("Please enter a nickname and at least one place.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/palace/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(palace),
      });

      const data = await res.json();
      if (data.error) {
        alert("❌ Error saving palace: " + data.error);
      } else {
        setSaved(palace);
        setNickname("");
        setPlaces([""]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save palace to server!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
      <h2 className="text-3xl font-semibold mb-6">🏰 Create Your Memory Palace</h2>

      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Palace nickname (e.g., Home)"
        className="w-full max-w-md p-3 mb-4 rounded border border-gray-600 text-black"
      />

      <h3 className="text-xl font-medium mb-2">Places:</h3>
      <div className="w-full max-w-md space-y-2">
        {places.map((place, i) => (
          <input
            key={i}
            value={place}
            onChange={(e) => updatePlace(i, e.target.value)}
            placeholder={`Place ${i + 1}`}
            className="w-full p-3 rounded border border-gray-600 text-black transition-all focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={addPlace}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
        >
          + Add Place
        </button>
        <button
          onClick={savePalace}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
        >
          Save Palace
        </button>
      </div>

      {saved && (
        <p className="mt-4 text-green-400">
          ✅ Saved "{saved.nickname}" with {saved.places.length} places.
        </p>
      )}
    </div>
  );
}
