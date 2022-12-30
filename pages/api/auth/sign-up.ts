import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwtDecode from "jwt-decode";

const prisma = new PrismaClient();

async function signUp(credential: string) {
  try {
    const decoded: { name: string; email: string; picture: string } =
      jwtDecode(credential);
    const response = await prisma.user.upsert({
      where: {
        email: decoded.email,
      },
      update: {
        name: decoded.name,
        image: decoded.picture,
      },
      create: {
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture,
      },
    });
    return response;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

type Data = {
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { credential } = req.query;
  if (credential == null) {
    return res.status(400).json({ message: "No credential" });
  }
  try {
    const result = await signUp(String(credential));
    res.status(200).json({ message: `Success`, data: result });
  } catch (e) {
    res.status(200).json({ message: `Fail` });
  }
}
