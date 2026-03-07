"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Trek {
  _id: string;
  name: string;
  location: string;
  duration: number;
  difficulty: string;
  price: number;
  imageUrl: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const [treksRes, favsRes] = await Promise.all([
          fetch("http://localhost:5050/api/treks?limit=3"),
          fetch("http://localhost:5050/api/favourites", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const treksData = await treksRes.json();
        const favsData = await favsRes.json();

        setTreks(treksData.data || []);
        setFavourites(favsData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const difficultyColor = (d: string) => {
    if (d === "Easy") return { bg: "#dcfce7", color: "#16a34a" };
    if (d === "Moderate") return { bg: "#fef9c3", color: "#ca8a04" };
    return { bg: "#fee2e2", color: "#dc2626" };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 72 }}>

      {/* ===== HEADER ===== */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1a2e1a 100%)",
        padding: "48px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.15), transparent 70%)",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "#4ade80", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>
                {getGreeting()},
              </p>
              <h1 style={{
                fontSize: 42, fontWeight: 900, color: "white",
                letterSpacing: "-0.02em", marginBottom: 8,
              }}>
                {user?.name || "Trekker"} 👋
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
                Welcome to your Trekly dashboard
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link href="/profile" style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                color: "white",
                padding: "10px 20px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                👤 My Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "rgba(239,68,68,0.15)",
                  color: "#fca5a5",
                  padding: "10px 20px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  border: "1px solid rgba(239,68,68,0.2)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 36 }}>
            {[
              { label: "Saved Treks", value: loading ? "..." : favourites.length, icon: "❤️", color: "#f43f5e" },
              { label: "Available Treks", value: "15+", icon: "🏔️", color: "#4ade80" },
              { label: "Trek Routes", value: "3", icon: "🗺️", color: "#60a5fa" },
              { label: "Member Since", value: "2026", icon: "🎖️", color: "#fbbf24" },
            ].map((stat) => (
              <div key={stat.label} style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "20px 24px",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                <p style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 4 }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28 }}>

          {/* LEFT - Featured Treks */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Featured Treks</h2>
              <Link href="/treks" style={{ color: "#16a34a", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                View all →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 100, borderRadius: 16, backgroundColor: "#e2e8f0" }} />
                ))
              ) : (
                treks.map((trek) => {
                  const diff = difficultyColor(trek.difficulty);
                  return (
                    <Link key={trek._id} href={`/treks/${trek._id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        backgroundColor: "white",
                        borderRadius: 16,
                        overflow: "hidden",
                        border: "1px solid #f1f5f9",
                        display: "flex",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        }}
                      >
                        <img
                          src={trek.imageUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200"}
                          alt={trek.name}
                          style={{ width: 120, height: 100, objectFit: "cover", flexShrink: 0 }}
                        />
                        <div style={{ padding: "14px 18px", flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                              {trek.name}
                            </h3>
                            <span style={{
                              backgroundColor: diff.bg, color: diff.color,
                              padding: "3px 10px", borderRadius: 999,
                              fontSize: 11, fontWeight: 700,
                            }}>
                              {trek.difficulty}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
                            📍 {trek.location} · {trek.duration} days
                          </p>
                          <p style={{ fontSize: 16, fontWeight: 900, color: "#16a34a" }}>
                            Rs. {trek.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Favourites Preview */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>❤️ My Favourites</h2>
                <Link href="/favourites" style={{ color: "#16a34a", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                  View all →
                </Link>
              </div>
              {loading ? (
                <div style={{ height: 60, borderRadius: 12, backgroundColor: "#e2e8f0" }} />
              ) : favourites.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>🏔️</p>
                  <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 12 }}>No saved treks yet</p>
                  <Link href="/treks" style={{
                    backgroundColor: "#f0fdf4", color: "#16a34a",
                    padding: "8px 16px", borderRadius: 8,
                    fontSize: 13, fontWeight: 700, textDecoration: "none",
                  }}>
                    Explore Treks →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {favourites.slice(0, 3).map((fav: any) => (
                    <Link key={fav._id} href={`/treks/${fav.trek?._id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 12px", borderRadius: 12,
                        backgroundColor: "#f8fafc", border: "1px solid #f1f5f9",
                      }}>
                        <img
                          src={fav.trek?.imageUrl}
                          alt={fav.trek?.name}
                          style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
                        />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{fav.trek?.name}</p>
                          <p style={{ fontSize: 11, color: "#94a3b8" }}>📍 {fav.trek?.location}</p>
                        </div>
                        <p style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "#16a34a" }}>
                          Rs. {fav.trek?.price?.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>⚡ Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "🏔️", label: "Explore All Treks", href: "/treks", color: "#f0fdf4", textColor: "#16a34a" },
                  { icon: "❤️", label: "My Favourites", href: "/favourites", color: "#fff1f2", textColor: "#f43f5e" },
                  { icon: "👤", label: "Edit Profile", href: "/profile", color: "#eff6ff", textColor: "#3b82f6" },
                ].map((action) => (
                  <Link key={action.label} href={action.href} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 16px", borderRadius: 12,
                      backgroundColor: action.color,
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.8"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                    >
                      <span style={{ fontSize: 20 }}>{action.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: action.textColor }}>{action.label}</span>
                      <span style={{ marginLeft: "auto", color: action.textColor }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trek Tip */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a, #1a2e1a)",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid rgba(74,222,128,0.2)",
            }}>
              <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
                💡 TREK TIP OF THE DAY
              </p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7 }}>
                Always carry a light rain jacket and keep your phone charged before starting a trail. The weather in Nepal can change quickly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}