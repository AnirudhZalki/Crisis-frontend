const FALLBACK_TRACE = [
  "Validate Input",
  "Resource Context",
  "Scenario Generator",
  "Medical Agent",
  "Rescue Agent",
  "Transport Agent",
  "Shelter Agent",
  "Safety Agent",
  "Decision Paths",
  "Scoring Engine",
  "Route Planner",
  "Coordinator",
  "LLM Explanation",
  "Human Approval",
];

const AGENT_KEYWORDS = ["Agent", "Medical", "Rescue", "Transport", "Shelter", "Safety", "Coordinator"];
const FINAL_KEYWORDS = ["Human Approval", "Approval"];

function getNodeType(label) {
  if (FINAL_KEYWORDS.some((k) => label.includes(k))) return "final";
  if (AGENT_KEYWORDS.some((k) => label.includes(k))) return "agent";
  return "util";
}

const NODE_STYLE = {
  agent: { bg: "#ecfdf3", border: "#86efac", color: "#15803d", tag: "Agent" },
  util: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", tag: "System" },
  final: { bg: "#f5f3ff", border: "#c4b5fd", color: "#6d28d9", tag: "Final" },
};

export default function WorkflowPipeline3D({ trace }) {
  const steps = Array.isArray(trace) && trace.length ? trace : FALLBACK_TRACE;

  return (
    <div className="workflow3d-card card">
      <div className="workflow3d-header">
        <span className="workflow3d-title">⚙️ 3D LangGraph Workflow Pipeline</span>
        <p className="workflow3d-subtitle">
          Visualizes how each agent contributes to the final response decision.
        </p>
      </div>

      <div className="workflow3d-legend">
        <span className="workflow3d-legend-item workflow3d-legend-agent">● Agent Node</span>
        <span className="workflow3d-legend-item workflow3d-legend-util">● System Node</span>
        <span className="workflow3d-legend-item workflow3d-legend-final">● Final Node</span>
      </div>

      <div className="workflow3d-pipeline">
        {steps.map((step, i) => {
          const label = typeof step === "string" ? step : step.node || step.name || String(step);
          const type = getNodeType(label);
          const ns = NODE_STYLE[type];

          return (
            <div key={i} className="workflow3d-step" style={{ animationDelay: `${i * 0.06}s` }}>
              <div
                className="workflow3d-node"
                style={{ background: ns.bg, border: `1.5px solid ${ns.border}`, color: ns.color }}
              >
                <span className="workflow3d-node-num">{i + 1}</span>
                <span className="workflow3d-node-label">{label}</span>
                <span
                  className="workflow3d-node-tag"
                  style={{ background: ns.border, color: ns.color }}
                >
                  {ns.tag}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="workflow3d-connector">
                  <div className="workflow3d-connector-line" />
                  <span className="workflow3d-arrow">›</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
