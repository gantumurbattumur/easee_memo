// frontend/src/Home.jsx
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">🧠 Welcome to Easee Memory</h1>
      
      <p className="max-w-2xl text-lg mb-4">
        The <b>Memory Palace</b> technique helps you memorize information by 
        associating it with familiar locations. By visualizing facts along 
        well-known places in your mind, recall becomes easier and faster.
      </p>

      <p className="max-w-2xl text-lg mb-6">
        Choosing locations you know well makes it easier to mentally navigate 
        through your palace. Each spot can represent a fact, image, or concept.
      </p>

      <a
        href="/memory-palace"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-lg font-medium transition"
      >
        Create Your Memory Palace
      </a>
    </div>
  );
}
