export default function Crisis3DScene() {
  return (
    <div className="card crisis-visual-card">
      <div className="crisis-visual-layout">
        <div className="crisis-visual-copy">
          <h3>Live Crisis Command View</h3>

          <p>
            CrisisMind AI connects disaster inputs, role-based resources,
            LangGraph agents, route planning, and human approval into one
            visual command workflow.
          </p>

          <div className="crisis-visual-pills">
            <span className="crisis-visual-pill">LangGraph Agents</span>
            <span className="crisis-visual-pill">Route Intelligence</span>
            <span className="crisis-visual-pill">Risk Scoring</span>
            <span className="crisis-visual-pill">Human Approval</span>
          </div>
        </div>

        <div className="crisis-3d-scene" aria-label="3D crisis command visualization">
          <div className="visual-stat visual-stat-1">
            <strong>3 Routes</strong>
            <span>compared safely</span>
          </div>

          <div className="visual-stat visual-stat-2">
            <strong>7 Roles</strong>
            <span>resource updates</span>
          </div>

          <div className="visual-stat visual-stat-3">
            <strong>AI + Rules</strong>
            <span>explainable decision</span>
          </div>

          <div className="command-platform">
            <div className="platform-grid"></div>

            <div className="radar-ring"></div>
            <div className="radar-sweep"></div>

            <div className="disaster-node" title="Affected disaster zone"></div>

            <div className="shelter-node shelter-a" title="Shelter A"></div>
            <div className="shelter-node shelter-b" title="Shelter B"></div>
            <div className="shelter-node shelter-c" title="Shelter C"></div>

            <div className="route-line-3d route-safe-3d"></div>
            <div className="route-line-3d route-warning-3d"></div>
            <div className="route-line-3d route-alt-3d"></div>

            <div className="route-packet"></div>
          </div>
        </div>
      </div>
    </div>
  );
}