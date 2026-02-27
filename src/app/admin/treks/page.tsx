"use client";

import { useEffect, useState } from "react";

interface Trek {
  _id: string;
  name: string;
  location: string;
  price: number;
  difficulty: string;
}

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const token = localStorage.getItem("token"); // the JWT you got on login

        const res = await fetch("http://localhost:5050/api/treks", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

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

    const handleDelete = async (id: string) => {
    const yes = window.confirm("Are you sure you want to delete this trek?");
    if (!yes) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5050/api/treks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Failed to delete trek");
        return;
      }

      setTreks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Error deleting trek");
    }
  };


  if (loading) {
    return <div style={{ padding: "20px" }}>Loading treks...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  }

    return (
    <div style={{ padding: "20px" }}>
      <h1>Admin – Treks List</h1>
      {treks.length === 0 ? (
        <p>No treks found.</p>
      ) : (
        <ul>
          {treks.map((trek) => (
            <li key={trek._id}>
              {trek.name} – {trek.location} – Rs. {trek.price} –{" "}
              {trek.difficulty}{" "}
              <a
                href={`/admin/treks/${trek._id}/edit`}
                style={{ color: "blue" }}
              >
                Edit
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


