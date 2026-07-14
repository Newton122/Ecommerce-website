import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.js";

const addItemSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().min(1).default(1),
  size: z.string().optional(),
  color: z.string().optional(),
});

export async function getCart(req: AuthRequest, res: Response) {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(items);
}

export async function addItem(req: AuthRequest, res: Response) {
  const parsed = addItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }
  const { productId, quantity, size, color } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (product.stock < quantity) {
    return res.status(409).json({ error: `Only ${product.stock} units available` });
  }

  const normalizedSize = size ?? "";
  const normalizedColor = color ?? "";

  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId_size_color: {
        userId: req.userId!,
        productId,
        size: normalizedSize,
        color: normalizedColor,
      },
    },
    update: { quantity: { increment: quantity } },
    create: {
      userId: req.userId!,
      productId,
      quantity,
      size: normalizedSize,
      color: normalizedColor,
    },
    include: { product: true },
  });

  res.status(201).json(item);
}

export async function updateItem(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const quantity = Number(req.body.quantity);

  if (Number.isNaN(id) || Number.isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ error: "Invalid id or quantity" });
  }

  const item = await prisma.cartItem.findFirst({ where: { id, userId: req.userId } });
  if (!item) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: { product: true },
  });
  res.json(updated);
}

export async function removeItem(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const item = await prisma.cartItem.findFirst({ where: { id, userId: req.userId } });
  if (!item) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  await prisma.cartItem.delete({ where: { id } });
  res.status(204).send();
}
