const FALLBACK_ROUTES = [
  {
    route_id: "A",
    name: "Shortest Flooded Route",
    status: "flooded",
    distance_km: 3.2,
    estimated_time_min: 18,
    route_score: 69,
    target_shelter: "AGM College Shelter",
    explanation: "Shortest route, but flood risk exists.",
  },
  {
    route_id: "B",
    name: "Longer Safe Road Route",
    status: "safe",
    distance_km: 6.5,
    estimated_time_min: 35,
    route_score: 81,
    target_shelter: "Government School Shelter",
    explanation: "Longer but safer and feasible.",
  },
  {
    route_id: "C",
    name: "Partially Blocked Rescue Route",
    status: "partially_blocked",
    distance_km: 4.8,
    estimated_time_min: 28,
    route_score: 70,
    target_shelter: "Community Hall Shelter",
    explanation: "Requires rescue team support.",
  },
];

const STATUS_META = {
  safe: { label: "Safe", color: "#15803d", bg: "#ecfdf3", border: "#bbf7d0" },
  flooded: { label: "Flooded", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  partially_blocked: { label: "Partial Block", color: "#d97706", bg: "#fff7ed", border: "#fed7aa" },
};

function normalize(r) {
  return {
    id: r.route_id || r.id || r.name?.charAt(0) || "?",
    name: r.name || r.route_name || "Unknown Route",
    status: r.status || "safe",
    distance: r.distance_km ?? r.distance ?? 0,
    time: r.estimated_time_min ?? r.time_min ?? 0,
    score: r.route_score ?? r.score ?? 0,
    shelter: r.target_shelter || r.shelter || "—",
    explanation: r.explanation || "",
  };
}

export default function RouteDecision3D({ routes, recommended }) {
  const list = Array.isArray(routes) && routes.length ? routes : FALLBACK_ROUTES;
  const rec = recommended || "B";

  return (
    <div className="route3d-card card">
      <div className="route3d-header">
        <span className="route3d-title">🗺️ 3D Route Decision Simulator</span>
        <p className="route3d-subtitle">
          Compares route safety, feasibility, resources, distance, and time.
        </p>
      </div>

      <div className="route3d-grid">
        {list.map((raw, i) => {
          const r = normalize(raw);
          const isRec = r.id === rec || r.name === rec;
          const sm = STATUS_META[r.status] || STATUS_META.safe;
          const tilt = i === 0 ? "route3d-tilt-left" : i === 2 ? "route3d-tilt-right" : "";

          return (
            <div
              key={r.id}
              className={`route3d-item ${tilt} ${isRec ? "route3d-recommended" : ""}`}
            >
              {isRec && <div className="route3d-rec-badge">⭐ Recommended</div>}

              <div className="route3d-item-top">
                <span className="route3d-id">Route {r.id}</span>
                <span
                  className="route3d-status"
                  style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}
                >
                  {sm.label}
                </span>
              </div>

              <div className="route3d-name">{r.name}</div>

              <div className="route3d-stats">
                <div className="route3d-stat">
                  <span className="route3d-stat-label">Distance</span>
                  <span className="route3d-stat-val">{r.distance} km</span>
                </div>
                <div className="route3d-stat">
                  <span className="route3d-stat-label">Time</span>
                  <span className="route3d-stat-val">{r.time} min</span>
                </div>
                <div className="route3d-stat">
                  <span className="route3d-stat-label">Score</span>
                  <span className="route3d-stat-val route3d-score">{r.score}/100</span>
                </div>
              </div>

              <div className="route3d-shelter">🏠 {r.shelter}</div>

              {r.explanation && (
                <div className="route3d-explanation">{r.explanation}</div>
              )}

              {/* Score bar */}
              <div className="route3d-bar-bg">
                <div
                  className="route3d-bar-fill"
                  style={{
                    width: `${r.score}%`,
                    background: isRec ? "#2563eb" : sm.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
