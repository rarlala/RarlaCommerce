import type { NextApiRequest, NextApiResponse } from "next";
import { OrderItem, PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function addOrder(
  userId: string,
  items: Omit<OrderItem, "id">[],
  orderInfo?: { receiver: string; address: string; phoneNumber: string }
) {
  try {
    let orderItemIds = [];
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          ...item,
        },
      });
      orderItemIds.push(orderItem.id);
    }

    const response = await prisma.orders.create({
      data: {
        userId,
        orderItemIds: orderItemIds.join(","),
        ...orderInfo,
        status: 0,
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
    const { items, orderInfo } = JSON.parse(req.body);
    if (session == null) {
      res.status(200).json({ items: [], message: "no Session" });
      return;
    }
    const orders = await addOrder(String(session.id), items, orderInfo);
    res.status(200).json({ message: `Success`, items: orders });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
