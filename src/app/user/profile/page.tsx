"use client";

import { useEffect, useState } from "react";
import api from "@/api/api";

type MeUser = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
};

export default function UserProfilePage() {
  const [me, setMe] = useState<MeUser | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await api.get("/api/auth/me");
        const user: MeUser = res.data?.user ?? res.data; // depends on your backend shape

        setMe(user);
        setName(user?.name ?? "");
        setEmail(user?.email ?? "");
      } catch (err: any) {
        setMsg(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me?._id) {
      setMsg("User id missing from /auth/me response");
      return;
    }

    setSaving(true);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      if (password.trim()) fd.append("password", password);
      if (image) fd.append("image", image); // change if backend expects different field name

      const res = await api.put(`/api/auth/${me._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated: MeUser = res.data?.user ?? res.data;
      setMe(updated);
      setPassword("");
      setImage(null);
      setMsg("Profile updated");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1>/user/profile</h1>

      {me && (
        <p style={{ marginTop: 8 }}>
          Logged in as: {me.email} {me.role ? `(${me.role})` : ""}
        </p>
      )}

      <form onSubmit={handleUpdate} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        <label>
          New Password (optional)
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>

        <label>
          Image (optional)
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Profile"}
        </button>

        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}


