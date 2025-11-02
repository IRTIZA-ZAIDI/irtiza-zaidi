import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
const unofficialNotion = new NotionAPI();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  try {
    // 1. Query the database for the post metadata
    const dbResponse = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        rich_text: { equals: slug },
      },
      page_size: 1,
    });

    if (!dbResponse.results.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    const page = dbResponse.results[0];
    const props = page.properties || {};

    // 2. Extract the banner image from the "Banner" column
    const banner = props.Banner?.files?.[0]?.file?.url || null;

    // 3. Get the full recordMap (blocks, code, paragraphs, etc.)
    const recordMap = await unofficialNotion.getPage(page.id);

    // 4. Return structured metadata + block content along with the banner image URL
    return res.status(200).json({
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || "Untitled",
      slug: props.Slug?.rich_text?.[0]?.plain_text || "",
      date: props["Publish Date"]?.date?.start || "",
      excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
      readTime: props["Read Time"]?.number
        ? `${props["Read Time"].number} min read`
        : "",
      isNew: props.New?.checkbox || false,
      banner: banner, // Add the banner image URL
      recordMap, // full block content (this includes your "hello world" code block)
    });
  } catch (error) {
    console.error("Post fetch error:", error);
    return res.status(500).json({
      error: "Failed to fetch post",
      details: error?.message || error,
    });
  }
}
