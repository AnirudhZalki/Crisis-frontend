export default function ExplainabilityBox({ explanation, scenarios }) {
  const lines = explanation.split("\n").filter(Boolean);
  return (
    <div className="card">
      <h2 className="section-title">💡 Explainable AI — Why This Decision?</h2>
      <div className="explain-box">
        {lines.map((line, i) => (
          <p key={i} className={
            line.startsWith("*") ? "explain-bullet" :
            line.includes("[WARNING]") ? "explain-warn" :
            line.includes("[HUMAN APPROVAL") ? "explain-approve" :
            line.startsWith("Route Decision") ? "explain-section" :
            "explain-line"
          }>
            {line}
          </p>
        ))}
      </div>
      {scenarios?.length > 0 && (
        <div className="scenarios-box">
          <strong>📡 Dynamic Scenario Variations:</strong>
          <ul>{scenarios.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
