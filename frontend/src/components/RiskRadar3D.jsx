const FALLBACK = {
  risk_score: 72,
  risk_level: "High",
  success_probability: 78,
  failure_probability: 22,
  final_score: 81,
  recommended_path: "Path B",
  recommended_route: "Route B",
  llm_used: false,
};

const LEVEL_COLOR = {
  Low: "#15803d",
  Medium: "#d97706",
  High: "#c2410c",
  Critical: "#dc2626",
};

const LEVEL_BG = {
  Low: "#ecfdf3",
  Medium: "#fff7ed",
  High: "#fff3e8",
  Critical: "#fef2f2",
};

export default function RiskRadar3D({ result }) {
  const d = result
    ? {
        risk_score: result.risk_score ?? FALLBACK.risk_score,
        risk_level: result.risk_level ?? FALLBACK.risk_level,
        success_probability: result.success_probability ?? FALLBACK.success_probability,
        failure_probability: result.failure_probability ?? FALLBACK.failure_probability,
        final_score: result.final_score ?? FALLBACK.final_score,
        recommended_path: result.recommended_path ?? FALLBACK.recommended_path,
        recommended_route: result.recommended_route ?? FALLBACK.recommended_route,
        llm_used: result.llm_used ?? FALLBACK.llm_used,
      }
    : FALLBACK;

  const lvl = d.risk_level || "High";
  const lvlColor = LEVEL_COLOR[lvl] || "#c2410c";
  const lvlBg = LEVEL_BG[lvl] || "#fff3e8";

  const metrics = [
    { label: "Risk Score", value: `${d.risk_score}`, unit: "/100", color: lvlColor },
    { label: "Success Prob.", value: `${d.success_probability}`, unit: "%", color: "#15803d" },
    { label: "Failure Prob.", value: `${d.failure_probability}`, unit: "%", color: "#dc2626" },
    { label: "Final Score", value: `${d.final_score}`, unit: "/100", color: "#2563eb" },
  ];

  // SVG radar dots positions (angle, radius fraction)
  const dots = [
    { cx: 90, cy: 28, color: "#dc2626", label: "Risk" },
    { cx: 148, cy: 62, color: "#15803d", label: "Safe" },
    { cx: 130, cy: 130, color: "#2563eb", label: "Conf" },
    { cx: 42, cy: 118, color: "#d97706", label: "Warn" },
    { cx: 28, cy: 68, color: "#7c3aed", label: "Uncert" },
  ];

  return (
    <div className="risk3d-card card">
      <div className="risk3d-header">
        <span className="risk3d-title">🎯 3D Risk Radar</span>
        <span
          className="risk3d-level-badge"
          style={{ background: lvlBg, color: lvlColor, border: `1px solid ${lvlColor}` }}
        >
          {lvl} Risk
        </span>
        {d.llm_used && <span className="risk3d-llm-tag">🤖 LLM</span>}
      </div>

      <div className="risk3d-body">
        {/* Radar SVG */}
        <div className="risk3d-radar-wrap">
          <svg viewBox="0 0 180 180" className="risk3d-svg" aria-hidden="true">
            {/* Concentric rings */}
            {[72, 54, 36, 18].map((r) => (
              <circle key={r} cx="90" cy="90" r={r} fill="none" stroke="#bfdbfe" strokeWidth="1" />
            ))}
            {/* Cross hairs */}
            <line x1="90" y1="18" x2="90" y2="162" stroke="#dbeafe" strokeWidth="0.8" />
            <line x1="18" y1="90" x2="162" y2="90" stroke="#dbeafe" strokeWidth="0.8" />
            <line x1="38" y1="38" x2="142" y2="142" stroke="#dbeafe" strokeWidth="0.8" />
            <line x1="142" y1="38" x2="38" y2="142" stroke="#dbeafe" strokeWidth="0.8" />

            {/* Radar sweep */}
            <path
              d="M90,90 L90,18 A72,72 0 0,1 152,108 Z"
              fill="url(#sweepGrad)"
              className="risk3d-sweep"
            />
            <defs>
              <radialGradient id="sweepGrad" cx="100%" cy="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Risk score arc */}
            <circle
              cx="90" cy="90" r="72"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeDasharray={`${(d.risk_score / 100) * 452} 452`}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
              opacity="0.35"
            />

            {/* Dots */}
            {dots.map((dot) => (
              <g key={dot.label}>
                <circle cx={dot.cx} cy={dot.cy} r="5" fill={dot.color} opacity="0.85" />
                <circle cx={dot.cx} cy={dot.cy} r="9" fill={dot.color} opacity="0.15" className="risk3d-ping" />
              </g>
            ))}

            {/* Center pulsing dot */}
            <circle cx="90" cy="90" r="7" fill="#dc2626" className="risk3d-center-pulse" />
            <circle cx="90" cy="90" r="14" fill="#dc2626" opacity="0.15" className="risk3d-center-ring" />
          </svg>

          <div className="risk3d-radar-labels">
            <div className="risk3d-path-row">
              <span className="risk3d-path-label">Recommended Path</span>
              <strong className="risk3d-path-val">{d.recommended_path}</strong>
            </div>
            <div className="risk3d-path-row">
              <span className="risk3d-path-label">Recommended Route</span>
              <strong className="risk3d-path-val">{d.recommended_route}</strong>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="risk3d-metrics">
          {metrics.map((m) => (
            <div key={m.label} className="risk3d-metric-tile">
              <span className="risk3d-metric-label">{m.label}</span>
              <span className="risk3d-metric-value" style={{ color: m.color }}>
                {m.value}<span className="risk3d-metric-unit">{m.unit}</span>
              </span>
              <div className="risk3d-metric-bar-bg">
                <div
                  className="risk3d-metric-bar-fill"
                  style={{
                    width: `${Math.min(parseFloat(m.value), 100)}%`,
                    background: m.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
