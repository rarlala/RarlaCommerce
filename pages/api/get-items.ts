import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: "secret_rBjFjnVl7NOnowc7JzkbIwKN1TKmmX4HM3KhwSFLOxM",
});

const databaseId = "6e121b16f2c241a08a74e98d96c16693";

async function getItems() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: "price", direction: "ascending" }],
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
    const response = await getItems();
    res.status(200).json({ items: response?.results, message: `Success` });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
