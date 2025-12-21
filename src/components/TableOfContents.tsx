import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  containerSelector: string;
  recordMap?: any;
}

const NAVBAR_OFFSET = -90;

const TableOfContents = ({
  containerSelector,
  recordMap,
}: TableOfContentsProps) => {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOverflowing, setIsOverflowing] = useState(false);

  const suppressRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});

  /* Build TOC */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const list: TOCItem[] = [];

      container
        .querySelectorAll(".notion-h1, .notion-h2, .notion-h3")
        .forEach((el) => {
          const t = el.querySelector(".notion-h-title");
          if (!t) return;

          const text = t.textContent || "";
          const level = el.classList.contains("notion-h1")
            ? 1
            : el.classList.contains("notion-h2")
            ? 2
            : 3;

          const id =
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || crypto.randomUUID();

          (el as HTMLElement).id = id;
          list.push({ id, text, level });
        });

      setToc(list);
    }, 250);

    return () => clearTimeout(timeout);
  }, [containerSelector, recordMap]);

  /* Detect overflow */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const check = () => {
      const overflowing = el.scrollHeight > el.clientHeight + 4;
      setIsOverflowing(overflowing);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => observer.disconnect();
  }, [toc]);

  /* Scrollspy */
  useEffect(() => {
    if (!toc.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressRef.current) return;

        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-35% 0% -55% 0%" }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  /* Auto-scroll highlight into view */
  useEffect(() => {
    const el = itemsRef.current[activeId];
    if (!el) return;

    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  /* Click scroll w/ offset */
  const jump = (id: string) => {
    suppressRef.current = true;
    setActiveId(id);

    const target = document.getElementById(id);
    if (target) {
      const y =
        target.getBoundingClientRect().top + window.scrollY + NAVBAR_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    let timeout: any;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        suppressRef.current = false;
        window.removeEventListener("scroll", onScroll);
      }, 150);
    };
    window.addEventListener("scroll", onScroll);
  };

  if (!toc.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-24"
    >
      <h3 className="font-sans text-lg font-medium text-muted-foreground mb-4">
        On this page
      </h3>

      <div
        ref={wrapperRef}
        className="
        relative
        max-h-[calc(100vh-10rem)]
        overflow-y-auto
        pr-3
        space-y-1
      "
        style={{ scrollbarWidth: "none" }}
      >
        <nav>
          {toc.map(({ id, text, level }) => {
            const isActive = activeId === id;

            return (
              <div
                key={id}
                ref={(el) => (itemsRef.current[id] = el)}
                onClick={() => jump(id)}
                className={`
  relative cursor-pointer leading-snug py-1 text-sm
  transition-colors
  ${
    isActive
      ? "text-accent font-medium"
      : "text-muted-foreground hover:text-blue-500"
  }
  ${
    level === 1 && !isActive
      ? "mt-2 font-medium text-foreground"
      : level === 1
      ? "mt-2"
      : ""
  }
  ${level === 2 ? "ml-3" : ""}
  ${level === 3 ? "ml-6 text-xs" : ""}
`}
              >
                {/* Active vertical bar */}
                {isActive && (
                  <span className="absolute -left-3 top-1 h-4 w-[2px] bg-accent rounded-full" />
                )}

                <span className="select-none">{text}</span>
              </div>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default TableOfContents;
