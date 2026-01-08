import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
  onClick?: () => void;
}

interface HeaderProps {
  logo?: string;
  navItems?: NavItem[];
  className?: string;
  isHeroPage?: boolean;
}

const defaultNavItems: NavItem[] = [
  { label: "home", href: "/" },
  { label: "projects", href: "/Projects" },
  { label: "blog", href: "/blog" },
  { label: "notes", href: "/notes" },
  { label: "about", href: "/about" },
  { label: "contact", href: "/contact" },
];

const Header: React.FC<HeaderProps> = ({
  logo = "Irtiza",
  navItems = defaultNavItems,
  className,
  isHeroPage = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transparentHero = isHeroPage && !isScrolled;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-6 bg-background/95 transition-all duration-300",
        className
      )}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-serif italic text-foreground hover:opacity-70 transition-opacity"
          >
            {logo}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-xs font-mono uppercase tracking-widest text-foreground hover:text-secondary transition-colors duration-200"
                onClick={item.onClick}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            <button
              className="p-2 text-foreground hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden fixed inset-0 top-[80px] bg-background z-40 transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          )}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-xl font-mono uppercase tracking-widest text-foreground hover:text-secondary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
