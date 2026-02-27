"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";


export default function CreateTrekPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    duration: 0,
    difficulty: "Easy",
    imageUrl: "",
    price: 0,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "duration" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5050/api/treks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          itinerary: [],
          hotels: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create trek");
      }

      router.push("/admin/treks");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    return (
    <AdminLayout>
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Create New Trek
          </h1>

          {error && (
            <p className="mb-4 text-sm text-red-600">Error: {error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (days)"
              value={form.duration}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Trek"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}


