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
    const [pendingOrders, pendingDesigns] = await Promise.all([
      prisma.order.findMany({
        where: { status: "pending" },
        include: {
          user: { select: { id: true, email: true, name: true } },
          items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.designRequest.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const orderNotifications = pendingOrders.map((order) => ({
      id: `order-${order.id}`,
      title: `New Order #${order.id}`,
      message: `${order.user?.name || order.user?.email || "Customer"} placed an order for ${(order.totalPrice || 0).toLocaleString()} DZD`,
      time: order.createdAt,
      type: "order" as const,
      href: "/admin/orders",
      read: order.status !== "pending",
    }));

    const designNotifications = pendingDesigns.map((design) => ({
      id: `design-${design.id}`,
      title: `New Design Request`,
      message: `${design.userName || design.userEmail || "A user"} submitted a ${design.shirtType} design request.`,
      time: design.createdAt,
      type: "design" as const,
      href: "/admin/design-requests",
      read: design.status !== "pending",
      image: design.designImage,
    }));

    const notifications = [...orderNotifications, ...designNotifications].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return res.json(notifications.slice(0, 20));
  }

  const [orders, designs] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.designRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const orderNotifications = orders.map((order) => ({
    id: `order-${order.id}`,
    title: `Order #${order.id}`,
    message: `Status: ${order.status}`,
    time: order.createdAt,
    type: "status" as const,
    href: "/account/orders",
    read: order.status === "delivered" || order.status === "cancelled",
  }));

  const designNotifications = designs.map((design) => ({
    id: `design-${design.id}`,
    title: `Design Request`,
    message: `Your ${design.shirtType} design request has been received. We'll contact you soon.`,
    time: design.createdAt,
    type: "design" as const,
    href: "/custom",
    read: design.status !== "pending",
    image: design.designImage,
  }));

  const notifications = [...orderNotifications, ...designNotifications].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  res.json(notifications.slice(0, 20));
}));

export default router;
