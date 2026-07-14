import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listCollections(_req: Request, res: Response) {
  const collections = await prisma.collection.findMany({
    include: { products: true },
    orderBy: { createdAt: "asc" },
  });

  const mapped = collections.map((c) => ({
    id: c.slug,
    name: c.name,
    description: "",
    image: c.image || "",
    productCount: c.products.length,
    products: c.products,
  }));

  res.json(mapped);
}

export async function getCollection(req: Request, res: Response) {
  const { id } = req.params;
  const collection = await prisma.collection.findUnique({
    where: { slug: String(id) },
    include: { products: true },
  });

  if (!collection) {
    return res.status(404).json({ error: "Collection not found" });
  }

  const mapped = {
    id: collection.slug,
    name: collection.name,
    description: "",
    image: collection.image || "",
    products: collection.products,
  };

  res.json(mapped);
}
