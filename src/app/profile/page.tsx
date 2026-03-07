"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem("user");
  if (!token || !stored) { router.push("/login"); return; }

  // Pre-fill immediately from localStorage
  const storedUser = JSON.parse(stored);
  setName(storedUser.name || "");
  setEmail(storedUser.email || "");
  setMe({
    _id: storedUser.id || storedUser._id,
    name: storedUser.name,
    email: storedUser.email,
    role: storedUser.role,
  });
  setLoading(false);

  // Also fetch fresh from API in background
  fetch("http://localhost:5050/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(r => r.json())
    .then(data => {
      const user = data?.user ?? data;
      if (user?.name) {
        setMe({ _id: user._id || user.id, name: user.name, email: user.email, role: user.role });
        setName(user.name);
        setEmail(user.email);
      }
    })
    .catch(console.error);
}, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me?._id) return;
    setSaving(true);
    setMsg(null);

    try {
      const token = localStorage.getItem("token");
      const body: any = { name, email };
      if (password.trim()) body.password = password;

      const res = await fetch(`http://localhost:5050/api/auth/${me._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      const updated = data?.user ?? data;
      setMe(updated);
      setPassword("");

      // Update localStorage name
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: updated.name, email: updated.email }));

      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 72 }}>

      {/* ===== HERO ===== */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #f1f5f9",
        padding: "40px 80px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 24 }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #16a34a, #4ade80)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 900, color: "white",
            boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
            flexShrink: 0,
          }}>
            {me?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 4, letterSpacing: "-0.02em" }}>
              {loading ? "Loading..." : me?.name}
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>{me?.email}</p>
            <span style={{
              backgroundColor: me?.role === "admin" ? "#fef9c3" : "#f0fdf4",
              color: me?.role === "admin" ? "#ca8a04" : "#16a34a",
              padding: "4px 12px", borderRadius: 999,
              fontSize: 12, fontWeight: 700,
            }}>
              {me?.role === "admin" ? "⚙️ Admin" : "🧭 Trekker"}
            </span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            <Link href="/dashboard" style={{
              backgroundColor: "#f0fdf4", color: "#16a34a",
              padding: "10px 20px", borderRadius: 10,
              fontWeight: 700, fontSize: 14, textDecoration: "none",
              border: "1px solid #bbf7d0",
            }}>
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* LEFT - Edit Form */}
          <div style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: "32px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
              ✏️ Edit Profile
            </h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 28 }}>
              Update your personal information
            </p>

            {msg && (
              <div style={{
                padding: "12px 16px",
                borderRadius: 10,
                marginBottom: 20,
                backgroundColor: msg.type === "success" ? "#f0fdf4" : "#fff1f2",
                border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecdd3"}`,
                color: msg.type === "success" ? "#16a34a" : "#f43f5e",
                fontSize: 13, fontWeight: 600,
              }}>
                {msg.type === "success" ? "✅ " : "⚠️ "}{msg.text}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              {/* Name */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontSize: 14, color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#16a34a"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontSize: 14, color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#16a34a"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
                  New Password
                  <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: 6 }}>(leave blank to keep current)</span>
                </label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontSize: 14, color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#16a34a"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              <button
                type="submit"
                disabled={saving || loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: saving ? "#86efac" : "#16a34a",
                  color: "white",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                  transition: "all 0.2s",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* RIGHT - Account Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Account Details */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: "28px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
                📋 Account Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Full Name", value: me?.name || "—", icon: "👤" },
                  { label: "Email", value: me?.email || "—", icon: "📧" },
                  { label: "Account Role", value: me?.role || "—", icon: "🎖️" },
                  { label: "Member Since", value: "2026", icon: "📅" },
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 14px",
                    borderRadius: 12,
                    backgroundColor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                  }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: "28px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
                ⚡ Quick Links
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "🏔️", label: "Explore Treks", href: "/treks", bg: "#f0fdf4", color: "#16a34a" },
                  { icon: "❤️", label: "My Favourites", href: "/favourites", bg: "#fff1f2", color: "#f43f5e" },
                  { icon: "📊", label: "Dashboard", href: "/dashboard", bg: "#eff6ff", color: "#3b82f6" },
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
                      <span style={{ fontSize: 18 }}>{a.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: a.color }}>{a.label}</span>
                      <span style={{ marginLeft: "auto", color: a.color }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}