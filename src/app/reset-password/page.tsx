"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/api/api';


export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setMessage("Invalid token");
    
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Password</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            required 
            placeholder="Enter new password" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-700 text-white p-3 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </div>
    </div>
  );
}
