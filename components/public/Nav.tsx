"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "QUESTS" },
  { href: "/about", label: "ABOUT" },
  { href: "/certificates", label: "CERTS" },
  { href: "/feed", label: "LOG" },
  { href: "/contact", label: "CONTACT" },
];

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-pixel bg-bg-base">
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-16 h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-pixel text-[11px] text-text-primary hover:text-text-primary z-50">
          <span className="bg-accent-violet text-bg-base px-1.5 py-1 text-[10px] shadow-[0_0_0_1px_#7c6df5] leading-none">@</span>
          RAAJPATRE.DEV
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-[22px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-pixel text-[9px] tracking-[0.05em] transition-colors",
                  isActive ? "text-accent-gold" : "text-text-muted hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Save indicator (desktop) + mobile hamburger */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline font-pixel text-[8px] text-accent-teal border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] px-2 py-1.5">
            ◆ SAVED{time ? ` · ${time}` : ""}
          </span>
          <button
            className="md:hidden p-2 text-text-primary hover:text-accent-gold z-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 w-full bg-bg-base border-b border-border-pixel shadow-xl md:hidden"
          >
            <nav className="flex flex-col p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "font-pixel text-[9px] tracking-[0.05em] px-4 py-4 border-b border-border-pixel/30 last:border-0 min-h-[44px] flex items-center",
                      isActive ? "text-accent-gold" : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
