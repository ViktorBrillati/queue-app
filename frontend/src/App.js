import React, { useState, useEffect } from "react";
import axios from "axios";

// Pick backend URL dynamically
// Pick API base URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL || // Use env var if set (Render)
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"       // Local dev
    : `${window.location.origin.replace(/\/$/, "")}/api`); // Default fallback


function App() {
  const [name, setName] = useState("");
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");

  const fetchQueue = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/queue`);
      setQueue(response.data.queue || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch queue");
      setQueue([]);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

 const addName = async () => {
  if (!name.trim()) return;
  try {
    const res = await axios.post(`${API_BASE_URL}/queue`, { name: name.trim() });
    setQueue(res.data.queue); // <-- must update queue here
    setName(""); // clear input
  } catch (err) {
    console.error("Failed to add name:", err);
    setError("Failed to add name");
  }
};


  const dequeue = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/queue`);
      fetchQueue();
    } catch (err) {
      console.error(err);
      setError("Failed to dequeue");
    }
  };

  const clearQueue = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/queue/clear`);
      fetchQueue();
    } catch (err) {
      console.error(err);
      setError("Failed to clear queue");
    }
  };

  return (
    <div className="App">
      <h1>FIFO Queue</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a name"
      />
      <button onClick={addName}>Add</button>
      <button onClick={dequeue}>Dequeue</button>
      <button onClick={clearQueue}>Clear Queue</button>

      <h2>Queue:</h2>
      <ul>
        {queue.map((n, idx) => (
          <li key={idx}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
