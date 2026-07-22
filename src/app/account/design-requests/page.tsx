"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

interface DesignRequest {
  id: number;
  shirtType: string;
  shirtColor: string;
  placement: string;
  viewSide?: string;
  designImage: string;
  mockupImage?: string;
  mockupVariant?: number;
  designPosX?: number;
  designPosY?: number;
  designRotation?: number;
  designScale?: number;
  status: string;
  createdAt: string;
}

interface Note {
  id: number;
  message: string;
  createdAt: string;
}

const PLACEMENT_POSITIONS: Record<string, { left: string; top: string; width: string; height: string }> = {
  "Front Center": { left: "25%", top: "28%", width: "50%", height: "42%" },
  "Back Center": { left: "25%", top: "28%", width: "50%", height: "42%" },
  "Left Chest": { left: "16%", top: "20%", width: "30%", height: "24%" },
  "Right Sleeve": { left: "60%", top: "20%", width: "28%", height: "22%" },
};

export default function UserDesignRequests() {
  const { user, token } = useAuth();
  const { refresh } = useNotifications();
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesMap, setNotesMap] = useState<Record<number, Note[]>>({});
  const [loadingNotesId, setLoadingNotesId] = useState<number | null>(null);

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

  useEffect(() => {
    if (!requests.length) return;
    requests.forEach((req) => {
      if (!notesMap[req.id]) {
        setLoadingNotesId(req.id);
        fetch(`/api/design-requests/${req.id}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.ok ? r.json() : Promise.reject())
          .then((data) => setNotesMap((prev) => ({ ...prev, [req.id]: data })))
          .catch(() => {})
          .finally(() => setLoadingNotesId(null));
      }
    });
  }, [requests, token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <p>Please log in to view your design requests.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-8" style={{ fontFamily: "Manrope, sans-serif" }}>
          My Design Requests
        </h1>
        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-white/60">You haven&apos;t submitted any design requests yet.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div key={req.id} className="rounded-2xl border border-white/[0.08] bg-card p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "Manrope, sans-serif" }}>
                      {req.shirtType}
                    </p>
                    <p className="text-white/50 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {req.shirtColor} · {req.placement} · {req.viewSide || "front"} · {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${
                    req.status === "pending" ? "bg-yellow-500/15 text-yellow-300" :
                    req.status === "in_progress" ? "bg-blue-500/15 text-blue-300" :
                    req.status === "completed" ? "bg-green-500/15 text-green-300" :
                    "bg-red-500/15 text-red-300"
                  }`}>
                    {req.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 rounded-xl border border-white/[0.08] bg-background/80 p-3">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Preview</p>
                    <div className="p-4 rounded-2xl bg-background/80 flex items-center justify-center">
                      <div className="relative w-full max-w-[360px]">
                        <img src={req.mockupImage} alt="Mockup" className="w-full h-auto" />
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            left: `calc(${(PLACEMENT_POSITIONS[req.placement] || PLACEMENT_POSITIONS["Front Center"]).left} + ${req.designPosX || 0}%)`,
                            top: `calc(${(PLACEMENT_POSITIONS[req.placement] || PLACEMENT_POSITIONS["Front Center"]).top} + ${req.designPosY || 0}%)`,
                            width: (PLACEMENT_POSITIONS[req.placement] || PLACEMENT_POSITIONS["Front Center"]).width,
                            height: (PLACEMENT_POSITIONS[req.placement] || PLACEMENT_POSITIONS["Front Center"]).height,
                          }}
                        >
                          <img src={req.designImage} alt="Design" className="max-w-full max-h-full object-contain" style={{ transform: `rotate(${req.designRotation ?? -2}deg) scale(${req.designScale ?? 0.95})`, filter: "contrast(1.05) saturate(0.9)", opacity: 0.92 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border border-white/[0.08] bg-background/80 p-3">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Design</p>
                    <img src={req.designImage} alt="Design" className="w-full h-48 object-contain rounded-lg" />
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-background/80 p-4">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Updates</p>
                  <div className="space-y-2">
                    {(notesMap[req.id] || []).length === 0 && !loadingNotesId && (
                      <p className="text-white/40 text-xs">No updates yet.</p>
                    )}
                    {(notesMap[req.id] || []).map((note) => (
                      <div key={note.id} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                        <p className="text-white/90 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{note.message}</p>
                        <p className="text-white/40 text-[10px] mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
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
