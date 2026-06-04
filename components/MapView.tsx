'use client';

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

export type ComplexOnMap = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  rooms: number;
  city: string;
  province: string;
  mainImage?: string | null;
};

interface Props {
  complexes: ComplexOnMap[];
  onSelect: (id: number) => void;
}

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ complexes }: { complexes: ComplexOnMap[] }) {
  const map = useMap();

  useEffect(() => {
    if (!complexes.length) return;

    const bounds = L.latLngBounds(
      complexes.map((c) => [c.latitude, c.longitude] as [number, number])
    );

    map.fitBounds(bounds, { padding: [40, 40] });
  }, [complexes, map]);

  return null;
}

export function MapView({ complexes, onSelect }: Props) {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={[39.8, -3.7]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds complexes={complexes} />

        {complexes.map((c) => (
          <Marker
            key={c.id}
            position={[c.latitude, c.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm">{c.city}, {c.province}</div>
                <div className="text-sm">Habitaciones: {c.rooms}</div>
                <button
                  onClick={() => onSelect(c.id)}
                  className="mt-2 rounded bg-blue-600 px-2 py-1 text-sm text-white"
                >
                  Ver detalle completo
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}