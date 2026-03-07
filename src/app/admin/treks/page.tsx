"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useRouter } from "next/navigation";

interface Trek {
  _id: string;
  name: string;
  location: string;
  price: number;
  difficulty: string;
  duration: number;
}

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => { fetchTreks(); }, []);

  const fetchTreks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/treks?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTreks(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this trek?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5050/api/treks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTreks(prev => prev.filter(t => t._id !== id));
  };

  const filtered = treks.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  const diffStyle = (d: string) => {
    if (d === "Easy") return { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" };
    if (d === "Moderate") return { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" };
    return { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)" };
  };

  const hardCount = treks.filter(t => t.difficulty === "Hard").length;
  const modCount = treks.filter(t => t.difficulty === "Moderate").length;
  const easyCount = treks.filter(t => t.difficulty === "Easy").length;

  const stats = [
    { label: "Total Treks", value: treks.length, icon: "🏔️", color: "#34d399", sub: "All treks" },
    { label: "Easy", value: easyCount, icon: "🟢", color: "#34d399", sub: "Beginner friendly" },
    { label: "Moderate", value: modCount, icon: "🟡", color: "#fbbf24", sub: "Intermediate" },
    { label: "Hard", value: hardCount, icon: "🔴", color: "#f87171", sub: "Expert level" },
  ];

  return (
    <AdminLayout>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: "22px 24px",
            cursor: "default",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500, letterSpacing: "0.03em" }}>{s.label}</p>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: 36, fontWeight: 800, color: s.color, letterSpacing: "-0.03em", marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        overflow: "hidden",
      }}>

        {/* Table Header */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>All Treks</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{treks.length} treks in database</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "10px 16px",
            }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>🔍</span>
              <input
                type="text"
                placeholder="Search treks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  color: "rgba(255,255,255,0.7)", fontSize: 13,
                  width: 200,
                }}
              />
            </div>
            <button
              onClick={() => router.push("/admin/treks/new")}
              className="action-btn"
              style={{
                background: "linear-gradient(135deg, #059669, #34d399)",
                color: "white", padding: "10px 20px",
                borderRadius: 10, border: "none",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(52,211,153,0.2)",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              + New Trek
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <div style={{
              width: 32, height: 32,
              border: "2px solid rgba(255,255,255,0.05)",
              borderTop: "2px solid #34d399",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Loading treks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>🏔️</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>No treks found</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Trek Name", "Location", "Duration", "Difficulty", "Price", "Actions"].map((h, i) => (
                  <th key={h} style={{
                    padding: "14px 20px",
                    fontSize: 10, fontWeight: 700,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.1em",
                    textAlign: i === 5 ? "right" : "left",
                  }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((trek, i) => {
                const diff = diffStyle(trek.difficulty);
                return (
                  <tr key={trek._id} className="table-row" style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <td style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{trek.name}</p>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>📍 {trek.location}</p>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{trek.duration} days</p>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        backgroundColor: diff.bg,
                        color: diff.color,
                        border: `1px solid ${diff.border}`,
                        padding: "4px 12px", borderRadius: 999,
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {trek.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#34d399", fontFamily: "'DM Mono', monospace" }}>
                        Rs. {trek.price?.toLocaleString()}
                      </p>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          onClick={() => router.push(`/admin/treks/${trek._id}/edit`)}
                          className="action-btn"
                          style={{
                            backgroundColor: "rgba(96,165,250,0.1)",
                            color: "#60a5fa",
                            border: "1px solid rgba(96,165,250,0.2)",
                            padding: "7px 14px", borderRadius: 8,
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trek._id)}
                          className="action-btn"
                          style={{
                            backgroundColor: "rgba(248,113,113,0.1)",
                            color: "#f87171",
                            border: "1px solid rgba(248,113,113,0.2)",
                            padding: "7px 14px", borderRadius: 8,
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
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