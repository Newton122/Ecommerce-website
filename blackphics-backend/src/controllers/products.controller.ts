import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listProducts(req: Request, res: Response) {
  const { category } = req.query;

  const products = await prisma.product.findMany({
    where: { isActive: true, ...(category ? { category: String(category) } : {}) },
    include: { collections: true },
    orderBy: { createdAt: "desc" },
  });

  const mapped = products.map((p) => ({
    ...p,
    collections: p.collections.map((c) => ({
      id: c.slug,
      name: c.name,
      image: c.image || "",
    })),
  }));

  res.json(mapped);
}

export async function getProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
    include: { collections: true },
  });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const mapped = {
    ...product,
    collections: product.collections.map((c) => ({
      id: c.slug,
      name: c.name,
      image: c.image || "",
    })),
  };

  res.json(mapped);
}
