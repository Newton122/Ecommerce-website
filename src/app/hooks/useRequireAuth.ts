"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (!loading && !user) {
    router.push("/login");
  }

  return { user, loading };
}
