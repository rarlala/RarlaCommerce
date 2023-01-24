import type { NextApiRequest, NextApiResponse } from "next";
import { Cart, PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function updateCart(item: Cart) {
  try {
    const response = await prisma.cart.update({
      where: {
        id: item.id,
      },
      data: {
        quantity: item.quantity,
        amount: item.amount,
      },
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
    const session = await unstable_getServerSession(req, res, authOptions);
    const { item } = JSON.parse(req.body);
    if (session == null || session.id !== item.userId) {
      res
        .status(200)
        .json({ items: [], message: "no Session or Invalid Session" });
      return;
    }
    const items = await updateCart(item);
    res.status(200).json({ message: `Success`, items: items });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
