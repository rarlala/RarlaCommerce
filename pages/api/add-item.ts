import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: "secret_rBjFjnVl7NOnowc7JzkbIwKN1TKmmX4HM3KhwSFLOxM",
});

const databaseId = "6e121b16f2c241a08a74e98d96c16693";

async function addItem(name: string) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
    });
    console.log(response);
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name } = req.query;
  if (name == null) {
    return res.status(400).json({ message: "No name" });
  }
  try {
    await addItem(String(name));
    res.status(200).json({ message: `Success ${name} added` });
  } catch (e) {
    res.status(200).json({ message: `Fail ${name} added` });
  }
}
