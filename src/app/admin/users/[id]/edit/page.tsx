"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/api/api';
import AdminLayout from '@/components/layout/AdminLayout';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "", role: "user" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch the existing user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setFormData({
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role,
        });
      } catch (err) {
        alert("Could not find user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // 2. Handle the update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/users/${id}`, formData);
      alert("User updated successfully!");
      router.push("/admin/users"); // Go back to table
    } catch (err) {
      alert("Update failed!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><p>Loading user data...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">User Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-green-700 text-white p-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/admin/users")}
              className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
