const ROLES = [
  "Crisis Admin",
  "Medical Resource Officer",
  "Rescue Resource Officer",
  "Fire and Safety Officer",
  "NGO / Volunteer Coordinator",
  "Transport Officer",
  "Shelter Officer",
];

const ROLE_ICONS = {
  "Crisis Admin": "🎯",
  "Medical Resource Officer": "🏥",
  "Rescue Resource Officer": "🚒",
  "Fire and Safety Officer": "🔥",
  "NGO / Volunteer Coordinator": "🤝",
  "Transport Officer": "🚌",
  "Shelter Officer": "🏠",
};

export default function RoleSelector({ selected, onSelect }) {
  return (
    <div className="card role-selector-card">
      <h2 className="section-title">👤 Select Your Role</h2>
      <div className="role-grid">
        {ROLES.map((role) => (
          <button
            key={role}
            className={`role-btn ${selected === role ? "role-btn-active" : ""}`}
            onClick={() => onSelect(role)}
          >
            <span className="role-icon">{ROLE_ICONS[role]}</span>
            <span>{role}</span>
          </button>
        ))}
      </div>
      <p className="role-note">
        Prototype mode: Role selection simulates role-based access. In production, this will use JWT authentication.
      </p>
    </div>
  );
}
