import { useEffect, useState } from "react";
import { fetchHistory, fetchSimulation } from "../api";

function riskClass(level) {
  return { Low: "badge-low", Medium: "badge-medium", High: "badge-high", Critical: "badge-critical" }[level] || "badge-medium";
}

export default function History({ onLoad }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setItems(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleView = async (id) => {
    try {
      const sim = await fetchSimulation(id);
      onLoad(sim);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {}
  };

  return (
    <div className="card">
      <div className="history-header">
        <h2 className="section-title">📜 Simulation History</h2>
        <button className="btn-ghost small" onClick={load}>↺ Refresh</button>
      </div>
      {loading && <p className="muted">Loading...</p>}
      {!loading && items.length === 0 && <p className="muted">No simulations yet. Run your first simulation above.</p>}
      <div className="history-list">
        {items.map((item) => (
          <div key={item.simulation_id} className="history-item">
            <div className="history-info">
              <strong>{item.disaster_type}</strong> — {item.location}
              <br />
              <small className="muted">{new Date(item.created_at).toLocaleString()}</small>
            </div>
            <div className="history-meta">
              <span className={`risk-badge ${riskClass(item.risk_level)}`}>{item.risk_level}</span>
              <span className="path-mini">Path {item.recommended_path}</span>
              <span className="score-mini">{item.final_score}/100</span>
              <button className="btn-ghost small" onClick={() => handleView(item.simulation_id)}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
