import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-border-pixel bg-bg-base mt-20">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-text-primary/60 uppercase tracking-wider">
          © {new Date().getFullYear()} Raaj Patre. All rights reserved.
        </p>
        <div className="flex items-center space-x-6 text-text-primary/60">
          <a
            href="https://github.com/raajpatre"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-violet transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/raajpatre"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-gold transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/raajpatre"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-teal transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
