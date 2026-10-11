import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

import Header from "@/components/Header";
import TableOfContents from "@/components/TableOfContents";

type NotionRichText = {
  plain_text: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
};

type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  children?: NotionBlock[];
  [key: string]: any;
};

interface Post {
  id: string;
  title: string;
  excerpt: string;
  blocks: NotionBlock[];
  date: string;
  readTime?: string;
  slug: string;
  banner: string | null;
}

const getRichText = (block: NotionBlock) =>
  block[block.type]?.rich_text || block[block.type]?.text || [];

const plainText = (richText: NotionRichText[] = []) =>
  richText.map((text) => text.plain_text).join("");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const renderRichText = (richText: NotionRichText[] = []) =>
  richText.map((text, index) => {
    const annotations = text.annotations || {};
    const className = [
      annotations.bold ? "font-semibold" : "",
      annotations.italic ? "italic" : "",
      annotations.strikethrough ? "line-through" : "",
      annotations.underline ? "underline underline-offset-2" : "",
      annotations.code
        ? "font-mono text-sm bg-muted px-1 py-0.5 border border-border"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <span key={index} className={className || undefined}>
        {text.plain_text}
      </span>
    );

    if (text.href) {
      return (
        <a
          key={index}
          href={text.href}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-accent-warm"
        >
          {content}
        </a>
      );
    }

    return content;
  });

const fileUrl = (value: any) =>
  value?.type === "external" ? value.external?.url : value?.file?.url;

const renderChildren = (block: NotionBlock) =>
  block.children?.length ? (
    <div className="mt-3 ml-5 space-y-3 border-l border-border/50 pl-4">
      {block.children.map(renderBlock)}
    </div>
  ) : null;

const renderBlock = (block: NotionBlock) => {
  const value = block[block.type] || {};
  const richText = getRichText(block);
  const text = plainText(richText);
  const headingId = slugify(text) || block.id;

  switch (block.type) {
    case "paragraph":
      return (
        <div key={block.id}>
          <p className="mb-5 font-sans text-base leading-8 text-foreground/90">
            {renderRichText(richText)}
          </p>
          {renderChildren(block)}
        </div>
      );

    case "heading_1":
      return (
        <h2
          key={block.id}
          id={headingId}
          className="notion-h1 mt-12 mb-5 font-serif text-4xl text-foreground"
        >
          <span className="notion-h-title">{renderRichText(richText)}</span>
        </h2>
      );

    case "heading_2":
      return (
        <h3
          key={block.id}
          id={headingId}
          className="notion-h2 mt-10 mb-4 font-serif text-3xl text-foreground"
        >
          <span className="notion-h-title">{renderRichText(richText)}</span>
        </h3>
      );

    case "heading_3":
      return (
        <h4
          key={block.id}
          id={headingId}
          className="notion-h3 mt-8 mb-3 font-serif text-2xl text-foreground"
        >
          <span className="notion-h-title">{renderRichText(richText)}</span>
        </h4>
      );

    case "bulleted_list_item":
      return (
        <div key={block.id} className="mb-3 flex gap-3 font-sans leading-8">
          <span className="mt-1">•</span>
          <div>
            <div>{renderRichText(richText)}</div>
            {renderChildren(block)}
          </div>
        </div>
      );

    case "numbered_list_item":
      return (
        <div key={block.id} className="mb-3 flex gap-3 font-sans leading-8">
          <span className="mt-1 text-muted-foreground">#</span>
          <div>
            <div>{renderRichText(richText)}</div>
            {renderChildren(block)}
          </div>
        </div>
      );

    case "quote":
      return (
        <blockquote
          key={block.id}
          className="my-6 border-l-2 border-foreground pl-5 font-serif text-xl italic leading-8"
        >
          {renderRichText(richText)}
          {renderChildren(block)}
        </blockquote>
      );

    case "code":
      return (
        <pre
          key={block.id}
          className="my-6 overflow-x-auto border border-border bg-foreground p-4 text-background"
        >
          <code>{text}</code>
        </pre>
      );

    case "image": {
      const src = fileUrl(value);
      if (!src) return null;
      return (
        <figure key={block.id} className="my-8">
          <img src={src} alt={plainText(value.caption)} className="w-full" />
          {value.caption?.length ? (
            <figcaption className="mt-2 text-sm text-muted-foreground">
              {renderRichText(value.caption)}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "divider":
      return <hr key={block.id} className="my-8 border-border" />;

    case "callout":
      return (
        <div key={block.id} className="my-6 border border-border p-4">
          <div className="font-sans leading-8">{renderRichText(richText)}</div>
          {renderChildren(block)}
        </div>
      );

    case "to_do":
      return (
        <label key={block.id} className="mb-3 flex gap-3 font-sans leading-8">
          <input type="checkbox" checked={!!value.checked} readOnly />
          <span>{renderRichText(richText)}</span>
        </label>
      );

    case "toggle":
      return (
        <details key={block.id} className="my-4 border border-border p-4">
          <summary className="cursor-pointer font-sans">
            {renderRichText(richText)}
          </summary>
          {renderChildren(block)}
        </details>
      );

    case "bookmark":
    case "link_preview":
    case "embed":
    case "video":
    case "file":
    case "pdf": {
      const href = value.url || fileUrl(value);
      if (!href) return null;
      return (
        <a
          key={block.id}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="my-4 block border border-border p-4 font-sans underline underline-offset-4"
        >
          {plainText(value.caption) || href}
        </a>
      );
    }

    default:
      return renderChildren(block);
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        console.log(
          "🔥 FULL NOTION BLOCK COUNT FROM BACKEND:",
          data.blocks?.length || 0
        );

        setPost({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          slug: data.slug,
          date: data.date,
          readTime: data.readTime,
          banner: data.banner,
          blocks: data.blocks || [],
        });
      } catch (err: any) {
        console.error("❌ FETCH ERROR:", err);
        setError(err?.message || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <p className="text-center mt-20 text-muted-foreground">Loading post…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <p className="text-center mt-20 text-red-500">
          Error: {error || "Post not found"}
        </p>
      </div>
    );
  }

  const { banner, blocks } = post;

  console.log(
    "🧩 FINAL RENDER BLOCK COUNT:",
    blocks.length
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {banner && (
        <div className="mt-20 w-full">
          <div className="relative w-full aspect-[1500/200] rounded-lg overflow-hidden bg-muted">
            <img
              src={banner}
              alt="Banner"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <main
        className={`pb-16 flex justify-center px-4 sm:px-6 ${
          !banner ? "pt-16" : ""
        }`}
      >
        {" "}
        <div className="flex flex-col lg:flex-row max-w-7xl w-full mt-8 gap-12">
          {/* MAIN CONTENT */}
          <div className="flex-1">
            <div className="wide-container p-1">
              <Link
                to="/blog"
                className="font-sans inline-flex items-center text-muted-foreground hover:text-accent mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-6">
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-accent mb-6 font-sans">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "–"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime || "–"}</span>
                </div>
              </div>

              <p className="font-sans text-sm sm:text-lg text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              <hr className="my-8 border-t border-border" />

              <article
                id="notion-container"
                className="notion-content text-foreground"
              >
                {blocks.length ? (
                  blocks.map(renderBlock)
                ) : (
                  <p className="text-muted-foreground">No post content found.</p>
                )}
              </article>

              <div className="content-container mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                  to="/blog"
                  className="text-accent hover:text-accent-warm transition-colors font-medium text-sm sm:text-base"
                >
                  ← All Posts
                </Link>

                <div className="text-sm sm:text-base text-muted-foreground text-center sm:text-right">
                  Share this post
                </div>
              </div>
            </div>
          </div>

          {/* TOC SIDEBAR */}
          <aside className="w-60 hidden lg:block flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] px-4 py-2 border-l border-border">
              <TableOfContents
                containerSelector="#notion-container"
                recordMap={blocks}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
