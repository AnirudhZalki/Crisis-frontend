import { useState, useEffect } from "react";
import { fetchResourceFreshness } from "../api";

function FreshnessBadge({ status }) {
  const map = {
    fresh:    { cls: "fresh-badge",    label: "🟢 Fresh" },
    warning:  { cls: "warning-badge",  label: "🟡 Warning" },
    outdated: { cls: "outdated-badge", label: "🔴 Outdated" },
  };
  const { cls, label } = map[status] || map.outdated;
  return <span className={`freshness-badge ${cls}`}>{label}</span>;
}

export default function ResourceFreshness() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchResourceFreshness());
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card freshness-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h2 className="section-title" style={{ marginBottom: 0, borderBottom: "none" }}>
          🕐 Resource Freshness Indicator
        </h2>
        <button className="btn-ghost small" onClick={load} disabled={loading}>
          {loading ? "⏳" : "↺ Refresh"}
        </button>
      </div>

      {data && (
        <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span className="muted">Overall Status:</span>
          <FreshnessBadge status={data.overall} />
          {data.overall === "outdated" && (
            <div className="freshness-warning-banner">
              ⚠️ Resource data may be outdated. Please request latest update before final approval.
            </div>
          )}
          {data.overall === "warning" && (
            <div className="freshness-warn-banner">
              🟡 Some resource data is aging. Consider refreshing before approval.
            </div>
          )}
        </div>
      )}

      {error && <div className="status-msg status-error">{error}</div>}

      {data?.details?.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Location</th>
                <th>Last Updated</th>
                <th>Age (min)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.details.map((r, i) => (
                <tr key={i} className={r.status === "outdated" ? "freshness-outdated-row" : r.status === "warning" ? "freshness-warning-row" : ""}>
                  <td>{r.role}</td>
                  <td>{r.location}</td>
                  <td style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{r.updated_at?.slice(0, 19).replace("T", " ")}</td>
                  <td>{r.age_minutes}</td>
                  <td><FreshnessBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.details?.length === 0 && (
        <p className="muted" style={{ fontSize: "0.84rem" }}>
          No resource updates found. Ask role officers to submit their resource data first.
        </p>
      )}
    </div>
  );
}
