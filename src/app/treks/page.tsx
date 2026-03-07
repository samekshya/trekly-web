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
  const [sortBy, setSortBy] = useState("default");

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

  const filtered = treks
    .filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase());
      const matchDiff = difficulty === "All" || t.difficulty === difficulty;
      return matchSearch && matchDiff;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "duration-asc") return a.duration - b.duration;
      return 0;
    });

  const difficultyColor = (d: string) => {
    if (d === "Easy") return { bg: "#dcfce7", color: "#16a34a" };
    if (d === "Moderate") return { bg: "#fef9c3", color: "#ca8a04" };
    return { bg: "#fee2e2", color: "#dc2626" };
  };

  const countByDiff = (d: string) => treks.filter((t) => t.difficulty === d).length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 72 }}>

      {/* ===== HERO ===== */}
      <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1800"
          alt="Treks"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 12 }}>
            EXPLORE NEPAL
          </p>
          <h1 style={{
            fontSize: 56, fontWeight: 900, color: "white",
            letterSpacing: "-0.02em", marginBottom: 12, textAlign: "center",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>
            Find Your Perfect Trek
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, marginBottom: 32 }}>
            {treks.length} handpicked adventures across Nepal
          </p>

          {/* Hero Search Bar */}
          <div style={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: 560,
          }}>
            <span style={{ padding: "0 16px", display: "flex", alignItems: "center", fontSize: 18 }}>🔍</span>
            <input
              type="text"
              placeholder="Search by trek name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, padding: "16px 0",
                border: "none", outline: "none",
                fontSize: 15, color: "#0f172a",
                backgroundColor: "transparent",
              }}
            />
            <button style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "0 28px",
              border: "none",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #f1f5f9",
        padding: "16px 80px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 72,
        zIndex: 40,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        {/* Difficulty Filters */}
        <div style={{ display: "flex", gap: 8, flex: 1 }}>
          {[
            { label: "All Treks", value: "All", icon: "🏔️", count: treks.length },
            { label: "Easy", value: "Easy", icon: "🟢", count: countByDiff("Easy") },
            { label: "Moderate", value: "Moderate", icon: "🟡", count: countByDiff("Moderate") },
            { label: "Hard", value: "Hard", icon: "🔴", count: countByDiff("Hard") },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: difficulty === d.value ? "#16a34a" : "#e2e8f0",
                backgroundColor: difficulty === d.value ? "#16a34a" : "white",
                color: difficulty === d.value ? "white" : "#64748b",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {d.icon} {d.label}
              <span style={{
                backgroundColor: difficulty === d.value ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                color: difficulty === d.value ? "white" : "#64748b",
                padding: "1px 7px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
              }}>
                {d.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1.5px solid #e2e8f0",
            backgroundColor: "white",
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="default">Sort by: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration-asc">Duration: Shortest First</option>
        </select>

        <p style={{ color: "#94a3b8", fontSize: 13, whiteSpace: "nowrap" }}>
          {filtered.length} trek{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* ===== TREK GRID ===== */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "48px 60px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{
                height: 400, borderRadius: 20,
                backgroundColor: "#e2e8f0",
              }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⚠️</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#ef4444" }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏔️</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>No treks found</p>
            <p style={{ color: "#94a3b8", marginBottom: 24 }}>Try a different search or filter</p>
            <button
              onClick={() => { setSearch(""); setDifficulty("All"); }}
              style={{
                backgroundColor: "#16a34a", color: "white",
                padding: "12px 28px", borderRadius: 10,
                border: "none", fontWeight: 700, cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
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
                      height: "100%",
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
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
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
                      <div style={{
                        position: "absolute", top: 14, left: 14,
                        backgroundColor: diff.bg, color: diff.color,
                        padding: "5px 12px", borderRadius: 999,
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {trek.difficulty}
                      </div>
                      <div style={{
                        position: "absolute", top: 14, right: 14,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(4px)",
                        color: "white",
                        padding: "5px 12px", borderRadius: 999,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {trek.duration} {trek.duration === 1 ? "day" : "days"}
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
                      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                        📍 {trek.location}
                      </p>
                      <p style={{
                        fontSize: 13, color: "#64748b", marginBottom: 16,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as any,
                        lineHeight: 1.6,
                      }}>
                        {trek.description}
                      </p>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        borderTop: "1px solid #f1f5f9", paddingTop: 14,
                      }}>
                        <div>
                          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Starting from</p>
                          <p style={{ fontSize: 22, fontWeight: 900, color: "#16a34a" }}>
                            Rs. {trek.price?.toLocaleString()}
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: "#f0fdf4", color: "#16a34a",
                          padding: "10px 18px", borderRadius: 10,
                          fontSize: 13, fontWeight: 700,
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