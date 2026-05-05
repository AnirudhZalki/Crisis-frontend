export default function ExplainabilityBox({ explanation, scenarios }) {
  const lines = explanation.split("\n").filter(Boolean);
  return (
    <div className="card">
      <h2 className="section-title">💡 Explainable AI — Why This Path?</h2>
      <div className="explain-box">
        {lines.map((line, i) => (
          <p key={i} className={line.startsWith("•") ? "explain-bullet" : line.startsWith("⚠") ? "explain-warn" : line.startsWith("✅") ? "explain-approve" : "explain-line"}>
            {line}
          </p>
        ))}
      </div>
      {scenarios && scenarios.length > 0 && (
        <div className="scenarios-box">
          <strong>📡 Dynamic Scenario Variations:</strong>
          <ul>{scenarios.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
