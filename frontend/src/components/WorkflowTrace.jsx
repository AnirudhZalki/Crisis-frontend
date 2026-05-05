export default function WorkflowTrace({ trace }) {
  return (
    <div className="card">
      <h2 className="section-title">🔗 LangGraph Workflow Trace — 18 Agents</h2>
      <div className="trace-flow">
        {trace.map((step, i) => (
          <div key={i} className="trace-step">
            <div className="trace-node">{step}</div>
            {i < trace.length - 1 && <div className="trace-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
