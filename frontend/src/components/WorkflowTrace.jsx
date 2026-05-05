const AGENT_NODES = [
  "medical_agent", "rescue_agent", "transport_agent",
  "shelter_agent", "ngo_agent", "fire_safety_agent",
  "resource_agent", "safety_agent"
];

function isAgent(step) {
  return AGENT_NODES.some(a => step.includes(a));
}

export default function WorkflowTrace({ trace }) {
  const agentCount = trace.filter(isAgent).length;
  const totalCount = trace.length;

  return (
    <div className="card">
      <h2 className="section-title">
        🔗 LangGraph Workflow — {totalCount} Nodes Executed &nbsp;
        <span className="trace-agent-badge">{agentCount} Expert Agents</span>
        <span className="trace-util-badge">{totalCount - agentCount} Orchestration Nodes</span>
      </h2>

      <div className="trace-legend">
        <span className="trace-legend-item"><span className="trace-dot agent-dot"></span>Expert Agent</span>
        <span className="trace-legend-item"><span className="trace-dot util-dot"></span>Orchestration Node</span>
      </div>

      <div className="trace-flow">
        {trace.map((step, i) => (
          <div key={i} className="trace-step">
            <div className={`trace-node ${isAgent(step) ? "trace-node-agent" : "trace-node-util"}`}>
              {isAgent(step) ? "🤖 " : "⚙️ "}{step}
            </div>
            {i < trace.length - 1 && <div className="trace-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
