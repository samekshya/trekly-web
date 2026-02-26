"use client";
import React, { useEffect, useState } from 'react';
import api from '@/api/api';

export default function HomePage() {
  const [treks, setTreks] = useState([]);

  
  useEffect(() => {
    
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <header className="h-[60vh] bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa')] bg-cover bg-center flex items-center justify-center text-white">
        <div className="bg-black/40 p-10 rounded-xl text-center backdrop-blur-sm">
          <h1 className="text-5xl font-extrabold mb-4">Explore the Himalayas</h1>
          <p className="text-xl">Discover and book the most beautiful treks in Nepal.</p>
        </div>
      </header>

      {/* 2. Trek Grid */}
      <section className="max-w-7xl mx-auto p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Popular Treks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* We will map over your treks here */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
              <div className="h-48 bg-gray-200"></div> {/* Replace with img */}
              <div className="p-6">
                <h3 className="text-xl font-bold">Everest Base Camp</h3>
                <p className="text-gray-600 text-sm my-2">14 Days • Moderate Difficulty</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-700 font-bold">$1,299</span>
                  <button className="bg-green-700 text-white px-4 py-2 rounded-lg">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


