import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  slug: string;
  imageUrl?: string;
  dataScienceLevel: (
    | "Machine Learning"
    | "Classical"
    | "Generative AI"
    | "Reinforcement Learning"
  )[] | null;
  domain: string[];
  githubUrl?: string;
}

const domainMap: Record<string, string> = {
  NLP: "Natural Language Processing",
  CV: "Computer Vision",
  SWE: "Software Engineering",
  ML: "Machine Learning",
  GAI: "Generative AI",
  RL: "Reinforcement Learning",
};

export default function ProjectCard({
  title,
  description,
  technologies,
  imageUrl,
  dataScienceLevel,
  domain,
  slug,
  githubUrl,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const fullDomain = domain.map((d) => domainMap[d] || d).join(" & ");

  const projectLink = githubUrl || `/projects/${slug}`;

  return (
    <div className="group border border-foreground/10 bg-transparent hover:border-foreground/40 transition-colors duration-300 h-full flex flex-col p-6 md:p-8">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {fullDomain}
            </span>
            {dataScienceLevel && dataScienceLevel.length > 0 && (
              <span className="text-xs text-muted-foreground/60">
                {dataScienceLevel.join(", ")}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-serif font-medium text-foreground mb-4 group-hover:italic transition-all">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {description}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.map((tech, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border"
              >
                {tech}
              </span>
            ))}
          </div>

          <a
            href={projectLink}
            target={githubUrl ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="inline-block text-xs font-medium uppercase tracking-widest text-foreground border-b border-transparent hover:border-foreground transition-all pb-1"
          >
            View Project
          </a>
        </div>
      </div>
    </div>
  );
}
