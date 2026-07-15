"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../src/app/context/AuthContext";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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

const STATUS_OPTIONS = ["pending", "in_progress", "completed", "rejected"] as const;

export default function AdminDesignRequests() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const load = () => {
    if (!token) return;
    fetch("/api/design-requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const updateStatus = async (id: number, status: string) => {
    setActioningId(id);
    try {
      const res = await fetch(`/api/design-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Status updated to ${status.replace("_", " ")}`);
      load();
    } catch {
      toast.error("Failed to update status. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  const deleteRequest = async (id: number) => {
    if (!confirm("Delete this design request?")) return;
    setActioningId(id);
    try {
      const res = await fetch(`/api/design-requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Design request deleted successfully");
    } catch {
      toast.error("Failed to delete design request. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

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
                  <div className="flex items-center gap-2">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      disabled={actioningId === req.id}
                      className="bg-black/40 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-primary disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteRequest(req.id)}
                      disabled={actioningId === req.id}
                      className="inline-flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors p-2 disabled:opacity-50"
                      title="Delete request"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
