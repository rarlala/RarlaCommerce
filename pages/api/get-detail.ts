import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: "secret_rBjFjnVl7NOnowc7JzkbIwKN1TKmmX4HM3KhwSFLOxM",
});

const databaseId = "6e121b16f2c241a08a74e98d96c16693";

async function getDetail(pageId: string, propertyId: string) {
  try {
    const response = await notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
    });
    return response;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

type Data = {
  detail?: any;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { pageId, propertyId } = req.query;
    const response = await getDetail(String(pageId), String(propertyId));
    res.status(200).json({ detail: response, message: `Success` });
  } catch (e) {
    res.status(200).json({ message: `Failed` });
  }
}
