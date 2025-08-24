import React, { useState, useEffect } from "react";
import axios from "axios";

// Pick backend URL dynamically
const API_BASE =
  "https://queue-app-tf66.onrender.com/" || // Provided by Render (or you manually)
  (window.location.hostname === "localhost"
    ? "http://localhost:8000" // local dev
    : "http://backend:8000"); // Docker compose internal network

function App() {
  const [name, setName] = useState("");
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState(null);

  const fetchQueue = async () => {
    try {
      const response = await axios.get(`${API_BASE}/queue`);
      setQueue(response.data.queue);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch queue");
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const addName = async () => {
    if (!name.trim()) return; // prevent empty strings
    try {
      await axios.post(`${API_BASE}/queue`, { name });
      setName("");
      fetchQueue();
    } catch (err) {
      console.error(err);
      setError("Failed to add name");
    }
  };

  const dequeue = async () => {
    try {
      await axios.delete(`${API_BASE}/queue`);
      fetchQueue();
    } catch (err) {
      console.error(err);
      setError("Failed to dequeue");
    }
  };

  const clearQueue = async () => {
    try {
      await axios.delete(`${API_BASE}/queue/clear`);
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
