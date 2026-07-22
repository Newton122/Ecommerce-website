"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Trash2, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";

interface DesignRequest {
  id: number;
  userId?: number;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
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
  mockupImage?: string;
  mockupVariant?: number;
  designPosX?: number;
  designPosY?: number;
  designRotation?: number;
  designScale?: number;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["pending", "in_progress", "completed", "rejected"] as const;

const PLACEMENT_POSITIONS: Record<string, { left: string; top: string; width: string; height: string }> = {
  "Front Center": { left: "25%", top: "28%", width: "50%", height: "42%" },
  "Back Center": { left: "25%", top: "28%", width: "50%", height: "42%" },
  "Left Chest": { left: "16%", top: "20%", width: "30%", height: "24%" },
  "Right Sleeve": { left: "60%", top: "20%", width: "28%", height: "22%" },
};

export default function AdminDesignRequests() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [notesMap, setNotesMap] = useState<Record<number, Note[]>>({});
  const [noteTextMap, setNoteTextMap] = useState<Record<number, string>>({});
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
    if (!token || requests.length === 0) return;
    requests.forEach((req) => {
      if (!notesMap[req.id]) {
        loadNotes(req.id);
      }
    });
  }, [token, requests]);

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
      setPendingDeleteId(null);
    }
  };

  const loadNotes = async (id: number) => {
    if (!token) return;
    setLoadingNotesId(id);
    try {
      const res = await fetch(`/api/design-requests/${id}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      setNotesMap((prev) => ({ ...prev, [id]: data }));
    } catch {
      // ignore
    } finally {
      setLoadingNotesId(null);
    }
  };

  const addNote = async (id: number) => {
    const message = noteTextMap[id];
    if (!message?.trim()) return;
    setActioningId(id);
    try {
      const res = await fetch(`/api/design-requests/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      toast.success("Note added");
      setNoteTextMap((prev) => ({ ...prev, [id]: "" }));
      loadNotes(id);
    } catch {
      toast.error("Failed to add note. Please try again.");
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
                    {req.userPhone && (
                      <a
                        href={`https://wa.me/${String(req.userPhone).replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#25d366] text-xs mt-1 hover:underline"
                      >
                        <MessageSquare size={12} /> WhatsApp
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      disabled={actioningId === req.id}
                      className="bg-background/80 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-primary disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setPendingDeleteId(req.id)}
                      disabled={actioningId === req.id}
                      className="inline-flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors p-2 disabled:opacity-50"
                      title="Delete request"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 rounded-xl border border-white/[0.08] bg-background/80 p-3">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Preview</p>
                    <div className="p-6 rounded-2xl bg-background/80 flex items-center justify-center">
                      <div className="relative w-full max-w-[520px]">
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
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Uploaded Design</p>
                    <img src={req.designImage} alt="Design" className="w-full h-48 object-contain rounded-lg" />
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-background/80 p-4">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Notes</p>
                  <div className="space-y-2 mb-3">
                    {(notesMap[req.id] || []).length === 0 && (
                      <p className="text-white/40 text-xs">No notes yet.</p>
                    )}
                    {(notesMap[req.id] || []).map((note) => (
                      <div key={note.id} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                        <p className="text-white/90 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{note.message}</p>
                        <p className="text-white/40 text-[10px] mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={noteTextMap[req.id] || ""}
                      onChange={(e) => setNoteTextMap((prev) => ({ ...prev, [req.id]: e.target.value }))}
                      placeholder="Add a note..."
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-primary"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                    <button
                      onClick={() => addNote(req.id)}
                      disabled={actioningId === req.id}
                      className="inline-flex items-center justify-center rounded-lg bg-primary text-black px-3 py-2 disabled:opacity-50"
                      title="Add note"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this design request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the design request from the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDeleteId && deleteRequest(pendingDeleteId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
