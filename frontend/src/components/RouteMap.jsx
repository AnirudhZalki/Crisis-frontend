import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons for Vite/webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DISASTER_ICON = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const SHELTER_ICON = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const DEMO_SHELTERS = [
  { name: "AGM College Shelter", lat: 15.3618, lng: 75.1231, capacity: 500, available: 350 },
  { name: "Government School Shelter", lat: 15.3725, lng: 75.1372, capacity: 800, available: 600 },
  { name: "Community Hall Shelter", lat: 15.3516, lng: 75.1115, capacity: 300, available: 180 },
];

const ROUTE_COLORS = {
  safe: "#3fb950",
  flooded: "#f85149",
  partially_blocked: "#d29922",
};

const ROUTE_SELECTED_COLOR = "#58a6ff";

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 14); }, [lat, lng, map]);
  return null;
}

export default function RouteMap({ lat, lng, routes, recommended, disasterType, location }) {
  const centerLat = lat || 15.3647;
  const centerLng = lng || 75.124;

  return (
    <div className="card map-card">
      <h2 className="section-title">🗺️ Evacuation Route Map — OpenStreetMap</h2>
      <div className="map-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: "#f85149" }}></span>Disaster Location</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#3fb950" }}></span>Shelter</span>
        <span className="legend-item"><span className="legend-line" style={{ background: ROUTE_SELECTED_COLOR }}></span>Selected Route</span>
        <span className="legend-item"><span className="legend-line" style={{ background: ROUTE_COLORS.safe }}></span>Safe Route</span>
        <span className="legend-item"><span className="legend-line" style={{ background: ROUTE_COLORS.flooded }}></span>Flooded Route</span>
        <span className="legend-item"><span className="legend-line" style={{ background: ROUTE_COLORS.partially_blocked }}></span>Partially Blocked</span>
      </div>
      <div className="map-container">
        <MapContainer center={[centerLat, centerLng]} zoom={14} style={{ height: "500px", width: "100%", borderRadius: "8px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap lat={centerLat} lng={centerLng} />

          {/* Disaster location marker */}
          <Marker position={[centerLat, centerLng]} icon={DISASTER_ICON}>
            <Popup>
              <strong>🚨 Disaster Location</strong><br />
              {disasterType || "Disaster"}<br />
              {location || "Affected Area"}<br />
              Lat: {centerLat}, Lng: {centerLng}
            </Popup>
          </Marker>

          {/* Shelter markers */}
          {DEMO_SHELTERS.map((s, i) => (
            <Marker key={i} position={[s.lat, s.lng]} icon={SHELTER_ICON}>
              <Popup>
                <strong>🏠 {s.name}</strong><br />
                Total Capacity: {s.capacity}<br />
                Available: {s.available} spaces<br />
                Utilization: {Math.round(((s.capacity - s.available) / s.capacity) * 100)}%
              </Popup>
            </Marker>
          ))}

          {/* Route polylines */}
          {routes && routes.map((route) => {
            const isSelected = route.route_id === recommended;
            const color = isSelected ? ROUTE_SELECTED_COLOR : ROUTE_COLORS[route.route_status] || "#8b949e";
            const weight = isSelected ? 6 : 3;
            const dashArray = route.route_status === "flooded" ? "10 5" : route.route_status === "partially_blocked" ? "6 4" : null;
            return (
              <Polyline
                key={route.route_id}
                positions={route.coordinates}
                pathOptions={{ color, weight, dashArray, opacity: isSelected ? 1 : 0.7 }}
              >
                <Popup>
                  <strong>Route {route.route_id}: {route.route_name}</strong><br />
                  Status: {route.route_status}<br />
                  Distance: {route.distance_km} km<br />
                  Time: {route.estimated_time_min} min<br />
                  Score: {route.route_score}/100<br />
                  Target: {route.target_shelter}<br />
                  {isSelected && <strong style={{ color: "#58a6ff" }}>SELECTED ROUTE</strong>}
                </Popup>
              </Polyline>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
