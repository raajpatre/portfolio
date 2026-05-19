"use client";

import { motion } from "framer-motion";
import { PixelButton } from "./PixelButton";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full py-24 sm:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary mb-6 leading-tight">
          Raaj Patre
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-mono text-base sm:text-lg text-text-primary/70 mb-12 max-w-2xl"
        >
          Builder. Breaker. Repeat. Crafting pixel-perfect web experiences with a focus on performance, aesthetics, and scalable architecture.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/projects">
            <PixelButton variant="primary" className="w-full sm:w-auto">
              View Projects
            </PixelButton>
          </Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            <PixelButton variant="secondary" className="w-full sm:w-auto">
              Download Resume
            </PixelButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative scanline overlay just for the hero area */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,12,26,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
    </section>
  );
}
