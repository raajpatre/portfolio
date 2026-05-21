"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface DialogueBoxProps {
  text: string;
  speed?: number; // ms per character
  onComplete?: () => void;
  className?: string;
}

export function DialogueBox({
  text,
  speed = 40,
  onComplete,
  className,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    setIsTyping(true);
    setDisplayedText("");

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  const handleSkip = useCallback(() => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [isTyping, text, onComplete]);

  return (
    <div
      onClick={handleSkip}
      className={cn(
        "relative p-4 sm:p-6 border-2 border-border-pixel rounded-sm bg-bg-base/90 backdrop-blur-sm cursor-pointer select-none",
        "font-pixel text-xs sm:text-sm text-text-primary leading-loose",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleSkip();
      }}
      aria-label={isTyping ? "Skip typing animation" : "Dialogue box"}
    >
      <p className="min-h-[3em]">
        {displayedText}
        {isTyping && <span className="animate-pulse">_</span>}
      </p>
      
      {/* Decorative corners to look like retro UI */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-gold -mt-[2px] -ml-[2px]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent-gold -mt-[2px] -mr-[2px]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent-gold -mb-[2px] -ml-[2px]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-gold -mb-[2px] -mr-[2px]" />
    </div>
  );
}
