"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  itinerary?: { day: number; title: string; description: string }[];
  hotels?: { name: string; contact: string; imageUrl?: string }[];
}

export default function TrekDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trek, setTrek] = useState<Trek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavourited, setIsFavourited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/treks/${id}`);
        if (!res.ok) throw new Error("Failed to load trek");
        const data = await res.json();
        setTrek(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const checkFavourite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`http://localhost:5050/api/favourites/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIsFavourited(data.isFavourited);
      } catch {}
    };

    if (id) { fetchTrek(); checkFavourite(); }
  }, [id]);

  const handleFavourite = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    setFavLoading(true);
    try {
      if (isFavourited) {
        await fetch(`http://localhost:5050/api/favourites/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavourited(false);
      } else {
        await fetch(`http://localhost:5050/api/favourites`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ trekId: id }),
        });
        setIsFavourited(true);
      }
    } catch {}
    setFavLoading(false);
  };

  const diffStyle = (d: string) => {
    if (d === "Easy") return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
    if (d === "Moderate") return { bg: "#fef9c3", color: "#ca8a04", border: "#fde68a" };
    return { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40,
          border: "3px solid #e2e8f0",
          borderTop: "3px solid #16a34a",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading trek...</p>
      </div>
    </div>
  );

  if (error || !trek) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#ef4444", fontSize: 18, marginBottom: 16 }}>Trek not found</p>
        <button onClick={() => router.push("/treks")} style={{
          backgroundColor: "#16a34a", color: "white",
          padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700,
        }}>
          Back to Treks
        </button>
      </div>
    </div>
  );

  const diff = diffStyle(trek.difficulty);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 72 }}>

      {/* ===== HERO ===== */}
      <div style={{ position: "relative", height: 520, overflow: "hidden" }}>
        <img
          src={trek.imageUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800"}
          alt={trek.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
        }} />

        {/* Back button */}
        <div style={{ position: "absolute", top: 28, left: 40 }}>
          <Link href="/treks" style={{
            display: "flex", alignItems: "center", gap: 8,
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            color: "white", padding: "10px 18px",
            borderRadius: 10, textDecoration: "none",
            fontSize: 13, fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.2)",
            transition: "all 0.2s",
          }}>
            ← Back to Treks
          </Link>
        </div>

        {/* Hero Content */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "40px 80px",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Badges row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{
                backgroundColor: diff.bg, color: diff.color,
                border: `1px solid ${diff.border}`,
                padding: "5px 14px", borderRadius: 999,
                fontSize: 12, fontWeight: 700,
              }}>
                {trek.difficulty}
              </span>
              <span style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                color: "white",
                padding: "5px 14px", borderRadius: 999,
                fontSize: 12, fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                {trek.duration} {trek.duration === 1 ? "day" : "days"}
              </span>
            </div>

            <h1 style={{
              fontSize: 52, fontWeight: 900, color: "white",
              letterSpacing: "-0.02em", marginBottom: 12,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}>
              {trek.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>{trek.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUICK STATS BAR ===== */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #f1f5f9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px" }}>
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { label: "Duration", value: `${trek.duration} ${trek.duration === 1 ? "Day" : "Days"}` },
              { label: "Difficulty", value: trek.difficulty },
              { label: "Price per person", value: `Rs. ${trek.price?.toLocaleString()}` },
              { label: "Location", value: trek.location },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: "20px 32px 20px 0",
                marginRight: 32,
                borderRight: i < 3 ? "1px solid #f1f5f9" : "none",
              }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 4 }}>
                  {stat.label.toUpperCase()}
                </p>
                <p style={{
                  fontSize: 16, fontWeight: 800,
                  color: i === 2 ? "#16a34a" : "#0f172a",
                }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 36 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* About */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: "32px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.01em" }}>
                About this Trek
              </h2>
              <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.8 }}>
                {trek.description}
              </p>

              {/* Highlights */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
                {[
                  { label: "Expert guides included", icon: "✓" },
                  { label: "All equipment provided", icon: "✓" },
                  { label: "Free cancellation", icon: "✓" },
                  { label: "Small group sizes", icon: "✓" },
                ].map(h => (
                  <div key={h.label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 16px",
                    backgroundColor: "#f0fdf4",
                    borderRadius: 10,
                    border: "1px solid #bbf7d0",
                  }}>
                    <div style={{
                      width: 20, height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#16a34a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 11, fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      {h.icon}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>{h.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            {trek.itinerary && trek.itinerary.length > 0 && (
              <div style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: "32px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.01em" }}>
                  Day-by-Day Itinerary
                </h2>
                <div style={{ position: "relative" }}>
                  {/* Timeline line */}
                  <div style={{
                    position: "absolute", left: 19, top: 20, bottom: 20,
                    width: 2, backgroundColor: "#e2e8f0",
                  }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {trek.itinerary.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 20, paddingBottom: i < trek.itinerary!.length - 1 ? 28 : 0 }}>
                        <div style={{
                          width: 40, height: 40,
                          borderRadius: "50%",
                          backgroundColor: "#16a34a",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontWeight: 800, fontSize: 13,
                          flexShrink: 0, zIndex: 1,
                          boxShadow: "0 0 0 4px white, 0 0 0 6px #e2e8f0",
                        }}>
                          {item.day}
                        </div>
                        <div style={{
                          flex: 1,
                          backgroundColor: "#f8fafc",
                          borderRadius: 14,
                          padding: "16px 20px",
                          border: "1px solid #f1f5f9",
                        }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                            {item.title}
                          </p>
                          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Hotels */}
            {trek.hotels && trek.hotels.length > 0 && (
              <div style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: "32px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 20, letterSpacing: "-0.01em" }}>
                  Accommodation
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {trek.hotels.map((hotel, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px",
                      backgroundColor: "#f8fafc",
                      borderRadius: 14,
                      border: "1px solid #f1f5f9",
                    }}>
                      <div style={{
                        width: 44, height: 44,
                        backgroundColor: "#eff6ff",
                        borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{hotel.name}</p>
                        <p style={{ fontSize: 12, color: "#94a3b8" }}>{hotel.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Booking Card */}
          <div>
            <div style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: "32px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 96,
            }}>
              {/* Price */}
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 4 }}>
                  STARTING FROM
                </p>
                <p style={{ fontSize: 40, fontWeight: 900, color: "#16a34a", letterSpacing: "-0.02em" }}>
                  Rs. {trek.price?.toLocaleString()}
                </p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>per person, all inclusive</p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>DURATION</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                    {trek.duration} {trek.duration === 1 ? "Day" : "Days"}
                  </p>
                </div>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>DIFFICULTY</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: diff.color }}>
                    {trek.difficulty}
                  </p>
                </div>
              </div>

              {/* Book Button */}
              <button style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#16a34a",
                color: "white",
                borderRadius: 14,
                border: "none",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                marginBottom: 12,
                boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                transition: "all 0.2s",
                letterSpacing: "-0.01em",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#15803d";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(22,163,74,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#16a34a";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(22,163,74,0.35)";
                }}
              >
                Book This Trek
              </button>

              {/* Save Button */}
              <button
                onClick={handleFavourite}
                disabled={favLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: isFavourited ? "#fff1f2" : "#f8fafc",
                  color: isFavourited ? "#f43f5e" : "#374151",
                  borderRadius: 14,
                  border: `1.5px solid ${isFavourited ? "#fecdd3" : "#e2e8f0"}`,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.8"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill={isFavourited ? "#f43f5e" : "none"}
                  stroke={isFavourited ? "#f43f5e" : "#374151"}
                  strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favLoading ? "Saving..." : isFavourited ? "Saved to Favourites" : "Save Trek"}
              </button>

              {/* Trust badges */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>
                  WHAT'S INCLUDED
                </p>
                {[
                  { label: "Expert local guides" },
                  { label: "All equipment provided" },
                  { label: "Free cancellation" },
                  { label: "Small groups (max 12)" },
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    marginBottom: 10,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      backgroundColor: "#f0fdf4",
                      border: "1.5px solid #16a34a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div style={{
                marginTop: 20,
                padding: "14px 16px",
                backgroundColor: "#f8fafc",
                borderRadius: 12,
                border: "1px solid #f1f5f9",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Need help booking?</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>contact@trekly.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}