import { useState } from "react";
import { updateResources, updateShelter } from "../api";
import { DEMO_RESOURCES } from "../demo";

const FIELDS = {
  "Medical Resource Officer": [
    { key: "doctors", label: "Doctors Available" },
    { key: "ambulances", label: "Ambulances" },
    { key: "hospital_beds", label: "Hospital Beds" },
    { key: "medical_camps", label: "Medical Camps" },
    { key: "first_aid_kits", label: "First Aid Kits" },
    { key: "blood_units", label: "Blood Units" },
  ],
  "Rescue Resource Officer": [
    { key: "rescue_teams", label: "Rescue Teams" },
    { key: "boats", label: "Boats" },
    { key: "life_jackets", label: "Life Jackets" },
    { key: "ropes", label: "Ropes" },
    { key: "divers", label: "Divers" },
    { key: "emergency_vehicles", label: "Emergency Vehicles" },
  ],
  "Fire and Safety Officer": [
    { key: "firefighters", label: "Firefighters" },
    { key: "fire_trucks", label: "Fire Trucks" },
    { key: "safety_teams", label: "Safety Teams" },
    { key: "danger_zones", label: "Danger Zones Identified" },
  ],
  "NGO / Volunteer Coordinator": [
    { key: "volunteers", label: "Volunteers" },
    { key: "food_packets", label: "Food Packets" },
    { key: "water_bottles", label: "Water Bottles" },
    { key: "clothes", label: "Clothes" },
    { key: "blankets", label: "Blankets" },
  ],
  "Transport Officer": [
    { key: "blocked_roads_count", label: "Blocked Roads" },
    { key: "safe_roads", label: "Safe Roads" },
    { key: "damaged_bridges", label: "Damaged Bridges" },
    { key: "available_buses", label: "Available Buses" },
    { key: "route_status", label: "Route Status", type: "text" },
  ],
};

const SHELTER_FIELDS = [
  { key: "name", label: "Shelter Name", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "total_capacity", label: "Total Capacity", type: "number" },
  { key: "available_capacity", label: "Available Capacity", type: "number" },
];

export default function ResourceDashboard({ role }) {
  const [form, setForm] = useState({ location: "Hubballi" });
  const [shelterForm, setShelterForm] = useState({
    name: "", location: "", latitude: "", longitude: "",
    total_capacity: "", available_capacity: "",
    food_available: true, water_available: true, medical_support: false,
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = FIELDS[role] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const payload = { role, ...form };
      // Convert numeric strings
      const numericKeys = fields.filter(f => f.type !== "text").map(f => f.key);
      numericKeys.forEach(k => { if (payload[k]) payload[k] = Number(payload[k]); });
      await updateResources(payload);
      setStatus({ type: "success", msg: `Resources updated successfully for ${role}!` });
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
    setLoading(false);
  };

  const handleShelterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const payload = {
        ...shelterForm,
        latitude: Number(shelterForm.latitude),
        longitude: Number(shelterForm.longitude),
        total_capacity: Number(shelterForm.total_capacity),
        available_capacity: Number(shelterForm.available_capacity),
      };
      await updateShelter(payload);
      setStatus({ type: "success", msg: "Shelter updated successfully!" });
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
    setLoading(false);
  };

  const loadDemo = () => {
    const demo = DEMO_RESOURCES[role];
    if (demo) {
      const { role: _r, location, ...rest } = demo;
      setForm({ location, ...rest });
      setStatus({ type: "info", msg: "Demo data loaded. Click Submit to save." });
    }
  };

  if (role === "Shelter Officer") {
    return (
      <div className="card">
        <h2 className="section-title">🏠 Shelter Officer — Update Shelter</h2>
        {status && <div className={`status-msg status-${status.type}`}>{status.msg}</div>}
        <form onSubmit={handleShelterSubmit}>
          <div className="form-grid">
            {SHELTER_FIELDS.map(f => (
              <label key={f.key}>
                {f.label}
                <input
                  type={f.type || "text"}
                  required
                  value={shelterForm[f.key]}
                  onChange={e => setShelterForm(s => ({ ...s, [f.key]: e.target.value }))}
                />
              </label>
            ))}
            <label>
              Food Available
              <select value={shelterForm.food_available} onChange={e => setShelterForm(s => ({ ...s, food_available: e.target.value === "true" }))}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label>
              Water Available
              <select value={shelterForm.water_available} onChange={e => setShelterForm(s => ({ ...s, water_available: e.target.value === "true" }))}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label>
              Medical Support
              <select value={shelterForm.medical_support} onChange={e => setShelterForm(s => ({ ...s, medical_support: e.target.value === "true" }))}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
          </div>
          <div className="btn-row">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Submit Shelter Update"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">📋 {role} — Update Resources</h2>
      {status && <div className={`status-msg status-${status.type}`}>{status.msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Location
            <input value={form.location || ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
          </label>
          {fields.map(f => (
            <label key={f.key}>
              {f.label}
              <input
                type={f.type || "number"}
                min={f.type === "text" ? undefined : "0"}
                value={form[f.key] || ""}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </label>
          ))}
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Submit Resource Update"}
          </button>
          {DEMO_RESOURCES[role] && (
            <button type="button" className="btn-secondary" onClick={loadDemo}>
              📋 Load Demo Data
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
