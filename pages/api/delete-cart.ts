import type { NextApiRequest, NextApiResponse } from "next";
import { Cart, PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function deleteCart(id: number) {
  try {
    const response = await prisma.cart.delete({
      where: {
        id: id,
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
    const { id } = JSON.parse(req.body);
    if (session == null) {
      res.status(200).json({ items: [], message: "no Session" });
      return;
    }
    const items = await deleteCart(id);
    res.status(200).json({ message: `Success`, items: items });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
