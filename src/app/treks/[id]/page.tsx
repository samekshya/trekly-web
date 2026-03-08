"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import WeatherCard from "@/components/WeatherCard";
import ReviewSection from "@/components/ReviewSection";

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
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: "", email: "", phone: "", date: "", people: "1", notes: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

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

  const handleConfirmBooking = async () => {
  if (!bookingData.date) { alert("Please select a date"); return; }
  setBookingLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5050/api/treks/${id}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error("Booking failed");
    setBookingSuccess(true);
  } catch (err) {
    alert("Something went wrong. Please try again.");
  } finally {
    setBookingLoading(false);
  }
};

  const resetBooking = () => {
    setShowBooking(false);
    setBookingStep(1);
    setBookingSuccess(false);
    setBookingData({ name: "", email: "", phone: "", date: "", people: "1", notes: "" });
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
          width: 40, height: 40, border: "3px solid #e2e8f0",
          borderTop: "3px solid #16a34a", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
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
        }}>Back to Treks</button>
      </div>
    </div>
  );

  const diff = diffStyle(trek.difficulty);
  const totalPrice = trek.price * parseInt(bookingData.people);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 72 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .book-btn:hover { background-color: #15803d !important; transform: translateY(-1px) !important; box-shadow: 0 8px 24px rgba(22,163,74,0.4) !important; }
        .input-field:focus { border-color: #16a34a !important; background-color: white !important; }
      `}</style>

      {/* ===== BOOKING MODAL ===== */}
      {showBooking && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          backgroundColor: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
          animation: "fadeIn 0.2s ease",
        }}
          onClick={e => { if (e.target === e.currentTarget) resetBooking(); }}
        >
          <div style={{
            backgroundColor: "white",
            borderRadius: 24,
            width: "100%", maxWidth: 520,
            boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            overflow: "hidden",
            animation: "slideUp 0.3s ease",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>

            {bookingSuccess ? (
              /* ===== SUCCESS ===== */
              <div style={{ padding: "52px 40px", textAlign: "center" }}>
                <div style={{
                  width: 80, height: 80,
                  backgroundColor: "#f0fdf4",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  border: "2px solid #16a34a",
                  animation: "scaleIn 0.4s ease",
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.02em" }}>
                  Booking Confirmed!
                </h2>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>
                  Your trek to <strong style={{ color: "#0f172a" }}>{trek.name}</strong> is confirmed.
                </p>
                <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 32 }}>
                  A confirmation has been sent to <strong style={{ color: "#16a34a" }}>{bookingData.email}</strong>
                </p>

                {/* Summary card */}
                <div style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: 16, padding: "20px 24px",
                  border: "1px solid #f1f5f9",
                  marginBottom: 28, textAlign: "left",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 14 }}>
                    BOOKING SUMMARY
                  </p>
                  {[
                    { label: "Name", value: bookingData.name },
                    { label: "Trek", value: trek.name },
                    { label: "Date", value: new Date(bookingData.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                    { label: "Group Size", value: `${bookingData.people} ${parseInt(bookingData.people) === 1 ? "person" : "people"}` },
                    { label: "Total Amount", value: `Rs. ${totalPrice.toLocaleString()}` },
                  ].map((item, i) => (
                    <div key={item.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 0",
                      borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
                    }}>
                      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{item.label}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: item.label === "Total Amount" ? "#16a34a" : "#0f172a",
                      }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button onClick={resetBooking} style={{
                    padding: "13px",
                    backgroundColor: "#f8fafc", color: "#374151",
                    borderRadius: 12, border: "1.5px solid #e2e8f0",
                    fontWeight: 700, fontSize: 14, cursor: "pointer",
                  }}>
                    Close
                  </button>
                  <button onClick={() => { resetBooking(); router.push("/dashboard"); }} style={{
                    padding: "13px",
                    backgroundColor: "#16a34a", color: "white",
                    borderRadius: 12, border: "none",
                    fontWeight: 700, fontSize: 14, cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                  }}>
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ===== MODAL HEADER ===== */}
                <div style={{
                  padding: "22px 28px",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "linear-gradient(135deg, #f0fdf4, #f8fafc)",
                }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>Book Your Trek</h2>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>{trek.name} · Rs. {trek.price?.toLocaleString()} per person</p>
                  </div>
                  <button onClick={resetBooking} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    backgroundColor: "white", border: "1px solid #e2e8f0",
                    cursor: "pointer", fontSize: 18, color: "#64748b",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}>×</button>
                </div>

                {/* ===== STEP INDICATOR ===== */}
                <div style={{ padding: "18px 28px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {[
                      { step: 1, label: "Your Details" },
                      { step: 2, label: "Trip Details" },
                    ].map(({ step, label }, i) => (
                      <div key={step} style={{ display: "flex", alignItems: "center", flex: i < 1 ? 1 : 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: "50%",
                            backgroundColor: bookingStep >= step ? "#16a34a" : "#f1f5f9",
                            color: bookingStep >= step ? "white" : "#94a3b8",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 800, flexShrink: 0,
                            transition: "all 0.3s",
                            boxShadow: bookingStep >= step ? "0 2px 8px rgba(22,163,74,0.3)" : "none",
                          }}>
                            {bookingStep > step ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : step}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: bookingStep >= step ? "#16a34a" : "#94a3b8" }}>
                            {label}
                          </span>
                        </div>
                        {i < 1 && (
                          <div style={{
                            flex: 1, height: 2, margin: "0 16px",
                            backgroundColor: bookingStep > 1 ? "#16a34a" : "#e2e8f0",
                            borderRadius: 2, transition: "all 0.3s",
                          }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ===== FORM BODY ===== */}
                <div style={{ padding: "28px" }}>
                  {bookingStep === 1 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                        Fill in your personal details to continue
                      </p>

                      {[
                        { key: "name", label: "Full Name", placeholder: "Your full name", type: "text" },
                        { key: "email", label: "Email Address", placeholder: "your@email.com", type: "email" },
                        { key: "phone", label: "Phone Number", placeholder: "+977 98XXXXXXXX", type: "tel" },
                      ].map(field => (
                        <div key={field.key}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
                            {field.label.toUpperCase()}
                          </label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={(bookingData as any)[field.key]}
                            onChange={e => setBookingData(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="input-field"
                            style={{
                              width: "100%", padding: "13px 16px",
                              borderRadius: 11, border: "1.5px solid #e2e8f0",
                              backgroundColor: "#f8fafc",
                              fontSize: 14, color: "#0f172a", outline: "none",
                              boxSizing: "border-box", transition: "all 0.2s",
                              fontFamily: "inherit",
                            }}
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          if (!bookingData.name || !bookingData.email || !bookingData.phone) {
                            alert("Please fill in all fields");
                            return;
                          }
                          setBookingStep(2);
                        }}
                        style={{
                          width: "100%", padding: "15px",
                          backgroundColor: "#16a34a", color: "white",
                          borderRadius: 12, border: "none",
                          fontWeight: 800, fontSize: 15, cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                          marginTop: 4, transition: "all 0.2s",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Continue to Trip Details →
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                        Choose your preferred date and group size
                      </p>

                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
                          PREFERRED START DATE
                        </label>
                        <input
                          type="date"
                          value={bookingData.date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={e => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                          className="input-field"
                          style={{
                            width: "100%", padding: "13px 16px",
                            borderRadius: 11, border: "1.5px solid #e2e8f0",
                            backgroundColor: "#f8fafc",
                            fontSize: 14, color: "#0f172a", outline: "none",
                            boxSizing: "border-box", transition: "all 0.2s",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
                          NUMBER OF PEOPLE
                        </label>
                        <select
                          value={bookingData.people}
                          onChange={e => setBookingData(prev => ({ ...prev, people: e.target.value }))}
                          style={{
                            width: "100%", padding: "13px 16px",
                            borderRadius: 11, border: "1.5px solid #e2e8f0",
                            backgroundColor: "#f8fafc",
                            fontSize: 14, color: "#0f172a", outline: "none",
                            boxSizing: "border-box", fontFamily: "inherit",
                          }}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? "person" : "people"} — Rs. {(trek.price * n).toLocaleString()}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
                          SPECIAL REQUESTS <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11 }}>(OPTIONAL)</span>
                        </label>
                        <textarea
                          placeholder="Dietary requirements, medical conditions, special needs..."
                          value={bookingData.notes}
                          onChange={e => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                          className="input-field"
                          style={{
                            width: "100%", padding: "13px 16px",
                            borderRadius: 11, border: "1.5px solid #e2e8f0",
                            backgroundColor: "#f8fafc",
                            fontSize: 14, color: "#0f172a", outline: "none",
                            boxSizing: "border-box", resize: "none",
                            fontFamily: "inherit", transition: "all 0.2s",
                          }}
                        />
                      </div>

                      {/* Price summary */}
                      <div style={{
                        backgroundColor: "#f0fdf4",
                        borderRadius: 14, padding: "18px 20px",
                        border: "1px solid #bbf7d0",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        <div>
                          <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>TOTAL PRICE</p>
                          <p style={{ fontSize: 28, fontWeight: 900, color: "#15803d", letterSpacing: "-0.02em" }}>
                            Rs. {totalPrice.toLocaleString()}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 12, color: "#4ade80", marginBottom: 2 }}>
                            Rs. {trek.price?.toLocaleString()} × {bookingData.people}
                          </p>
                          <p style={{ fontSize: 11, color: "#86efac" }}>All inclusive</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => setBookingStep(1)}
                          style={{
                            flex: 1, padding: "14px",
                            backgroundColor: "#f8fafc", color: "#374151",
                            borderRadius: 12, border: "1.5px solid #e2e8f0",
                            fontWeight: 700, fontSize: 14, cursor: "pointer",
                          }}
                        >
                          ← Back
                        </button>
                        <button
                          onClick={handleConfirmBooking}
                          disabled={bookingLoading}
                          style={{
                            flex: 2, padding: "14px",
                            backgroundColor: bookingLoading ? "#86efac" : "#16a34a",
                            color: "white",
                            borderRadius: 12, border: "none",
                            fontWeight: 800, fontSize: 15, cursor: bookingLoading ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          }}
                        >
                          {bookingLoading ? (
                            <>
                              <div style={{
                                width: 16, height: 16,
                                border: "2px solid rgba(255,255,255,0.4)",
                                borderTop: "2px solid white",
                                borderRadius: "50%",
                                animation: "spin 0.8s linear infinite",
                              }} />
                              Confirming...
                            </>
                          ) : "Confirm Booking"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
        <div style={{ position: "absolute", top: 28, left: 40 }}>
          <Link href="/treks" style={{
            display: "flex", alignItems: "center", gap: 8,
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            color: "white", padding: "10px 18px",
            borderRadius: 10, textDecoration: "none",
            fontSize: 13, fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            ← Back to Treks
          </Link>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 80px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
                backdropFilter: "blur(4px)", color: "white",
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

      {/* ===== STATS BAR ===== */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px" }}>
          <div style={{ display: "flex" }}>
            {[
              { label: "Duration", value: `${trek.duration} ${trek.duration === 1 ? "Day" : "Days"}` },
              { label: "Difficulty", value: trek.difficulty },
              { label: "Price per person", value: `Rs. ${trek.price?.toLocaleString()}` },
              { label: "Location", value: trek.location },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: "20px 32px 20px 0", marginRight: 32,
                borderRight: i < 3 ? "1px solid #f1f5f9" : "none",
              }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 4 }}>
                  {stat.label.toUpperCase()}
                </p>
                <p style={{ fontSize: 16, fontWeight: 800, color: i === 2 ? "#16a34a" : "#0f172a" }}>
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
              backgroundColor: "white", borderRadius: 20, padding: "32px",
              border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.01em" }}>
                About this Trek
              </h2>
              <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.8 }}>{trek.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
                {["Expert guides included", "All equipment provided", "Free cancellation", "Small group sizes"].map(label => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 16px", backgroundColor: "#f0fdf4",
                    borderRadius: 10, border: "1px solid #bbf7d0",
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      backgroundColor: "#16a34a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            {trek.itinerary && trek.itinerary.length > 0 && (
              <div style={{
                backgroundColor: "white", borderRadius: 20, padding: "32px",
                border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.01em" }}>
                  Day-by-Day Itinerary
                </h2>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 19, top: 20, bottom: 20, width: 2, backgroundColor: "#e2e8f0" }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {trek.itinerary.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 20, paddingBottom: i < trek.itinerary!.length - 1 ? 28 : 0 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          backgroundColor: "#16a34a",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontWeight: 800, fontSize: 13,
                          flexShrink: 0, zIndex: 1,
                          boxShadow: "0 0 0 4px white, 0 0 0 6px #e2e8f0",
                        }}>
                          {item.day}
                        </div>
                        <div style={{
                          flex: 1, backgroundColor: "#f8fafc",
                          borderRadius: 14, padding: "16px 20px",
                          border: "1px solid #f1f5f9",
                        }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{item.title}</p>
                          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{item.description}</p>
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
                backgroundColor: "white", borderRadius: 20, padding: "32px",
                border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 20, letterSpacing: "-0.01em" }}>
                  Accommodation
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {trek.hotels.map((hotel, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px", backgroundColor: "#f8fafc",
                      borderRadius: 14, border: "1px solid #f1f5f9",
                    }}>
                      <div style={{
                        width: 44, height: 44, backgroundColor: "#eff6ff",
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

            {/* Reviews */}
            <ReviewSection trekId={id as string} />
          </div>
          

          {/* RIGHT - Booking Card */}
          <div>
            <WeatherCard trekLocation={trek.location} />
            <div style={{
              backgroundColor: "white", borderRadius: 24, padding: "32px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              position: "sticky", top: 96,
            }}>
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 4 }}>STARTING FROM</p>
                <p style={{ fontSize: 40, fontWeight: 900, color: "#16a34a", letterSpacing: "-0.02em" }}>
                  Rs. {trek.price?.toLocaleString()}
                </p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>per person, all inclusive</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>DURATION</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{trek.duration} {trek.duration === 1 ? "Day" : "Days"}</p>
                </div>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>DIFFICULTY</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: diff.color }}>{trek.difficulty}</p>
                </div>
              </div>

              <button
                onClick={() => setShowBooking(true)}
                className="book-btn"
                style={{
                  width: "100%", padding: "16px",
                  backgroundColor: "#16a34a", color: "white",
                  borderRadius: 14, border: "none",
                  fontWeight: 800, fontSize: 16, cursor: "pointer",
                  marginBottom: 12,
                  boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                  transition: "all 0.2s", letterSpacing: "-0.01em",
                }}
              >
                Book This Trek
              </button>

              <button
                onClick={handleFavourite}
                disabled={favLoading}
                style={{
                  width: "100%", padding: "14px",
                  backgroundColor: isFavourited ? "#fff1f2" : "#f8fafc",
                  color: isFavourited ? "#f43f5e" : "#374151",
                  borderRadius: 14,
                  border: `1.5px solid ${isFavourited ? "#fecdd3" : "#e2e8f0"}`,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill={isFavourited ? "#f43f5e" : "none"}
                  stroke={isFavourited ? "#f43f5e" : "#374151"}
                  strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favLoading ? "Saving..." : isFavourited ? "Saved to Favourites" : "Save Trek"}
              </button>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>WHAT'S INCLUDED</p>
                {["Expert local guides", "All equipment provided", "Free cancellation", "Small groups (max 12)"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      backgroundColor: "#f0fdf4", border: "1.5px solid #16a34a",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 20, padding: "14px 16px",
                backgroundColor: "#f8fafc", borderRadius: 12,
                border: "1px solid #f1f5f9", textAlign: "center",
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