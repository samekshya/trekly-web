"use client";

import { useEffect, useState } from "react";

interface Trek {
  _id: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  difficulty: string;
  price: number;
  imageUrl: string;
}

export default function UserTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/treks");

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load treks");
        }

        const data = await res.json();
        setTreks(data.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading treks...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>User Treks</h1>
      {treks.length === 0 ? (
        <p>No treks available right now.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 16,
          }}
        >
          {treks.map((trek) => (
            <div
              key={trek._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
              }}
            >
              {trek.imageUrl && (
                <img
                  src={trek.imageUrl}
                  alt={trek.name}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
              )}
              <h2>
                <a href={`/treks/${trek._id}`} style={{ color: "blue" }}>
                 {trek.name}
                </a>
              </h2>

              <p>{trek.location}</p>
              <p>
                {trek.duration} days · {trek.difficulty}
              </p>
              <p>Rs. {trek.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}