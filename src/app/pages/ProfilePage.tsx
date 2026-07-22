"use client";

import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Package, Shirt, Settings, LogOut, ChevronRight } from "lucide-react";
import UserDesignRequests from "../account/design-requests/page";

interface DesignRequest {
  id: number;
  shirtType: string;
  shirtColor: string;
  placement: string;
  status: string;
  createdAt: string;
  viewSide?: string;
}

type Tab = "profile" | "designs";

export default function ProfilePage() {
  useRequireAuth();
  const { user, logout, updateProfile, token } = useAuth();

  if (!user) return null;

  const [tab, setTab] = useState<Tab>("profile");
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [designRequests, setDesignRequests] = useState<DesignRequest[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);

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

  const loadDesignRequests = () => {
    if (!token) return;
    setLoadingDesigns(true);
    fetch("/api/design-requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setDesignRequests)
      .catch(() => {})
      .finally(() => setLoadingDesigns(false));
  };

  useEffect(() => {
    if (tab === "designs") {
      loadDesignRequests();
    }
  }, [tab, token]);

  const tabs = [
    { key: "profile" as Tab, label: "Profile", icon: Settings },
    { key: "designs" as Tab, label: "My Designs", icon: Shirt },
    { key: "orders" as Tab, label: "Orders", icon: Package, href: "/account/orders" },
  ];

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-2xl font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{user.name || "User"}</h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{user.email}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-card overflow-hidden">
          <div className="flex border-b border-white/[0.06]">
            {tabs.map((t) => (
              t.href ? (
                <Link
                  key={t.key}
                  href={t.href}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:text-primary ${
                    tab === t.key ? "text-primary border-b-2 border-primary" : "text-white/60"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <t.icon size={16} />
                  {t.label}
                  <ChevronRight size={14} className="opacity-50" />
                </Link>
              ) : (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:text-primary ${
                    tab === t.key ? "text-primary border-b-2 border-primary" : "text-white/60"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <t.icon size={16} />
                  {t.label}
                </button>
              )
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {tab === "profile" && (
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-input-background border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-input-background border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {message && (
                  <p className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                    {message}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </form>
            )}

            {tab === "designs" && (
              <div className="space-y-4">
                <h3 className="text-white/50 text-xs uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>My Custom Design Requests</h3>
                {loadingDesigns ? (
                  <p className="text-white/60 text-sm">Loading...</p>
                ) : designRequests.length === 0 ? (
                  <p className="text-white/60 text-sm">You haven&apos;t submitted any design requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {designRequests.map((req) => (
                      <div key={req.id} className="rounded-xl border border-white/[0.08] bg-background/80 p-4 flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>{req.shirtType}</p>
                          <p className="text-white/50 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                            {req.shirtColor} · {req.placement} · {req.viewSide || "front"}
                          </p>
                        </div>
                        <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full ${
                          req.status === "pending" ? "bg-yellow-500/15 text-yellow-300" :
                          req.status === "in_progress" ? "bg-blue-500/15 text-blue-300" :
                          req.status === "completed" ? "bg-green-500/15 text-green-300" :
                          "bg-red-500/15 text-red-300"
                        }`}>
                          {req.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
