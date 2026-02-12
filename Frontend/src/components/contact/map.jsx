import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const position = [28.492, -16.314];

  return (
    <>
      <div className="sm:h-96 h-56 sm:px-0 overflow-hidden">
        <MapContainer
          className="h-96 z-0"
          center={position}
          zoom={14}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>Aquí puedes encontrarme</Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
}
