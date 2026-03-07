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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) { router.push("/login"); return; }
    setUser(JSON.parse(stored));

    const fetchData = async () => {
      try {
        const [treksRes, favsRes] = await Promise.all([
          fetch("http://localhost:5050/api/treks?limit=100"),
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

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const featuredTrek = treks.find(t => t.difficulty === "Hard") || treks[0];

  const filteredTreks = treks.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    if (filter === "Easy") return matchSearch && t.difficulty === "Easy";
    if (filter === "Moderate") return matchSearch && t.difficulty === "Moderate";
    if (filter === "Hard") return matchSearch && t.difficulty === "Hard";
    if (filter === "Saved") return matchSearch && favourites.some(f => f.trek?._id === t._id);
    return matchSearch;
  }).slice(0, 6);

  const difficultyStyle = (d: string) => {
    if (d === "Easy") return { bg: "#dcfce7", color: "#16a34a" };
    if (d === "Moderate") return { bg: "#fef9c3", color: "#ca8a04" };
    return { bg: "#fee2e2", color: "#dc2626" };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 72 }}>

      {/* ===== HERO BANNER ===== */}
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800"
          alt="Dashboard"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.2))",
          display: "flex", alignItems: "center",
          padding: "0 80px",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>
              {getGreeting()},
            </p>
            <h1 style={{
              fontSize: 44, fontWeight: 900, color: "white",
              letterSpacing: "-0.02em", marginBottom: 12,
            }}>
              {user?.name || "Trekker"} 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 24 }}>
              Ready for your next adventure?
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/treks" style={{
                backgroundColor: "#16a34a",
                color: "white",
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(22,163,74,0.4)",
              }}>
                🏔️ Explore Treks
              </Link>
              <Link href="/favourites" style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "white",
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                ❤️ My Favourites
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #f1f5f9",
        padding: "0 80px",
        display: "flex",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        {[
          { icon: "❤️", value: loading ? "..." : favourites.length, label: "Saved Treks", color: "#f43f5e" },
          { icon: "🏔️", value: loading ? "..." : treks.length, label: "Total Treks", color: "#16a34a" },
          { icon: "📍", value: "8", label: "Regions Covered", color: "#3b82f6" },
          { icon: "⭐", value: "3", label: "Difficulty Levels", color: "#f59e0b" },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            padding: "20px 40px 20px 0",
            marginRight: 40,
            borderRight: i < 3 ? "1px solid #f1f5f9" : "none",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: 12,
              backgroundColor: `${stat.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{stat.label}</p>
            </div>
          </div>
        ))}

        {/* Profile quick info */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/profile" style={{
            display: "flex", alignItems: "center", gap: 10,
            textDecoration: "none",
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            transition: "all 0.2s",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #4ade80)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 15,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: "#94a3b8" }}>View Profile →</p>
            </div>
          </Link>
          <button onClick={handleLogout} style={{
            backgroundColor: "#fff1f2",
            color: "#f43f5e",
            padding: "10px 18px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13,
            border: "1px solid #fecdd3",
            cursor: "pointer",
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>

          {/* LEFT */}
          <div>
            {/* Search + Filter */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: "20px 24px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              marginBottom: 24,
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{
                  flex: 1, minWidth: 200,
                  display: "flex",
                  backgroundColor: "#f8fafc",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}>
                  <span style={{ padding: "0 14px", display: "flex", alignItems: "center", color: "#94a3b8" }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search treks..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      flex: 1, padding: "12px 0",
                      border: "none", outline: "none",
                      backgroundColor: "transparent",
                      fontSize: 14, color: "#0f172a",
                    }}
                  />
                </div>
                {["All", "Easy", "Moderate", "Hard", "Saved"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1.5px solid",
                      borderColor: filter === f ? "#16a34a" : "#e2e8f0",
                      backgroundColor: filter === f ? "#16a34a" : "white",
                      color: filter === f ? "white" : "#64748b",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {f === "Saved" ? "❤️ " : ""}{f}
                  </button>
                ))}
              </div>
            </div>

            {/* Trek Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} style={{ height: 280, borderRadius: 18, backgroundColor: "#e2e8f0" }} />
                ))
              ) : filteredTreks.length === 0 ? (
                <div style={{ gridColumn: "span 2", textAlign: "center", padding: "60px 0" }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>🏔️</p>
                  <p style={{ fontSize: 16, color: "#94a3b8" }}>No treks found</p>
                </div>
              ) : (
                filteredTreks.map(trek => {
                  const diff = difficultyStyle(trek.difficulty);
                  const isFav = favourites.some(f => f.trek?._id === trek._id);
                  return (
                    <Link key={trek._id} href={`/treks/${trek._id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        backgroundColor: "white",
                        borderRadius: 18,
                        overflow: "hidden",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        transition: "all 0.25s",
                        cursor: "pointer",
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 32px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                        }}
                      >
                        <div style={{ position: "relative", height: 160 }}>
                          <img
                            src={trek.imageUrl}
                            alt={trek.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                          }} />
                          <div style={{ position: "absolute", top: 12, left: 12 }}>
                            <span style={{
                              backgroundColor: diff.bg, color: diff.color,
                              padding: "4px 10px", borderRadius: 999,
                              fontSize: 11, fontWeight: 700,
                            }}>
                              {trek.difficulty}
                            </span>
                          </div>
                          {isFav && (
                            <div style={{ position: "absolute", top: 12, right: 12, fontSize: 16 }}>❤️</div>
                          )}
                          <div style={{ position: "absolute", bottom: 10, right: 12 }}>
                            <span style={{
                              backgroundColor: "rgba(0,0,0,0.5)",
                              backdropFilter: "blur(4px)",
                              color: "white",
                              padding: "3px 10px", borderRadius: 999,
                              fontSize: 11, fontWeight: 600,
                            }}>
                              {trek.duration} days
                            </span>
                          </div>
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                          <h3 style={{
                            fontSize: 15, fontWeight: 800, color: "#0f172a",
                            marginBottom: 4,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {trek.name}
                          </h3>
                          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>📍 {trek.location}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}>
                              Rs. {trek.price?.toLocaleString()}
                            </p>
                            <span style={{
                              backgroundColor: "#f0fdf4", color: "#16a34a",
                              padding: "6px 12px", borderRadius: 8,
                              fontSize: 12, fontWeight: 700,
                            }}>
                              View →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Featured Trek */}
            {featuredTrek && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>⭐ Featured Trek</h2>
                <Link href={`/treks/${featuredTrek._id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    borderRadius: 18, overflow: "hidden",
                    position: "relative", height: 200,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    transition: "transform 0.25s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"}
                  >
                    <img src={featuredTrek.imageUrl} alt={featuredTrek.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    }} />
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 4 }}>
                        {featuredTrek.name}
                      </h3>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        {featuredTrek.difficulty} · {featuredTrek.duration} days · {featuredTrek.location}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Favourites */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 18,
              padding: "20px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>❤️ Saved Treks</h2>
                <Link href="/favourites" style={{ color: "#16a34a", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                  View all →
                </Link>
              </div>
              {loading ? (
                <div style={{ height: 60, borderRadius: 10, backgroundColor: "#f1f5f9" }} />
              ) : favourites.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>No saved treks yet</p>
                  <Link href="/treks" style={{
                    backgroundColor: "#f0fdf4", color: "#16a34a",
                    padding: "8px 14px", borderRadius: 8,
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                    display: "inline-block",
                  }}>
                    Explore Treks →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {favourites.slice(0, 3).map((fav: any) => (
                    <Link key={fav._id} href={`/treks/${fav.trek?._id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px",
                        borderRadius: 12,
                        backgroundColor: "#f8fafc",
                        border: "1px solid #f1f5f9",
                        transition: "all 0.2s",
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "white"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8fafc"}
                      >
                        <img src={fav.trek?.imageUrl} alt={fav.trek?.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {fav.trek?.name}
                          </p>
                          <p style={{ fontSize: 11, color: "#94a3b8" }}>📍 {fav.trek?.location}</p>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", flexShrink: 0 }}>
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
              borderRadius: 18,
              padding: "20px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>⚡ Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "🏔️", label: "Browse All Treks", sub: `${treks.length} available`, href: "/treks", bg: "#f0fdf4", color: "#16a34a" },
                  { icon: "❤️", label: "My Favourites", sub: `${favourites.length} saved`, href: "/favourites", bg: "#fff1f2", color: "#f43f5e" },
                  { icon: "👤", label: "Edit Profile", sub: "Update your info", href: "/profile", bg: "#eff6ff", color: "#3b82f6" },
                ].map(a => (
                  <Link key={a.label} href={a.href} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", borderRadius: 12,
                      backgroundColor: a.bg, transition: "opacity 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.75"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                    >
                      <span style={{ fontSize: 20 }}>{a.icon}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{a.label}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8" }}>{a.sub}</p>
                      </div>
                      <span style={{ marginLeft: "auto", color: a.color, fontWeight: 700 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trek Tip */}
            <div style={{
              borderRadius: 18, padding: "20px",
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              border: "1px solid #bbf7d0",
            }}>
              <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 8 }}>
                💡 TREK TIP OF THE DAY
              </p>
              <p style={{ color: "#166534", fontSize: 13, lineHeight: 1.7 }}>
                Always carry a light rain jacket and keep your phone charged. Weather in Nepal can change very quickly!
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}