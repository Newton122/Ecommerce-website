import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.js";

const FROM_ADDRESS = "onboarding@resend.dev";

async function sendOrderStatusEmail(order: { user: { email: string; name: string | null }; id: number; status: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY is not set. Order #${order.id} status email to ${order.user.email} was not sent.`);
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const subject = `Your Blackphics order #${order.id} is ${order.status}`;
    const html = `
      <div style="font-family: Inter, Arial, sans-serif; color: #111;">
        <h2>Order #${order.id} — ${order.status}</h2>
        <p>Hi ${order.user.name || "there"},</p>
        <p>Your order <strong>#${order.id}</strong> has been updated to: <strong>${order.status}</strong>.</p>
        <p>Thank you for shopping with Blackphics.</p>
      </div>
    `;
    const result = await resend.emails.send({ from: FROM_ADDRESS, to: order.user.email, subject, html });
    console.log(`[email] Order #${order.id} status email sent to ${order.user.email}`, result);
  } catch (err) {
    console.error(`[email] Failed to send order #${order.id} status email to ${order.user.email}`, err);
  }
}

const createOrderSchema = z.object({
  address: z.string().min(3),
  city: z.string().min(2),
  phone: z.string().min(6),
});

export async function createOrder(req: AuthRequest, res: Response) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }
  const { address, city, phone } = parsed.data;
  const userId = req.userId!;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const insufficient = cartItems.find((item) => item.product.stock < item.quantity);
  if (insufficient) {
    return res.status(409).json({ error: `Insufficient stock for ${insufficient.product.name}. Available: ${insufficient.product.stock}` });
  }

  // Wrap order creation + cart clearing in a transaction: either both happen or neither does.
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        address,
        city,
        phone,
        totalPrice,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: { items: true },
    });

    await tx.cartItem.deleteMany({ where: { userId } });

    // Decrement stock for each purchased product so we never oversell.
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return createdOrder;
  });

  res.status(201).json(order);
}

export async function listOrders(req: AuthRequest, res: Response) {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
}

export async function getOrder(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid order id" });
  }

  const order = await prisma.order.findFirst({
    where: { id, userId: req.userId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
}

const orderStatusSchema = z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]);

const validTransitions: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export async function listAllOrders(req: AuthRequest, res: Response) {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, email: true, name: true } },
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid order id" });
  }

  const parsed = orderStatusSchema.safeParse(req.body?.status);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid order status" });
  }
  const status = parsed.data;

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "Order not found" });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { id: true, email: true, name: true } },
      items: { include: { product: true } },
    },
  });

  await sendOrderStatusEmail(order);
  res.json(order);
}

export async function cancelOrder(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid order id" });
  }

  const existing = await prisma.order.findFirst({
    where: { id, userId: req.userId },
    include: { items: { include: { product: true } } },
  });
  if (!existing) {
    return res.status(404).json({ error: "Order not found" });
  }

  const allowed = validTransitions[existing.status] || [];
  if (!allowed.includes("cancelled")) {
    return res.status(400).json({ error: `Cannot cancel order with status ${existing.status}` });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: "cancelled" },
    include: {
      user: { select: { id: true, email: true, name: true } },
      items: { include: { product: true } },
    },
  });

  await sendOrderStatusEmail(order);
  res.json(order);
}

export async function confirmDelivery(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid order id" });
  }

  const existing = await prisma.order.findFirst({
    where: { id, userId: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (existing.status !== "shipped") {
    return res.status(400).json({ error: "Only shipped orders can be confirmed as delivered" });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: "delivered" },
    include: {
      user: { select: { id: true, email: true, name: true } },
      items: { include: { product: true } },
    },
  });

  await sendOrderStatusEmail(order);
  res.json(order);
}
