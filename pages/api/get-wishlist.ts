import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function getProduct(userId: string) {
  try {
    const response = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });
    return response?.productIds.split(",");
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
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session == null) {
      res.status(200).json({ items: [], message: "no Session" });
      return;
    }
    const wishlist = await getProduct(String(session.id));
    res.status(200).json({ items: wishlist, message: `Success` });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
