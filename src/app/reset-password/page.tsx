"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or expired reset link. Please request a new one.");
  }, [token]);

  const handleReset = async () => {
    if (!password || !confirm) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5050/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (p: string) => {
    if (p.length === 0) return { width: "0%", color: "#e2e8f0", label: "" };
    if (p.length < 4) return { width: "25%", color: "#f43f5e", label: "Weak" };
    if (p.length < 6) return { width: "50%", color: "#f59e0b", label: "Fair" };
    if (p.length < 8) return { width: "75%", color: "#16a34a", label: "Good" };
    return { width: "100%", color: "#16a34a", label: "Strong" };
  };

  const strength = getStrength(password);

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
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .input-rp:focus { border-color: #16a34a !important; background: white !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.4s ease" }}>

        {/* Logo */}
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
          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 72, height: 72,
                backgroundColor: "#f0fdf4", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                border: "2px solid #16a34a",
                animation: "scaleIn 0.4s ease",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>
                Password Reset!
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
                Your password has been updated successfully. Redirecting you to login...
              </p>
              <div style={{
                height: 4, backgroundColor: "#f1f5f9", borderRadius: 999, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", backgroundColor: "#16a34a", borderRadius: 999,
                  animation: "progress 3s linear forwards",
                  width: "0%",
                }} />
              </div>
              <style>{`@keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>
            </div>
          ) : (
            <>
              <div style={{
                width: 56, height: 56,
                backgroundColor: "#f0fdf4", borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20, border: "1px solid #bbf7d0",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>
                Reset your password
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 28 }}>
                Enter your new password below. Make it strong!
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

              {/* New Password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
                  NEW PASSWORD
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-rp"
                    style={{
                      width: "100%", padding: "13px 44px 13px 16px",
                      borderRadius: 11, border: "1.5px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      fontSize: 14, color: "#0f172a", outline: "none",
                      boxSizing: "border-box", transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                  />
                  <button onClick={() => setShowPass(!showPass)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0,
                  }}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, backgroundColor: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: strength.width,
                        backgroundColor: strength.color, borderRadius: 999,
                        transition: "all 0.3s",
                      }} />
                    </div>
                    <p style={{ fontSize: 11, color: strength.color, fontWeight: 600, marginTop: 4 }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
                  CONFIRM PASSWORD
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleReset()}
                    className="input-rp"
                    style={{
                      width: "100%", padding: "13px 44px 13px 16px",
                      borderRadius: 11, border: `1.5px solid ${confirm && confirm !== password ? "#fecdd3" : "#e2e8f0"}`,
                      backgroundColor: "#f8fafc",
                      fontSize: 14, color: "#0f172a", outline: "none",
                      boxSizing: "border-box", transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                  />
                  <button onClick={() => setShowConfirm(!showConfirm)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0,
                  }}>
                    {showConfirm ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p style={{ fontSize: 11, color: "#f43f5e", fontWeight: 600, marginTop: 4 }}>Passwords do not match</p>
                )}
              </div>

              <button
                onClick={handleReset}
                disabled={loading || !token}
                style={{
                  width: "100%", padding: "14px",
                  backgroundColor: loading ? "#86efac" : "#16a34a",
                  color: "white", borderRadius: 12, border: "none",
                  fontWeight: 800, fontSize: 15,
                  cursor: loading || !token ? "not-allowed" : "pointer",
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
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    Resetting...
                  </>
                ) : "Reset Password"}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}