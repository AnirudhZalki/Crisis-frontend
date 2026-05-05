import { useEffect } from "react";
import {
  MapContainer, TileLayer, Marker, Popup,
  Polyline, Tooltip, useMap, Circle
} from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default icon for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icons
function makeIcon(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  });
}

const ICONS = {
  disaster: makeIcon("red"),
  shelter:  makeIcon("green"),
  people:   makeIcon("orange"),
};

// Hardcoded demo shelters matching route_planner.py
const DEMO_SHELTERS = [
  {
    name: "AGM College Shelter",
    lat: 15.3618, lng: 75.1231,
    total_capacity: 500, available_capacity: 350,
    food: true, water: true, medical: false,
  },
  {
    name: "Government School Shelter",
    lat: 15.3725, lng: 75.1372,
    total_capacity: 800, available_capacity: 600,
    food: true, water: true, medical: true,
  },
  {
    name: "Community Hall Shelter",
    lat: 15.3516, lng: 75.1115,
    total_capacity: 300, available_capacity: 180,
    food: false, water: true, medical: false,
  },
];

// Affected population cluster points around disaster center
function getAffectedPoints(centerLat, centerLng) {
  return [
    { lat: centerLat + 0.003, lng: centerLng + 0.002, label: "Zone A — 6,000 people" },
    { lat: centerLat - 0.004, lng: centerLng + 0.003, label: "Zone B — 5,500 people" },
    { lat: centerLat + 0.002, lng: centerLng - 0.004, label: "Zone C — 4,800 people" },
    { lat: centerLat - 0.002, lng: centerLng - 0.003, label: "Zone D — 3,700 people (Vulnerable)" },
  ];
}

// Route colors
const ROUTE_STYLE = {
  safe:              { color: "#3fb950", dashArray: null },
  flooded:           { color: "#f85149", dashArray: "10 6" },
  partially_blocked: { color: "#d29922", dashArray: "6 4" },
};

const SELECTED_COLOR = "#58a6ff";

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 14); }, [lat, lng, map]);
  return null;
}

export default function RouteMap({ lat, lng, routes, recommended, disasterType, location, affectedPopulation }) {
  const centerLat = lat || 15.3647;
  const centerLng = lng || 75.124;
  const affectedPoints = getAffectedPoints(centerLat, centerLng);

  return (
    <div className="card map-card">
      <h2 className="section-title">🗺️ Live Evacuation Route Map — OpenStreetMap</h2>

      {/* Legend */}
      <div className="map-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: "#f85149" }}></span>Disaster Zone</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#ff8c00" }}></span>Affected People Zones</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#3fb950" }}></span>Shelter</span>
        <span className="legend-item"><span className="legend-line" style={{ background: SELECTED_COLOR, height: "5px" }}></span>Selected Route</span>
        <span className="legend-item"><span className="legend-line" style={{ background: "#3fb950" }}></span>Safe Route</span>
        <span className="legend-item"><span className="legend-line" style={{ background: "#f85149", borderTop: "3px dashed #f85149", background: "none", width: "24px" }}></span>Flooded Route</span>
        <span className="legend-item"><span className="legend-line" style={{ background: "#d29922" }}></span>Partially Blocked</span>
      </div>

      <div className="map-container">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={14}
          style={{ height: "520px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap lat={centerLat} lng={centerLng} />

          {/* Disaster impact zone circle */}
          <Circle
            center={[centerLat, centerLng]}
            radius={400}
            pathOptions={{ color: "#f85149", fillColor: "#f85149", fillOpacity: 0.12, weight: 2, dashArray: "6 3" }}
          />

          {/* Disaster location marker */}
          <Marker position={[centerLat, centerLng]} icon={ICONS.disaster}>
            <Tooltip permanent direction="top" offset={[0, -40]} className="map-tooltip-disaster">
              🚨 Disaster Zone
            </Tooltip>
            <Popup>
              <div style={{ minWidth: "180px" }}>
                <strong style={{ color: "#f85149" }}>🚨 Disaster Location</strong><br />
                <strong>Type:</strong> {disasterType || "Disaster"}<br />
                <strong>Area:</strong> {location || "Affected Area"}<br />
                <strong>Affected:</strong> {affectedPopulation ? affectedPopulation.toLocaleString() : "20,000"} people<br />
                <strong>Coords:</strong> {centerLat}, {centerLng}
              </div>
            </Popup>
          </Marker>

          {/* Affected population zone markers */}
          {affectedPoints.map((pt, i) => (
            <Marker key={i} position={[pt.lat, pt.lng]} icon={ICONS.people}>
              <Tooltip permanent direction="top" offset={[0, -38]} className="map-tooltip-people">
                👥 {pt.label}
              </Tooltip>
              <Popup>
                <div style={{ minWidth: "160px" }}>
                  <strong style={{ color: "#ff8c00" }}>👥 Affected Population</strong><br />
                  {pt.label}<br />
                  <em>Needs evacuation to nearest shelter</em>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Shelter markers */}
          {DEMO_SHELTERS.map((s, i) => (
            <Marker key={i} position={[s.lat, s.lng]} icon={ICONS.shelter}>
              <Tooltip permanent direction="top" offset={[0, -40]} className="map-tooltip-shelter">
                🏠 {s.name}
              </Tooltip>
              <Popup>
                <div style={{ minWidth: "190px" }}>
                  <strong style={{ color: "#3fb950" }}>🏠 {s.name}</strong><br />
                  <strong>Total Capacity:</strong> {s.total_capacity}<br />
                  <strong>Available:</strong> {s.available_capacity} spaces<br />
                  <strong>Occupied:</strong> {s.total_capacity - s.available_capacity}<br />
                  <strong>Food:</strong> {s.food ? "✅ Yes" : "❌ No"}<br />
                  <strong>Water:</strong> {s.water ? "✅ Yes" : "❌ No"}<br />
                  <strong>Medical:</strong> {s.medical ? "✅ Yes" : "❌ No"}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route polylines — draw non-selected first, selected on top */}
          {routes && [...routes]
            .sort((a, b) => (a.route_id === recommended ? 1 : -1))
            .map((route) => {
              const isSelected = route.route_id === recommended;
              const style = ROUTE_STYLE[route.route_status] || { color: "#8b949e", dashArray: null };
              const color = isSelected ? SELECTED_COLOR : style.color;
              const weight = isSelected ? 8 : 4;
              const opacity = isSelected ? 1 : 0.65;
              const dashArray = isSelected ? null : style.dashArray;

              return (
                <Polyline
                  key={route.route_id}
                  positions={route.coordinates}
                  pathOptions={{ color, weight, dashArray, opacity }}
                >
                  <Tooltip sticky className={isSelected ? "map-tooltip-selected" : "map-tooltip-route"}>
                    <strong>Route {route.route_id}: {route.route_name}</strong><br />
                    Status: {route.route_status}<br />
                    Distance: {route.distance_km} km | Time: {route.estimated_time_min} min<br />
                    Score: {route.route_score}/100<br />
                    Target: {route.target_shelter}<br />
                    {isSelected && <strong style={{ color: SELECTED_COLOR }}>★ SELECTED BEST ROUTE</strong>}
                  </Tooltip>
                  <Popup>
                    <div style={{ minWidth: "200px" }}>
                      <strong style={{ color: isSelected ? SELECTED_COLOR : color }}>
                        Route {route.route_id}: {route.route_name}
                        {isSelected && " ★ SELECTED"}
                      </strong><br />
                      <strong>Status:</strong> {route.route_status}<br />
                      <strong>Distance:</strong> {route.distance_km} km<br />
                      <strong>Est. Time:</strong> {route.estimated_time_min} min<br />
                      <strong>Route Score:</strong> {route.route_score}/100<br />
                      <strong>Target Shelter:</strong> {route.target_shelter}<br />
                      <strong>Required:</strong> {route.required_resources?.join(", ")}<br />
                      {route.available_resources?.length > 0 && (
                        <><strong>Available:</strong> {route.available_resources.join(", ")}<br /></>
                      )}
                      {isSelected && (
                        <div style={{ marginTop: "6px", color: SELECTED_COLOR, fontWeight: "bold" }}>
                          ★ This is the recommended evacuation route
                        </div>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              );
            })}
        </MapContainer>
      </div>

      {/* Route summary below map */}
      <div className="map-route-summary">
        {routes && routes.map((r) => (
          <div key={r.route_id} className={`map-route-pill ${r.route_id === recommended ? "map-route-pill-selected" : ""}`}>
            <span className="route-pill-id">Route {r.route_id}</span>
            <span className="route-pill-name">{r.route_name}</span>
            <span className="route-pill-dist">{r.distance_km} km</span>
            <span className={`route-pill-status status-${r.route_status}`}>
              {r.route_status === "safe" ? "Safe" : r.route_status === "flooded" ? "Flooded" : "Partial"}
            </span>
            <span className="route-pill-score">Score: {r.route_score}</span>
            {r.route_id === recommended && <span className="route-pill-best">★ Best</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
