import { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.js";

export async function listUsers(_req: AuthRequest, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
}

export async function updateUserRole(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const { role } = req.body as { role?: string };
  if (!role || !["admin", "customer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });
  res.json(user);
}

export async function toggleUserActive(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, isActive: true } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });
  res.json(updated);
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === "admin") {
    return res.status(403).json({ error: "Cannot delete an admin user" });
  }

  await prisma.user.delete({ where: { id } });
  res.status(204).send();
}
