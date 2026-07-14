import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    prisma.user
      .findUnique({ where: { id: payload.userId } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "User no longer exists" });
        }
        if (!user.isActive) {
          return res.status(403).json({ error: "Your account has been deactivated" });
        }
        req.userId = user.id;
        req.userRole = user.role;
        next();
      })
      .catch(() => {
        return res.status(500).json({ error: "Failed to authenticate user" });
      });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
}
