import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Detect backend URL automatically
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"   // running locally
    : "http://backend:8000";    // running inside Docker

function App() {
  const [name, setName] = useState('');
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState('');

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API_URL}/queue`);
      setQueue(res.data.queue);
      setError('');
    } catch (err) {
      setError('Failed to fetch queue.');
    }
  };

  const addName = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    try {
      await axios.post(`${API_URL}/queue`, { name });
      setName('');
      fetchQueue();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add name.');
    }
  };

  const removeName = async () => {
    try {
      await axios.delete(`${API_URL}/queue`);
      fetchQueue();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove name.');
    }
  };

  const clearQueue = async () => {
    try {
      await axios.delete(`${API_URL}/queue/clear`);
      fetchQueue();
    } catch (err) {
      setError('Failed to clear queue.');
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>FIFO Name Queue</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Enter name"
      />
      <button onClick={addName}>Add Name</button>
      <button onClick={removeName}>Remove First</button>
      <button onClick={clearQueue}>Clear Queue</button>
      <h2>Queue:</h2>
      <ul>
        {queue.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );
}

export default App;
