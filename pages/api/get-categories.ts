import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCategories() {
  try {
    const response = await prisma.categories.findMany();
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
    const categories = await getCategories();
    res.status(200).json({ items: categories, message: `Success` });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
