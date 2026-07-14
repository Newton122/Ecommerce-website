import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
});

export async function updateOwnProfile(req: AuthRequest, res: Response) {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    const issues = parsed.error?.issues || parsed.error || [];
    const messages = Array.isArray(issues)
      ? issues.map((e: any) => typeof e === "string" ? e : (e.message || "Invalid request")).join("; ")
      : "Invalid request";
    return res.status(400).json({ error: messages });
  }

  const { name, email } = parsed.data;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const updateData: { name?: string; email?: string } = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, name: true, role: true },
    });
    res.json({ user: updated });
  } catch {
    res.status(500).json({ error: "Failed to update profile" });
  }
}
