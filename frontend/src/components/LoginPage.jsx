import { useState } from "react";
import { useAuth, ROLE_ICONS, ROLE_PASSWORDS } from "../AuthContext";

const ROLES = Object.keys(ROLE_PASSWORDS);

const ROLE_DESC = {
  "Crisis Admin":                "Full access — simulate, approve, view all data",
  "Medical Resource Officer":    "Update medical resources only",
  "Rescue Resource Officer":     "Update rescue resources only",
  "Fire and Safety Officer":     "Update fire & safety resources only",
  "NGO / Volunteer Coordinator": "Update NGO & volunteer resources only",
  "Transport Officer":           "Update transport & road resources only",
  "Shelter Officer":             "Update shelter capacity & status only",
};

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedRole) { setError("Please select a role."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      const ok = login(selectedRole, password);
      if (!ok) setError("Incorrect password. Please try again.");
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <span className="login-logo-icon">🧠</span>
          <h1 className="login-title">CrisisMind AI</h1>
          <p className="login-subtitle">Disaster Response Intelligence Platform</p>
          <p className="login-tagline">Select your role and enter your password to continue</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <label className="login-label">Select Role</label>
            <div className="login-role-grid">
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  className={`login-role-btn ${selectedRole === role ? "login-role-active" : ""}`}
                  onClick={() => { setSelectedRole(role); setError(""); setPassword(""); }}
                >
                  <span className="login-role-icon">{ROLE_ICONS[role]}</span>
                  <span className="login-role-name">{role}</span>
                  {role === "Crisis Admin" && <span className="login-admin-tag">ADMIN</span>}
                </button>
              ))}
            </div>
          </div>

          {selectedRole && (
            <div className="login-role-desc">
              <span>{ROLE_ICONS[selectedRole]}</span>
              <span><strong>{selectedRole}</strong> — {ROLE_DESC[selectedRole]}</span>
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-pass-wrap">
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder={selectedRole === "Crisis Admin" ? "Enter admin password" : "Enter role password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                required
                autoComplete="current-password"
              />
              <button type="button" className="login-show-btn" onClick={() => setShowPass(s => !s)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

          </div>

          {error && <div className="login-error">❌ {error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading || !selectedRole}>
            {loading ? "⏳ Verifying..." : `🔐 Login as ${selectedRole || "..."}`}
          </button>
        </form>

        <p className="login-footer-note">
          🔒 CrisisMind AI | Hack Fusion 2025 | Secure Role-Based Access
        </p>
      </div>
    </div>
  );
}
