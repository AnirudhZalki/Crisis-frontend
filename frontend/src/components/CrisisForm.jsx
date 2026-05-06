import { useState } from "react";
import { DEMO_SCENARIO } from "../demo";

const EMPTY = {
  disaster_type: "", location: "", latitude: 15.3647, longitude: 75.124,
  severity_level: 50, affected_population: "", vulnerable_population: "",
  available_rescue_teams: "", required_rescue_teams: "", hospital_capacity: "",
  estimated_injured: "", blocked_roads: "", weather_condition: "",
  response_time_limit: 6, budget_level: "Medium",
};

export default function CrisisForm({ onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      severity_level: Number(form.severity_level),
      affected_population: Number(form.affected_population),
      vulnerable_population: Number(form.vulnerable_population),
      available_rescue_teams: Number(form.available_rescue_teams),
      required_rescue_teams: Number(form.required_rescue_teams),
      hospital_capacity: Number(form.hospital_capacity),
      estimated_injured: Number(form.estimated_injured),
      blocked_roads: Number(form.blocked_roads),
      response_time_limit: Number(form.response_time_limit),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="section-title">🚨 Disaster Input — Crisis Admin</h2>
      <div className="form-grid">
        <label>Disaster Type<input required value={form.disaster_type} onChange={e => set("disaster_type", e.target.value)} placeholder="e.g. Flood" /></label>
        <label>Location<input required value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Hubballi - Varur Region" /></label>
        <label>Latitude<input type="number" step="0.0001" required value={form.latitude} onChange={e => set("latitude", e.target.value)} /></label>
        <label>Longitude<input type="number" step="0.0001" required value={form.longitude} onChange={e => set("longitude", e.target.value)} /></label>
        <label>Severity Level (0–100)<input type="number" min="0" max="100" required value={form.severity_level} onChange={e => set("severity_level", e.target.value)} /></label>
        <label>Affected Population<input type="number" min="1" required value={form.affected_population} onChange={e => set("affected_population", e.target.value)} /></label>
        <label>Vulnerable Population<input type="number" min="0" required value={form.vulnerable_population} onChange={e => set("vulnerable_population", e.target.value)} /></label>
        <label>Available Rescue Teams<input type="number" min="0" required value={form.available_rescue_teams} onChange={e => set("available_rescue_teams", e.target.value)} /></label>
        <label>Required Rescue Teams<input type="number" min="1" required value={form.required_rescue_teams} onChange={e => set("required_rescue_teams", e.target.value)} /></label>
        <label>Hospital Capacity<input type="number" min="0" required value={form.hospital_capacity} onChange={e => set("hospital_capacity", e.target.value)} /></label>
        <label>Estimated Injured<input type="number" min="0" required value={form.estimated_injured} onChange={e => set("estimated_injured", e.target.value)} /></label>
        <label>Blocked Roads<input type="number" min="0" required value={form.blocked_roads} onChange={e => set("blocked_roads", e.target.value)} /></label>
        <label>Response Time Limit (hrs)<input type="number" min="1" required value={form.response_time_limit} onChange={e => set("response_time_limit", e.target.value)} /></label>
        <label>Budget Level
          <select value={form.budget_level} onChange={e => set("budget_level", e.target.value)}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>
        <label className="full-width">Weather Condition<input required value={form.weather_condition} onChange={e => set("weather_condition", e.target.value)} placeholder="e.g. Heavy rainfall expected for 6 hours" /></label>
      </div>
      <div className="btn-row">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "⏳ Running Simulation..." : "▶ Run LangGraph Simulation"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setForm(DEMO_SCENARIO)}>📋 Load Demo Scenario</button>
        <button type="button" className="btn-ghost" onClick={() => setForm(EMPTY)}>↺ Reset</button>
      </div>
    </form>
  );
}
