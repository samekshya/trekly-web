"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Trek {
  _id: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  difficulty: string;
  price: number;
  imageUrl: string;
}

export default function UserTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/treks?limit=100");
        if (!res.ok) throw new Error("Failed to load treks");
        const data = await res.json();
        setTreks(data.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchTreks();
  }, []);

  const filtered = treks.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === "All" || t.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  const difficultyColor = (d: string) => {
    if (d === "Easy") return { bg: "#dcfce7", color: "#16a34a" };
    if (d === "Moderate") return { bg: "#fef9c3", color: "#ca8a04" };
    return { bg: "#fee2e2", color: "#dc2626" };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 80 }}>

      {/* ===== HERO BANNER ===== */}
      <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1800"
          alt="Treks"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", marginBottom: 12 }}>
            EXPLORE NEPAL
          </p>
          <h1 style={{
            fontSize: 52, fontWeight: 900, color: "white",
            letterSpacing: "-0.02em", marginBottom: 12, textAlign: "center",
          }}>
            Find Your Perfect Trek
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
            {treks.length} adventures waiting for you
          </p>
        </div>
      </div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #f1f5f9",
        padding: "20px 80px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 72,
        zIndex: 40,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input
            type="text"
            placeholder="Search treks or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              fontSize: 14,
              outline: "none",
              color: "#0f172a",
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Easy", "Moderate", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: difficulty === d ? "#16a34a" : "#e2e8f0",
                backgroundColor: difficulty === d ? "#16a34a" : "white",
                color: difficulty === d ? "white" : "#64748b",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {d === "Easy" ? "🟢" : d === "Moderate" ? "🟡" : d === "Hard" ? "🔴" : "🏔️"} {d}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ color: "#94a3b8", fontSize: 14, marginLeft: "auto", whiteSpace: "nowrap" }}>
          {filtered.length} trek{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* ===== TREK GRID ===== */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 80px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{
                height: 380, borderRadius: 20,
                backgroundColor: "#e2e8f0",
              }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#ef4444" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⚠️</p>
            <p style={{ fontSize: 18, fontWeight: 600 }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏔️</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>No treks found</p>
            <p style={{ color: "#94a3b8" }}>Try a different search or filter</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {filtered.map((trek) => {
              const diff = difficultyColor(trek.difficulty);
              return (
                <Link key={trek._id} href={`/treks/${trek._id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: 20,
                      overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      border: "1px solid #f1f5f9",
                      transition: "all 0.25s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                      {trek.imageUrl ? (
                        <img
                          src={trek.imageUrl}
                          alt={trek.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 48,
                        }}>🏔️</div>
                      )}
                      {/* Difficulty badge */}
                      <div style={{
                        position: "absolute", top: 14, left: 14,
                        backgroundColor: diff.bg,
                        color: diff.color,
                        padding: "5px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {trek.difficulty}
                      </div>
                      {/* Duration badge */}
                      <div style={{
                        position: "absolute", top: 14, right: 14,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(4px)",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {trek.duration} days
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "20px 22px 22px" }}>
                      <h3 style={{
                        fontSize: 17, fontWeight: 800,
                        color: "#0f172a", marginBottom: 6,
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {trek.name}
                      </h3>
                      <p style={{
                        fontSize: 13, color: "#94a3b8",
                        marginBottom: 6,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        📍 {trek.location}
                      </p>
                      <p style={{
                        fontSize: 13, color: "#64748b",
                        marginBottom: 16,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as any,
                        lineHeight: 1.5,
                      }}>
                        {trek.description}
                      </p>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: 14,
                      }}>
                        <div>
                          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Starting from</p>
                          <p style={{ fontSize: 20, fontWeight: 900, color: "#16a34a" }}>
                            Rs. {trek.price?.toLocaleString()}
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: "#f0fdf4",
                          color: "#16a34a",
                          padding: "10px 18px",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                        }}>
                          View Details →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}