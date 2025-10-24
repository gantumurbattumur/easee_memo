import React, { useState } from "react";

export default function MemoryPalace() {
  const [nickname, setNickname] = useState("");
  const [places, setPlaces] = useState([]);
  const [currentPlace, setCurrentPlace] = useState("");
  const [savedPalaces, setSavedPalaces] = useState([]);
  const [message, setMessage] = useState("");

  // Add place on Enter key press
  const handleAddPlace = (e) => {
    if (e.key === "Enter" && currentPlace.trim()) {
      e.preventDefault();
      setPlaces([...places, currentPlace.trim()]);
      setCurrentPlace("");
    }
  };

  // Save palace to backend
  const savePalace = async () => {
    if (!nickname.trim() || places.length === 0) {
      setMessage("Please enter a nickname and at least one place.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/palace/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, spots: places }),
      });

      const data = await res.json();
      setMessage(data.message || "Memory Palace saved successfully!");
      setNickname("");
      setPlaces([]);
      setCurrentPlace("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save palace. Try again.");
    }
  };

  // Load saved palaces
  const loadPalaces = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/palace/list");
      const data = await res.json();
      setSavedPalaces(data.palaces || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load palaces.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏰 Create Your Memory Palace</h1>

      <input
        type="text"
        placeholder="Palace nickname (e.g., Home, Library...)"
        style={styles.input}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter next place (press Enter to add)"
        style={styles.input}
        value={currentPlace}
        onChange={(e) => setCurrentPlace(e.target.value)}
        onKeyDown={handleAddPlace}
      />

      <div style={styles.spotsContainer}>
        {places.length > 0 && <h3 style={styles.subtitle}>🧩 Current Places</h3>}
        <ul style={styles.spotList}>
          {places.map((place, i) => (
            <li key={i} style={styles.spotItem}>
              {i + 1}. {place}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.buttonRow}>
        <button onClick={savePalace} style={styles.buttonGreen}>
          Save Memory Palace
        </button>
        <button onClick={loadPalaces} style={styles.buttonGray}>
          View Saved Palaces
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {savedPalaces.length > 0 && (
        <div style={styles.palaceList}>
          <h3>📚 Saved Palaces</h3>
          <ul>
            {savedPalaces.map((p, i) => (
              <li key={i} style={styles.palaceItem}>
                <b>{p.nickname}</b>
                <ul>
                  {p.spots &&
                    p.spots.map((s, j) => (
                      <li key={j} style={styles.subSpot}>
                        {s}
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "1rem",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    transition: "border-color 0.2s",
  },
  spotsContainer: {
    marginTop: "15px",
    textAlign: "left",
  },
  subtitle: {
    fontWeight: "500",
    marginBottom: "5px",
  },
  spotList: {
    listStyleType: "none",
    padding: 0,
  },
  spotItem: {
    background: "#f7f7f7",
    marginBottom: "5px",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  buttonRow: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  buttonGreen: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonGray: {
    padding: "10px 20px",
    backgroundColor: "#555",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  message: {
    marginTop: "10px",
    color: "#333",
  },
  palaceList: {
    textAlign: "left",
    marginTop: "20px",
  },
  palaceItem: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "10px",
  },
  subSpot: {
    marginLeft: "20px",
  },
};
