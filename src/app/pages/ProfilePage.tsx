"use client";

import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  useRequireAuth();
  const { user, logout, updateProfile } = useAuth();

  if (!user) return null;

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ name, email });
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>My Account</h1>
        <p className="text-white/50 mb-10" style={{ fontFamily: "Inter, sans-serif" }}>Manage your profile and preferences</p>

        <div className="rounded-2xl border border-white/[0.08] bg-card p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xl font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>{user.name || "User"}</h2>
              <p className="text-white/50 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="border-t border-white/[0.06] pt-6 space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-input-background border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-input-background border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                {message}
              </p>
            )}

            <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                View Orders
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
