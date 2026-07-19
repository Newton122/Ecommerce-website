import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";

const router = Router();

async function getRequestUser(req: any) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, name: true, role: true } });
    return user;
  } catch {
    return null;
  }
}

async function requireAdminUser(req: any) {
  const user = await getRequestUser(req);
  if (!user || user.role !== "admin") {
    const err = new Error("Admin access required") as any;
    err.statusCode = 403;
    throw err;
  }
  return user;
}

router.post("/", asyncHandler(async (req: any, res: Response) => {
  const { shirtType, shirtColor, placement, viewSide, designImage, mockupImage, designPosX, designPosY, mockupVariant, designRotation, designScale } = req.body;
  const user = await getRequestUser(req);

  if (!shirtType || !shirtColor || !placement || !designImage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const designRequest = await prisma.designRequest.create({
    data: {
      userId: user?.id || undefined,
      userEmail: user?.email || req.body.userEmail || null,
      userName: user?.name || req.body.userName || null,
      shirtType,
      shirtColor,
      placement,
      viewSide: viewSide || null,
      designImage,
      mockupImage: mockupImage || null,
      mockupVariant: mockupVariant ?? 0,
      designPosX: designPosX ?? null,
      designPosY: designPosY ?? null,
      designRotation: designRotation ?? null,
      designScale: designScale ?? null,
    },
  });

  return res.status(201).json(designRequest);
}));

router.get("/", asyncHandler(async (req: any, res: Response) => {
  const user = await getRequestUser(req);
  const userRole = user?.role === "admin" ? "admin" : undefined;

  if (userRole === "admin") {
    const requests = await prisma.designRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json(requests);
  }

  const requests = user
    ? await prisma.designRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  res.json(requests);
}));

router.patch("/:id", asyncHandler(async (req: any, res: Response) => {
  const admin = await requireAdminUser(req);
  const requestId = Number(req.params.id);
  const { status } = req.body;

  if (!["pending", "in_progress", "completed", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const existing = await prisma.designRequest.findUnique({ where: { id: requestId } });
  if (!existing) {
    return res.status(404).json({ message: "Design request not found" });
  }

  const updated = await prisma.designRequest.update({
    where: { id: requestId },
    data: { status },
  });

  if (existing.userId && existing.status !== status) {
    await prisma.notification.create({
      data: {
        userId: existing.userId,
        title: `Design Request ${status.replace("_", " ")}`,
        message: `Your ${existing.shirtType} design request has been marked as ${status.replace("_", " ")}.`,
        type: "design",
        href: "/custom",
        image: existing.designImage,
      },
    });
  }

  return res.json(updated);
}));

router.delete("/:id", asyncHandler(async (req: any, res: Response) => {
  await requireAdminUser(req);
  const requestId = Number(req.params.id);

  const existing = await prisma.designRequest.findUnique({ where: { id: requestId } });
  if (!existing) {
    return res.status(404).json({ message: "Design request not found" });
  }

  await prisma.designRequest.delete({ where: { id: requestId } });
  return res.status(204).send();
}));

export default router;
