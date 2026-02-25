"use client";
import api from '@/api/api';
import React, { useState } from 'react';


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
        <p className="text-gray-600 mb-6">Enter your email and we'll send you a link to reset your password.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            required 
            placeholder="name@example.com" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-700 text-white p-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-3 rounded-lg text-center text-sm ${message.includes("error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
