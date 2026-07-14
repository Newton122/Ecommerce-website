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

router.post("/", asyncHandler(async (req: any, res: Response) => {
  const { shirtType, shirtColor, placement, viewSide, designImage, mockupImage } = req.body;
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

export default router;
