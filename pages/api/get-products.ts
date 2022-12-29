import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProducts(skip: number, take: number) {
  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
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
    const { skip, take } = req.query;
    if (skip == null || take == null) {
      res.status(400).json({ message: "no skip or take" });
    }
    const products = await getProducts(Number(skip), Number(take));
    res.status(200).json({ items: products, message: `Success` });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
