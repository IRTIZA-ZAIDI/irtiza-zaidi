import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// unofficial client (react-notion-x)
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
    // 1. Query DB for page
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

    // 2. Banner
    const banner =
      props.Banner?.files?.[0]?.file?.url ||
      props.Banner?.files?.[0]?.external?.url ||
      null;

    // 3. FULL RECORD MAP USING getPageRaw()
    const { recordMap } = await unofficialNotion.getPageRaw(page.id);

    console.log(
      "Loaded full recordMap. Block count:",
      Object.keys(recordMap.block).length
    );

    // 4. Send
    return res.status(200).json({
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || "Untitled",
      slug: props.Slug?.rich_text?.[0]?.plain_text || "",
      date: props["Publish Date"]?.date?.start || "",
      excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
      readTime: props["Read Time"]?.number
        ? `${props["Read Time"].number} min read`
        : "",
      isNew: props.New?.checkbox ?? false,
      banner,
      recordMap,
    });
  } catch (error) {
    console.error("Post fetch error:", error);
    return res.status(500).json({
      error: "Failed to fetch post",
      details: error?.message || error,
    });
  }
}
