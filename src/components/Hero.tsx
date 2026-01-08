import React from "react";
import { cn } from "@/lib/utils";
// import FadeIn from './animations/FadeIn';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section
      id="hero"
      className={cn(
        "relative min-h-[70vh] flex items-center bg-background",
        className
      )}
    >
      <div className="container mx-auto px-6 md:px-12 py-20 md:py-32 relative z-10 max-w-5xl">
        <div className="max-w-4xl text-left">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight text-foreground leading-[0.9] mb-8">
            <span className="italic">Irtiza</span> Zaidi
          </h1>

          <div className="border-t border-secondary/30 my-8 w-12"></div>

          <p className="text-lg md:text-xl text-foreground font-mono uppercase tracking-widest mb-6">
            Data Scientist
          </p>

          <div className="space-y-4 max-w-2xl">
            <p className="text-xl md:text-2xl text-secondary font-serif leading-relaxed">
              Experiments, notes, and reflections on turning data into understanding.
            </p>
            <p className="text-base text-secondary/80 font-mono">
              Sharing projects built, problems solved, and questions still being explored.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
