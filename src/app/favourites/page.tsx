"use client";

import { useEffect, useState } from "react";
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
  description: string;
}

interface Favourite {
  _id: string;
  trek: Trek;
}

export default function FavouritesPage() {
  const router = useRouter();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) { router.push("/login"); return; }

    const fetchFavourites = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/favourites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFavourites(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const handleRemove = async (trekId: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5050/api/favourites/${trekId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavourites(prev => prev.filter(f => f.trek?._id !== trekId));
    } catch (err) {
      console.error(err);
    }
  };

  const difficultyStyle = (d: string) => {
    if (d === "Easy") return { bg: "#dcfce7", color: "#16a34a" };
    if (d === "Moderate") return { bg: "#fef9c3", color: "#ca8a04" };
    return { bg: "#fee2e2", color: "#dc2626" };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 72 }}>

      {/* ===== HERO ===== */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800"
          alt="Favourites"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.65))",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 10 }}>
            MY COLLECTION
          </p>
          <h1 style={{
            fontSize: 48, fontWeight: 900, color: "white",
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>
            ❤️ Saved Treks
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15 }}>
            {loading ? "Loading..." : `${favourites.length} trek${favourites.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 80px" }}>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 360, borderRadius: 20, backgroundColor: "#e2e8f0" }} />
            ))}
          </div>
        ) : favourites.length === 0 ? (

          /* ===== EMPTY STATE ===== */
          <div style={{
            textAlign: "center", padding: "80px 0",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{
              width: 100, height: 100,
              backgroundColor: "#fff1f2",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 48, marginBottom: 24,
            }}>
              🏔️
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>
              No saved treks yet
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 32, maxWidth: 360, lineHeight: 1.6 }}>
              Start exploring and save the treks you love. They'll all appear here!
            </p>
            <Link href="/treks" style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "14px 32px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
            }}>
              🏔️ Explore Treks
            </Link>
          </div>

        ) : (
          <>
            {/* Summary bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                  Your Saved Adventures
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>
                  {favourites.length} trek{favourites.length !== 1 ? "s" : ""} in your collection
                </p>
              </div>
              <Link href="/treks" style={{
                backgroundColor: "#16a34a",
                color: "white",
                padding: "10px 22px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
              }}>
                + Add More Treks
              </Link>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {favourites.map(fav => {
                const trek = fav.trek;
                if (!trek) return null;
                const diff = difficultyStyle(trek.difficulty);
                return (
                  <div key={fav._id} style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.25s",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 32px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 200 }}>
                      <img
                        src={trek.imageUrl}
                        alt={trek.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                      }} />
                      <div style={{ position: "absolute", top: 14, left: 14 }}>
                        <span style={{
                          backgroundColor: diff.bg, color: diff.color,
                          padding: "4px 12px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700,
                        }}>
                          {trek.difficulty}
                        </span>
                      </div>
                      <div style={{ position: "absolute", top: 14, right: 14 }}>
                        <span style={{
                          backgroundColor: "rgba(0,0,0,0.5)",
                          backdropFilter: "blur(4px)",
                          color: "white",
                          padding: "4px 12px", borderRadius: 999,
                          fontSize: 11, fontWeight: 600,
                        }}>
                          {trek.duration} days
                        </span>
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(trek._id)}
                        style={{
                          position: "absolute", bottom: 14, right: 14,
                          backgroundColor: "rgba(239,68,68,0.85)",
                          backdropFilter: "blur(4px)",
                          color: "white",
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: "none",
                          fontSize: 12, fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(220,38,38,1)")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.85)")}
                      >
                        ✕ Remove
                      </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "18px 20px 20px" }}>
                      <h3 style={{
                        fontSize: 16, fontWeight: 800, color: "#0f172a",
                        marginBottom: 6, letterSpacing: "-0.01em",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {trek.name}
                      </h3>
                      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>
                        📍 {trek.location}
                      </p>
                      <p style={{
                        fontSize: 13, color: "#64748b", marginBottom: 16,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as any,
                        lineHeight: 1.6,
                      }}>
                        {trek.description}
                      </p>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        borderTop: "1px solid #f1f5f9", paddingTop: 14,
                      }}>
                        <div>
                          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Starting from</p>
                          <p style={{ fontSize: 20, fontWeight: 900, color: "#16a34a" }}>
                            Rs. {trek.price?.toLocaleString()}
                          </p>
                        </div>
                        <Link href={`/treks/${trek._id}`} style={{
                          backgroundColor: "#f0fdf4",
                          color: "#16a34a",
                          padding: "10px 18px",
                          borderRadius: 10,
                          fontSize: 13, fontWeight: 700,
                          textDecoration: "none",
                        }}>
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}