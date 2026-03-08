"use client";

import { useEffect, useRef } from "react";

interface Trek {
  _id: string;
  name: string;
  location: string;
  difficulty: string;
  price: number;
  duration: number;
  imageUrl: string;
}

interface TrekMapProps {
  treks: Trek[];
}

const locationCoords: Record<string, [number, number]> = {
  "Pokhara": [28.2096, 83.9856],
  "Kathmandu": [27.7172, 85.3240],
  "Lukla": [27.6868, 86.7314],
  "Namche Bazaar": [27.8069, 86.7144],
  "Namche": [27.8069, 86.7144],
  "Everest Base Camp": [28.0026, 86.8528],
  "Gorak Shep": [28.0548, 86.8301],
  "Kala Patthar": [28.0536, 86.8247],
  "Tengboche": [27.8361, 86.7644],
  "Dingboche": [27.8944, 86.8311],
  "Lobuche": [27.9477, 86.8122],
  "Pheriche": [27.8936, 86.8181],
  "Annapurna Base Camp": [28.5311, 83.8778],
  "Annapurna": [28.5311, 83.8778],
  "Ghorepani": [28.3997, 83.6928],
  "Poon Hill": [28.4017, 83.6906],
  "Nayapul": [28.3667, 83.8167],
  "Chomrong": [28.4792, 83.8244],
  "Ghandruk": [28.3803, 83.8047],
  "Jomsom": [28.7808, 83.7275],
  "Muktinath": [28.8175, 83.8706],
  "Langtang": [28.2139, 85.5161],
  "Kyanjin Gompa": [28.2117, 85.5631],
  "Gosaikunda": [28.0878, 85.4161],
  "Manaslu": [28.5497, 84.5597],
  "Rara Lake": [29.5333, 82.0833],
  "Mustang": [28.9967, 83.8481],
  "Upper Mustang": [29.1800, 83.9700],
  "Chitwan": [27.5291, 84.3542],
  "Nagarkot": [27.7167, 85.5167],
  "Kapuche": [28.2096, 83.9856],
  "Kapuche Glacier": [28.2096, 83.9856],
};

function getCoords(location: string): [number, number] {
  if (locationCoords[location]) return locationCoords[location];
  const lower = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationCoords)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return coords;
    }
  }
  return [28.3949, 84.1240];
}

const diffColor = (d: string) => {
  if (d === "Easy") return "#16a34a";
  if (d === "Moderate") return "#ca8a04";
  return "#dc2626";
};

function TrekMap({ treks }: TrekMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      if (!mapRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      const map = L.map(mapRef.current, {
        center: [28.3949, 84.124],
        zoom: 7,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      treks.forEach((trek) => {
        const coords = getCoords(trek.location);
        const color = diffColor(trek.difficulty);

        const icon = L.divIcon({
          className: "",
          html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -34],
        });

        const popup = L.popup({ maxWidth: 260 }).setContent(`
          <div style="font-family:system-ui,sans-serif;padding:4px;">
            <img src="${trek.imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px;"/>
            <h3 style="font-size:14px;font-weight:800;color:#0f172a;margin:0 0 3px;">${trek.name}</h3>
            <p style="font-size:12px;color:#94a3b8;margin:0 0 8px;">📍 ${trek.location}</p>
            <div style="display:flex;gap:6px;margin-bottom:8px;">
              <span style="background:${color}22;color:${color};padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;">${trek.difficulty}</span>
              <span style="background:#f1f5f9;color:#64748b;padding:2px 8px;border-radius:999px;font-size:11px;">${trek.duration} days</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f5f9;padding-top:8px;">
              <p style="font-size:16px;font-weight:900;color:#16a34a;margin:0;">Rs. ${trek.price?.toLocaleString()}</p>
              <a href="/treks/${trek._id}" style="background:#16a34a;color:white;padding:6px 14px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700;">View →</a>
            </div>
          </div>
        `);

        L.marker(coords, { icon }).addTo(map).bindPopup(popup);
      });
    };

    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
      <div style={{
        position: "absolute", top: 16, right: 16, zIndex: 1000,
        backgroundColor: "white", borderRadius: 12, padding: "12px 16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>DIFFICULTY</p>
        {[{ label: "Easy", color: "#16a34a" }, { label: "Moderate", color: "#ca8a04" }, { label: "Hard", color: "#dc2626" }].map(d => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: d.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{d.label}</span>
          </div>
        ))}
      </div>
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 1000,
        backgroundColor: "#16a34a", color: "white",
        borderRadius: 10, padding: "8px 14px",
      }}>
        <p style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>🗺️ {treks.length} Treks</p>
      </div>
      <div ref={mapRef} style={{ height: 600, width: "100%" }} />
    </div>
  );
}

export default TrekMap;