// pages/api/blog/[slug].js

import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

export const config = {
  runtime: "nodejs",
};

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const dbId = process.env.NOTION_DATABASE_ID;

// Unofficial Notion API for full recordMap
const unofficial = new NotionAPI({
  fetchCollections: true,
  fetchMissingBlocks: true,
  fetchUsers: true,
  recurseChildren: true,
});

export default async function handler(req, res) {
  // 🔥 HARD DISABLE CACHING (THIS FIXES YOUR ISSUE)
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.removeHeader("ETag");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  try {
    // 1️⃣ Find page via database + slug
    const dbResp = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Slug",
        rich_text: { equals: slug },
      },
      page_size: 1,
    });

    if (!dbResp.results.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    const page = dbResp.results[0];
    const props = page.properties;

    // 2️⃣ Fetch full recordMap (unofficial API)
    const recordMap = await unofficial.getPage(page.id);

    console.log(
      "🚀 BACKEND: Block count delivered:",
      Object.keys(recordMap.block || {}).length
    );

    const banner =
      props.Banner?.files?.[0]?.file?.url ||
      props.Banner?.files?.[0]?.external?.url ||
      null;

    const payload = {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || "Untitled",
      slug: props.Slug?.rich_text?.[0]?.plain_text || "",
      date: props["Publish Date"]?.date?.start || "",
      excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
      readTime: props["Read Time"]?.number
        ? `${props["Read Time"].number} min read`
        : "",
      banner,
      recordMap,
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error("❌ Post fetch error:", error);
    return res.status(500).json({
      error: "Failed to fetch post",
      details: error?.message || String(error),
    });
  }
}
