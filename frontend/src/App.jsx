// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import MemoryPalacePage from "./pages/MemoryPalacePage";
import StoryPage from "./pages/StoryPage";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="app">
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "10px" }}>🏠 Home</Link>
        <Link to="/palace/upload" style={{ marginRight: "10px" }}>🏰 Memory Palace</Link>
        <Link to="/story/generate">📖 Generate Story</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/palace/upload" element={<MemoryPalacePage />} />
        <Route path="/palace/list" element={<MemoryPalacePage />} />
        <Route path="/story/generate" element={<StoryPage />} />
      </Routes>
    </div>
  );
}
