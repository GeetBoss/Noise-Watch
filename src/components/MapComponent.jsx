import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { citySubAreas } from "../data/alerts";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = ({ selectedCity }) => {
  const locations = citySubAreas[selectedCity] || [];
  const center = locations.length
    ? [locations[0].lat, locations[0].lng]
    : [23.0225, 72.5714];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-[400px] w-full rounded-lg z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, idx) => (
        <Marker key={idx} position={[loc.lat, loc.lng]}>
          <Popup>
            <div className="text-center">
              <strong>{loc.name}</strong>
              <br />
              Noise Level: {loc.noise} dB
              <br />
              <span
                className={loc.noise > 80 ? "text-red-600" : "text-green-600"}
              >
                {loc.noise > 80 ? "⚠ High Alert" : "✅ Safe"}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
