import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import ScrollAnimation from "@/components/ScrollAnimation";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { ArrowRight, Github, Linkedin, Mail, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Loader } from "@/components/Loader.tsx";
import { useLocation } from "react-router-dom"; // If using React Router
import Hero from "@/components/Hero";

const Index = () => {
  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 2);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // fetch blog posts from Notion API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };
    fetchPosts();
  }, []);

  const featuredPosts = posts.filter((post) => post.featured).slice(0, 2);

  // loader logic
  useEffect(() => {
    const isDirectVisit =
      document.referrer === "" || // No referrer → fresh tab or bookmark
      !document.referrer.startsWith(window.location.origin); // Came from outside domain

    if (isDirectVisit) {
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-black selection:text-white">
      <Header isHeroPage />

      {/* Hero Section */}
      <Hero />

      {/* Featured Blog Posts */}
      <section className="py-24 md:py-32 border-t border-foreground/5">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-20 gap-8">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground italic">
                Recent Thoughts
              </h2>
              <a
                href="/blog"
                className="group inline-flex items-center text-sm font-mono uppercase tracking-widest text-foreground hover:text-secondary transition-colors"
              >
                View all posts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {featuredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  readTime={post.readTime}
                  slug={post.slug}
                />
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 md:py-32 border-t border-foreground/5">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-20 gap-8">
              <h2 className="font-serif text-4xl md:text-5xl text-foreground italic">
                Featured Work
              </h2>
              <a
                href="/Projects"
                className="group inline-flex items-center text-sm font-mono uppercase tracking-widest text-foreground hover:text-secondary transition-colors"
              >
                View all projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  role={project.role}
                  slug={project.slug}
                  imageUrl={project.imageUrl}
                  dataScienceLevel={project.dataScienceLevel}
                  domain={project.domain}
                />
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Latest Updates / About Small */}
      <section className="py-24 md:py-32 border-t border-foreground/5">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <ScrollAnimation direction="up" delay={0.3}>
            <div className="text-center space-y-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
                Currently
              </h2>
              <div className="space-y-6 text-xl md:text-2xl font-serif text-secondary leading-relaxed">
                <p>
                  Convincing LLMs to behave in production and making models spill
                  their secrets with interpretability tools.
                </p>
                <p>
                  Always open to discussions on AI interpretability, LLM
                  fine-tuning, and impactful ML solutions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <Button asChild className="rounded-none border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all font-mono uppercase tracking-wider h-12 px-8">
                  <a href="/contact">Get in Touch</a>
                </Button>
                <Button variant="outline" asChild className="rounded-none border border-foreground/20 text-secondary hover:text-foreground hover:border-foreground transition-all font-mono uppercase tracking-wider h-12 px-8">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Cannot Define Me
                  </a>
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 pt-8">
                <a
                  href="mailto:zirtiza110@gmail.com"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/zirtiza/"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/IRTIZA-ZAIDI"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
};

export default Index;
