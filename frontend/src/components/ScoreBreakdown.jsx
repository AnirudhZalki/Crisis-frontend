import { useState, useEffect } from "react";
import { fetchScoreBreakdown } from "../api";

export default function ScoreBreakdown({ simulationId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (data) { setOpen(o => !o); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchScoreBreakdown(simulationId);
      setData(res.breakdowns);
      setOpen(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card breakdown-card">
      <div className="breakdown-header" onClick={load} style={{ cursor: "pointer" }}>
        <h2 className="section-title" style={{ marginBottom: 0, borderBottom: "none" }}>
          📊 Explainable Score Breakdown
        </h2>
        <span className="breakdown-toggle">{loading ? "⏳" : open ? "▲ Hide" : "▼ Show"}</span>
      </div>
      <p className="muted" style={{ marginTop: "8px", marginBottom: open ? "16px" : 0 }}>
        Understand why each path received its score — positive factors, negatives, and risk warnings.
      </p>

      {error && <div className="status-msg status-error">{error}</div>}

      {open && data && (
        <div className="breakdown-grid">
          {data.map(path => (
            <div key={path.path_id} className="breakdown-path-card">
              <div className="breakdown-path-header">
                <span className="path-badge">Path {path.path_id}</span>
                <span className="breakdown-path-name">{path.name}</span>
                <span className="breakdown-score">Score: {path.final_score}</span>
              </div>

              {path.positives.length > 0 && (
                <div className="breakdown-section">
                  <div className="breakdown-section-title positive-title">✅ Positive Factors</div>
                  <ul className="breakdown-list">
                    {path.positives.map((f, i) => <li key={i} className="breakdown-positive">{f}</li>)}
                  </ul>
                </div>
              )}

              {path.negatives.length > 0 && (
                <div className="breakdown-section">
                  <div className="breakdown-section-title negative-title">❌ Negative Factors</div>
                  <ul className="breakdown-list">
                    {path.negatives.map((f, i) => <li key={i} className="breakdown-negative">{f}</li>)}
                  </ul>
                </div>
              )}

              {path.warnings.length > 0 && (
                <div className="breakdown-section">
                  <div className="breakdown-section-title warning-title">⚠️ Risk Warnings</div>
                  <ul className="breakdown-list">
                    {path.warnings.map((w, i) => <li key={i} className="breakdown-warning">{w}</li>)}
                  </ul>
                </div>
              )}

              {path.positives.length === 0 && path.negatives.length === 0 && path.warnings.length === 0 && (
                <p className="muted" style={{ fontSize: "0.82rem" }}>No specific factors identified.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
