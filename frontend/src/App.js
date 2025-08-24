import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// -----------------------------
// Detect backend URL
// -----------------------------
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://queue-app-tf66.onrender.com"); // fallback for Render backend

function App() {
  const [queue, setQueue] = useState([]); // initialize empty
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Fetch queue on mount
  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/queue`);
      setQueue(res.data.queue || []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch queue:", err);
      setError("Failed to fetch queue");
    }
  };

  const addName = async () => {
    if (!name.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/queue`, { name: name.trim() });
      setQueue(res.data.queue || []);
      setName("");
      setError("");
    } catch (err) {
      console.error("Failed to add name:", err);
      setError("Failed to add name");
    }
  };

  const removeName = async () => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/queue`);
      setQueue(res.data.queue || []);
      setError("");
    } catch (err) {
      console.error("Failed to remove name:", err);
      setError("Failed to remove name");
    }
  };

  const clearQueue = async () => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/queue/clear`);
      setQueue(res.data.queue || []);
      setError("");
    } catch (err) {
      console.error("Failed to clear queue:", err);
      setError("Failed to clear queue");
    }
  };

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1>Name Queue</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={name}
          placeholder="Enter a name"
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "5px", width: "70%" }}
        />
        <button onClick={addName} style={{ marginLeft: "10px", padding: "5px 10px" }}>
          Add
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={removeName} style={{ padding: "5px 10px", marginRight: "10px" }}>
          Remove First
        </button>
        <button onClick={clearQueue} style={{ padding: "5px 10px" }}>
          Clear Queue
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <h2>Queue:</h2>
      {queue && queue.length > 0 ? (
        <ul>
          {queue.map((n, idx) => (
            <li key={idx}>{n}</li>
          ))}
        </ul>
      ) : (
        <div>Queue is empty</div>
      )}
    </div>
  );
}

export default App;
