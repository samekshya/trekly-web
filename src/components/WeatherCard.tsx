"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: string;
}

interface WeatherCardProps {
  trekLocation: string;
}

const conditionStyles: Record<
  string,
  { gradient: string; accent: string; textClass: string }
> = {
  Clear: {
    gradient: "from-amber-400 via-orange-300 to-sky-400",
    accent: "#f59e0b",
    textClass: "text-amber-900",
  },
  Clouds: {
    gradient: "from-slate-400 via-gray-300 to-slate-500",
    accent: "#94a3b8",
    textClass: "text-slate-800",
  },
  Rain: {
    gradient: "from-blue-600 via-blue-400 to-indigo-500",
    accent: "#3b82f6",
    textClass: "text-blue-950",
  },
  Drizzle: {
    gradient: "from-sky-400 via-blue-300 to-cyan-400",
    accent: "#38bdf8",
    textClass: "text-sky-900",
  },
  Thunderstorm: {
    gradient: "from-purple-700 via-violet-500 to-gray-700",
    accent: "#7c3aed",
    textClass: "text-purple-950",
  },
  Snow: {
    gradient: "from-sky-100 via-blue-200 to-indigo-200",
    accent: "#bae6fd",
    textClass: "text-indigo-900",
  },
  Mist: {
    gradient: "from-gray-300 via-slate-200 to-gray-400",
    accent: "#cbd5e1",
    textClass: "text-gray-700",
  },
  Haze: {
    gradient: "from-yellow-200 via-amber-100 to-gray-300",
    accent: "#fde68a",
    textClass: "text-amber-800",
  },
};

const defaultStyle = {
  gradient: "from-emerald-500 via-teal-400 to-cyan-500",
  accent: "#10b981",
  textClass: "text-emerald-950",
};

export default function WeatherCard({ trekLocation }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trekLocation) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5050/api/weather/${encodeURIComponent(trekLocation)}`
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch weather");
        }
        const json = await res.json();
        setWeather(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [trekLocation]);

  const style = weather
    ? conditionStyles[weather.condition] ?? defaultStyle
    : defaultStyle;

  // Loading
  if (loading) {
    return (
      <div style={{
        borderRadius: 20, overflow: "hidden", marginBottom: 16,
        background: "linear-gradient(135deg, #e2e8f0, #f1f5f9)",
        height: 160, animation: "pulse 1.5s infinite",
      }} />
    );
  }

  // Error
  if (error || !weather) {
    return (
      <div style={{
        borderRadius: 20, border: "1px solid #fecaca",
        backgroundColor: "#fff5f5", padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
      }}>
        <span style={{ fontSize: 24 }}>🌐</span>
        <div>
          <p style={{ fontWeight: 700, color: "#dc2626", fontSize: 13, margin: 0 }}>
            Weather unavailable
          </p>
          <p style={{ color: "#f87171", fontSize: 12, margin: "2px 0 0" }}>
            {error ?? "Could not load weather for this location."}
          </p>
        </div>
      </div>
    );
  }

  // Inline styles since your project uses inline styles (not Tailwind classes)
  const gradientMap: Record<string, string> = {
    Clear: "linear-gradient(135deg, #fbbf24, #fb923c, #38bdf8)",
    Clouds: "linear-gradient(135deg, #94a3b8, #cbd5e1, #64748b)",
    Rain: "linear-gradient(135deg, #2563eb, #60a5fa, #6366f1)",
    Drizzle: "linear-gradient(135deg, #38bdf8, #93c5fd, #22d3ee)",
    Thunderstorm: "linear-gradient(135deg, #7c3aed, #a78bfa, #374151)",
    Snow: "linear-gradient(135deg, #e0f2fe, #bfdbfe, #c7d2fe)",
    Mist: "linear-gradient(135deg, #d1d5db, #e2e8f0, #9ca3af)",
    Haze: "linear-gradient(135deg, #fde68a, #fef3c7, #d1d5db)",
  };

  const textColorMap: Record<string, string> = {
    Clear: "#78350f", Clouds: "#1e293b", Rain: "#1e3a5f",
    Drizzle: "#0c4a6e", Thunderstorm: "#2e1065", Snow: "#1e3a8a",
    Mist: "#374151", Haze: "#78350f",
  };

  const bg = gradientMap[weather.condition] ?? "linear-gradient(135deg, #10b981, #2dd4bf, #06b6d4)";
  const textColor = textColorMap[weather.condition] ?? "#064e3b";

  return (
    <div style={{
      borderRadius: 20, overflow: "hidden",
      background: bg, color: textColor,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 20px 8px" }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.65, margin: "0 0 4px", textTransform: "uppercase" }}>
            Live Weather
          </p>
          <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
            {weather.location}, {weather.country}
          </p>
          <p style={{ fontSize: 13, margin: "2px 0 0", opacity: 0.85, textTransform: "capitalize" }}>
            {weather.description}
          </p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          style={{ width: 60, height: 60, marginTop: -4, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
        />
      </div>

      {/* Temperature */}
      <div style={{ padding: "0 20px 12px" }}>
        <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1 }}>
          {weather.temperature}°
        </span>
        <span style={{ fontSize: 13, opacity: 0.7, marginLeft: 6 }}>
          Feels like {weather.feelsLike}°C
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 20px" }}>
        {[
          { icon: "💧", label: "Humidity", value: `${weather.humidity}%` },
          { icon: "💨", label: "Wind", value: `${weather.windSpeed} km/h` },
          { icon: "👁️", label: "Visibility", value: `${weather.visibility} km` },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, backgroundColor: "rgba(255,255,255,0.25)",
            borderRadius: 12, padding: "10px 8px", textAlign: "center",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{stat.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, marginTop: 1 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: "rgba(0,0,0,0.1)", padding: "8px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 11, opacity: 0.6 }}>Powered by OpenWeatherMap</span>
        <span style={{ fontSize: 11, opacity: 0.5 }}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}