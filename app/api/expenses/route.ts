import { NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const DATABASE_ID = process.env.NOTION_EXPENSES_DATABASE_ID!;

async function notionFetch(url: string, body: any) {
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

// 讀取
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("tripId");

  const res = await notionFetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      filter: tripId
        ? {
            property: "旅程",
            relation: {
              contains: tripId,
            },
          }
        : undefined,
      sorts: [
        {
          property: "日期",
          direction: "descending",
        },
      ],
    }
  );

  const data = await res.json();
  return NextResponse.json(data.results ?? data);
}

// 新增
export async function POST(req: Request) {
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
          title: [{ text: { content: body.title } }],
        },
        金額: {
          number: body.amount,
        },
        日期: {
          date: { start: body.date },
        },
        類別: {
          select: { name: body.category || "飲食" },
        },
        旅程: {
          relation: [{ id: body.tripId }],
        },
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}