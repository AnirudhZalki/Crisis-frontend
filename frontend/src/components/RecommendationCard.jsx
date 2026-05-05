function riskClass(level) {
  return { Low: "badge-low", Medium: "badge-medium", High: "badge-high", Critical: "badge-critical" }[level] || "badge-medium";
}

export default function RecommendationCard({ result }) {
  const best = result.decision_paths.find(p => p.path_id === result.recommended_path);
  if (!best) return null;
  return (
    <div className="card recommend-card">
      <h2 className="section-title">🏆 Recommended Decision Path</h2>
      <div className="recommend-header">
        <div className="path-badge">Path {best.path_id}</div>
        <h3>{best.name}</h3>
        <span className={`risk-badge ${riskClass(result.risk_level)}`}>{result.risk_level} Risk</span>
      </div>
      <p className="path-desc">{best.description}</p>
      <div className="score-grid">
        <div className="score-box"><span className="score-label">Final Score</span><span className="score-value primary">{best.final_decision_score}</span></div>
        <div className="score-box"><span className="score-label">Success Prob.</span><span className="score-value success">{best.success_probability}%</span></div>
        <div className="score-box"><span className="score-label">Failure Prob.</span><span className="score-value danger">{best.failure_probability}%</span></div>
        <div className="score-box"><span className="score-label">Confidence</span><span className="score-value info">{best.confidence_score}</span></div>
        <div className="score-box"><span className="score-label">Risk Score</span><span className="score-value warn">{best.risk_score}</span></div>
        <div className="score-box"><span className="score-label">Safety Score</span><span className="score-value success">{best.safety_score}</span></div>
      </div>
    </div>
  );
}
