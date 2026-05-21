"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const DIALOGUE_TEXT =
  "Hey. I'm Raaj.\nBuilder. Breaker. Repeat.\n\nI build things for the web — and occasionally\nbreak them in interesting ways.";

function Typewriter({ text, speed = 26, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setI((n) => n + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed, onDone]);

  const shown = text.slice(0, i);
  const done = i >= text.length;

  return (
    <span className="whitespace-pre-wrap">
      {shown}
      {!done && <span className="inline-block w-[7px] h-[14px] bg-text-primary align-[-2px] ml-0.5 animate-[blink_800ms_steps(2)_infinite]" />}
    </span>
  );
}

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [typingDone, setTypingDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [spriteError, setSpriteError] = useState(false);

  const handleEnter = useCallback(() => {
    if (!isVisible) return;
    localStorage.setItem("rp-welcomed", "1");
    document.body.style.overflow = "auto";
    setIsVisible(false);
    setTimeout(() => onComplete(), 500);
  }, [isVisible, onComplete]);

  useEffect(() => {
    const hasVisited = localStorage.getItem("rp-welcomed");
    if (!hasVisited) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleEnter]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcome"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-base p-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.48, ease: "easeInOut" }}
        >
          {/* Top strip */}
          <div className="absolute top-4 left-5 font-pixel text-[8px] text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent-teal shadow-[0_0_8px_#3dd6ac] inline-block" />
            SAVE FILE 01 · NEW GAME
          </div>

          {/* ESC skip */}
          <button
            onClick={handleEnter}
            className="absolute top-4 right-5 font-pixel text-[8px] text-text-muted border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] px-2.5 py-2 hover:text-text-primary hover:border-text-muted transition-colors"
          >
            [ ESC ] SKIP INTRO
          </button>

          <div className="flex flex-col items-center max-w-[560px] w-full gap-7 -mt-10">
            {/* Character sprite */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -2, 0], opacity: 1 }}
              transition={{ y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.5, delay: 0.2 } }}
              className="relative w-32 h-32"
            >
              {spriteError ? (
                <div className="absolute inset-0 border-2 border-dashed border-border-pixel bg-bg-surface flex items-center justify-center">
                  <span className="font-pixel text-[8px] text-text-muted text-center leading-relaxed px-2">
                    [ CHARACTER<br />SPRITE ]
                  </span>
                </div>
              ) : (
                <Image
                  src="/character/idle.png"
                  alt="Raaj character sprite"
                  fill
                  sizes="8rem"
                  className="object-contain [image-rendering:pixelated]"
                  priority
                  onError={() => setSpriteError(true)}
                />
              )}
              {/* Shadow beneath sprite */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-accent-violet/18 blur-sm" />
            </motion.div>

            {/* Dialogue box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full bg-bg-surface border-2 border-accent-violet shadow-[0_0_20px_rgba(124,109,245,0.3),0_0_0_1px_#7c6df5] rounded-sm"
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-border-pixel">
                <span className="font-pixel text-[10px] text-accent-gold tracking-[0.04em]">▸ RAAJ PATRE</span>
                <span className="font-pixel text-[10px] text-accent-teal">[LVL 2]</span>
              </div>
              <div className="px-4 py-4 font-mono text-[13px] text-text-primary leading-[1.8] min-h-[100px] relative">
                <Typewriter text={DIALOGUE_TEXT} speed={26} onDone={() => setTypingDone(true)} />
                {typingDone && (
                  <span className="absolute right-3.5 bottom-2.5 font-pixel text-[10px] text-accent-violet animate-[blink_800ms_ease-in-out_infinite]">
                    [▼]
                  </span>
                )}
              </div>
            </motion.div>

            {/* Enter button */}
            <AnimatePresence>
              {typingDone && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleEnter}
                  className="font-pixel text-[11px] tracking-[0.06em] border-2 border-accent-violet bg-accent-violet text-bg-base px-5 py-3 shadow-[0_0_0_1px_#7c6df5] hover:shadow-[0_0_16px_#7c6df5,0_0_0_1px_#7c6df5] hover:scale-[1.03] active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                  ▶ ENTER PORTFOLIO
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
