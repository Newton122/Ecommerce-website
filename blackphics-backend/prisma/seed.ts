import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const products = [
  {
    name: "Blacphics Signature Tee",
    price: 2800,
    category: "signature",
    colors: ["#080808", "#ffffff", "#1a1a2e"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=800&h=1000&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1780566036282-e0845b9e4efe?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1780565336250-dd4eaa377ec0?w=800&h=1000&fit=crop&auto=format",
    ],
    badge: "new" as const,
    description:
      "Our signature piece — a heavyweight premium cotton tee featuring the iconic Blacphics emblem. Designed for those who carry identity in every stitch.",
    rating: 4.9,
    reviewCount: 128,
    stock: 50,
    collections: ["brands", "unisex"],
  },
  {
    name: "Urban Core Oversized Tee",
    price: 3200,
    originalPrice: 4000,
    category: "oversized",
    colors: ["#080808", "#2d2d2d", "#ffffff"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1760126130290-bbbc9b41292a?w=800&h=1000&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1760126130290-bbbc9b41292a?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1768696082704-c4e5593d9f27?w=800&h=1000&fit=crop&auto=format",
    ],
    badge: "sale" as const,
    description:
      "Dropped shoulders, relaxed fit. The Urban Core is engineered for comfort that still hits hard on the streets.",
    rating: 4.7,
    reviewCount: 94,
    stock: 0,
    collections: ["mens", "unisex", "find-your-style"],
  },
  {
    name: "Creatives Club Graphic Tee",
    price: 3500,
    category: "graphic",
    colors: ["#080808", "#ffffff", "#39d353"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1768696082704-c4e5593d9f27?w=800&h=1000&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1768696082704-c4e5593d9f27?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1780566036313-1f12261769e8?w=800&h=1000&fit=crop&auto=format",
    ],
    badge: "hot" as const,
    description: "Bold graphic print celebrating Algeria's creative uprising. Limited run, made to be noticed.",
    rating: 4.8,
    reviewCount: 67,
    stock: 25,
    collections: ["unisex", "find-your-style"],
  },
  {
    name: "Studio Essential White Tee",
    price: 2200,
    category: "essential",
    colors: ["#ffffff", "#f5f5f0", "#e8e8e8"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800&h=1000&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?w=800&h=1000&fit=crop&auto=format",
    ],
    badge: null,
    description: "The blank canvas. A premium white tee made for creatives who let their art do the talking.",
    rating: 4.6,
    reviewCount: 211,
    stock: 80,
    collections: ["unisex", "womens", "find-your-style"],
  },
  {
    name: "Gold Label Edition Tee",
    price: 4500,
    category: "limited",
    colors: ["#080808", "#1a1a1a"],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1780565336250-dd4eaa377ec0?w=800&h=1000&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1780565336250-dd4eaa377ec0?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1780566036282-e0845b9e4efe?w=800&h=1000&fit=crop&auto=format",
    ],
    badge: "new" as const,
    description:
      "Limited edition gold foil print on pure black. Where streetwear meets luxury. Only 50 units available.",
    rating: 5.0,
    reviewCount: 32,
    stock: 10,
    collections: ["brands", "mens"],
  },
  {
    name: "Portrait Series Tee",
    price: 3800,
    category: "graphic",
    colors: ["#080808", "#2d2d2d", "#ffffff"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1766149756155-4a8122ad0732?w=800&h=1000&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1766149756155-4a8122ad0732?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1760126130290-bbbc9b41292a?w=800&h=1000&fit=crop&auto=format",
    ],
    badge: null,
    description: "Inspired by Blacphics' photography portfolio. Real portraits, real stories, printed in ink.",
    rating: 4.7,
    reviewCount: 45,
    stock: 35,
    collections: ["unisex", "find-your-style"],
  },
];

const collectionsDef = [
  { name: "Find Your Style", slug: "find-your-style", image: "https://images.unsplash.com/photo-1520975698512-1f8f7a6f9fbb?w=1200&h=800&auto=format&fit=crop" },
  { name: "Men's T-Shirts", slug: "mens", image: "https://images.unsplash.com/photo-1520975698512-1f8f7a6f9fbb?w=1200&h=800&auto=format&fit=crop" },
  { name: "Unisex", slug: "unisex", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=800&auto=format&fit=crop" },
  { name: "Women's", slug: "womens", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=800&auto=format&fit=crop" },
  { name: "Brands", slug: "brands", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=800&auto=format&fit=crop" },
];

const reviewsDef = [
  { slug: "blacphics-signature-tee", rating: 5, comment: "The print quality is insane — zero bleeding, sharp edges.", author: "Amine K." },
  { slug: "blacphics-signature-tee", rating: 4, comment: "Great fit and premium feel. Would buy again.", author: "Sara B." },
  { slug: "urban-core-oversized-tee", rating: 5, comment: "Dropped shoulders, relaxed fit. Hits hard on the streets.", author: "Yacine M." },
  { slug: "urban-core-oversized-tee", rating: 4, comment: "Comfortable and stylish. The oversized look is perfect.", author: "Leila H." },
  { slug: "creatives-club-graphic-tee", rating: 5, comment: "Bold print, great quality. Gets noticed everywhere.", author: "Karim Z." },
  { slug: "studio-essential-white-tee", rating: 5, comment: "The perfect blank canvas. Premium quality fabric.", author: "Nadia R." },
  { slug: "studio-essential-white-tee", rating: 4, comment: "Clean, simple, premium. Exactly what I needed.", author: "Omar F." },
  { slug: "gold-label-edition-tee", rating: 5, comment: "Limited edition gold foil print. Streetwear meets luxury.", author: "Yasmine A." },
  { slug: "gold-label-edition-tee", rating: 5, comment: "Worth every penny. The quality is unmatched.", author: "Riad B." },
  { slug: "portrait-series-tee", rating: 5, comment: "Real portraits, real stories. The print quality is amazing.", author: "Ines M." },
];

async function main() {
  for (const c of collectionsDef) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: { name: c.name, image: c.image },
      create: c,
    });
  }

  const productSlugMap = new Map<string, number>();
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: {},
      create: {
        name: p.name,
        slug: slugify(p.name),
        price: p.price,
        originalPrice: p.originalPrice ?? undefined,
        category: p.category,
        colors: p.colors,
        sizes: p.sizes,
        image: p.image,
        images: p.images,
        badge: p.badge ?? undefined,
        description: p.description,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
      },
    });

    productSlugMap.set(slugify(p.name), product.id);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        collections: {
          connect: (p.collections || []).map((slug: string) => ({ slug })),
        },
      },
    });
  }

  await prisma.review.deleteMany();

  for (const r of reviewsDef) {
    const productId = productSlugMap.get(r.slug);
    if (!productId) continue;
    await prisma.review.create({
      data: {
        productId,
        rating: r.rating,
        comment: r.comment,
        author: r.author,
      },
    });
  }

  console.log(`Seeded ${products.length} products, ${collectionsDef.length} collections, and ${reviewsDef.length} reviews.`);
  console.log("");
  console.log("To promote a user to admin, run one of these:");
  console.log("  • psql:           UPDATE \"User\" SET role = 'admin' WHERE email = 'you@example.com';");
  console.log("  • Prisma Studio:  npx prisma studio, then set the user's role field to \"admin\".");
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
