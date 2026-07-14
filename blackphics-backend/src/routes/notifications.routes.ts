import { Router, Response } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(async (req: any, res: Response) => {
  const userId = req.userId;
  const userRole = req.userRole;

  if (userRole === "admin") {
    const pendingOrders = await prisma.order.findMany({
      where: { status: "pending" },
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const notifications = pendingOrders.map((order) => ({
      id: order.id,
      title: `New Order #${order.id}`,
      message: `${order.user?.name || order.user?.email || "Customer"} placed an order for ${(order.totalPrice || 0).toLocaleString()} DZD`,
      time: order.createdAt,
      type: "order" as const,
      href: "/admin/orders",
      read: order.status !== "pending",
    }));

    return res.json(notifications);
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const notifications = orders.map((order) => ({
    id: order.id,
    title: `Order #${order.id}`,
    message: `Status: ${order.status}`,
    time: order.createdAt,
    type: "status" as const,
    href: "/account/orders",
    read: order.status === "delivered" || order.status === "cancelled",
  }));

  res.json(notifications);
}));

export default router;
