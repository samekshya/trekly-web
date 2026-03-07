"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useRouter } from "next/navigation";

interface Trek {
  _id: string;
  name: string;
  location: string;
  price: number;
  difficulty: string;
  duration: number;
}

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/treks?limit=100", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      setTreks(data.data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const yes = window.confirm("Are you sure you want to delete this trek?");
    if (!yes) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/treks/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        setTreks((prev) => prev.filter((t) => t._id !== id));
      }
    } catch {
      alert("Error deleting trek");
    }
  };

  const difficultyBadge = (difficulty: string) => {
    if (difficulty === "Easy") return "bg-green-100 text-green-700";
    if (difficulty === "Moderate") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const filtered = treks.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
  );

  const hardCount = treks.filter((t) => t.difficulty === "Hard").length;
  const moderateCount = treks.filter((t) => t.difficulty === "Moderate").length;
  const easyCount = treks.filter((t) => t.difficulty === "Easy").length;

  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Treks</p>
          <p className="text-3xl font-bold text-gray-800">{treks.length}</p>
          <p className="text-xs text-green-600 mt-1">All treks</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Easy</p>
          <p className="text-3xl font-bold text-green-600">{easyCount}</p>
          <p className="text-xs text-gray-400 mt-1">Beginner friendly</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Moderate</p>
          <p className="text-3xl font-bold text-yellow-600">{moderateCount}</p>
          <p className="text-xs text-gray-400 mt-1">Intermediate</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Hard</p>
          <p className="text-3xl font-bold text-red-600">{hardCount}</p>
          <p className="text-xs text-gray-400 mt-1">Expert level</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">All Treks</h2>
            <p className="text-sm text-gray-500">{treks.length} treks total</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search treks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
            />
            <button
              onClick={() => router.push("/admin/treks/new")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              + New Trek
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading treks...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No treks found</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Trek Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((trek) => (
                <tr key={trek._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {trek.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    📍 {trek.location}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {trek.duration} days
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyBadge(trek.difficulty)}`}>
                      {trek.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    Rs. {trek.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => router.push(`/admin/treks/${trek._id}/edit`)}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trek._id)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}