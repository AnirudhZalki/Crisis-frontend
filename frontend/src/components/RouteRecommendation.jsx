function statusClass(s) {
  return { safe: "route-safe", flooded: "route-flooded", partially_blocked: "route-partial" }[s] || "route-safe";
}
function statusLabel(s) {
  return { safe: "Safe", flooded: "Flooded", partially_blocked: "Partially Blocked" }[s] || s;
}

export default function RouteRecommendation({ routes, recommended }) {
  if (!routes || routes.length === 0) return null;
  const best = routes.find(r => r.route_id === recommended) || routes[0];

  return (
    <div className="card route-rec-card">
      <h2 className="section-title">🗺️ Recommended Evacuation Route</h2>
      <div className="route-best">
        <div className="route-best-header">
          <span className="path-badge">Route {best.route_id}</span>
          <h3>{best.route_name}</h3>
          <span className={`route-status-badge ${statusClass(best.route_status)}`}>{statusLabel(best.route_status)}</span>
          <span className="route-score-badge">Score: {best.route_score}/100</span>
        </div>
        <div className="route-meta-grid">
          <div className="route-meta-item"><span className="meta-label">Target Shelter</span><span className="meta-value">{best.target_shelter}</span></div>
          <div className="route-meta-item"><span className="meta-label">Distance</span><span className="meta-value">{best.distance_km} km</span></div>
          <div className="route-meta-item"><span className="meta-label">Est. Time</span><span className="meta-value">{best.estimated_time_min} min</span></div>
          <div className="route-meta-item"><span className="meta-label">Shelter Capacity</span><span className="meta-value">{best.shelter_capacity} spaces</span></div>
          <div className="route-meta-item"><span className="meta-label">Required Resources</span><span className="meta-value">{best.required_resources?.join(", ")}</span></div>
          <div className="route-meta-item"><span className="meta-label">Available Resources</span><span className="meta-value success-text">{best.available_resources?.length > 0 ? best.available_resources.join(", ") : "Standard vehicles"}</span></div>
        </div>
        <div className="route-explanation">{best.explanation}</div>
      </div>

      <h3 className="sub-title">All Route Options</h3>
      <div className="routes-compare">
        {routes.map(r => (
          <div key={r.route_id} className={`route-card ${r.selected ? "route-card-selected" : ""}`}>
            <div className="route-card-header">
              <span className="route-id">Route {r.route_id}</span>
              <span className={`route-status-badge ${statusClass(r.route_status)}`}>{statusLabel(r.route_status)}</span>
              {r.selected && <span className="best-tag">Selected</span>}
            </div>
            <div className="route-card-name">{r.route_name}</div>
            <div className="route-card-stats">
              <span>{r.distance_km} km</span>
              <span>{r.estimated_time_min} min</span>
              <span>Score: {r.route_score}</span>
            </div>
            <div className="route-card-shelter">{r.target_shelter}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
