"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

type User = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { orders: number; reviews: number };
};

export default function AdminUsers() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/admin");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (!user || user.role !== "admin" || !token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load users");
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load users");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user, token]);

  const updateRole = async (userId: number, role: string) => {
    if (!token) return;
    setSavingId(userId);
    try {
      const res = await fetch(`${API}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch {
      setError("Failed to update user role");
    } finally {
      setSavingId(null);
    }
  };

  const toggleActive = async (userId: number, current: boolean) => {
    if (!token) return;
    setSavingId(userId);
    try {
      const res = await fetch(`${API}/admin/users/${userId}/active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to update user status");
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch {
      setError("Failed to update user status");
    } finally {
      setSavingId(null);
    }
  };

  const removeUser = async (userId: number) => {
    if (!token) return;
    setDeleteId(userId);
  };

  const confirmDelete = async () => {
    if (!deleteId || !token) return;
    setSavingId(deleteId);
    try {
      const res = await fetch(`${API}/admin/users/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    } catch {
      setError("Failed to delete user");
    } finally {
      setSavingId(null);
      setDeleteId(null);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const repeatCustomers = users.filter((u) => u._count.orders > 1).length;
  const totalOrders = users.reduce((sum, u) => sum + u._count.orders, 0);

  const roles = useMemo(() => Array.from(new Set(users.map((u) => u.role).filter(Boolean))), [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = !search || [u.name, u.email].some((v) => v?.toLowerCase().includes(search.toLowerCase()));
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>Users</h1>
            <p className="text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>Manage customer accounts and roles</p>
          </div>
          <Link href="/admin" className="px-5 py-2.5 border border-white/15 text-white rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all">Back to Dashboard</Link>
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Total Users</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{loading ? "—" : totalUsers}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Active Users</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{loading ? "—" : activeUsers}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Repeat Customers</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{loading ? "—" : repeatCustomers}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-card p-5">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Total Orders</p>
            <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{loading ? "—" : totalOrders}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-sm outline-none focus:border-primary/50"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-sm outline-none focus:border-primary/50 dark:bg-white/5 dark:text-white"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {(search || roleFilter) && (
            <button onClick={() => { setSearch(""); setRoleFilter(""); }} className="h-10 px-4 rounded-lg border border-white/10 text-white/70 text-sm hover:border-primary/40 hover:text-primary transition-all">Clear</button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-6 py-4 text-white/40 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Name</th>
                    <th className="px-6 py-4 text-white/40 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Email</th>
                    <th className="px-6 py-4 text-white/40 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Role</th>
                    <th className="px-6 py-4 text-white/40 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Status</th>
                    <th className="px-6 py-4 text-white/40 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Date Joined</th>
                    <th className="px-6 py-4 text-white/40 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Orders</th>
                    <th className="px-6 py-4 text-white/40 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-white font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{u.name || "—"}</td>
                      <td className="px-6 py-4 text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          disabled={savingId === u.id}
                          className="bg-background border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-white/20 transition-colors disabled:opacity-50 dark:bg-white/5 dark:text-white"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.isActive ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                          {u.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-white" style={{ fontFamily: "Inter, sans-serif" }}>{u._count.orders}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(u.id, u.isActive)}
                            disabled={savingId === u.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${u.isActive ? "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25" : "bg-green-500/15 text-green-400 hover:bg-green-500/25"}`}
                          >
                            {u.isActive ? "Block" : "Unblock"}
                          </button>
                          {u.role !== "admin" && (
                            <button
                              onClick={() => setDeleteId(u.id)}
                              disabled={savingId === u.id}
                              className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all disabled:opacity-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        {savingId === u.id && <span className="text-white/40 text-xs">Saving...</span>}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-white/40 text-sm">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete User"
        message="This will permanently delete this user and all their data. This action cannot be undone."
        confirmLabel={savingId === deleteId ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => { if (savingId !== deleteId) setDeleteId(null); }}
      />
    </div>
  );
}
