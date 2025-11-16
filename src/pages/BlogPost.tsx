import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

import Header from "@/components/Header";
import TableOfContents from "@/components/TableOfContents";

import { NotionRenderer } from "react-notion-x";
import { Code } from "react-notion-x/build/third-party/code";
import { Equation } from "react-notion-x/build/third-party/equation";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  recordMap: any;
  date: string;
  readTime?: string;
  slug: string;
  banner: string | null;
}

const MAX_BLOCKS = 100;

function buildSafeSubset(recordMap: any, maxBlocks = MAX_BLOCKS) {
  const fullBlocks = recordMap.block;
  const rootId = Object.keys(fullBlocks).find(
    (id) => fullBlocks[id].value.type === "page"
  );

  if (!rootId) return recordMap;

  const queue = [rootId];
  const visited = new Set();
  const subset: any = {};

  while (queue.length && visited.size < maxBlocks) {
    const id = queue.shift();
    if (!id || visited.has(id) || !fullBlocks[id]) continue;

    visited.add(id);
    subset[id] = fullBlocks[id];

    const children = fullBlocks[id].value?.content || [];
    children.forEach((childId: string) => queue.push(childId));
  }

  return { ...recordMap, block: subset };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [extraLoading, setExtraLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        const firstMap = buildSafeSubset(data.recordMap, MAX_BLOCKS);
        const fullMap = data.recordMap;

        setPost({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          slug: data.slug,
          date: data.date,
          readTime: data.readTime,
          banner: data.banner,
          recordMap: firstMap,
        });

        setTimeout(() => {
          setPost((prev) =>
            prev
              ? {
                  ...prev,
                  recordMap: fullMap,
                }
              : prev
          );
          setExtraLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Banner */}
      {post?.banner && (
        <div className="mt-20 w-full">
          <div
            style={{
              width: "100%",
              height: "160px",
              overflow: "hidden",
              position: "relative",
              borderRadius: "8px",
            }}
          >
            <img
              src={post.banner}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <main className="pb-16 flex justify-center px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row max-w-7xl w-full mt-8 gap-12">
          
          {/* Main Content */}
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
                {post?.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-accent mb-6 font-sans">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {post?.date
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
                  <span>{post?.readTime || "–"}</span>
                </div>
              </div>

              <p className="font-sans text-sm sm:text-lg text-muted-foreground leading-relaxed">
                {post?.excerpt}
              </p>

              <hr className="my-8 border-t border-border" />

              {/* Notion Content */}
              <article id="notion-container" className="notion-content">
                {post?.recordMap && (
                  <NotionRenderer
                    recordMap={post.recordMap}
                    fullPage={false}
                    components={{
                      Code: (props) => <Code {...props} />,
                      Equation: (props) => <Equation {...props} />,
                    }}
                  />
                )}

                {extraLoading && (
                  <p className="text-center text-muted-foreground my-6">
                    Loading full article...
                  </p>
                )}
              </article>

              {/* Navigation */}
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

          {/* Table of Contents */}
          <aside className="w-60 hidden lg:block flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] px-4 py-2 border-l border-border">
              <TableOfContents
                containerSelector="#notion-container"
                recordMap={post?.recordMap}
              />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default BlogPost;
