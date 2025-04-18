import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [type, setType] = useState("p");
  const [numbers, setNumbers] = useState([]);
  const [average, setAverage] = useState(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    try {
      console.log("Sending request with type:", type); 
      const response = await axios.post("http://localhost:5000/fetch", { type });

      console.log("Response received:", response.data); // Debugging log
      setNumbers(response.data.storedNumbers);
      setAverage(response.data.average);
      setError("");
    } catch (err) {
      console.error("Request failed:", err.response?.data || err.message);
      setError("Error fetching number.");
    }
  };

  return (
    <div className="container">
      <h2>Number Fetcher</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="p">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>
      <button onClick={handleFetch}>Fetch Number</button>
      {error && <p className="error">{error}</p>}
      <p><strong>Stored Numbers:</strong> {numbers.join(", ")}</p>
      {average !== null && <p><strong>Average:</strong> {average}</p>}
    </div>
  );
}

export default App;
