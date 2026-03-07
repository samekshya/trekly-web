"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/treks/${id}`);
        if (!res.ok) throw new Error("Failed to load trek");
        const data = await res.json();
        setTrek(data.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
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

    if (id) {
      fetchTrek();
      checkFavourite();
    }
  }, [id]);

  const handleFavourite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ trekId: id }),
        });
        setIsFavourited(true);
      }
    } catch {}
    setFavLoading(false);
  };

  const difficultyColor = (difficulty: string) => {
    if (difficulty === "Easy") return "bg-green-100 text-green-700";
    if (difficulty === "Moderate") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trek...</p>
        </div>
      </div>
    );
  }

  if (error || !trek) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Trek not found</p>
          <button
            onClick={() => router.push("/treks")}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
          >
            Back to Treks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image */}
      <div className="relative w-full h-96 overflow-hidden">
        {trek.imageUrl ? (
          <img
            src={trek.imageUrl}
            alt={trek.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-6xl">🏔️</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{trek.name}</h1>
            <p className="text-lg opacity-90">📍 {trek.location}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left - Main Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-700">{trek.duration}</p>
                <p className="text-sm text-gray-500">Days</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor(trek.difficulty)}`}>
                  {trek.difficulty}
                </span>
                <p className="text-sm text-gray-500 mt-1">Difficulty</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">Rs. {trek.price?.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Per Person</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About this Trek</h2>
              <p className="text-gray-600 leading-relaxed">{trek.description}</p>
            </div>

            {/* Itinerary */}
            {trek.itinerary && trek.itinerary.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {trek.itinerary.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {item.day}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {trek.hotels && trek.hotels.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Accommodation</h2>
                <div className="space-y-3">
                  {trek.hotels.map((hotel, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">🏨</span>
                      <div>
                        <p className="font-semibold text-gray-800">{hotel.name}</p>
                        <p className="text-sm text-gray-500">{hotel.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Booking Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <p className="text-3xl font-bold text-green-700 mb-1">
                Rs. {trek.price?.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm mb-6">per person</p>

              <button className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition mb-3">
                Book Now
              </button>

              <button
                onClick={handleFavourite}
                disabled={favLoading}
                className={`w-full py-3 rounded-lg font-semibold transition border-2 ${
                  isFavourited
                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {favLoading ? "..." : isFavourited ? "❤️ Saved" : "🤍 Save Trek"}
              </button>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Expert guides included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>All equipment provided</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}