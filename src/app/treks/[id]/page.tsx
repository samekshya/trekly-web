"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function TrekDetailsPage() {
  const { id } = useParams();
  const [trek, setTrek] = useState<Trek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/treks/${id}`);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load trek");
        }

        const data = await res.json();
        setTrek(data.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTrek();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading trek...</div>;
  }

  if (error || !trek) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        Error: {error || "Trek not found"}
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      {trek.imageUrl && (
        <img
          src={trek.imageUrl}
          alt={trek.name}
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
      )}
      <h1>{trek.name}</h1>
      <p>{trek.location}</p>
      <p>
        {trek.duration} days · {trek.difficulty}
      </p>
      <p>Rs. {trek.price}</p>
      <p style={{ marginTop: 16 }}>{trek.description}</p>
    </div>
  );
}
