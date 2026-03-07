"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5050/api/admin/users?page=${page}&limit=8&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.total || data.data?.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5050/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const adminCount = users.filter((u: any) => u.role === "admin").length;
  const userCount = users.filter((u: any) => u.role === "user").length;

  const stats = [
    { label: "Total Users", value: totalUsers, icon: "👥", color: "#34d399", sub: "Registered accounts" },
    { label: "Regular Users", value: userCount, icon: "🧭", color: "#60a5fa", sub: "On this page" },
    { label: "Admins", value: adminCount, icon: "⚙️", color: "#f87171", sub: "On this page" },
  ];

  return (
    <AdminLayout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "22px 24px", cursor: "default",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s.label}</p>
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
        borderRadius: 20, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>All Users</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{totalUsers} registered accounts</p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "10px 16px",
          }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>🔍</span>
            <input
              type="text"
              placeholder="Search users..."
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                background: "none", border: "none", outline: "none",
                color: "rgba(255,255,255,0.7)", fontSize: 13, width: 200,
              }}
            />
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
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>👥</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>No users found</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["User", "Email", "Role", "Member Since", "Actions"].map((h, i) => (
                  <th key={h} style={{
                    padding: "14px 20px",
                    fontSize: 10, fontWeight: 700,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.1em",
                    textAlign: i === 4 ? "right" : "left",
                  }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, i: number) => (
                <tr key={user._id} className="table-row" style={{
                  borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg, #059669, #34d399)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 800, fontSize: 13, flexShrink: 0,
                      }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{user.name}</p>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>{user.email}</p>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      backgroundColor: user.role === "admin" ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)",
                      color: user.role === "admin" ? "#f87171" : "#34d399",
                      border: `1px solid ${user.role === "admin" ? "rgba(248,113,113,0.2)" : "rgba(52,211,153,0.2)"}`,
                      padding: "4px 12px", borderRadius: 999,
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {user.role === "admin" ? "⚙️ Admin" : "🧭 User"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "2026"}
                    </p>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(user._id)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div style={{
          padding: "20px 28px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
            Page {page} / {totalPages}
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: page === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
                fontSize: 12, fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                padding: "8px 14px", borderRadius: 8,
                background: p === page ? "linear-gradient(135deg, #059669, #34d399)" : "rgba(255,255,255,0.04)",
                border: p === page ? "none" : "1px solid rgba(255,255,255,0.08)",
                color: p === page ? "white" : "rgba(255,255,255,0.4)",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                boxShadow: p === page ? "0 4px 10px rgba(52,211,153,0.2)" : "none",
              }}>
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              style={{
                padding: "8px 16px", borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: page === totalPages ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
                fontSize: 12, fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}