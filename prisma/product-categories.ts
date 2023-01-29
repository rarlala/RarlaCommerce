import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const productData: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(10)
).map((_, index) => ({
  name: `Sneakers ${index + 1}`,
  image_url:
    "https://www.bobbies.com/c/118667-large_portrait/women-sneakers.jpg",
  category_id: 1,
  contents: "",
  price: Math.floor(Math.random() * (100000 - 20000) + 20000),
}));

const productData2: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(10)
).map((_, index) => ({
  name: `T-SHIRT ${index + 1}`,
  image_url:
    "https://cdn.shopify.com/s/files/1/1002/7150/products/New-Mockups---no-hanger---TShirt-Yellow.jpg?v=1639657077",
  category_id: 2,
  contents: "",
  price: Math.floor(Math.random() * (100000 - 20000) + 20000),
}));

const productData3: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(10)
).map((_, index) => ({
  name: `PANTS ${index + 1}`,
  image_url:
    "https://cdn.shopify.com/s/files/1/0099/5708/1143/products/116482_BLUE_1_61ea14c4-9c3d-4c2f-a8f6-911cc17e5857_300x300.jpg?v=1667516154",
  category_id: 3,
  contents: "",
  price: Math.floor(Math.random() * (100000 - 20000) + 20000),
}));

const productData4: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(10)
).map((_, index) => ({
  name: `CAP ${index + 1}`,
  image_url: "https://m.media-amazon.com/images/I/419DHgF1nqL.jpg",
  category_id: 4,
  contents: "",
  price: Math.floor(Math.random() * (100000 - 20000) + 20000),
}));

const productData5: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(10)
).map((_, index) => ({
  name: `HOODIE ${index + 1}`,
  image_url:
    "http://cdn.shopify.com/s/files/1/0035/1309/0115/products/Recycled-Cotton-Hoodie-Stone-1.png?v=1662475104",
  category_id: 5,
  contents: "",
  price: Math.floor(Math.random() * (100000 - 20000) + 20000),
}));

async function main() {
  await prisma.products.deleteMany({});

  for (const p of productData) {
    const product = await prisma.products.create({
      data: p,
    });
    // console.log(`Created id: ${product.id}`);
  }
  for (const p of productData2) {
    const product = await prisma.products.create({
      data: p,
    });
    // console.log(`Created id: ${product.id}`);
  }
  for (const p of productData3) {
    const product = await prisma.products.create({
      data: p,
    });
    // console.log(`Created id: ${product.id}`);
  }
  for (const p of productData4) {
    const product = await prisma.products.create({
      data: p,
    });
    // console.log(`Created id: ${product.id}`);
  }
  for (const p of productData5) {
    const product = await prisma.products.create({
      data: p,
    });
    // console.log(`Created id: ${product.id}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
