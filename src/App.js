import React, { useState } from "react";
import "./App.css";

const mockCitizenRegistry = {
  BW001: { name: "Thabo Molefe", dob: "1950-06-01", status: "alive", last_verified: "2025-01-10" },
  BW002: { name: "Naledi Dube", dob: "1965-04-21", status: "deceased", last_verified: "2023-11-05" },
  BW003: { name: "Kabelo Moagi", dob: "2000-09-10", status: "alive", last_verified: "2025-04-15" },
};

const mockBenefitRegistry = {
  BW001: { type: "pension", last_paid: "2025-05-01" },
  BW002: { type: "pension", last_paid: "2025-05-01" },
  BW003: { type: "grant", last_paid: "2025-05-01" },
};

const mockUsers = {
  admin: { password: "secure123" },
};

function App() {
  const [inputID, setInputID] = useState("");
  const [result, setResult] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginTimestamp, setLoginTimestamp] = useState(null);
  const [loginError, setLoginError] = useState("");

  const verifyCitizen = (id) => {
    const citizen = mockCitizenRegistry[id];
    if (!citizen) return `No record found for ${id}`;
    if (citizen.status === "deceased") {
      return `ALERT: ${citizen.name} is deceased. Payment should be stopped.`;
    }
    return `${citizen.name} is alive. Last verified on ${citizen.last_verified}`;
  };

  const runDashboard = () => {
    const newAlerts = Object.keys(mockBenefitRegistry)
      .map((id) => {
        const status = verifyCitizen(id);
        return status.includes("ALERT") ? `${id} → ${status}` : null;
      })
      .filter(Boolean);
    setAlerts(newAlerts);
  };

  const handleLogin = () => {
    if (mockUsers[username] && mockUsers[username].password === password) {
      setAuthenticated(true);
      setLoginTimestamp(new Date().toLocaleString());
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Secure Login</h2>
        <div>
          <label>Username: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={handleLogin}>Login</button>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Citizen Verification & Fraud Detection</h1>
      <p>Logged in as {username} at {loginTimestamp}</p>

      <div style={{ margin: "20px 0" }}>
        <h3>Verify Individual Citizen</h3>
        <input
          placeholder="Enter Citizen ID (e.g. BW003)"
          value={inputID}
          onChange={(e) => setInputID(e.target.value)}
        />
        <button onClick={() => setResult(verifyCitizen(inputID))}>Verify</button>
        {result && <p><strong>Result:</strong> {result}</p>}
      </div>

      <div>
        <h3>Fraud Detection Dashboard</h3>
        <button onClick={runDashboard}>Run Check</button>
        <div>
          {alerts.length === 0 ? (
            <p>No fraudulent payments detected.</p>
          ) : (
            alerts.map((alert, idx) => <p key={idx}>{alert}</p>)
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
