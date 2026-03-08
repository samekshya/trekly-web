"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

interface Trek {
  _id: string;
  name: string;
  location: string;
  price: number;
  difficulty: string;
  duration: number;
}

interface Booking {
  _id: string;
  trekId: string;
  name: string;
  email: string;
  people: number;
  totalPrice: number;
  date: string;
  createdAt: string;
}

interface Review {
  _id: string;
  trekId: string;
  rating: number;
  comment: string;
}

export default function AdminAnalyticsPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:5050/api/treks?limit=100", { headers }).then(r => r.json()),
      fetch("http://localhost:5050/api/bookings", { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch("http://localhost:5050/api/reviews", { headers }).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([trekData, bookingData, reviewData]) => {
      setTreks(trekData.data || []);
      setBookings(bookingData.data || bookingData || []);
      setReviews(reviewData.data || reviewData || []);
      setLoading(false);
    });
  }, []);

  // Computed stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalPeople = bookings.reduce((sum, b) => sum + (b.people || 0), 0);
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const easyCount = treks.filter(t => t.difficulty === "Easy").length;
  const modCount = treks.filter(t => t.difficulty === "Moderate").length;
  const hardCount = treks.filter(t => t.difficulty === "Hard").length;

  // Top 5 most expensive treks
  const topTreks = [...treks].sort((a, b) => b.price - a.price).slice(0, 5);

  // Bookings by month (last 6 months)
  const monthlyBookings = (() => {
    const months: Record<string, { count: number; revenue: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      months[key] = { count: 0, revenue: 0 };
    }
    bookings.forEach(b => {
      const d = new Date(b.createdAt || b.date);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      if (months[key]) {
        months[key].count++;
        months[key].revenue += b.totalPrice || 0;
      }
    });
    return Object.entries(months).map(([month, v]) => ({ month, ...v }));
  })();

  const maxBookings = Math.max(...monthlyBookings.map(m => m.count), 1);

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));
  const maxRating = Math.max(...ratingDist.map(r => r.count), 1);

  // Recent bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 5);

  const statCards = [
    { label: "Total Treks", value: treks.length, icon: "🏔️", color: "#34d399", sub: "In database" },
    { label: "Total Bookings", value: bookings.length, icon: "📋", color: "#60a5fa", sub: "All time" },
    { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: "💰", color: "#fbbf24", sub: `${totalPeople} people booked` },
    { label: "Avg Rating", value: avgRating, icon: "⭐", color: "#f97316", sub: `${reviews.length} reviews` },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
          <div>
            <div style={{
              width: 40, height: 40,
              border: "2px solid rgba(255,255,255,0.05)",
              borderTop: "2px solid #34d399",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center" }}>Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: 4 }}>
          Analytics Overview
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          Real-time insights across treks, bookings, and reviews
        </p>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {statCards.map(s => (
          <div key={s.label} className="stat-card" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "22px 24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.06em" }}>
                {s.label.toUpperCase()}
              </p>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: 30, fontWeight: 800, color: s.color, letterSpacing: "-0.02em", marginBottom: 4 }}>
              {s.value}
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ===== ROW 2: Bookings Chart + Difficulty Breakdown ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Bookings Bar Chart */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: 28,
        }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>
              Monthly Bookings
            </h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Last 6 months</p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {monthlyBookings.map((m) => {
              const heightPct = maxBookings > 0 ? (m.count / maxBookings) * 100 : 0;
              return (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%",
                      height: `${Math.max(heightPct, 4)}%`,
                      background: m.count > 0
                        ? "linear-gradient(180deg, #34d399, #059669)"
                        : "rgba(255,255,255,0.06)",
                      borderRadius: "6px 6px 4px 4px",
                      transition: "height 0.5s ease",
                      position: "relative",
                    }}>
                      {m.count > 0 && (
                        <div style={{
                          position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)",
                          fontSize: 11, fontWeight: 700, color: "#34d399", whiteSpace: "nowrap",
                        }}>
                          {m.count}
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{m.month}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: 28,
        }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>
              Trek Difficulty
            </h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Distribution across all treks</p>
          </div>

          {[
            { label: "Easy", count: easyCount, color: "#34d399" },
            { label: "Moderate", count: modCount, color: "#fbbf24" },
            { label: "Hard", count: hardCount, color: "#f87171" },
          ].map(d => {
            const pct = treks.length ? Math.round((d.count / treks.length) * 100) : 0;
            return (
              <div key={d.label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: d.color }}>{d.label}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{d.count} treks · {pct}%</span>
                </div>
                <div style={{
                  height: 8, borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    backgroundColor: d.color,
                    borderRadius: 999,
                    transition: "width 0.6s ease",
                    boxShadow: `0 0 8px ${d.color}66`,
                  }} />
                </div>
              </div>
            );
          })}

          {/* Donut-style total */}
          <div style={{
            marginTop: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "14px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Total Treks</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#34d399" }}>{treks.length}</span>
          </div>
        </div>
      </div>

      {/* ===== ROW 3: Top Treks + Rating Distribution ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Top Treks by Price */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: 28,
        }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>
              Top Treks by Price
            </h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Highest priced adventures</p>
          </div>
          {topTreks.map((trek, i) => (
            <div key={trek._id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 0",
              borderBottom: i < topTreks.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: i === 0 ? "linear-gradient(135deg, #fbbf24, #f97316)"
                  : i === 1 ? "linear-gradient(135deg, #94a3b8, #64748b)"
                  : i === 2 ? "linear-gradient(135deg, #cd7c2f, #92400e)"
                  : "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "white",
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{trek.name}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>📍 {trek.location}</p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#34d399", whiteSpace: "nowrap" }}>
                Rs. {trek.price?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Rating Distribution */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: 28,
        }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>
              Review Ratings
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <p style={{ fontSize: 36, fontWeight: 800, color: "#fbbf24" }}>{avgRating}</p>
              <div>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{
                      fontSize: 14,
                      color: parseFloat(avgRating as string) >= s ? "#fbbf24" : "rgba(255,255,255,0.15)"
                    }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{reviews.length} reviews total</p>
              </div>
            </div>
          </div>
          {ratingDist.map(r => (
            <div key={r.star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", width: 16, textAlign: "right" }}>{r.star}</span>
              <span style={{ fontSize: 12, color: "#fbbf24" }}>★</span>
              <div style={{
                flex: 1, height: 8, borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${maxRating > 0 ? (r.count / maxRating) * 100 : 0}%`,
                  backgroundColor: "#fbbf24",
                  borderRadius: 999,
                  boxShadow: "0 0 8px rgba(251,191,36,0.4)",
                }} />
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", width: 20 }}>{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ROW 4: Recent Bookings ===== */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, overflow: "hidden",
      }}>
        <div style={{
          padding: "22px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>Recent Bookings</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Latest 5 bookings</p>
          </div>
          <div style={{
            background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
            borderRadius: 8, padding: "5px 12px",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>{bookings.length} total</span>
          </div>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>📋</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>No bookings yet</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Customer", "Trek", "People", "Revenue", "Date"].map((h, i) => (
                  <th key={h} style={{
                    padding: "12px 24px", fontSize: 10, fontWeight: 700,
                    color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em",
                    textAlign: "left",
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, i) => {
                const trek = treks.find(t => t._id === b.trekId);
                return (
                  <tr key={b._id} className="table-row" style={{
                    borderBottom: i < recentBookings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <td style={{ padding: "14px 24px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{b.name}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{b.email}</p>
                    </td>
                    <td style={{ padding: "14px 24px" }}>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                        {trek?.name || "—"}
                      </p>
                    </td>
                    <td style={{ padding: "14px 24px" }}>
                      <span style={{
                        background: "rgba(96,165,250,0.1)", color: "#60a5fa",
                        border: "1px solid rgba(96,165,250,0.2)",
                        padding: "3px 10px", borderRadius: 999,
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {b.people} pax
                      </span>
                    </td>
                    <td style={{ padding: "14px 24px" }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#34d399" }}>
                        Rs. {b.totalPrice?.toLocaleString()}
                      </p>
                    </td>
                    <td style={{ padding: "14px 24px" }}>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                        {new Date(b.createdAt || b.date).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}