"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, MessageSquare } from "lucide-react";
import { PixelButton } from "./PixelButton";

export function ContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto mt-12 perspective-1000"
    >
      <div className="bg-bg-base border-4 border-border-pixel p-8 sm:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-b-4 border-r-4 border-bg-base bg-accent-gold" />
        <div className="absolute top-0 right-0 w-4 h-4 border-b-4 border-l-4 border-bg-base bg-accent-gold" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-t-4 border-r-4 border-bg-base bg-accent-gold" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-t-4 border-l-4 border-bg-base bg-accent-gold" />

        <div className="text-center space-y-6">
          <MessageSquare className="w-12 h-12 mx-auto text-accent-violet mb-6" />
          
          <h2 className="font-pixel text-xl sm:text-2xl text-text-primary uppercase">
            Send a Raven
          </h2>
          
          <p className="font-mono text-sm sm:text-base text-text-primary/70 max-w-lg mx-auto leading-relaxed">
            Looking to collaborate, have a question, or just want to say hi? 
            My inbox is always open. I'll try my best to get back to you!
          </p>

          <div className="pt-8 pb-4">
            <a href="mailto:raajpatre.dev@gmail.com">
              <PixelButton variant="primary" className="text-sm px-8 py-4">
                <Mail className="w-4 h-4 mr-2" />
                Say Hello
              </PixelButton>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 pt-8 border-t-2 border-border-pixel/50">
            <a
              href="https://github.com/raajpatre"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border-2 border-border-pixel rounded-sm hover:border-accent-violet text-text-primary/70 hover:text-accent-violet transition-all hover:-translate-y-1"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/raajpatre"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border-2 border-border-pixel rounded-sm hover:border-accent-gold text-text-primary/70 hover:text-accent-gold transition-all hover:-translate-y-1"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/raajpatre"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border-2 border-border-pixel rounded-sm hover:border-accent-teal text-text-primary/70 hover:text-accent-teal transition-all hover:-translate-y-1"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
