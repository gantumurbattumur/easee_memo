// import React, { useState } from "react";

// export default function MemoryPalace() {
//   const [nickname, setNickname] = useState("");
//   const [places, setPlaces] = useState([]);
//   const [currentPlace, setCurrentPlace] = useState("");
//   const [savedPalaces, setSavedPalaces] = useState([]);
//   const [message, setMessage] = useState("");

//   const handleAddPlace = (e) => {
//     if (e.key === "Enter" && currentPlace.trim()) {
//       e.preventDefault();
//       setPlaces([...places, currentPlace.trim()]);
//       setCurrentPlace("");
//     }
//   };

//   const savePalace = async () => {
//     if (!nickname.trim() || places.length === 0) {
//       setMessage("Please enter a nickname and at least one spot.");
//       return;
//     }
//     try {
//       const res = await fetch("http://127.0.0.1:8000/palace/upload", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ nickname, spots: places }),
//       });
//       const data = await res.json();
//       setMessage(data.message || "Memory Palace saved successfully!");
//       setNickname("");
//       setPlaces([]);
//       setCurrentPlace("");
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to save palace. Try again.");
//     }
//   };

//   const loadPalaces = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/palace/list");
//       const data = await res.json();
//       setSavedPalaces(data || []);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to load palaces.");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-start justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-12 px-4">
//       <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
//         <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
//           🏰 Create Your Memory Palace
//         </h1>

//         {/* Inputs */}
//         <input
//           type="text"
//           className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
//           value={nickname}
//           onChange={(e) => setNickname(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Enter next place (press Enter to add)"
//           className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
//           value={currentPlace}
//           onChange={(e) => setCurrentPlace(e.target.value)}
//           onKeyDown={handleAddPlace}
//         />

//         {/* Current Places */}
//         {places.length > 0 && (
//           <div className="w-full bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg">
//             <h3 className="font-semibold text-lg mb-2">🧩 Current Places</h3>
//             <ul className="list-disc list-inside space-y-1">
//               {places.map((place, i) => (
//                 <li key={i}>{place}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex space-x-4">
//           <button
//             onClick={savePalace}
//             className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
//           >
//             Save Memory Palace
//           </button>
//           <button
//             onClick={loadPalaces}
//             className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition"
//           >
//             View Saved Palaces
//           </button>
//         </div>

//         {/* Message */}
//         {message && <p className="text-purple-700">{message}</p>}

//         {/* Saved Palaces */}
//         {savedPalaces.length > 0 && (
//           <div className="w-full bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg">
//             <h3 className="font-semibold text-lg mb-2">📚 Saved Palaces</h3>
//             <ul className="space-y-2">
//               {savedPalaces.map((p, i) => (
//                 <li key={i}>
//                   <b>{p.nickname}</b>
//                   <ul className="list-disc list-inside ml-5 space-y-1">
//                     {p.spots?.map((s, j) => (
//                       <li key={j}>{s}</li>
//                     ))}
//                   </ul>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
