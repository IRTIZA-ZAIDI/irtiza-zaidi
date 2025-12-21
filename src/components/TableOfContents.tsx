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

const TableOfContents = ({ containerSelector, recordMap }: TableOfContentsProps) => {
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

      container.querySelectorAll(".notion-h1, .notion-h2, .notion-h3").forEach((el) => {
        const t = el.querySelector(".notion-h-title");
        if (!t) return;

        const text = t.textContent || "";
        const level = el.classList.contains("notion-h1")
          ? 1
          : el.classList.contains("notion-h2")
          ? 2
          : 3;

        const id =
          text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
          crypto.randomUUID();

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
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-24 relative"
    >
      <h3 className="font-sans text-lg font-semibold mb-3">On This Page</h3>

      {/* Scrollable list */}
      <div
        ref={wrapperRef}
        className="
          relative
          overflow-y-auto overflow-x-hidden
          max-h-[calc(100vh-9rem)]
          pr-2
          pt-4
          pb-24
          bg-background
        "
        style={{ scrollbarWidth: "none" }}
      >
        {/* TOP fade (inside scrollable area) */}
        {isOverflowing && (
          <div
            className="
              pointer-events-none
              absolute top-0 left-0 right-0
              h-12
              bg-gradient-to-b from-background to-transparent
              z-20
            "
          />
        )}

        <nav className="space-y-1 relative z-10">
          {toc.map(({ id, text, level }) => {
            const isActive = activeId === id;
            return (
              <div
                key={id}
                ref={(el) => (itemsRef.current[id] = el)}
                onClick={() => jump(id)}
                className={`
                  cursor-pointer relative leading-tight py-0.5 text-sm transition-colors
                  ${isActive ? "text-accent font-semibold" : "text-muted-foreground hover:text-accent"}
                  ${level === 1 ? "mt-3 mb-1 ml-0 font-semibold text-foreground" : ""}
                  ${level === 2 ? "ml-3" : ""}
                  ${level === 3 ? "ml-6" : ""}
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-[2px] bg-accent rounded-full" />
                )}
                <span className="select-none">{text}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* FIXED BOTTOM FADE — sticks to bottom of sidebar */}
      {isOverflowing && (
        <div
          className="
            pointer-events-none
            absolute bottom-0 left-0 right-0
            h-24
            bg-gradient-to-t from-background to-transparent
            z-30
          "
        />
      )}
    </motion.div>
  );
};

export default TableOfContents;
