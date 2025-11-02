import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import TableOfContents from "@/components/TableOfContents";
import ScrollAnimation from "@/components/ScrollAnimation";

import { NotionRenderer } from "react-notion-x";
import { Code } from "react-notion-x/build/third-party/code";
// Optional: add more renderers if needed
// import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from "react-notion-x/build/third-party/equation";

import "react-notion-x/src/styles.css";
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'

interface Post {
  id: string;
  title: string;
  excerpt: string;
  recordMap: any;
  date: string;
  readTime?: string;
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        setPost({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          slug: data.slug,
          date: data.date,
          readTime: data.readTime,
          recordMap: data.recordMap,
        });
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
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <main className="pt-16 pb-16 flex justify-center px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row max-w-7xl w-full mt-8 gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <ScrollAnimation direction="fade">
              <div className="wide-container p-1">
                <Link
                  to="/blog"
                  className="font-sans inline-flex items-center text-muted-foreground hover:text-accent transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="font-serif text-4xl text-foreground mb-6">
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

                  <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  <hr className="my-8 border-t border-border" />
                </motion.div>

                {/* Notion Content */}
                <article id="notion-container" className="notion-content">
                  {post.recordMap && (
                    <NotionRenderer
                      recordMap={post.recordMap}
                      fullPage={false}
                      components={{
                        Code, // enable code block rendering
                        Equation, // Use only MathML
                        // Collection,
                      }}
                      className="text-foreground"
                    />
                  )}
                </article>

                {/* Navigation */}
                <ScrollAnimation direction="up" delay={0.5}>
                  <div className="content-container mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link
                      to="/blog"
                      className="text-accent hover:text-accent-warm transition-colors font-medium text-sm sm:text-base"
                    >
                      ← All Posts
                    </Link>

                    <div className="text-sm sm:text-base text-muted-foreground text-center sm:text-right w-full sm:w-auto">
                      Share this post
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </ScrollAnimation>
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
