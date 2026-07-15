"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface DesignRequest {
  id: number;
  userId?: number;
  userEmail?: string;
  userName?: string;
  shirtType: string;
  shirtColor: string;
  placement: string;
  viewSide?: string;
  designImage: string;
  mockupImage: string;
  status: string;
  createdAt: string;
}

export default function AdminDesignRequests() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/design-requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <p>Admin access required</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-8" style={{ fontFamily: "Manrope, sans-serif" }}>
          Design Requests
        </h1>
        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-white/60">No design requests yet.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div key={req.id} className="rounded-2xl border border-white/[0.08] bg-card p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>
                      {req.userName || req.userEmail || "Anonymous"} — {req.shirtType}
                    </p>
                    <p className="text-white/50 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {req.shirtColor} · {req.placement} · {req.viewSide || "front"} · {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/15 text-primary w-fit">
                    {req.status}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 rounded-xl border border-white/[0.08] bg-black/20 p-3">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Design</p>
                    <img src={req.designImage} alt="Design" className="w-full h-48 object-contain rounded-lg" />
                  </div>
                  <div className="flex-1 rounded-xl border border-white/[0.08] bg-black/20 p-3">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Mockup</p>
                    <img src={req.mockupImage} alt="Mockup" className="w-full h-48 object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
