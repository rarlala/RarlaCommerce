import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getOrderBy } from "./../../constants/products";

const prisma = new PrismaClient();

async function getProducts(
  skip: number,
  take: number,
  category: number,
  orderBy: string
) {
  const where =
    category && category !== -1
      ? {
          where: {
            category_id: category,
          },
        }
      : undefined;
  const orderByCondition = getOrderBy(orderBy);

  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
      ...where,
      ...orderByCondition,
    });
    return response;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

type Data = {
  items?: any;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { skip, take, category, orderBy } = req.query;
    if (skip == null || take == null) {
      res.status(400).json({ message: "no skip or take" });
    }
    const products = await getProducts(
      Number(skip),
      Number(take),
      Number(category),
      String(orderBy)
    );
    res.status(200).json({ items: products, message: `Success` });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
