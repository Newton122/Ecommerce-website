import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.js";

const FROM_ADDRESS = "Blacphics <promos@blacphics.com>";

const sendPromoEmailSchema = z.object({
  subject: z.string().min(1),
  html: z.string().min(1),
  userEmails: z.array(z.string().email()).optional(),
});

export async function sendPromoEmail(req: AuthRequest, res: Response) {
  const parsed = sendPromoEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }
  const { subject, html, userEmails } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  let recipients: string[] = [];
  if (userEmails && userEmails.length > 0) {
    recipients = userEmails;
  } else {
    const users = await prisma.user.findMany({
      select: { email: true },
    });
    recipients = users.map((u) => u.email);
  }

  if (recipients.length === 0) {
    return res.json({ sent: 0, message: "No recipients found" });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: recipients,
      subject,
      html,
    });
    if (error) {
      return res.status(500).json({ error: error.message || "Failed to send promo email" });
    }
    return res.json({ sent: recipients.length, id: data?.id });
  } catch {
    return res.status(500).json({ error: "Failed to send promo email" });
  }
}
