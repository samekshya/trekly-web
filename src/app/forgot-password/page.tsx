"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5050/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <style>{`
        @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .input-fp:focus { border-color: #16a34a !important; background: white !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.4s ease" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Trek<span style={{ color: "#16a34a" }}>ly</span>
            </span>
          </Link>
        </div>

        <div style={{
          backgroundColor: "white", borderRadius: 24, padding: "40px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}>
          {!sent ? (
            <>
              <div style={{
                width: 56, height: 56, backgroundColor: "#f0fdf4",
                borderRadius: 16, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 20, border: "1px solid #bbf7d0",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>
                Forgot your password?
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 28 }}>
                No worries! Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div style={{
                  backgroundColor: "#fff1f2", border: "1px solid #fecdd3",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span style={{ fontSize: 13, color: "#f43f5e", fontWeight: 500 }}>{error}</span>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="input-fp"
                  style={{
                    width: "100%", padding: "13px 16px",
                    borderRadius: 11, border: "1.5px solid #e2e8f0",
                    backgroundColor: "#f8fafc", fontSize: 14, color: "#0f172a",
                    outline: "none", boxSizing: "border-box",
                    transition: "all 0.2s", fontFamily: "inherit",
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", padding: "14px",
                  backgroundColor: loading ? "#86efac" : "#16a34a",
                  color: "white", borderRadius: 12, border: "none",
                  fontWeight: 800, fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                  transition: "all 0.2s", letterSpacing: "-0.01em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: 16, height: 16,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTop: "2px solid white", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    Sending...
                  </>
                ) : "Send Reset Link"}
              </button>

              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Link href="/login" style={{
                  fontSize: 13, color: "#64748b", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, backgroundColor: "#f0fdf4",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 20px",
                border: "2px solid #16a34a",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>
                Check your inbox!
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 8 }}>
                We've sent a password reset link to
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#16a34a", marginBottom: 28 }}>
                {email}
              </p>
              <div style={{
                backgroundColor: "#f8fafc", borderRadius: 12, padding: 16,
                border: "1px solid #f1f5f9", marginBottom: 24, textAlign: "left",
              }}>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Didn't receive it? Check your spam folder or{" "}
                  <button onClick={() => setSent(false)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#16a34a", fontWeight: 700, fontSize: 12, padding: 0,
                  }}>
                    try again
                  </button>.
                </p>
              </div>
              <Link href="/login" style={{
                display: "block", width: "100%", padding: "14px",
                backgroundColor: "#16a34a", color: "white",
                borderRadius: 12, textDecoration: "none",
                fontWeight: 800, fontSize: 15,
                boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                textAlign: "center", boxSizing: "border-box",
              }}>
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}