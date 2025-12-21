// pages/api/blog/index.js

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  // 🔥 HARD DISABLE ALL CACHING (Vercel-safe)
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.removeHeader("ETag");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 50,
      sorts: [{ property: "Publish Date", direction: "descending" }],
      filter: {
        property: "Status",
        status: { equals: "Published" },
      },
    });

    const posts = response.results.map((page) => {
      const props = page.properties || {};

      const publishDate = props["Publish Date"]?.date?.start ?? null;
      const readTimeNumber = props["Read Time"]?.number ?? null;

      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text ?? "Untitled",
        slug: props.Slug?.rich_text?.[0]?.plain_text ?? "",
        date: publishDate,
        excerpt: props.Excerpt?.rich_text?.[0]?.plain_text ?? "",
        readTime: readTimeNumber ? `${readTimeNumber} min read` : "—",
        isNew: props.New?.checkbox ?? false,
        featured: props["Featured Work"]?.checkbox ?? false,
        pageUrl: `https://www.notion.so/${page.id.replace(/-/g, "")}`,
      };
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Notion fetch error:", error);
    return res.status(500).json({
      error: "Failed to fetch posts",
      details: error?.message || String(error),
    });
  }
}
