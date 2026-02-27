"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface TrekForm {
  name: string;
  description: string;
  location: string;
  duration: number;
  difficulty: string;
  imageUrl: string;
  price: number;
}

export default function EditTrekPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<TrekForm>({
    name: "",
    description: "",
    location: "",
    duration: 0,
    difficulty: "Easy",
    imageUrl: "",
    price: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch existing trek
  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5050/api/treks/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Could not find trek");
          return;
        }

        setFormData({
          name: data.data.name,
          description: data.data.description,
          location: data.data.location,
          duration: data.data.duration,
          difficulty: data.data.difficulty,
          imageUrl: data.data.imageUrl,
          price: data.data.price,
        });
      } catch (err) {
        alert("Error loading trek");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrek();
    }
  }, [id]);

  // 2. Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5050/api/treks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed!");
        return;
      }

      alert("Trek updated successfully!");
      router.push("/admin/treks");
    } catch (err) {
      alert("Update failed!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading trek data...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Edit Trek</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={formData.duration}
          onChange={(e) =>
            setFormData({
              ...formData,
              duration: Number(e.target.value),
            })
          }
        />
        <select
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({ ...formData, difficulty: e.target.value })
          }
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: Number(e.target.value),
            })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
