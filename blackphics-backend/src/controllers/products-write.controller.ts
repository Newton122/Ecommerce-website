import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.js";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const badgeSchema = z.enum(["new", "sale", "hot"]).nullable().optional();

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  price: z.coerce.number().int().nonnegative(),
  originalPrice: z.coerce.number().int().nonnegative().optional(),
  category: z.string().min(1),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  image: z.string().min(1),
  images: z.array(z.string()).default([]),
  badge: badgeSchema,
  description: z.string().default(""),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().int().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  collectionSlugs: z.array(z.string()).optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  originalPrice: z.coerce.number().int().nonnegative().optional().nullable(),
  category: z.string().min(1).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  image: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  badge: badgeSchema,
  description: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().int().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  collectionSlugs: z.array(z.string()).optional(),
});

export async function createProduct(req: AuthRequest, res: Response) {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }
  const data = parsed.data;

  const slug = data.slug?.trim() || slugify(data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return res.status(409).json({ error: `A product with slug "${slug}" already exists` });
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      price: data.price,
      originalPrice: data.originalPrice,
      category: data.category,
      colors: data.colors,
      sizes: data.sizes,
      image: data.image,
      images: data.images,
      badge: data.badge ?? undefined,
      description: data.description,
      rating: data.rating,
      reviewCount: data.reviewCount,
      stock: data.stock,
      collections: data.collectionSlugs
        ? { connect: data.collectionSlugs.map((slug) => ({ slug })) }
        : undefined,
    },
    include: { collections: true },
  });

  res.status(201).json(product);
}

export async function updateProduct(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }

  const slug = data.slug?.trim() || (data.name ? slugify(data.name) : undefined);
  if (slug && slug !== existing.slug) {
    const conflict = await prisma.product.findUnique({ where: { slug } });
    if (conflict) {
      return res.status(409).json({ error: `A product with slug "${slug}" already exists` });
    }
  }

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (slug !== undefined) updateData.slug = slug;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.colors !== undefined) updateData.colors = data.colors;
  if (data.sizes !== undefined) updateData.sizes = data.sizes;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.images !== undefined) updateData.images = data.images;
  if (data.badge !== undefined) updateData.badge = data.badge;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.reviewCount !== undefined) updateData.reviewCount = data.reviewCount;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.collectionSlugs !== undefined) {
    updateData.collections = {
      set: [],
      connect: data.collectionSlugs.map((slug) => ({ slug })),
    };
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { collections: true },
  });

  res.json(product);
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }

  await prisma.product.update({ where: { id }, data: { isActive: false } });
  res.json({ success: true });
}
