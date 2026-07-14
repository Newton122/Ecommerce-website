import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.js";

const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
  author: z.string().min(1).max(100),
});

export async function listReviews(req: Request, res: Response) {
  const { productId } = req.query;
  const where = productId ? { productId: Number(productId) } : {};
  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const mapped = reviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    rating: r.rating,
    comment: r.comment,
    author: r.user?.name || r.author,
    createdAt: r.createdAt,
  }));

  res.json(mapped);
}

export async function createReview(req: AuthRequest, res: Response) {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }
  const { productId, rating, comment, author } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: req.userId ?? null,
      rating,
      comment,
      author,
    },
  });

  const [avg, count] = await prisma.$transaction([
    prisma.review.aggregate({ where: { productId }, _avg: { rating: true } }),
    prisma.review.count({ where: { productId } }),
  ]);
  await prisma.product.update({
    where: { id: productId },
    data: { rating: avg._avg.rating || 0, reviewCount: count },
  });

  res.status(201).json(review);
}
