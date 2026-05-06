import { useState } from "react";
import { approvePlan } from "../api";

const DEPT_ICONS = {
  "Rescue Team": "🚒", "Medical Team": "🏥", "Transport Team": "🚌",
  "Shelter Team": "🏠", "NGO Team": "🤝", "Fire/Safety Team": "🔥",
};

export default function HumanApproval({ simulationId, recommendedPath, recommendedRoute }) {
  const [status, setStatus] = useState(null); // null | "approved" | "rejected" | "re_simulate_requested"
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [officerName, setOfficerName] = useState("Crisis Admin");

  const handleAction = async (action) => {
    setLoading(true);
    setError(null);
    try {
      const res = await approvePlan(simulationId, action, officerName, notes);
      setResult(res);
      setStatus(res.status);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card approval-card">
      <h2 className="section-title">✅ Human Approval Workflow</h2>
      <p className="muted" style={{ marginBottom: "16px" }}>
        AI has recommended <strong style={{ color: "var(--primary)" }}>Path {recommendedPath}</strong> via{" "}
        <strong style={{ color: "var(--info)" }}>Route {recommendedRoute}</strong>.
        Crisis Admin must review and approve before execution.
      </p>

      {!status && (
        <>
          <div className="approval-inputs">
            <label>
              Officer Name
              <input value={officerName} onChange={e => setOfficerName(e.target.value)} placeholder="Crisis Admin" />
            </label>
            <label>
              Notes / Remarks (optional)
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any notes before decision..." />
            </label>
          </div>

          <div className="approval-warning">
            ⚠️ <strong>This action is final.</strong> Approving will dispatch department alerts. Rejecting will halt the plan.
          </div>

          <div className="btn-row" style={{ marginTop: "16px" }}>
            <button className="btn-approve" onClick={() => handleAction("approve")} disabled={loading}>
              {loading ? "⏳ Processing..." : "✅ Approve Plan"}
            </button>
            <button className="btn-resim" onClick={() => handleAction("re_simulate")} disabled={loading}>
              🔄 Request Re-Simulation
            </button>
            <button className="btn-reject" onClick={() => handleAction("reject")} disabled={loading}>
              ❌ Reject Plan
            </button>
          </div>
        </>
      )}

      {error && <div className="status-msg status-error">{error}</div>}

      {status === "approved" && result && (
        <div className="approval-result approval-approved">
          <div className="approval-status-banner">
            ✅ PLAN APPROVED — {result.approved_at?.slice(0, 19).replace("T", " ")} UTC
          </div>
          <p style={{ marginBottom: "8px" }}>
            <strong>Approved by:</strong> {result.approved_by} &nbsp;|&nbsp;
            <strong>Action Plan:</strong> {result.action_plan}
          </p>
          {result.notes && <p className="muted" style={{ marginBottom: "14px" }}>Notes: {result.notes}</p>}
          
          {result.email_alert && (
            <div className={`status-msg ${result.email_alert.status === 'sent' ? 'status-success' : 'status-error'}`} style={{ marginBottom: "16px" }}>
              {result.email_alert.status === 'sent' 
                ? `📧 Email notification sent to ${result.email_alert.recipient}` 
                : `❌ Email notification failed: ${result.email_alert.error}`}
            </div>
          )}

          <h3 className="sub-title">📢 Department Alert Messages</h3>
          <div className="alerts-grid">
            {Object.entries(result.department_alerts || {}).map(([dept, msg]) => (
              <div key={dept} className="alert-card">
                <div className="alert-dept-header">
                  <span className="alert-icon">{DEPT_ICONS[dept] || "📋"}</span>
                  <strong>{dept}</strong>
                </div>
                <p className="alert-msg">{msg}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "rejected" && result && (
        <div className="approval-result approval-rejected">
          <div className="approval-status-banner rejected-banner">
            ❌ PLAN REJECTED — {result.rejected_at?.slice(0, 19).replace("T", " ")} UTC
          </div>
          <p><strong>Rejected by:</strong> {result.rejected_by}</p>
          {result.notes && <p className="muted">Notes: {result.notes}</p>}
          <p className="muted" style={{ marginTop: "10px" }}>Please run a new simulation with updated parameters.</p>
        </div>
      )}

      {status === "re_simulate_requested" && result && (
        <div className="approval-result approval-resim">
          <div className="approval-status-banner resim-banner">
            🔄 RE-SIMULATION REQUESTED — {result.requested_at?.slice(0, 19).replace("T", " ")} UTC
          </div>
          <p><strong>Requested by:</strong> {result.requested_by}</p>
          {result.notes && <p className="muted">Notes: {result.notes}</p>}
          <p className="muted" style={{ marginTop: "10px" }}>Scroll up to adjust parameters and run a new simulation.</p>
        </div>
      )}
    </div>
  );
}
