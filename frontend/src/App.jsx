// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import MemoryPalacePage from "./pages/MemoryPalacePage";
import StoryPage from "./pages/StoryPage";
import Home from "./pages/Home";
import Recall from "./pages/Recall";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 flex justify-center gap-6 shadow-sm sticky top-0 z-50">
        <Link
          to="/"
          className="text-slate-700 font-semibold hover:text-purple-600 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/palace/list"
          className="text-slate-700 font-semibold hover:text-purple-600 transition-colors"
        >
          Memory Palaces
        </Link>
        {/* <Link
          to="/story/generate"
          className="text-slate-700 font-semibold hover:text-purple-600 transition-colors"
        >
          Generate Story
        </Link> */}
        {/* <Link
          to="/story/recall"
          className="text-slate-700 font-semibold hover:text-purple-600 transition-colors"
        >
          Recall
        </Link> */}
      </nav>

      {/* Page content area */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/palace/upload" element={<MemoryPalacePage />} />
          <Route path="/palace/list" element={<MemoryPalacePage />} />
          <Route path="/story/generate" element={<StoryPage />} />
          <Route path="/story/recall" element={<Recall />} />
        </Routes>
      </main>
    </div>
  );
}
