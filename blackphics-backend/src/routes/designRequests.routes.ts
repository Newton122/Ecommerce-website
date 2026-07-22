import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

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

const resend = new Resend(process.env.RESEND_API_KEY as string);

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return false;
  }
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM || "Blackphics <no-reply@blackphics.com>",
      to,
      subject,
      html,
    });
    console.log("Email sent to", to);
    return true;
  } catch (error) {
    console.error("Failed to send email to", to, error);
    return false;
  }
}

router.post("/", asyncHandler(async (req: any, res: Response) => {
  const { shirtType, shirtColor, placement, viewSide, designImage, mockupImage, designPosX, designPosY, mockupVariant, designRotation, designScale, userPhone } = req.body;
  const user = await getRequestUser(req);

  if (!shirtType || !shirtColor || !placement || !designImage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const designRequest = await prisma.designRequest.create({
    data: {
      userId: user?.id || undefined,
      userEmail: user?.email || req.body.userEmail || null,
      userName: user?.name || req.body.userName || null,
      userPhone: userPhone || req.body.userPhone || null,
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

    if (existing.userEmail) {
      await sendEmail(
        existing.userEmail,
        `Design Request ${status.replace("_", " ")}`,
        `<p>Hi ${existing.userName || "there"},</p>
         <p>Your ${existing.shirtType} design request has been marked as <strong>${status.replace("_", " ")}</strong>.</p>
         <p>We'll be in touch soon.</p>
         <p>— Blackphics Team</p>`
      );
    }
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

router.post("/:id/notes", asyncHandler(async (req: any, res: Response) => {
  const admin = await requireAdminUser(req);
  const requestId = Number(req.params.id);
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Note message is required" });
  }

  const designRequest = await prisma.designRequest.findUnique({ where: { id: requestId } });
  if (!designRequest) {
    return res.status(404).json({ message: "Design request not found" });
  }

  const note = await prisma.designRequestNote.create({
    data: {
      designRequestId: requestId,
      message: message.trim(),
    },
  });

  if (designRequest.userId && designRequest.userEmail) {
    await prisma.notification.create({
      data: {
        userId: designRequest.userId,
        title: "New note on your design request",
        message: message.trim(),
        type: "design",
        href: "/account/design-requests",
        image: designRequest.designImage,
      },
    });

    const appUrl = `whatsapp://send?phone=${designRequest.userPhone || ""}&text=${encodeURIComponent(`Hi ${designRequest.userName || "there"}, we have an update on your ${designRequest.shirtType} design request: ${message.trim()}`)}`;
    const webUrl = `https://wa.me/${designRequest.userPhone || ""}?text=${encodeURIComponent(`Hi ${designRequest.userName || "there"}, we have an update on your ${designRequest.shirtType} design request: ${message.trim()}`)}`;
    try {
      await sendEmail(
        designRequest.userEmail,
        "New note on your design request",
        `<p>Hi ${designRequest.userName || "there"},</p>
         <p>We have an update on your ${designRequest.shirtType} design request:</p>
         <blockquote>${message.trim()}</blockquote>
         <p>— Blackphics Team</p>`
      );
    } catch {
      // email is best effort
    }
  }

  res.status(201).json(note);
}));

router.get("/:id/notes", asyncHandler(async (req: any, res: Response) => {
  const user = await getRequestUser(req);
  const requestId = Number(req.params.id);

  const designRequest = await prisma.designRequest.findUnique({ where: { id: requestId } });
  if (!designRequest) {
    return res.status(404).json({ message: "Design request not found" });
  }

  if (!user || (designRequest.userId !== user?.id && user.role !== "admin")) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const notes = await prisma.designRequestNote.findMany({
    where: { designRequestId: requestId },
    orderBy: { createdAt: "asc" },
  });

  res.json(notes);
}));

export default router;
