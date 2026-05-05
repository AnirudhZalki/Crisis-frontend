import { useState } from "react";
import { runWhatIf } from "../api";

const SCENARIOS = [
  { key: "increase_rainfall",  label: "🌧️ Increase Rainfall Severity",      desc: "+15 severity, +2 blocked roads" },
  { key: "remove_boats",       label: "🚤 Remove Boat Availability",         desc: "No water evacuation resources" },
  { key: "reduce_hospital",    label: "🏥 Reduce Hospital Capacity (50%)",   desc: "Hospital capacity halved" },
  { key: "shelter_full",       label: "🏠 Mark Nearest Shelter Full",        desc: "Primary shelter unavailable" },
  { key: "add_road_blockage",  label: "🚧 Add Road Blockage (+3 roads)",     desc: "3 more roads blocked" },
  { key: "delay_response",     label: "⏰ Delay Response by 2 Hours",        desc: "Response time window reduced" },
];

function DeltaBadge({ value, invert = false }) {
  if (value === undefined || value === null) return null;
  const positive = invert ? value < 0 : value > 0;
  const zero = value === 0;
  const cls = zero ? "delta-zero" : positive ? "delta-pos" : "delta-neg";
  const sign = value > 0 ? "+" : "";
  return <span className={`delta-badge ${cls}`}>{sign}{value}</span>;
}

function CompareRow({ label, orig, whatif, invert = false }) {
  const delta = typeof orig === "number" && typeof whatif === "number"
    ? Math.round((whatif - orig) * 10) / 10 : null;
  const changed = orig !== whatif;
  return (
    <tr className={changed ? "whatif-changed-row" : ""}>
      <td className="whatif-label">{label}</td>
      <td>{orig}{typeof orig === "number" && label.includes("%") ? "%" : ""}</td>
      <td className={changed ? "whatif-new-val" : ""}>{whatif}{typeof whatif === "number" && label.includes("%") ? "%" : ""}</td>
      <td>{delta !== null ? <DeltaBadge value={delta} invert={invert} /> : (changed ? <span className="delta-badge delta-neg">Changed</span> : <span className="delta-badge delta-zero">Same</span>)}</td>
    </tr>
  );
}

export default function WhatIfPanel({ originalInput, simulationId }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async (scenarioKey) => {
    setSelected(scenarioKey);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await runWhatIf(originalInput, scenarioKey);
      setResult(res);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card whatif-card">
      <h2 className="section-title">🔬 What-If Simulation Panel</h2>
      <p className="muted" style={{ marginBottom: "16px" }}>
        Test uncertainty scenarios to see how the AI recommendation changes under different conditions.
      </p>

      <div className="whatif-scenarios-grid">
        {SCENARIOS.map(s => (
          <button
            key={s.key}
            className={`whatif-scenario-btn ${selected === s.key ? "whatif-scenario-active" : ""}`}
            onClick={() => handleRun(s.key)}
            disabled={loading}
          >
            <span className="whatif-scenario-label">{s.label}</span>
            <span className="whatif-scenario-desc">{s.desc}</span>
          </button>
        ))}
      </div>

      {loading && <div className="status-msg status-info">⏳ Running what-if simulation...</div>}
      {error && <div className="status-msg status-error">{error}</div>}

      {result && (
        <div className="whatif-result">
          <div className="whatif-result-header">
            <span className="whatif-scenario-tag">Scenario: {result.scenario_label}</span>
            <div className="whatif-impact-pills">
              {result.impact.path_changed  && <span className="impact-pill impact-warn">⚠️ Path Changed</span>}
              {result.impact.route_changed && <span className="impact-pill impact-warn">⚠️ Route Changed</span>}
              {result.impact.risk_changed  && <span className="impact-pill impact-danger">🔴 Risk Level Changed</span>}
              {!result.impact.path_changed && !result.impact.route_changed && !result.impact.risk_changed &&
                <span className="impact-pill impact-ok">✅ Plan Stable</span>}
            </div>
          </div>

          <div className="table-wrap" style={{ marginTop: "14px" }}>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Original</th>
                  <th>What-If</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Recommended Path"   orig={result.original.path_name}        whatif={result.whatif.path_name} />
                <CompareRow label="Recommended Route"  orig={result.original.route_name}       whatif={result.whatif.route_name} />
                <CompareRow label="Risk Level"         orig={result.original.risk_level}       whatif={result.whatif.risk_level} />
                <CompareRow label="Final Score"        orig={result.original.final_score}      whatif={result.whatif.final_score} />
                <CompareRow label="Success Probability %" orig={result.original.success_probability} whatif={result.whatif.success_probability} />
                <CompareRow label="Safety Score"       orig={result.original.safety_score}     whatif={result.whatif.safety_score} />
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
