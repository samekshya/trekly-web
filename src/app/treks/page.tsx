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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600">Loading treks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Discover Treks
        </h1>

        {treks.length === 0 ? (
          <p className="text-gray-600">No treks available right now.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {treks.map((trek) => (
              <div
                key={trek._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                {trek.imageUrl && (
                  <img
                    src={trek.imageUrl}
                    alt={trek.name}
                    className="w-full h-44 object-cover"
                  />
                )}

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    <a
                      href={`/treks/${trek._id}`}
                      className="hover:text-green-700"
                    >
                      {trek.name}
                    </a>
                  </h2>
                  <p className="text-sm text-gray-500">
                    {trek.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {trek.duration} days ·{" "}
                    <span className="font-medium">
                      {trek.difficulty}
                    </span>
                  </p>
                  <p className="text-base font-bold text-green-700">
                    Rs. {trek.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}