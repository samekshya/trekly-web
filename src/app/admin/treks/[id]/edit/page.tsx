"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";

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
  const [error, setError] = useState("");

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
          setError(data.message || "Could not find trek");
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
      } catch (err: any) {
        setError("Error loading trek");
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
    setError("");

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
        setError(data.message || "Update failed!");
        return;
      }

      alert("Trek updated successfully!");
      router.push("/admin/treks");
    } catch (err: any) {
      setError("Update failed!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-6">Loading trek data...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <p className="p-6 text-red-600">Error: {error}</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Trek
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
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
              className="w-full border rounded-lg px-3 py-2"
            />
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  difficulty: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 bg-white"
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
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imageUrl: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
