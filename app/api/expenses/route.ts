import { NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const DATABASE_ID = process.env.NOTION_EXPENSES_DATABASE_ID!;

async function notionFetch(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");

    const body = tripId
      ? {
          filter: {
            property: "旅程",
            relation: {
              contains: tripId,
            },
          },
          sorts: [
            {
              property: "日期",
              direction: "descending",
            },
          ],
        }
      : {
          sorts: [
            {
              property: "日期",
              direction: "descending",
            },
          ],
        };

    const res = await notionFetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      body
    );

    const data = await res.json();
    return NextResponse.json(data.results ?? data);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          項目: {
            title: [{ text: { content: body.title || "未命名" } }],
          },
          金額: {
            number: Number(body.amount || 0),
          },
          日期: {
            date: { start: body.date || new Date().toISOString() },
          },
          類別: {
            select: { name: body.category || "飲食" },
          },
          旅程: body.tripId
            ? {
                relation: [{ id: body.tripId }],
              }
            : undefined,
        },
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}