export default function DecisionComparison({ paths, recommended }) {
  return (
    <div className="card">
      <h2 className="section-title">📊 Decision Path Comparison</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Path</th>
              <th>Safety</th>
              <th>Speed</th>
              <th>Resource</th>
              <th>Cost</th>
              <th>Confidence</th>
              <th>Risk</th>
              <th>Success %</th>
              <th>Final Score</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {paths.map((p) => (
              <tr key={p.path_id} className={p.path_id === recommended ? "row-best" : ""}>
                <td>
                  <strong>Path {p.path_id}</strong>
                  <br />
                  <small>{p.name}</small>
                  {p.path_id === recommended && <span className="best-tag">★ Best</span>}
                </td>
                <td>{p.safety_score}</td>
                <td>{p.speed_score}</td>
                <td>{p.resource_score}</td>
                <td>{p.cost_score}</td>
                <td>{p.confidence_score}</td>
                <td>{p.risk_score}</td>
                <td>{p.success_probability}%</td>
                <td><strong>{p.final_decision_score}</strong></td>
                <td>#{p.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
